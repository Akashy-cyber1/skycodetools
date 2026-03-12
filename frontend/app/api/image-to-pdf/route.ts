import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// GET handler for browser testing
export async function GET() {
  return NextResponse.json({
    message: "This endpoint requires a POST request with image files",
    example: "curl -X POST -F 'files=@image1.jpg' -F 'files=@image2.jpg' http://localhost:3000/api/image-to-pdf",
    note: "Use POST for production with FormData containing image files"
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    console.log("Proxy: Received request, forwarding to Django...");
    console.log("Proxy: Django URL:", DJANGO_API_URL);
    
    // Forward the request to Django backend - try without trailing slash first
    let djangoUrl = `${DJANGO_API_URL}/api/image-to-pdf`;
    console.log("Proxy: Trying URL:", djangoUrl);
    
    let response = await fetch(djangoUrl, {
      method: "POST",
      body: formData,
    });

    console.log("Proxy: First response status:", response.status);

    // If 404, try with trailing slash
    if (response.status === 404) {
      console.log("Proxy: Trying with trailing slash...");
      djangoUrl = `${DJANGO_API_URL}/api/image-to-pdf/`;
      console.log("Proxy: Trying URL:", djangoUrl);
      
      response = await fetch(djangoUrl, {
        method: "POST",
        body: formData,
      });
      
      console.log("Proxy: Second response status:", response.status);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Proxy: Django error:", errorText);
      return NextResponse.json(
        { error: errorText || `Failed to convert images to PDF (${response.status})` },
        { status: response.status }
      );
    }

    // Get the blob from Django response
    const blob = await response.blob();
    console.log("Proxy: Received PDF blob, size:", blob.size);

    // Return the blob to the client
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error) {
    console.error("Proxy: Error in image-to-pdf proxy:", error);
    
    // Check if it's a network error (Django server not running)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isNetworkError = error instanceof TypeError && error.message.includes("fetch");
    
    if (isNetworkError || errorMessage.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { 
          error: "Backend server is not running. Please ensure Django is running at http://127.0.0.1:8000",
          code: "BACKEND_UNAVAILABLE"
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

// GET handler for browser testing
export async function GET() {
  return NextResponse.json({
    message: "This endpoint requires a POST request with an image file",
    example: "curl -X POST -F 'image=@your-image.png' http://localhost:3000/api/image-compressor",
    note: "This endpoint is temporarily accepting GET for testing. Use POST for production."
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to Django backend
    const djangoUrl = `${BACKEND_URL}/api/tools/image-compressor/`;
    const response = await fetch(djangoUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Proxy: Django error:", errorText);
      return NextResponse.json(
        { error: errorText || "Failed to compress image" },
        { status: response.status }
      );
    }

    // Get the blob from Django response
    const blob = await response.blob();

    // Get content type from original image
    const contentType = blob.type || "image/jpeg";

    // Return the blob to the client
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": 'attachment; filename="compressed-image"',
      },
    });
  } catch (error) {
    console.error("Error in image-compressor proxy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


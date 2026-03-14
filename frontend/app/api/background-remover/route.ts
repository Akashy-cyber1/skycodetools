import { NextRequest, NextResponse } from "next/server";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "");

// GET handler for browser testing
export async function GET() {
  return NextResponse.json({
    message: "This endpoint requires a POST request with an image file",
    example: "curl -X POST -F 'file=@your-image.png' http://localhost:3000/api/background-remover",
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to Django backend
    const djangoUrl = `${BACKEND_URL}/api/tools/background-remover/`;
    const response = await fetch(djangoUrl, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    
    // Check if response is JSON (error case)
    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      console.error("Django API error:", errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || "Failed to remove background" },
        { status: response.status }
      );
    }

    // Check if response is an image (success case)
    if (contentType.includes("image")) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Return the image blob to the client (PNG with transparency)
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'attachment; filename="removed-bg.png"',
        },
      });
    }

    // Unexpected content type
    console.error("Unexpected response content type:", contentType);
    return NextResponse.json(
      { error: "Unexpected response from server" },
      { status: 502 }
    );

  } catch (error) {
    console.error("Error in background-remover proxy:", error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "Unable to connect to backend server. Please ensure Django is running." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


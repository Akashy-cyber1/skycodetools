import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";

// GET handler for browser testing
export async function GET() {
  return NextResponse.json({
    message: "This endpoint requires a POST request with PDF files",
    example: "curl -X POST -F 'files=@file1.pdf' -F 'files=@file2.pdf' http://localhost:3000/api/merge-pdf",
    note: "This endpoint is temporarily accepting GET for testing. Use POST for production."
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to Django backend
    const response = await fetch(`${DJANGO_API_URL}/api/merge-pdf/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Failed to merge PDFs" },
        { status: response.status }
      );
    }

    // Get the blob from Django response
    const blob = await response.blob();

    // Return the blob to the client
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error) {
    console.error("Error in merge-pdf proxy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


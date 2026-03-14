import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  // const url = `${BACKEND_URL}/api/blog/posts/${params.slug}/`;
  const url = `${BACKEND_URL}/api/blog/posts/${slug}/`;
  console.log('[PROXY DEBUG slug] URL:', url);
  try {
    const res = await fetch(url);
    console.log('[PROXY DEBUG slug] Status:', res.status);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[PROXY DEBUG slug] Error:', error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}


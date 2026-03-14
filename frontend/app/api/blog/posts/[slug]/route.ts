import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : '');

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // const url = `${BACKEND_URL}/api/blog/posts/${params.slug}/`;
  const url = `${BACKEND_URL}/api/blog/posts/${slug}/`;
  console.log('[PROXY DEBUG slug] URL:', url);
  try {
    if (!BACKEND_URL) {
  return NextResponse.json(
    { error: 'BACKEND_URL is not configured.' },
    { status: 500 }
  );
}
    const res = await fetch(url, { cache: 'no-store' });
    console.log('[PROXY DEBUG slug] Status:', res.status);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[PROXY DEBUG slug] Error:', error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}


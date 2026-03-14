import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest)  {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  let url = `${BACKEND_URL}/api/blog/posts/`;
  if (category) {
  url += `?category=${encodeURIComponent(category)}`;
}
  console.log('[PROXY DEBUG posts] Building URL:', url);
  try {
    const backendRes = await fetch(url, { cache: 'no-store' });
    console.log('[PROXY DEBUG posts] Backend status:', backendRes.status);
    if (!backendRes.ok) {
      const backendText = await backendRes.text();
      console.error('[PROXY DEBUG posts] Backend HTTP', backendRes.status, backendText.slice(0,500));
      return NextResponse.json({ error: `Backend ${backendRes.status}` }, { status: backendRes.status });
    }
    const data = await backendRes.json();
    console.log('[PROXY DEBUG posts] Success, data:', Array.isArray(data) ? data.length : typeof data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[PROXY DEBUG posts] Full error:', error);
    return NextResponse.json({ error: 'Proxy fetch failed', details: (error as Error).message || String(error) }, { status: 500 });
  }
}



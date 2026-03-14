// import { NextRequest, NextResponse } from 'next/server';

//  // const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// export async function GET() {
//   const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
//   const url = `${BACKEND_URL}/api/blog/categories/`;
//   console.log('[PROXY DEBUG categories] URL:', url);
//   try {
//     const res = await fetch(url);
//     console.log('[PROXY DEBUG categories] Status:', res.status);
//     const data = await res.json();
//     console.log('[PROXY DEBUG categories] Success length:', data.length);
//     return NextResponse.json(data);
//   } catch (error: any) {
//     console.error('[PROXY DEBUG categories] Error:', error);
//     return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 });
//   }
// }

import { NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : '');

export async function GET() {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { error: 'BACKEND_URL is not configured.' },
        { status: 500 }
      );
    }

    const url = `${BACKEND_URL}/api/blog/categories/`;

    console.log('[PROXY DEBUG categories] URL:', url);

    const res = await fetch(url, {
      cache: 'no-store',
    });

    console.log('[PROXY DEBUG categories] Status:', res.status);

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('[PROXY DEBUG categories] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
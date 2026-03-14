import type { BlogPost, BlogSeo } from '@/types/blog';
import { getAllPosts, getPostBySlug, getAllCategories as getStaticCategories } from '@/config/blog'; // Fallback

// Backend direct URL for server-side, proxy for client-side
// const getApiUrl = (path: string): string => {
//   // Server-side: direct backend
//   if (typeof window === 'undefined') {
//     return `http://127.0.0.1:8000/api/blog/${path}`;
//   }
//   // Client-side: proxy route
//   return `/api/blog/${path}`;
// };
const getApiUrl = (path: string): string => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  // Server-side: use backend URL directly
  if (typeof window === "undefined") {
    return `${backendUrl}/api/blog/${path}`;
  }

  // Client-side: use Next.js proxy route
  return `/api/blog/${path}`;
}; 

// Timeout wrapper
async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 3000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Raw API response type
interface RawApiPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  seo?: BlogSeo;
  category: {
    name: string;
  };
  tags: Array<{
    name: string;
  }>;
  published_at: string;
}

// Safe mapper
function mapApiToBlogPost(raw: RawApiPost): BlogPost {
  return {
    id: raw.id.toString(),
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    content: raw.content,
    category: raw.category.name,
    tags: raw.tags.map(t => t.name),
    publishedAt: raw.published_at,
    featuredImage: raw.featured_image,
    seo: {
      metaTitle: raw.seo?.metaTitle || raw.title,
      metaDescription: (raw.seo?.metaDescription || raw.excerpt || '').slice(0, 160) + '...'
    }
  };
}

// Fetch all posts
export async function fetchAllPosts(category?: string): Promise<BlogPost[]> {
  try {
    const path = category ? `posts/?category=${encodeURIComponent(category)}` : 'posts/';
    console.log('[API DEBUG] Using URL:', getApiUrl(path));
    const res = await fetchWithTimeout(getApiUrl(path), {
      next: { revalidate: 3600 },
      cache: 'no-store',
    }, 5000);
    
    if (!res.ok) {
      console.error('[API] HTTP', res.status);
      throw new Error(`HTTP ${res.status}`);
    }
    
    const raw = await res.json() as RawApiPost[];
    console.log('[API DEBUG] Raw API posts length:', raw.length);
    if (raw.length > 0) {
      console.log('[API DEBUG] First raw post:', JSON.stringify(raw[0], null, 2));
    }
    
    const mapped = raw.map(mapApiToBlogPost);
    console.log('[API DEBUG] Mapped length:', mapped.length, '- LIVE API SUCCESS');
    return mapped;
  } catch (error) {
    console.error('[API DEBUG] fetchAllPosts FAILED:', error);
    console.log('[API DEBUG] → STATIC FALLBACK');
    return getAllPosts();
  }
}

// Single post
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log('[API DEBUG SLUG] Using URL:', getApiUrl(`posts/${slug}/`));
    const res = await fetchWithTimeout(getApiUrl(`posts/${slug}/`), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Not found');
    const raw: RawApiPost = await res.json();
    return mapApiToBlogPost(raw);
  } catch {
    return getPostBySlug(slug) || null;
  }
}

// Categories
export async function fetchCategories(): Promise<string[]> {
  try {
    console.log('[API DEBUG CAT] Using URL:', getApiUrl('categories/'));
    const res = await fetchWithTimeout(getApiUrl('categories/'), {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error('Categories fetch failed');
    const raw = await res.json();
    return raw.map((cat: any) => cat.name);
  } catch {
    console.log('[API DEBUG CAT] Fallback static');
    return getStaticCategories?.() || Array.from(new Set(getAllPosts().map(p => p.category)));
  }
}

// Static exports
export { getAllPosts as getStaticPosts, getPostBySlug as getStaticPostBySlug, getStaticCategories };


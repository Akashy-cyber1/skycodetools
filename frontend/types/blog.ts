/**
 * Blog-related TypeScript type definitions
 */

export interface BlogSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown content
  category: string;
  tags: string[];
  publishedAt: string; // ISO date string
  featuredImage?: string;
  seo: BlogSeo;
}

// Category type (expandable)
export type BlogCategory = 'announcement' | 'tutorial' | 'update' | 'news';

// Helper for static params
export type BlogSlugParams = { params: { slug: string } };


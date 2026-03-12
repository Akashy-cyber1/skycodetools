import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/config/blog';
import type { BlogSlugParams } from '@/types/blog';
import Link from 'next/link';
import { Calendar, Tag, Folder, ChevronLeft } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Generate static paths for all posts
export function generateStaticParams() {
  return getAllPosts().map(post => ({
    slug: post.slug
  }));
}

// Dynamic metadata
export async function generateMetadata({ params }: BlogSlugParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found - SkyCode Tools',
    };
  }

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.tags.join(', '),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-12 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to blog
        </Link>

        {/* Post Header */}
        <article>
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs font-medium text-blue-400">
                <Folder className="w-3 h-3" />
                {post.category}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-50 to-slate-200 bg-clip-text text-transparent mb-6 leading-tight">
              {post.title}
            </h1>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs text-slate-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div 
            className="prose prose-invert prose-headings:text-white prose-headings:font-bold prose-a:text-blue-400 prose-a:hover:text-blue-300 prose-code:bg-slate-800 prose-code:rounded prose-pre:bg-slate-900 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />

          {/* Back CTA */}
          <div className="mt-20 pt-12 border-t border-slate-800 text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 hover:from-blue-500/20 hover:to-purple-500/20 text-blue-400 font-semibold hover:text-blue-300 transition-all duration-300"
            >
              ← View all posts
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}


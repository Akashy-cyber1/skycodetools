import { Metadata } from 'next';
import BlogFilterClient from '@/components/blog/BlogFilterClient';
import { getAllPosts, getAllCategories } from '@/config/blog';

export const metadata: Metadata = {
  title: 'SkyCode Tools Blog - Tutorials, Tips & Updates',
  description: 'Discover tutorials, productivity tips, tool updates, and best practices from SkyCode Tools. Free online file processing utilities.',
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const allCategories = getAllCategories();

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Blog
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Latest updates, tutorials, and news from SkyCode Tools.
          </p>
        </div>

        {/* Blog Content */}
        <BlogFilterClient allPosts={allPosts} allCategories={allCategories} />
      </div>
    </div>
  );
}


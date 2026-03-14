import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogFilterClient from '@/components/blog/BlogFilterClient';

import { fetchAllPosts, fetchCategories } from '@/lib/api/blog';
export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: 'SkyCode Tools Blog - Tutorials, Tips & Updates',
  description: 'Discover tutorials, productivity tips, tool updates, and best practices from SkyCode Tools. Free online file processing utilities.',
};

async function getBlogData() {
  const [allPosts, allCategories] = await Promise.all([
    fetchAllPosts(),
    fetchCategories()
  ]);
  console.log('[PAGE DEBUG] Using API data, allPosts length:', allPosts.length);
  if (allPosts.length > 0) {
    console.log('[PAGE DEBUG] First normalized post:', JSON.stringify(allPosts[0], null, 2));
  }
  console.log('[PAGE DEBUG] allCategories:', allCategories);
  return { allPosts, allCategories };
}

export default async function BlogPage() {
  const { allPosts, allCategories } = await getBlogData();

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
        <Suspense fallback={
          <div className="space-y-12">
            <div className="flex flex-wrap gap-3 justify-center -mt-4 pb-8 animate-pulse">
              <div className="h-11 px-6 bg-slate-800/50 border border-slate-700/50 rounded-xl w-28" />
              <div className="h-11 px-6 bg-slate-800/50 border border-slate-700/50 rounded-xl w-24 flex items-center gap-1.5" />
              <div className="h-11 px-6 bg-slate-800/50 border border-slate-700/50 rounded-xl w-32 flex items-center gap-1.5" />
              <div className="h-11 px-6 bg-slate-800/50 border border-slate-700/50 rounded-xl w-28" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, i) => (
                <div 
                  key={i} 
                  className="bg-[#0f172a]/80 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 h-80 animate-pulse"
                >
                  <div className="h-6 w-20 bg-slate-700/50 rounded-lg mb-4" />
                  <div className="h-10 mb-3 bg-slate-700/50 rounded-xl w-4/5" />
                  <div className="h-4 bg-slate-700/50 rounded mb-4 w-3/4" />
                  <div className="h-4 bg-slate-700/50 rounded mb-6 w-1/2" />
                  <div className="h-10 w-full bg-slate-700/50 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        }>
          <BlogFilterClient allPosts={allPosts} allCategories={allCategories} />
        </Suspense>
      </div>
    </div>
  );
}



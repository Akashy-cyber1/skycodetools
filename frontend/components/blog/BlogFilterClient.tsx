"use client";

import { useState, useCallback } from 'react';
import { Folder } from 'lucide-react';
import BlogList from './BlogList';
import type { BlogPost } from '@/types/blog';
import { getPostsByCategory } from '@/config/blog';

interface BlogFilterClientProps {
  allPosts: BlogPost[];
  allCategories: string[];
}

export default function BlogFilterClient({ allPosts, allCategories }: BlogFilterClientProps) {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  const filteredPosts = currentCategory 
    ? getPostsByCategory(currentCategory)
    : allPosts;

  const handleCategoryChange = useCallback((category: string | null) => {
    setCurrentCategory(category);
  }, []);

  const getPostCount = useCallback((category: string | null): number => {
    if (category === null) return allPosts.length;
    return getPostsByCategory(category).length;
  }, [allPosts]);

  const activeStyle = (category: string | null) => currentCategory === category 
    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600/50';

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center mb-12 -mt-4 pb-8 border-b border-slate-800\">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-6 py-2.5 rounded-xl border font-medium transition-all duration-300 text-sm ${activeStyle(null)}`}
        >
          All ({allPosts.length})
        </button>
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-2.5 rounded-xl border font-medium transition-all duration-300 text-sm flex items-center gap-1.5 ${activeStyle(category)}`}
          >
            <Folder className="w-4 h-4\" />
            {category} ({getPostCount(category)})
          </button>
        ))}
      </div>

      <div className="mt-16\">
        <BlogList posts={filteredPosts} />
      </div>
    </>
  );
}

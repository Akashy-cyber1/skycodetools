"use client";

import BlogCard from './BlogCard';
import Link from 'next/link';
import { getAllPosts } from '@/config/blog';

import type { BlogPost } from '@/types';

interface BlogListProps {
  posts?: BlogPost[];
  className?: string;
  showEmptyState?: boolean;
}


export default function BlogList({ posts = getAllPosts(), className = '' }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg mb-4">No posts found for this category.</p>
        <Link href="/blog" className="text-blue-400 hover:text-blue-300 font-medium">
          View all posts
        </Link>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {posts.map((post) => (
        <BlogCard 
          key={post.id} 
          post={post}
          className="hover:shadow-2xl"
        />
      ))}
    </div>
  );
}




"use client";

import Link from 'next/link';
import { Calendar, Tag, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogCard({ post, className = '' }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={`group bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs font-medium text-blue-400">
          <Folder className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{post.category}</span>
        </div>
      </div>

      {/* Title */}
      <Link href={`/blog/${post.slug}`} className="block mb-4">
        <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300 line-clamp-2 leading-tight">
          {post.title}
        </h3>
      </Link>

      {/* Excerpt */}
      <p className="text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3 md:line-clamp-2">
        {post.excerpt}
      </p>

      {/* Meta Info */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span className="truncate">{post.tags[0]}{post.tags.length > 1 ? ` +${post.tags.length - 1}` : ''}</span>
          </div>
        )}
      </div>

      {/* Read More Button */}
      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 group/link"
      >
        Read full post
        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
}


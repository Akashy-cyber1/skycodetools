import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-24 h-24 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center mb-8">
          <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent mb-4">
          Post Not Found
        </h1>
        
        <p className="text-xl text-slate-400 mb-8 max-w-sm mx-auto">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Blog
        </Link>
      </div>
    </div>
  );
}


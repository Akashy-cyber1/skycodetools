import { Metadata } from 'next';
import Link from 'next/link';
import { tools, getToolsByCategory } from '@/config/tools';
import type { ToolCategory } from '@/types/tool';

export const metadata: Metadata = {
  title: 'Categories - SkyCode Tools',
  description: 'Browse tools by category. Find PDF tools, image tools, and more.',
};

const categoryInfo: Record<ToolCategory, { title: string; description: string; icon: string }> = {
  pdf: {
    title: 'PDF Tools',
    description: 'Merge, split, convert, and manipulate PDF files with ease.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  image: {
    title: 'Image Tools',
    description: 'Compress, convert, and enhance your images online.',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  video: {
    title: 'Video Tools',
    description: 'Edit, convert, and optimize your videos.',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
  audio: {
    title: 'Audio Tools',
    description: 'Convert, compress, and enhance audio files.',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  },
  document: {
    title: 'Document Tools',
    description: 'Work with various document formats effortlessly.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
};

export default function CategoriesPage() {
  // Get unique categories from tools
  const categories = [...new Set(tools.map((tool) => tool.category))] as ToolCategory[];

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Categories
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Browse our tools by category. Find exactly what you need.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const info = categoryInfo[category];
            const categoryTools = getToolsByCategory(category);
            
            return (
              <Link
                key={category}
                href={`/tools?category=${category}`}
                className="group p-6 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                {/* Category Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                  <svg
                    className="w-7 h-7 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={info.icon}
                    />
                  </svg>
                </div>

                {/* Category Title */}
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {info.title}
                </h2>

                {/* Category Description */}
                <p className="text-sm text-slate-400 mb-4">
                  {info.description}
                </p>

                {/* Tool Count */}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="px-2 py-1 rounded-md bg-[#1e293b]">
                    {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* All Tools Link */}
        <div className="mt-12 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            View All Tools
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}


/**
 * ToolGridSection - Reusable tool grid with optional category filtering
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ToolCard from '@/components/ToolCard';
import { tools, getToolsByCategory, getAllCategories } from '@/config/tools';
import type { ToolCategory } from '@/types/tool';

export interface ToolGridSectionProps {
  title?: string;
  description?: string;
  /** Show category filter tabs */
  showFilters?: boolean;
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Limit number of tools shown */
  limit?: number;
  /** Initial category to filter by */
  initialCategory?: ToolCategory | 'all';
}

export function ToolGridSection({
  title = 'Popular Tools',
  description = 'Discover our suite of powerful file conversion and image tools.',
  showFilters = false,
  columns = 3,
  limit,
  initialCategory = 'all',
}: ToolGridSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>(initialCategory);
  const categories: (ToolCategory | 'all')[] = ['all', ...getAllCategories()];

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : getToolsByCategory(activeCategory);

  const displayTools = limit ? filteredTools.slice(0, limit) : filteredTools;

  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <section className="py-16 bg-[#030712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
            <span className="gradient-text"> Tools</span>
          </h2>
          {description && (
            <p className="text-slate-400 max-w-2xl mx-auto">{description}</p>
          )}
        </motion.div>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-[#1e293b] text-slate-400 hover:text-white hover:bg-[#334155]'
                }`}
              >
                {category === 'all' ? 'All Tools' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Tools Grid */}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {displayTools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              icon={tool.icon}
              title={tool.name}
              description={tool.shortDescription}
              href={`/tools/${tool.slug}`}
              color={tool.color.css}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ToolGridSection;


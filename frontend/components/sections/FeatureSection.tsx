/**
 * FeatureSection - Reusable feature cards section
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface FeatureSectionProps {
  features: Feature[];
  title?: string;
  description?: string;
  /** Number of columns */
  columns?: 2 | 3 | 4 | 5;
}

export function FeatureSection({
  features,
  title = 'Why Choose Us',
  description,
  columns = 5,
}: FeatureSectionProps) {
  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  return (
    <section className="py-20 bg-[#030712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
            <span className="gradient-text"></span>
          </h2>
          {description && (
            <p className="text-slate-400 max-w-2xl mx-auto">{description}</p>
          )}
        </motion.div>
        </div>

        {/* Features Grid */}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group p-6 rounded-2xl bg-[#0f172a]/50 border border-[#1e293b] hover:border-blue-500/50 backdrop-blur-sm"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
                  <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
    </section>
  );
}

export default FeatureSection;

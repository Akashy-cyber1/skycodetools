/**
 * ToolFeatureList - Reusable feature display for tool pages
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Clock, Download, Image, FileText, Sparkles, LucideIcon } from 'lucide-react';

export interface ToolFeature {
  title: string;
  description?: string;
  icon?: 'zap' | 'shield' | 'clock' | 'download' | 'image' | 'file' | 'sparkles' | 'check';
}

export interface ToolFeatureListProps {
  features: string[] | ToolFeature[];
  columns?: 1 | 2 | 3;
  /** Use large card style */
  large?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  clock: Clock,
  download: Download,
  image: Image,
  file: FileText,
  sparkles: Sparkles,
  check: Check,
};

export function ToolFeatureList({
  features,
  columns = 3,
  large = false,
}: ToolFeatureListProps) {
  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
  };

  // Convert simple strings to feature objects
  const normalizedFeatures: ToolFeature[] = features.map((f, index) => {
    if (typeof f === 'string') {
      return {
        title: f,
        icon: ['check', 'zap', 'sparkles'][index % 3] as 'check' | 'zap' | 'sparkles',
      };
    }
    return f;
  });

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {normalizedFeatures.map((feature, index) => {
        const Icon = feature.icon ? iconMap[feature.icon] : Check;
        
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`
              flex items-start gap-3 p-4 rounded-xl bg-[#0f172a]/30 border border-[#1e293b]
              ${large ? 'p-6' : ''}
            `}
          >
            <div className={`
              flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 
              flex items-center justify-center
              ${large ? 'w-12 h-12' : 'w-10 h-10'}
            `}>
              <Icon className={`text-blue-400 ${large ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </div>
            <div>
              <h4 className={`font-semibold text-white ${large ? 'text-lg' : 'text-sm'}`}>
                {feature.title}
              </h4>
              {feature.description && (
                <p className="text-slate-400 text-sm mt-1">{feature.description}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ToolFeatureList;

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ToolConfig } from '@/types/tool';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
  toolConfig?: ToolConfig;
  className?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  showBackButton = true,
  backHref = '/tools',
  badge,
  toolConfig,
  className = '',
  children,
}: PageHeaderProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg opacity-30" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        {showBackButton && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Tools</span>
            </Link>
          </motion.div>
        )}

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
              {badge.icon || <Sparkles className="w-4 h-4" />}
              <span>{badge.text}</span>
            </div>
          )}

          {/* Title */}
          {toolConfig ? (
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {toolConfig.name}
              {toolConfig.name.toLowerCase().includes('pdf') && (
                <span className="gradient-text"> PDF</span>
              )}
            </h1>
          ) : (
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
          )}

          {/* Description */}
          <p className="text-slate-400 max-w-2xl mx-auto">
            {toolConfig?.description || description}
          </p>
        </motion.div>

        {/* Additional Content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Simple hero section for marketing pages
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function HeroSection({ title, subtitle, children, className = '' }: HeroSectionProps) {
  return (
    <section className={`relative py-20 overflow-hidden ${className}`}>
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {title}
            <span className="gradient-text"> Tools</span>
          </h1>
          {subtitle && (
            <p className="text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}


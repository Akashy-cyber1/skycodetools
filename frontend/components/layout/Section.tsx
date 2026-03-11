/**
 * Section - Reusable section wrapper with consistent spacing and optional background
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical padding size */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Background variant */
  background?: 'default' | 'dark' | 'gradient' | 'card';
  /** Enable entrance animation */
  animate?: boolean;
  /** Animation delay in seconds */
  delay?: number;
}

export function Section({
  children,
  className = '',
  padding = 'medium',
  background = 'default',
  animate = false,
  delay = 0,
}: SectionProps) {
  const paddingClasses: Record<string, string> = {
    none: '',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24',
  };

  const backgroundClasses: Record<string, string> = {
    default: 'bg-[#030712]',
    dark: 'bg-[#020617]',
    gradient: 'gradient-bg',
    card: 'bg-[#0f172a]/50',
  };

  const sectionContent = (
    <div className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        {sectionContent}
      </motion.section>
    );
  }

  return <section>{sectionContent}</section>;
}

export default Section;


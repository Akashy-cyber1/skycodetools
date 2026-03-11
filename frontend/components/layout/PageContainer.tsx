/**
 * PageContainer - Standard wrapper with consistent max-width and padding
 * Provides consistent layout structure across all pages
 */

import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Remove default padding */
  noPadding?: boolean;
  /** Full width without max constraint */
  fullWidth?: boolean;
  /** Background color variant */
  background?: 'default' | 'dark' | 'transparent';
}

export function PageContainer({
  children,
  className = '',
  noPadding = false,
  fullWidth = false,
  background = 'default',
}: PageContainerProps) {
  const backgroundClasses: Record<string, string> = {
    default: 'bg-[#030712]',
    dark: 'bg-[#020617]',
    transparent: 'bg-transparent',
  };

  const paddingClass = noPadding ? '' : 'px-4 sm:px-6 lg:px-8';

  return (
    <div className={`min-h-screen ${backgroundClasses[background]} ${className}`}>
      <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} ${paddingClass} py-6`}>
        {children}
      </div>
    </div>
  );
}

export default PageContainer;


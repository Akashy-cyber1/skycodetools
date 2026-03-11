/**
 * ToolLayout - Specialized layout for tool pages
 * Provides consistent structure with tool-specific elements
 * 
 * Phase 2 preparation: Enables easy addition of:
 * - Tool-specific sidebars
 * - Processing state management
 * - File queue management
 * - Progress tracking UI
 */

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getToolBySlug } from '@/config/tools';
import type { ToolConfig } from '@/types/tool';

export interface ToolLayoutProps {
  children: React.ReactNode;
  /** Tool slug to load configuration */
  toolSlug: string;
  /** Optional: Custom className for tool container */
  className?: string;
  /** Optional: Hide the tool header */
  hideHeader?: boolean;
  /** Optional: Full width mode */
  fullWidth?: boolean;
}

/**
 * ToolLayout - Wrapper for individual tool pages
 * Automatically loads tool configuration based on slug
 * 
 * @example
 * ```tsx
 * // Basic usage - automatically loads tool config
 * <ToolLayout toolSlug="image-to-pdf">
 *   <ToolContent />
 * </ToolLayout>
 * 
 * // With custom header
 * <ToolLayout toolSlug="merge-pdf" hideHeader>
 *   <CustomHeader />
 *   <ToolContent />
 * </ToolLayout>
 * ```
 */
export function ToolLayout({
  children,
  toolSlug,
  className = '',
  hideHeader = false,
  fullWidth = false,
}: ToolLayoutProps) {
  // Load tool configuration
  const tool = getToolBySlug(toolSlug);

  // Pass tool config to children via context or props
  // This allows tool pages to access metadata without hardcoding

  return (
    <div className="min-h-screen flex flex-col bg-[#030712]">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main 
        className={`
          flex-1 
          pt-16 
          ${fullWidth ? 'px-0' : 'px-4 sm:px-6 lg:px-8'}
          ${className}
        `}
      >
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

/**
 * ToolContainer - Standard container for tool content
 * Provides consistent max-width and padding
 */
export interface ToolContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolContainer({ 
  children, 
  className = '' 
}: ToolContainerProps) {
  return (
    <div className={`max-w-3xl mx-auto py-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * ToolHeader - Standard header for tool pages
 * Displays tool name, description, and metadata
 */
export interface ToolHeaderProps {
  tool: ToolConfig;
  className?: string;
}

export function ToolHeader({ tool, className = '' }: ToolHeaderProps) {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {tool.name}
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto">
        {tool.description}
      </p>
    </div>
  );
}

/**
 * ToolRequirements - Display file requirements for a tool
 */
export interface ToolRequirementsProps {
  acceptedFiles: string[];
  maxFiles: number;
  maxFileSizeMB: number;
  className?: string;
}

export function ToolRequirements({
  acceptedFiles,
  maxFiles,
  maxFileSizeMB,
  className = '',
}: ToolRequirementsProps) {
  const formatFileTypes = (types: string[]) => {
    return types.map(type => {
      const ext = type.split('/')[1]?.toUpperCase();
      return ext || type;
    }).join(', ');
  };

  return (
    <div className={`text-sm text-slate-500 ${className}`}>
      <p>
        <span className="font-medium">Accepted: </span>
        {formatFileTypes(acceptedFiles)}
      </p>
      <p>
        <span className="font-medium">Max files: </span>
        {maxFiles}
      </p>
      <p>
        <span className="font-medium">Max size per file: </span>
        {maxFileSizeMB}MB
      </p>
    </div>
  );
}

export default ToolLayout;


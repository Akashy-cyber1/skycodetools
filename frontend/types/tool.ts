/**
 * Tool-related TypeScript type definitions
 * Centralized types for all tool configurations
 */

import { 
  Image, 
  Combine, 
  Scissors, 
  Eraser, 
  FileText, 
  Video, 
  Music, 
  Volume2, 
  FileCode 
} from 'lucide-react';

// Tool category type
export type ToolCategory = 'pdf' | 'image' | 'video' | 'audio' | 'document';

// Icon component mapping
export type ToolIconName = 'Image' | 'Combine' | 'Scissors' | 'Eraser' | 'FileText' | 'Video' | 'Music' | 'Volume2' | 'FileCode';

export const toolIcons: Record<ToolIconName, React.ComponentType<{ className?: string }>> = {
  Image,
  Combine,
  Scissors,
  Eraser,
  FileText,
  Video,
  Music,
  Volume2,
  FileCode,
};

// Color configuration for tools
export interface ToolColor {
  from: string;
  to: string;
  css: string; // Combined gradient class
}

// SEO configuration for each tool
export interface ToolSeo {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
}

// Tool configuration interface
export interface ToolConfig {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: ToolIconName;
  color: ToolColor;
  category: ToolCategory;
  apiEndpoint: string;
  acceptedFiles: string[];
  maxFiles: number;
  maxFileSizeMB: number;
  seo: ToolSeo;
  features: string[];
}

// File validation interface
export interface FileValidation {
  allowedTypes: string[];
  maxSizeMB: number;
  maxFiles: number;
}

// Tool processing result
export interface ToolProcessingResult {
  success: boolean;
  outputUrl?: string;
  error?: string;
  processingTime?: number;
}

// Helper type for creating new tools
export type CreateToolInput = Omit<ToolConfig, 'id'>;

// Category labels for display
export const categoryLabels: Record<ToolCategory, string> = {
  pdf: 'PDF Tools',
  image: 'Image Tools',
  video: 'Video Tools',
  audio: 'Audio Tools',
  document: 'Document Tools',
};


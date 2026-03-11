/**
 * Centralized Tool Configuration
 * Single source of truth for all tool definitions
 * Eliminates duplication across Navbar, Footer, and ToolsPage
 */

import { ToolConfig, ToolCategory, ToolSeo, ToolColor, ToolIconName, toolIcons, categoryLabels } from '@/types/tool';

// Icon component mapping (exported for backward compatibility)
export { toolIcons, categoryLabels };

// All tools configuration
export const tools: ToolConfig[] = [
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert multiple images into a single high-quality PDF file quickly and easily.',
    shortDescription: 'Convert images to PDF',
    icon: 'Image',
    color: {
      from: 'blue-500',
      to: 'cyan-500',
      css: 'from-blue-500 to-cyan-500',
    },
    category: 'pdf',
    apiEndpoint: '/api/image-to-pdf/',
    acceptedFiles: ['image/png', 'image/jpeg', 'image/jpg'],
    maxFiles: 20,
    maxFileSizeMB: 10,
    seo: {
      title: 'Image to PDF Converter - Free Online Tool | SkyCode Tools',
      description: 'Convert JPG, PNG images to PDF instantly. Free, secure, no registration required. Batch convert multiple images to one PDF file.',
      keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert images to pdf', 'image converter'],
      canonical: 'https://skycode.tools/tools/image-to-pdf',
    },
    features: [
      'Batch convert multiple images',
      'High-quality PDF output',
      'Drag and drop support',
      'No registration required',
    ],
  },
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one organized document.',
    shortDescription: 'Combine multiple PDFs',
    icon: 'Combine',
    color: {
      from: 'purple-500',
      to: 'pink-500',
      css: 'from-purple-500 to-pink-500',
    },
    category: 'pdf',
    apiEndpoint: '/api/merge-pdf/',
    acceptedFiles: ['application/pdf'],
    maxFiles: 10,
    maxFileSizeMB: 25,
    seo: {
      title: 'Merge PDF Files - Free Online PDF Combiner | SkyCode Tools',
      description: 'Merge multiple PDF files into one. Free, fast, and secure. Combine PDF documents instantly without registration.',
      keywords: ['merge pdf', 'combine pdf', 'join pdf', 'pdf merger', 'combine pdf files'],
      canonical: 'https://skycode.tools/tools/merge-pdf',
    },
    features: [
      'Combine multiple PDFs',
      'Drag and drop ordering',
      'Preserve original quality',
      'Secure file processing',
    ],
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract or separate pages from a PDF file instantly.',
    shortDescription: 'Extract PDF pages',
    icon: 'Scissors',
    color: {
      from: 'orange-500',
      to: 'red-500',
      css: 'from-orange-500 to-red-500',
    },
    category: 'pdf',
    apiEndpoint: '/api/split-pdf/',
    acceptedFiles: ['application/pdf'],
    maxFiles: 1,
    maxFileSizeMB: 25,
    seo: {
      title: 'Split PDF Files - Free Online PDF Splitter | SkyCode Tools',
      description: 'Split PDF into separate pages. Extract specific pages or split by page range. Free, fast, and secure PDF splitter.',
      keywords: ['split pdf', 'extract pdf pages', 'pdf splitter', 'separate pdf pages'],
      canonical: 'https://skycode.tools/tools/split-pdf',
    },
    features: [
      'Extract page ranges',
      'Split by single pages',
      'Preview before download',
      'Secure processing',
    ],
  },
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce image size without losing quality.',
    shortDescription: 'Reduce image size',
    icon: 'Eraser',
    color: {
      from: 'green-500',
      to: 'emerald-500',
      css: 'from-green-500 to-emerald-500',
    },
    category: 'image',
    apiEndpoint: '/api/image-compressor/',
    acceptedFiles: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    maxFiles: 10,
    maxFileSizeMB: 15,
    seo: {
      title: 'Image Compressor - Free Online Image Optimizer | SkyCode Tools',
      description: 'Compress images without losing quality. Reduce file size for PNG, JPG, WebP. Fast, free, and secure image optimizer.',
      keywords: ['image compressor', 'compress image', 'reduce image size', 'optimize image', 'image optimizer'],
      canonical: 'https://skycode.tools/tools/image-compressor',
    },
    features: [
      'Lossless compression option',
      'Bulk compress images',
      'Multiple format support',
      'Quality control',
    ],
  },
  {
    id: 'background-remover',
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Automatically remove image backgrounds in seconds.',
    shortDescription: 'Remove image backgrounds',
    icon: 'Eraser',
    color: {
      from: 'violet-500',
      to: 'purple-500',
      css: 'from-violet-500 to-purple-500',
    },
    category: 'image',
    apiEndpoint: '/api/background-remover/',
    acceptedFiles: ['image/png', 'image/jpeg', 'image/jpg'],
    maxFiles: 1,
    maxFileSizeMB: 10,
    seo: {
      title: 'Background Remover - Free AI Image Tool | SkyCode Tools',
      description: 'Remove background from images automatically. Free AI-powered background remover. Supports PNG, JPG with transparent background.',
      keywords: ['background remover', 'remove background', 'transparent background', 'image background removal', 'cutout'],
      canonical: 'https://skycode.tools/tools/background-remover',
    },
    features: [
      'AI-powered removal',
      'Transparent backgrounds',
      'High-quality output',
      'Supports multiple formats',
    ],
  },
];

// Helper functions
export const getToolById = (id: string): ToolConfig | undefined => {
  return tools.find(tool => tool.id === id);
};

export const getToolBySlug = (slug: string): ToolConfig | undefined => {
  return tools.find(tool => tool.slug === slug);
};

export const getToolsByCategory = (category: ToolCategory): ToolConfig[] => {
  return tools.filter(tool => tool.category === category);
};

export const getAllToolSlugs = (): string[] => {
  return tools.map(tool => tool.slug);
};


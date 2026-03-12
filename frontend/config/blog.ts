/**
 * Centralized Blog Configuration
 * Single source of truth for all blog posts
 * Add new posts here - auto-generates pages
 */

import type { BlogPost } from '@/types/blog';

// All blog posts - edit here to add new content
export const blogPosts: BlogPost[] = [
  {
    id: 'welcome',
    title: 'Welcome to SkyCode Blog',
    slug: 'welcome',
    excerpt: 'Discover how SkyCode Tools can boost your productivity with our free online utilities. Tutorials, tips, and updates.',
    content: `
# Welcome to SkyCode Blog

## We're Live!

SkyCode Tools blog is now live! 

Get updates on:
- New tool releases
- Productivity tips
- File processing best practices
- Tool tutorials

**Start exploring our tools today!**
    `.trim(),
    category: 'announcement',
    tags: ['welcome', 'blog', 'tools'],
    publishedAt: '2024-01-15T00:00:00Z',
    seo: {
      metaTitle: 'Welcome to SkyCode Blog - Tutorials & Tool Updates',
      metaDescription: 'Discover SkyCode Tools blog with tutorials, productivity tips, and updates on our free online file processing tools.'
    }
  },
  {
    id: 'pdf-tools-students',
    title: '5 PDF Tools Every Student Needs',
    slug: 'pdf-tools-students',
    excerpt: "Master your documents with these essential PDF utilities. Perfect for assignments, research papers, and presentations.",
    content: `
# 5 PDF Tools Every Student Needs

## 1. Merge PDF
Combine multiple PDFs into one document.

## 2. Split PDF  
Extract specific pages from large PDFs.

## 3. Image to PDF
Convert lecture slides to printable PDFs.

## Pro Tips:
- Always keep originals
- Use for study notes organization
- Share clean professional documents

**Explore all PDF tools →**
    `.trim(),
    category: 'tutorial',
    tags: ['pdf', 'students', 'tools', 'tutorial'],
    publishedAt: '2024-01-20T00:00:00Z',
    featuredImage: '/api/placeholder/600/400',
    seo: {
      metaTitle: '5 Essential PDF Tools for Students | SkyCode Tools',
      metaDescription: "Student-friendly PDF utilities: merge, split, convert images to PDF. Free online tools for perfect documents."
    }
  },
  {
    id: 'image-optimization',
    title: 'Image Optimization Best Practices',
    slug: 'image-optimization',
    excerpt: 'Reduce file sizes by 70% without losing quality. Essential techniques for web, social media, and presentations.',
    content: `
# Image Optimization Guide

## Compression Settings:
- JPEG: 75-85% quality
- PNG: Use PNG-8 when possible
- WebP: Modern format support

## Tools We Recommend:
1. **Image Compressor** - Lossy/lossless
2. **Background Remover** - Clean product shots

## Before/After Results:
- Original: 2.5MB → Optimized: 450KB
- Load time improved 3x

**Try our image tools now!**
    `.trim(),
    category: 'tutorial',
    tags: ['images', 'optimization', 'web', 'performance'],
    publishedAt: '2024-01-25T00:00:00Z',
    featuredImage: '/api/placeholder/600/400',
    seo: {
      metaTitle: 'Image Optimization Guide | Reduce Size 70% | SkyCode Tools',
      metaDescription: 'Image optimization best practices. Compress without quality loss using free online tools.'
    }
  }
];

// Helper functions (mimic tools.ts pattern)
export const getAllPosts = (): BlogPost[] => {
  return blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  const post = getAllPosts().find(post => post.slug === slug);
  return post; // Null-safe lookup
};


export const getPostsByCategory = (category: string): BlogPost[] => {
  return getAllPosts().filter(post => post.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(getAllPosts().map(post => post.category)));
};

export const getAllSlugs = (): string[] => {
  return getAllPosts().map(post => post.slug);
};


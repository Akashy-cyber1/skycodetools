/**
 * Footer Configuration
 * Centralized footer content and structure
 */

import { siteConfig } from './site';
import { tools, getToolsByCategory } from './tools';
import type { ToolCategory } from '@/types/tool';

// Quick links for footer
export const FOOTER_QUICK_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'All Tools', href: '/tools' },
  { name: 'Categories', href: '/categories' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
] as const;

// Contact information for footer
export const FOOTER_CONTACT = {
  email: 'akashy1935@gmail.com',
  phone: '+91 7007592695',
  address: 'India',
  supportHours: 'Mon-Fri: 9AM - 6PM',
} as const;

// Get popular tools for footer (top 5 by order in config)
export const getPopularTools = () => {
  return tools.slice(0, 5).map(tool => ({
    name: tool.name,
    href: `/tools/${tool.slug}`,
    icon: tool.icon,
  }));
};

// Social links configuration
export const FOOTER_SOCIAL = [
  {
    name: 'Twitter',
    href: siteConfig.social.twitter || 'https://twitter.com/skycodetools',
    icon: 'Twitter',
  },
  {
    name: 'GitHub',
    href: siteConfig.social.github || 'https://github.com/skycode-tools',
    icon: 'Github',
  },
  {
    name: 'LinkedIn',
    href: siteConfig.social.linkedin || 'https://linkedin.com/company/skycode-tools',
    icon: 'Linkedin',
  },
] as const;

// WhatsApp placeholder configuration
export const FOOTER_WHATSAPP = {
  enabled: true,
  phoneNumber: '917007592695',
  label: 'Chat on WhatsApp',
} as const;

// Footer columns configuration
export const FOOTER_COLUMNS = {
  brand: {
    showTagline: true,
    maxWidth: 'max-w-md',
  },
  quickLinks: {
    title: 'Quick Links',
    items: FOOTER_QUICK_LINKS,
  },
  popularTools: {
    title: 'Popular Tools',
    getItems: getPopularTools,
  },
} as const;

// Footer bottom configuration
export const FOOTER_BOTTOM = {
  copyright: {
    text: `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
  },
} as const;

// Footer brand info (reusable)
export const FOOTER_BRAND = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  logo: {
    icon: 'Zap',
    gradient: 'from-blue-500 via-blue-600 to-purple-600',
  },
} as const;


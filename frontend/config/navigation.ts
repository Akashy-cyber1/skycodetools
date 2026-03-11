/**
 * Navigation Configuration
 * Centralized navigation items and structure
 */

import { siteConfig } from './site';

// Main navigation items
export const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'All Tools', href: '/tools' },
  { name: 'Categories', href: '/categories' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
] as const;

// Navigation item type
export type NavItem = typeof NAV_ITEMS[number];

// CTA Button configuration
export const NAV_CTA = {
  text: 'Explore Tools',
  href: '/tools',
} as const;

// Mobile menu configuration
export const MOBILE_MENU_CONFIG = {
  breakpoint: 'md', // Mobile breakpoint
  animationDuration: 0.15,
} as const;

// Dropdown configuration
export const TOOLS_DROPDOWN_CONFIG = {
  title: 'Tools',
  showAllLink: '/tools',
  showAllText: 'View All Tools →',
} as const;

// Site branding (for consistency across components)
export const NAV_BRAND = {
  name: siteConfig.name,
  logo: {
    icon: 'Zap', // Lucide icon name
    gradient: 'from-blue-500 via-blue-600 to-purple-600',
  },
  href: '/',
} as const;


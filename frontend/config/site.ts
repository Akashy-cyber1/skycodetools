/**
 * Site Configuration
 * Site-wide metadata, social links, and default settings
 */

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  favicon: string;
  email: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  contact: {
    email: string;
    supportHours: string;
  };
  defaults: {
    defaultSeoDescription: string;
    defaultSeoKeywords: string[];
  };
}

export const siteConfig: SiteConfig = {
  name: 'SkyCode Tools',
  tagline: 'Free Online File Conversion & Image Tools',
  description: 'Convert, compress, and edit files instantly with SkyCode Tools. Free online utilities for students, developers, and professionals.',
  url: 'https://skycode.tools',
  ogImage: 'https://skycode.tools/og-image.png',
  favicon: '/favicon.ico',
  email: 'support@skycode.tools',
  social: {
    twitter: '@skycodetools',
    github: 'https://github.com/skycode-tools',
    linkedin: 'https://linkedin.com/company/skycode-tools',
  },
  contact: {
    email: 'support@skycode.tools',
    supportHours: 'Mon-Fri, 9AM-6PM EST',
  },
  defaults: {
    defaultSeoDescription: 'Free online tools for file conversion, image editing, and document management. No registration required.',
    defaultSeoKeywords: ['file conversion', 'image tools', 'pdf tools', 'online tools', 'free tools'],
  },
};

// Default SEO metadata generator
export const getDefaultSeo = (overrides?: Partial<{
  title: string;
  description: string;
  keywords: string[];
  url: string;
  image: string;
}>) => {
  return {
    title: overrides?.title ? `${overrides.title} | ${siteConfig.name}` : siteConfig.name,
    description: overrides?.description || siteConfig.defaults.defaultSeoDescription,
    keywords: overrides?.keywords || siteConfig.defaults.defaultSeoKeywords,
    url: overrides?.url || siteConfig.url,
    image: overrides?.image || siteConfig.ogImage,
    siteName: siteConfig.name,
  };
};


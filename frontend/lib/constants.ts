/**
 * Application-wide constants
 * Single source for all hardcoded values
 */

// API Configuration
export const API_CONFIG = {
  // Use Django API URL - defaults to local development URL
  // Set NEXT_PUBLIC_API_BASE_URL environment variable for production
  BASE_URL: '/api',
  TIMEOUT: 60000, // 60 seconds for file processing
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  DEFAULT_MAX_FILE_SIZE_MB: 10,
  DEFAULT_MAX_FILES: 10,
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large files
} as const;

// Supported File Types
export const FILE_TYPES = {
  IMAGES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  PDF: ['application/pdf'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALL_IMAGES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  MODAL_CLOSE_DELAY: 200,
  PROGRESS_UPDATE_INTERVAL: 100,
} as const;

// Navigation
export const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
] as const;

// Social Links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/skycodetools',
  GITHUB: 'https://github.com/skycode-tools',
  LINKEDIN: 'https://linkedin.com/company/skycode-tools',
  FACEBOOK: 'https://facebook.com/skycodetools',
  INSTAGRAM: 'https://instagram.com/skycodetools',
} as const;

// Tool Categories with display properties
export const TOOL_CATEGORIES = {
  PDF: {
    label: 'PDF Tools',
    description: 'Merge, split, convert, and compress PDF files',
    icon: 'FileText',
  },
  IMAGE: {
    label: 'Image Tools',
    description: 'Compress, convert, and edit images',
    icon: 'Image',
  },
  VIDEO: {
    label: 'Video Tools',
    description: 'Convert and edit video files',
    icon: 'Video',
  },
  AUDIO: {
    label: 'Audio Tools',
    description: 'Convert and edit audio files',
    icon: 'Music',
  },
  DOCUMENT: {
    label: 'Document Tools',
    description: 'Work with various document formats',
    icon: 'FileText',
  },
} as const;

// Color gradients for tools (Tailwind classes)
export const TOOL_COLORS = {
  BLUE_CYAN: { from: 'blue-500', to: 'cyan-500', css: 'from-blue-500 to-cyan-500' },
  PURPLE_PINK: { from: 'purple-500', to: 'pink-500', css: 'from-purple-500 to-pink-500' },
  ORANGE_RED: { from: 'orange-500', to: 'red-500', css: 'from-orange-500 to-red-500' },
  GREEN_EMERALD: { from: 'green-500', to: 'emerald-500', css: 'from-green-500 to-emerald-500' },
  VIOLET_PURPLE: { from: 'violet-500', to: 'purple-500', css: 'from-violet-500 to-purple-500' },
  CYAN_BLUE: { from: 'cyan-500', to: 'blue-500', css: 'from-cyan-500 to-blue-500' },
  TEAL_EMERALD: { from: 'teal-500', to: 'emerald-500', css: 'from-teal-500 to-emerald-500' },
  AMBER_ORANGE: { from: 'amber-500', to: 'orange-500', css: 'from-amber-500 to-orange-500' },
} as const;

// SEO Defaults
export const SEO_DEFAULTS = {
  SITE_NAME: 'SkyCode Tools',
  SITE_URL: 'https://skycode.tools',
  OG_IMAGE: 'https://skycode.tools/og-image.png',
  TWITTER_HANDLE: '@skycodetools',
  DEFAULT_KEYWORDS: ['file conversion', 'image tools', 'pdf tools', 'online tools', 'free tools'],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File is too large. Maximum size allowed is',
  INVALID_FILE_TYPE: 'Invalid file type. Allowed types are',
  TOO_MANY_FILES: 'Too many files. Maximum allowed is',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  PROCESSING_FAILED: 'Processing failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  UPLOAD_COMPLETE: 'Upload complete!',
  PROCESSING_COMPLETE: 'Processing complete!',
  DOWNLOAD_READY: 'Your file is ready to download.',
  FILES_MERGED: 'Files merged successfully!',
  PDF_CREATED: 'PDF created successfully!',
} as const;

// Feature Flags (for future phases)
export const FEATURE_FLAGS = {
  ENABLE_CHAT: false,
  ENABLE_BLOG: false,
  ENABLE_ANALYTICS: false,
  ENABLE_FEEDBACK: false,
} as const;


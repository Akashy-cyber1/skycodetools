/**
 * Main component exports for SkyCode Tools
 */

// Layout components
export { PageContainer } from './layout/PageContainer';
export { Section } from './layout/Section';
export { MainLayout } from './layout/MainLayout';
export { ToolLayout, ToolContainer, ToolHeader, ToolRequirements } from './layout/ToolLayout';
export { default as PageHeader } from './layout/PageHeader';
export { default as PageHero } from './sections/PageHero';

// Section components
export { ToolGridSection } from './sections/ToolGridSection';
export { FeatureSection } from './sections/FeatureSection';
export type { Feature, FeatureSectionProps } from './sections/FeatureSection';

// Tool components
export { ToolUploadArea } from './tools/ToolUploadArea';
export { ToolFeatureList } from './tools/ToolFeatureList';
export type { FileItem, ToolUploadAreaProps } from './tools/ToolUploadArea';
export type { ToolFeature, ToolFeatureListProps } from './tools/ToolFeatureList';

// Existing components (re-exported for convenience)
export { default as Navbar } from './Navbar';
export { default as Footer } from './Footer';
export { default as Hero } from './Hero';
export { default as FeatureCards } from './FeatureCards';
export { default as ToolCard } from './ToolCard';
export { default as ToolGrid } from './ToolGrid';
export { default as UploadBox } from './UploadBox';
export { default as ProgressBar } from './ProgressBar';

// Blog components
export { BlogCard, BlogList } from './blog';




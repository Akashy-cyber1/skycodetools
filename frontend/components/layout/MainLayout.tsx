/**
 * MainLayout - Reusable layout wrapper for standard pages
 * Provides consistent structure with Navbar and Footer
 * 
 * Phase 2 preparation: Enables easy addition of:
 * - Auth guards
 * - Loading states
 * - Toast notifications
 * - Theme provider
 * - Analytics
 */

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
  /** Optional: Add custom className for main content area */
  className?: string;
  /** Optional: Hide navbar */
  hideNavbar?: boolean;
  /** Optional: Hide footer */
  hideFooter?: boolean;
  /** Optional: Full width without max container */
  fullWidth?: boolean;
}

/**
 * MainLayout - Standard page wrapper
 * Usage: Wrap page content in this component for consistent layout
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <MainLayout>
 *   <YourPageContent />
 * </MainLayout>
 * 
 * // Custom configuration
 * <MainLayout fullWidth hideFooter>
 *   <YourPageContent />
 * </MainLayout>
 * ```
 */
export function MainLayout({
  children,
  className = '',
  hideNavbar = false,
  hideFooter = false,
  fullWidth = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      {!hideNavbar && <Navbar />}
      
      {/* Main Content */}
      <main 
        className={`
          flex-1 
          pt-16 
          ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}
          ${className}
        `}
      >
        {children}
      </main>
      
      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}

/**
 * PageSection - Standard section wrapper for consistent spacing
 */
export interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Add background styling */
  hasBackground?: boolean;
  /** Vertical padding size */
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function PageSection({
  children,
  className = '',
  hasBackground = false,
  padding = 'medium',
}: PageSectionProps) {
  const paddingClasses = {
    none: '',
    small: 'py-8',
    medium: 'py-12',
    large: 'py-20',
  };

  return (
    <section
      className={`
        ${paddingClasses[padding]}
        ${hasBackground ? 'bg-[#030712]/50' : ''}
        ${className}
      `}
    >
      {children}
    </section>
  );
}

export default MainLayout;


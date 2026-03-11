'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

interface BadgeConfig {
  text: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

interface CTAConfig {
  primary: { text: string; href: string };
  secondary?: { text: string; href: string };
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: BadgeConfig;
  cta?: CTAConfig;
  trustIndicators?: Array<{ icon: React.ReactNode; text: string; color?: string }>;
  className?: string;
  /** Use full-height hero for homepage */
  fullHeight?: boolean;
}

export default function PageHero({
  title,
  subtitle,
  description,
  badge,
  cta,
  trustIndicators,
  className = '',
  fullHeight = false,
}: PageHeroProps) {
  const defaultTrustIndicators = [
    { icon: <Star className="w-4 h-4" />, text: 'Trusted by 10,000+ users', color: 'text-yellow-400' },
  ];

  const indicators = trustIndicators || defaultTrustIndicators;

  return (
    <section className={`relative overflow-hidden ${fullHeight ? 'min-h-[90vh]' : 'py-20'} ${className}`}>
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b]/50 border border-blue-500/30 backdrop-blur-sm">
              {badge.icon || <Sparkles className="w-4 h-4 text-blue-400" />}
              <span className="text-sm text-slate-300">{badge.text}</span>
            </div>
          </motion.div>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            {title}
            {title.toLowerCase().includes('tools') && (
              <span className="gradient-text"> Tools</span>
            )}
          </h1>
          {subtitle && (
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 text-center max-w-xl mx-auto mb-10"
          >
            {description}
          </motion.p>
        )}

        {/* CTA Buttons */}
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href={cta.primary.href}
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {cta.primary.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            {cta.secondary && (
              <Link
                href={cta.secondary.href}
                className="px-8 py-4 rounded-xl border-2 border-slate-600 text-slate-300 font-semibold text-lg hover:border-blue-500 hover:text-white transition-all duration-300"
              >
                {cta.secondary.text}
              </Link>
            )}
          </motion.div>
        )}

        {/* Trust Indicators */}
        {indicators && indicators.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-slate-500"
          >
            {indicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={indicator.color}>{indicator.icon}</span>
                <span className="text-sm">{indicator.text}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}


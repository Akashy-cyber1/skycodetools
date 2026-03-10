"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, FileText, Image, Shield, Clock, Star } from "lucide-react";

export default function Hero() {
  const floatingCards = [
    { icon: Image, label: "Image to PDF", color: "from-blue-500 to-cyan-500" },
    { icon: FileText, label: "Merge PDF", color: "from-purple-500 to-pink-500" },
    { icon: Zap, label: "Compress", color: "from-orange-500 to-red-500" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiMyMTYyNzIiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b]/50 border border-blue-500/30 backdrop-blur-sm mb-8"
        >
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-slate-300">Trusted by 10,000+ users worldwide</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="text-white">All-in-One </span>
          <span className="gradient-text">Free Online Tools</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-4"
        >
          Convert, Compress, and Edit Files Instantly with SkyCode Tools
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-slate-500 max-w-xl mx-auto mb-10"
        >
          SkyCode Tools provides fast, secure, and completely free online utilities to make your daily digital tasks easier. 
          Our tools work directly in your browser so you don&apos;t need to install any software.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/tools"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            Explore Tools
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/#features"
            className="px-8 py-4 rounded-xl border-2 border-slate-600 text-slate-300 font-semibold text-lg hover:border-blue-500 hover:text-white transition-all duration-300"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Floating Cards */}
        <div className="relative h-48 hidden lg:block">
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ 
                opacity: 1, 
                y: [0, -15, 0]
              }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.5 + index * 0.1 },
                y: { 
                  duration: 3 + index * 0.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5 + index * 0.1
                }
              }}
              className={`absolute ${index === 0 ? 'left-1/4 -translate-x-1/2' : index === 1 ? 'left-1/2 -translate-x-1/2' : 'left-3/4 -translate-x-1/2'} top-0`}
            >
              <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${card.color} p-4 shadow-2xl backdrop-blur-sm bg-opacity-90`}>
                <div className="w-full h-full rounded-xl bg-black/20 flex flex-col items-center justify-center gap-2">
                  <card.icon className="w-8 h-8 text-white" />
                  <span className="text-xs font-medium text-white text-center">{card.label}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-8 text-slate-500"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm">100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-sm">Instant Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">No Installation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


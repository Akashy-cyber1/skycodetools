"use client";

import { motion } from "framer-motion";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/config/tools";

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-bg opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our <span className="gradient-text">Tools</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Free online tools for file conversion, image editing, 
              and document management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                icon={tool.icon}
                title={tool.name}
                description={tool.description}
                href={`/tools/${tool.slug}`}
                color={tool.color.css}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


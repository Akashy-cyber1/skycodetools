"use client";

import { motion } from "framer-motion";
import { Image, Combine, Scissors, Eraser } from "lucide-react";
import ToolCard from "@/components/ToolCard";

const tools = [
  {
    id: "image-to-pdf",
    icon: "Image",
    title: "Image to PDF",
    description: "Convert multiple images into a single high-quality PDF file quickly and easily.",
    href: "/tools/image-to-pdf",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "merge-pdf",
    icon: "Combine",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one organized document.",
    href: "/tools/merge-pdf",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "split-pdf",
    icon: "Scissors",
    title: "Split PDF",
    description: "Extract or separate pages from a PDF file instantly.",
    href: "/tools/split-pdf",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "image-compressor",
    icon: "Eraser",
    title: "Image Compressor",
    description: "Reduce image size without losing quality.",
    href: "/tools/image-compressor",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "background-remover",
    icon: "Eraser",
    title: "Background Remover",
    description: "Automatically remove image backgrounds in seconds.",
    href: "/tools/background-remover",
    color: "from-violet-500 to-purple-500",
  },
];

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
                title={tool.title}
                description={tool.description}
                href={tool.href}
                color={tool.color}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


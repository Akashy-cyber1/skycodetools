"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Image, Combine, Scissors, Eraser, FileText, Video, Music, Volume2, FileCode } from "lucide-react";

// Icon map for dynamic rendering
const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Image,
  Combine,
  Scissors,
  Eraser,
  FileText,
  Video,
  Music,
  Volume2,
  FileCode,
};

interface ToolCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
  index?: number;
}

export default function ToolCard({ icon, title, description, href, color, index = 0 }: ToolCardProps) {
  const Icon = icons[icon] || FileText;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={href}>
        <div className="p-6 rounded-2xl bg-[#0f172a]/50 border border-[#1e293b] hover:border-blue-500/50 backdrop-blur-sm h-full card-hover">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
              <Icon className={`w-7 h-7 bg-gradient-to-br ${color} bg-clip-text text-transparent`} />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {description}
          </p>

          {/* Button */}
          <div className="flex items-center text-blue-400 font-medium text-sm group-hover:text-blue-300 transition-colors">
            Use Tool
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


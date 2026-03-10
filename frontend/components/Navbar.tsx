"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Zap, FileImage, FileSpreadsheet, Scissors, Minimize2, Eraser, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tools = [
  {
    name: "Image to PDF",
    href: "/tools/image-to-pdf",
    icon: FileImage,
    description: "Convert images to PDF",
  },
  {
    name: "Merge PDF",
    href: "/tools/merge-pdf",
    icon: FileSpreadsheet,
    description: "Combine multiple PDFs",
  },
  {
    name: "Split PDF",
    href: "/tools/split-pdf",
    icon: Scissors,
    description: "Split PDF pages",
  },
  {
    name: "Image Compressor",
    href: "/tools/image-compressor",
    icon: Minimize2,
    description: "Reduce image size",
  },
  {
    name: "Background Remover",
    href: "/tools/background-remover",
    icon: Eraser,
    description: "Remove image backgrounds",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/90 backdrop-blur-xl border-b border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              SkyCode Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-[#1e293b]/50 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                {item.name}
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white hover:bg-[#1e293b]/50 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                Tools
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-64 rounded-xl bg-[#0f172a]/95 backdrop-blur-xl border border-[#1e293b] shadow-2xl overflow-hidden"
                  >
                    <div className="py-2">
                      {tools.map((tool, index) => (
                        <motion.div
                          key={tool.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={tool.href}
                            onClick={() => setToolsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-200 group"
                          >
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-200">
                              <tool.icon className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tool.name}</p>
                              <p className="text-xs text-slate-500">{tool.description}</p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <div className="border-t border-[#1e293b] px-4 py-3">
                      <Link
                        href="/tools"
                        onClick={() => setToolsOpen(false)}
                        className="block text-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        View All Tools →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/tools"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 text-sm"
            >
              Explore Tools
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-[#1e293b] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0f172a]/95 backdrop-blur-xl border-t border-[#1e293b]"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-300 hover:text-white hover:bg-[#1e293b]/50 font-medium py-3 px-4 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Tools Section */}
              <div className="pt-2">
                <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tools
                </p>
                {tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-[#1e293b]/50 font-medium py-3 px-4 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <tool.icon className="w-4 h-4 text-blue-400" />
                    {tool.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/tools"
                  className="block w-full text-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Explore Tools
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


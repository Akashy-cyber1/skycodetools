"use client";

import Link from "next/link";
import { Zap, FileText, Image, Scissors, Combine, Eraser } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const popularTools = [
    { name: "Image to PDF", href: "/tools/image-to-pdf", icon: Image },
    { name: "Merge PDF", href: "/tools/merge-pdf", icon: Combine },
    { name: "Split PDF", href: "/tools/split-pdf", icon: Scissors },
    { name: "Compress Image", href: "/tools/compress-image", icon: Eraser },
    { name: "Background Remover", href: "/tools/background-remover", icon: Eraser },
  ];

  return (
    <footer className="bg-[#030712] border-t border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                SkyCode Tools
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-md leading-relaxed">
              All-in-one free online tools for file conversion, image editing, and document management. 
              Fast, secure, and works directly in your browser.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular Tools
            </h3>
            <ul className="space-y-3">
              {popularTools.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#1e293b]">
          <p className="text-center text-sm text-slate-500">
            © {currentYear} SkyCode Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


"use client";

import Link from "next/link";
import { Zap, Mail, Phone, MapPin, Clock, Twitter, Github, Linkedin, MessageCircle } from "lucide-react";
import { 
  FOOTER_QUICK_LINKS, 
  getPopularTools, 
  FOOTER_BRAND, 
  FOOTER_CONTACT, 
  FOOTER_SOCIAL, 
  FOOTER_WHATSAPP 
} from "@/config/footer";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const popularTools = getPopularTools();

  return (
    <footer className="bg-[#030712] border-t border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {FOOTER_BRAND.name}
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-md leading-relaxed">
              {FOOTER_BRAND.description}
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a 
                href={`mailto:${FOOTER_CONTACT.email}`}
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {FOOTER_CONTACT.email}
              </a>
              <a 
                href={`tel:${FOOTER_CONTACT.phone}`}
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {FOOTER_CONTACT.phone}
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4" />
                {FOOTER_CONTACT.address}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {FOOTER_CONTACT.supportHours}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {FOOTER_SOCIAL.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1e293b] flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-500 transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.name === 'Twitter' && <Twitter className="w-5 h-5" />}
                  {social.name === 'GitHub' && <Github className="w-5 h-5" />}
                  {social.name === 'LinkedIn' && <Linkedin className="w-5 h-5" />}
                </a>
              ))}
              {/* WhatsApp */}
              {FOOTER_WHATSAPP.enabled && (
                <a
                  href={`https://wa.me/${FOOTER_WHATSAPP.phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1e293b] flex items-center justify-center text-slate-400 hover:text-white hover:bg-green-500 transition-all duration-200"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {FOOTER_QUICK_LINKS.map((item) => (
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
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories?type=pdf"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                >
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?type=image"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Image Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?type=video"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Video Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?type=audio"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Audio Tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#1e293b]">
          <p className="text-center text-sm text-slate-500">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


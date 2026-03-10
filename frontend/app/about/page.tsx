"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Clock, Users, Heart, Star } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: "Speed",
      description: "We process your files instantly using high-performance servers.",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Your files are encrypted and automatically deleted after processing.",
    },
    {
      icon: Clock,
      title: "Availability",
      description: "Access our tools 24/7 from anywhere in the world.",
    },
    {
      icon: Users,
      title: "User-Friendly",
      description: "Simple, intuitive interface that anyone can use without training.",
    },
    {
      icon: Heart,
      title: "Free for All",
      description: "All our tools are completely free with no hidden costs.",
    },
    {
      icon: Star,
      title: "Quality",
      description: "We maintain high-quality output for all file conversions.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "500,000+", label: "Files Processed" },
    { value: "20+", label: "Tools Available" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              About <span className="gradient-text">SkyCode Tools</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              SkyCode Tools was created to provide simple, reliable, and free online utilities 
              for everyday digital tasks. Our goal is to help users convert, edit, and optimize 
              files quickly without complicated software.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-[#0f172a]/50 border border-[#1e293b]"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              We focus on providing tools that are:
            </p>
            <ul className="space-y-4">
              {[
                "Speed - Fast processing times for all operations",
                "Security - Safe file handling with automatic deletion",
                "User-friendly design - Simple and intuitive interface",
                "Free accessibility - No costs for using our tools"
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[#0f172a]/50 border border-[#1e293b]"
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything we do is guided by these core principles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-[#0f172a]/50 border border-[#1e293b] hover:border-blue-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-slate-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center p-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              Thousands of users rely on SkyCode Tools for file conversions and 
              image optimization every day. Join them today!
            </p>
            <a
              href="/tools"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
            >
              Explore Tools
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


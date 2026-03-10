"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Download, CreditCard, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Process your files instantly with our high-speed servers. No waiting, no delays.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure File Handling",
    description: "Your files are encrypted and automatically deleted after processing. 100% secure.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Download,
    title: "No Installation Required",
    description: "All tools work directly in your browser. No software downloads needed.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: CreditCard,
    title: "100% Free Tools",
    description: "All our tools are completely free to use. No hidden fees, no subscriptions.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access all tools from any device. Works perfectly on mobile, tablet, and desktop.",
    color: "from-red-500 to-rose-500",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="py-20 bg-[#030712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose <span className="gradient-text">SkyCode Tools</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We provide the best online tools experience with speed, security, and simplicity.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-[#0f172a]/50 border border-[#1e293b] hover:border-blue-500/50 backdrop-blur-sm card-hover"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
                  <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


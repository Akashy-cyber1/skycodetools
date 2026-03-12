"use client";

import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import ToolGrid from "@/components/ToolGrid";
import { getFeaturedTools } from "@/config/tools";

// Map featured tools for ToolGrid compatibility
const toolGridItems = getFeaturedTools().map(tool => ({
  id: tool.id,
  icon: tool.icon,
  title: tool.name,
  description: tool.description,
  href: tool.route || `/tools/${tool.slug}`,
  color: tool.color.css,
}));


export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <Hero />
      <FeatureCards />
      <ToolGrid 
        tools={toolGridItems}
        title="Popular Tools"
        description="Discover our suite of powerful file conversion and image tools."
      />
    </div>
  );
}


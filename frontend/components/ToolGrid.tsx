"use client";

import ToolCard from "./ToolCard";

interface Tool {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}

interface ToolGridProps {
  tools: Tool[];
  title?: string;
  description?: string;
}

export default function ToolGrid({ tools, title, description }: ToolGridProps) {
  return (
    <section className="py-20 bg-[#030712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-slate-400 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Tools Grid */}
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
  );
}


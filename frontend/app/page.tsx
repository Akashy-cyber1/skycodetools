import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import ToolGrid from "@/components/ToolGrid";

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
    id: "compress-image",
    icon: "Eraser",
    title: "Image Compressor",
    description: "Reduce image size without losing quality.",
    href: "/tools/compress-image",
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
  {
    id: "word-to-pdf",
    icon: "FileText",
    title: "Word to PDF",
    description: "Convert Word documents to PDF format instantly.",
    href: "/tools/word-to-pdf",
    color: "from-blue-600 to-indigo-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <Hero />
      <FeatureCards />
      <ToolGrid 
        tools={tools}
        title="Popular Tools"
        description="Discover our suite of powerful file conversion and image tools."
      />
    </div>
  );
}


"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Upload,
  X,
  FileImage,
  Download,
  Loader2,
  Sparkles,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export default function ImageToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedPdf, setConvertedPdf] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Validate file type
  const isValidImageType = (file: File): boolean => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    return validTypes.includes(file.type);
  };

  // Handle file selection
  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const validFiles = files.filter(isValidImageType);

    const newImages: ImageFile[] = validFiles.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  // Remove image
  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
    // Reset converted PDF if images change
    setConvertedPdf(null);
  }, []);

  // Clear all images
  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setConvertedPdf(null);
    setProgress(0);
  }, [images]);

  // Convert images to PDF using API
  const convertToPDF = async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    setProgress(0);
    setConvertedPdf(null);
    setError(null);

    try {
      // Create FormData and append all images
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("files", image.file);
      });

      // Send API request
      const response = await axios.post("/api/image-to-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      // Create blob URL for the PDF
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setConvertedPdf(pdfUrl);
      setProgress(100);
    } catch (err) {
      console.error("Error converting to PDF:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.status}. Please try again.`);
        } else if (err.request) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Failed to convert images to PDF. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsConverting(false);
    }
  };

  // Download PDF
  const downloadPDF = () => {
    if (!convertedPdf) return;

    const link = document.createElement("a");
    link.href = convertedPdf;
    link.download = "converted.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-bg opacity-30" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Tools</span>
            </Link>
          </motion.div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Free Online Tool</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Image to <span className="gradient-text">PDF</span> Converter
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Convert multiple images into a single high-quality PDF file quickly
              and easily.
            </p>
          </motion.div>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-[#0f172a]/50 backdrop-blur-sm border border-[#1e293b] rounded-3xl p-6 sm:p-8">
              {/* Drag & Drop Area */}
              <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                animate={{
                  scale: isDragging ? 1.02 : 1,
                  borderColor: isDragging ? "#3b82f6" : "#1e293b",
                }}
                className={`
                  relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
                  transition-colors duration-200 mb-6
                  ${
                    isDragging
                      ? "bg-blue-500/10 border-blue-500"
                      : "bg-[#0f172a]/30 border-[#1e293b] hover:border-blue-500/50 hover:bg-[#0f172a]/50"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />

                <motion.div
                  animate={{ y: isDragging ? -5 : 0 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 ${
                      isDragging ? "ring-4 ring-blue-500/30" : ""
                    }`}
                  >
                    <Upload
                      className={`w-10 h-10 ${
                        isDragging ? "text-blue-400" : "text-slate-400"
                      }`}
                    />
                  </div>

                  <p className="text-white font-semibold text-lg mb-2">
                    {isDragging
                      ? "Drop your images here"
                      : "Drag & drop images here"}
                  </p>
                  <p className="text-slate-500 mb-4">or click to browse</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="px-3 py-1 rounded-full bg-[#1e293b]">
                      PNG
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#1e293b]">
                      JPG
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#1e293b]">
                      JPEG
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Image Preview Grid */}
              <AnimatePresence>
                {images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <FileImage className="w-5 h-5 text-blue-400" />
                        {images.length} {images.length === 1 ? "Image" : "Images"}{" "}
                        Added
                      </h3>
                      <button
                        onClick={clearAll}
                        className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
                      {images.map((image, index) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative group"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1e293b] border border-[#1e293b]">
                            <img
                              src={image.preview}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => removeImage(image.id)}
                                className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 truncate">
                            {image.name}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar */}
              <AnimatePresence>
                {isConverting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                        <span className="text-sm font-medium text-slate-300">
                          Converting to PDF...
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-400">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1e293b] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Convert Button */}
                <motion.button
                  onClick={convertToPDF}
                  disabled={images.length === 0 || isConverting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold
                    transition-all duration-200
                    ${
                      images.length === 0 || isConverting
                        ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                    }
                  `}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Convert to PDF</span>
                    </>
                  )}
                </motion.button>

                {/* Download Button */}
                <AnimatePresence>
                  {convertedPdf && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={downloadPDF}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download PDF</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Info Text */}
              {images.length > 0 && !convertedPdf && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  Each image will be added as a separate page in the PDF
                </p>
              )}
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Easy Upload</h3>
              <p className="text-slate-400 text-sm">
                Drag and drop or browse to upload multiple images at once
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">High Quality</h3>
              <p className="text-slate-400 text-sm">
                Maintain image quality with optimized PDF generation
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Instant Download</h3>
              <p className="text-slate-400 text-sm">
                Download your converted PDF immediately after processing
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


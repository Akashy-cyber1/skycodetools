"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API, { isAxiosError } from "@/lib/api";
import {
  Upload,
  X,
  Download,
  Loader2,
  Sparkles,
  ArrowLeft,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export default function BackgroundRemoverPage() {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    const file = files[0];

    if (!file) return;

    if (!isValidImageType(file)) {
      setError("Please upload a valid PNG, JPG, or JPEG image");
      return;
    }

    setError(null);
    setProcessedImage(null);

    const newImage: ImageFile = {
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    };

    setOriginalImage(newImage);
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

  // Clear the current image
  const clearImage = useCallback(() => {
    if (originalImage) {
      URL.revokeObjectURL(originalImage.preview);
    }
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
  }, [originalImage]);

  // Remove background using API
  const removeBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create FormData and append the image
      const formData = new FormData();
      formData.append("file", originalImage.file);

      // Send API request to internal backend
      const response = await API.post("/background-remover/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      // Create blob URL for the processed image
      const processedUrl = URL.createObjectURL(response.data);
      setProcessedImage(processedUrl);
    } catch (err) {
      console.error("Error removing background:", err);
      if (isAxiosError(err)) {
        if (err.response) {
          // Try to parse error message from response
          const status = err.response.status;
          let errorMessage = `Server error: ${status}. Please try again.`;
          
          // Check if response is JSON (error details from backend)
          const contentType = err.response.headers["content-type"];
          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = JSON.parse(await (err.response.data as Blob).text());
              errorMessage = errorData.error || errorData.message || errorMessage;
            } catch {
              // If parsing fails, use default message
            }
          }
          
          setError(errorMessage);
        } else if (err.request) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Failed to remove background. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Download processed image
  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `removed_bg_${originalImage?.name || "image"}.png`;
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
              Remove <span className="gradient-text">Background</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Upload an image and instantly remove the background with AI-powered
              precision. Get a transparent PNG output.
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
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Area - Only show if no image */}
              <AnimatePresence mode="wait">
                {!originalImage ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
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
                        transition-colors duration-200
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
                        onChange={(e) =>
                          e.target.files && handleFiles(e.target.files)
                        }
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
                            ? "Drop your image here"
                            : "Drag & drop image here"}
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    {/* Image Preview Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-blue-400" />
                          {originalImage.name}
                        </h3>
                        <button
                          onClick={clearImage}
                          className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </button>
                      </div>

                      {/* Preview Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Original Image */}
                        <div className="relative">
                          <p className="text-sm text-slate-400 mb-2">
                            Original Image
                          </p>
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1e293b] border border-[#1e293b]">
                            {/* Checkerboard pattern for transparency */}
                            <div className="absolute inset-0 checkerboard" />
                            <img
                              src={originalImage.preview}
                              alt="Original"
                              className="relative z-10 w-full h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Processed Image */}
                        <div className="relative">
                          <p className="text-sm text-slate-400 mb-2">
                            Processed Image
                          </p>
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1e293b] border border-[#1e293b]">
                            {processedImage ? (
                              <>
                                {/* Checkerboard pattern for transparency */}
                                <div className="absolute inset-0 checkerboard" />
                                <img
                                  src={processedImage}
                                  alt="Processed"
                                  className="relative z-10 w-full h-full object-contain"
                                />
                              </>
                            ) : isProcessing ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                                <p className="text-slate-400 text-sm">
                                  Removing background...
                                </p>
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-slate-600 mb-4" />
                                <p className="text-slate-500 text-sm">
                                  Click "Remove Background" to process
                                </p>
                              </div>
                            )}
                          </div>
                          {processedImage && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Done</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Remove Background Button */}
                      <motion.button
                        onClick={removeBackground}
                        disabled={isProcessing}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                          isProcessing
                            ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                        }`}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Remove Background</span>
                          </>
                        )}
                      </motion.button>

                      {/* Download Button */}
                      <AnimatePresence>
                        {processedImage && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={downloadImage}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200"
                          >
                            <Download className="w-5 h-5" />
                            <span>Download PNG</span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info Text */}
              {originalImage && !processedImage && !isProcessing && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  Click the button above to remove the background from your image
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
                Simply drag and drop or click to upload your image
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
              <p className="text-slate-400 text-sm">
                Advanced AI automatically removes backgrounds with precision
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Transparent PNG</h3>
              <p className="text-slate-400 text-sm">
                Download your image with transparent background instantly
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .checkerboard {
          background-image: 
            linear-gradient(45deg, #1e293b 25%, transparent 25%),
            linear-gradient(-45deg, #1e293b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1e293b 75%),
            linear-gradient(-45deg, transparent 75%, #1e293b 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #0f172a;
        }
      `}</style>
    </div>
  );
}


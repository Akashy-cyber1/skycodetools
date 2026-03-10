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
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
}

export default function ImageCompressorPage() {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [compressedFile, setCompressedFile] = useState<ImageFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Calculate compression percentage
  const getCompressionPercentage = (original: number, compressed: number): string => {
    const percentage = ((original - compressed) / original) * 100;
    return percentage.toFixed(1);
  };

  // Validate image file type
  const isValidImage = (file: File): boolean => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    return validTypes.includes(file.type);
  };

  // Handle file selection
  const handleFile = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const validFile = files.find(isValidImage);

    if (!validFile) {
      setError("Please upload a valid image file (PNG, JPG, JPEG)");
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(validFile);

    const newFile: ImageFile = {
      id: generateId(),
      file: validFile,
      name: validFile.name,
      size: validFile.size,
      preview,
    };

    setImageFile(newFile);
    setCompressedFile(null);
    setError(null);
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
      handleFile(e.dataTransfer.files);
    },
    [handleFile]
  );

  // Remove file
  const removeFile = useCallback(() => {
    if (imageFile?.preview) {
      URL.revokeObjectURL(imageFile.preview);
    }
    if (compressedFile?.preview) {
      URL.revokeObjectURL(compressedFile.preview);
    }
    setImageFile(null);
    setCompressedFile(null);
    setError(null);
  }, [imageFile, compressedFile]);

  // Compress image using API
  const compressImage = async () => {
    if (!imageFile) return;

    setIsCompressing(true);
    setError(null);

    try {
      // Create FormData and append the image
      const formData = new FormData();
      formData.append("file", imageFile.file);
      formData.append("quality", quality.toString());

      // Send API request
      const response = await API.post("/image-compressor/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      // Create blob URL for the compressed image
      const compressedBlob = new Blob([response.data], { type: imageFile.file.type });
      const compressedPreview = URL.createObjectURL(compressedBlob);

      const compressed: ImageFile = {
        id: generateId(),
        file: new File([compressedBlob], imageFile.name, {
          type: imageFile.file.type,
        }),
        name: imageFile.name,
        size: compressedBlob.size,
        preview: compressedPreview,
      };

      setCompressedFile(compressed);
    } catch (err) {
      console.error("Error compressing image:", err);
      if (isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.status}. Please try again.`);
        } else if (err.request) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Failed to compress image. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsCompressing(false);
    }
  };

  // Download compressed image
  const downloadImage = () => {
    if (!compressedFile) return;

    const link = document.createElement("a");
    link.href = compressedFile.preview;
    link.download = `compressed-${compressedFile.name}`;
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Free Online Tool</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Image <span className="gradient-text">Compressor</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Compress images without losing visible quality. Reduce file size while maintaining clarity.
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
              {/* Drag & Drop Area - Only show if no image */}
              <AnimatePresence mode="wait">
                {!imageFile && (
                  <motion.div
                    key="upload-area"
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
                        borderColor: isDragging ? "#22c55e" : "#1e293b",
                      }}
                      className={`
                        relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
                        transition-colors duration-200 mb-6
                        ${
                          isDragging
                            ? "bg-green-500/10 border-green-500"
                            : "bg-[#0f172a]/30 border-[#1e293b] hover:border-green-500/50 hover:bg-[#0f172a]/50"
                        }
                      `}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => e.target.files && handleFile(e.target.files)}
                        className="hidden"
                      />

                      <motion.div
                        animate={{ y: isDragging ? -5 : 0 }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4 ${
                            isDragging ? "ring-4 ring-green-500/30" : ""
                          }`}
                        >
                          <Upload
                            className={`w-10 h-10 ${
                              isDragging ? "text-green-400" : "text-slate-400"
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
                )}

                {/* Image Preview - Show when image is uploaded */}
                {imageFile && (
                  <motion.div
                    key="image-preview"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-green-400" />
                        Image Selected
                      </h3>
                      <button
                        onClick={removeFile}
                        className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>

                    {/* Image Preview Card */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0f172a]/50 border border-[#1e293b] group hover:border-green-500/30 transition-colors">
                      <div className="w-24 h-24 rounded-xl bg-[#1e293b] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={imageFile.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {imageFile.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-slate-500 text-sm">
                            {formatFileSize(imageFile.size)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">Ready to compress</span>
                        </div>
                      </div>
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

              {/* Quality Slider - Show when image is uploaded and not yet compressed */}
              <AnimatePresence>
                {imageFile && !compressedFile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-green-400" />
                      Compression Quality
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="flex-1 h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                        <span className="text-white font-semibold w-14 text-right">
                          {quality}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-500">
                        <span>Smaller file</span>
                        <span>Higher quality</span>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Lower quality = smaller file size. For web images, 60-80% is usually optimal.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Compressed Result Preview - Show when image is compressed */}
              <AnimatePresence>
                {compressedFile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-green-400" />
                      Compression Result
                    </label>
                    
                    {/* Before/After Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Original */}
                      <div className="p-4 rounded-xl bg-[#0f172a]/50 border border-[#1e293b]">
                        <p className="text-slate-500 text-sm mb-2">Original</p>
                        <div className="w-full h-32 rounded-lg bg-[#1e293b] overflow-hidden mb-2">
                          <img
                            src={imageFile?.preview}
                            alt="Original"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-white font-semibold">
                          {formatFileSize(imageFile?.size || 0)}
                        </p>
                      </div>
                      
                      {/* Compressed */}
                      <div className="p-4 rounded-xl bg-[#0f172a]/50 border border-green-500/30">
                        <p className="text-slate-500 text-sm mb-2">Compressed</p>
                        <div className="w-full h-32 rounded-lg bg-[#1e293b] overflow-hidden mb-2">
                          <img
                            src={compressedFile.preview}
                            alt="Compressed"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-white font-semibold">
                          {formatFileSize(compressedFile.size)}
                        </p>
                      </div>
                    </div>

                    {/* Size Reduction Info */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white font-medium">
                          Size reduced by
                        </span>
                      </div>
                      <span className="text-green-400 font-bold text-lg">
                        {getCompressionPercentage(imageFile?.size || 0, compressedFile.size)}%
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading State */}
              <AnimatePresence>
                {isCompressing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-center gap-2 py-4">
                      <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                      <span className="text-sm font-medium text-slate-300">
                        Compressing image...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Compress Button */}
                {!compressedFile && (
                  <motion.button
                    onClick={compressImage}
                    disabled={!imageFile || isCompressing}
                    whileHover={{ scale: !imageFile || isCompressing ? 1 : 1.02 }}
                    whileTap={{ scale: !imageFile || isCompressing ? 1 : 0.98 }}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold
                      transition-all duration-200
                      ${
                        !imageFile || isCompressing
                          ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25"
                      }
                    `}
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Compressing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Compress Image</span>
                      </>
                    )}
                  </motion.button>
                )}

                {/* Download Button */}
                <AnimatePresence>
                  {compressedFile && (
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
                      <span>Download Compressed Image</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Compress Another Button */}
                <AnimatePresence>
                  {compressedFile && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={removeFile}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold bg-[#1e293b] text-white hover:bg-[#2d3a4f] transition-all duration-200"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Compress Another</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Info Text */}
              {imageFile && !compressedFile && !isCompressing && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  Adjust the quality slider and click "Compress Image" to reduce file size
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
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Easy Upload</h3>
              <p className="text-slate-400 text-sm">
                Drag and drop or browse to upload your image files
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Quality Control</h3>
              <p className="text-slate-400 text-sm">
                Adjust compression quality to balance size and clarity
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Instant Download</h3>
              <p className="text-slate-400 text-sm">
                Download your compressed image immediately after processing
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


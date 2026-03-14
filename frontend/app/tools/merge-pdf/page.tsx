"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API, { isAxiosError } from "@/lib/api";
import {
  Upload,
  X,
  FileText,
  Download,
  Loader2,
  Sparkles,
  ArrowLeft,
  FilePlus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
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

  // Validate file type - only PDF
  const isValidPDF = (file: File): boolean => {
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  };

  // Handle file selection
  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const validFiles = files.filter(isValidPDF);

    const newFiles: PDFFile[] = validFiles.map((file) => ({
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    // Reset merged PDF if files change
    setMergedPdfUrl(null);
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

  // Remove file
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    // Reset merged PDF if files change
    setMergedPdfUrl(null);
  }, []);

  // Clear all files
  const clearAll = useCallback(() => {
    setFiles([]);
    setMergedPdfUrl(null);
    setProgress(0);
  }, []);

  // Merge PDFs using API
  const mergePDFs = async () => {
    if (files.length === 0) return;

    setIsMerging(true);
    setProgress(0);
    setMergedPdfUrl(null);
    setError(null);

    try {
      // Create FormData and append all PDF files
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file.file);
      });

      // Send API request
      const response = await API.post("/merge-pdf/", formData, {
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

      // Create blob URL for the merged PDF
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setMergedPdfUrl(pdfUrl);
      setProgress(100);
    } catch (err) {
      console.error("Error merging PDFs:", err);
      if (isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.status}. Please try again.`);
        } else if (err.request) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Failed to merge PDFs. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsMerging(false);
    }
  };

  // Download merged PDF
  const downloadPDF = () => {
    if (!mergedPdfUrl) return;

    const link = document.createElement("a");
    link.href = mergedPdfUrl;
    link.download = "merged-document.pdf";
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
              Merge <span className="gradient-text">PDF</span> Files
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Combine multiple PDF files into a single document easily.
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
                  ${isDragging
                    ? "bg-blue-500/10 border-blue-500"
                    : "bg-[#0f172a]/30 border-[#1e293b] hover:border-blue-500/50 hover:bg-[#0f172a]/50"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />

                <motion.div
                  animate={{ y: isDragging ? -5 : 0 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 ${isDragging ? "ring-4 ring-blue-500/30" : ""
                      }`}
                  >
                    <Upload
                      className={`w-10 h-10 ${isDragging ? "text-blue-400" : "text-slate-400"
                        }`}
                    />
                  </div>

                  <p className="text-white font-semibold text-lg mb-2">
                    {isDragging
                      ? "Drop your PDF files here"
                      : "Drag & drop PDF files here"}
                  </p>
                  <p className="text-slate-500 mb-4">or click to browse</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="px-3 py-1 rounded-full bg-[#1e293b]">
                      PDF
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* File Preview List */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        {files.length} {files.length === 1 ? "File" : "Files"}{" "}
                        Added
                      </h3>
                      <button
                        onClick={clearAll}
                        className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </button>
                    </div>

                    {/* File List */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {files.map((file, index) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a]/50 border border-[#1e293b] group hover:border-blue-500/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium truncate">
                                {file.name}
                              </p>
                              <p className="text-slate-500 text-sm">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-sm">
                              {index + 1}
                            </span>
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar */}
              <AnimatePresence>
                {isMerging && (
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
                          Merging PDFs...
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
                {/* Merge Button */}
                <motion.button
                  onClick={mergePDFs}
                  disabled={files.length === 0 || isMerging}
                  whileHover={{ scale: files.length === 0 || isMerging ? 1 : 1.02 }}
                  whileTap={{ scale: files.length === 0 || isMerging ? 1 : 0.98 }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold
                    transition-all duration-200
                    ${files.length === 0 || isMerging
                      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                    }
                  `}
                >
                  {isMerging ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Merging...</span>
                    </>
                  ) : (
                    <>
                      <FilePlus className="w-5 h-5" />
                      <span>Merge PDFs</span>
                    </>
                  )}
                </motion.button>

                {/* Download Button */}
                <AnimatePresence>
                  {mergedPdfUrl && (
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
                      <span>Download Merged PDF</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Info Text */}
              {files.length > 0 && !mergedPdfUrl && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  Files will be merged in the order shown above
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
                Drag and drop or browse to upload multiple PDF files at once
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">High Quality</h3>
              <p className="text-slate-400 text-sm">
                Maintain original PDF quality with lossless merging
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Instant Download</h3>
              <p className="text-slate-400 text-sm">
                Download your merged PDF immediately after processing
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


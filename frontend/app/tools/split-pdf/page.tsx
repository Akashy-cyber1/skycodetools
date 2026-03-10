"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Upload,
  X,
  FileText,
  Download,
  Loader2,
  Sparkles,
  ArrowLeft,
  Scissors,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export default function SplitPDFPage() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [pageRanges, setPageRanges] = useState("");
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
  const handleFile = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const validFile = files.find(isValidPDF);

    if (!validFile) {
      setError("Please upload a valid PDF file");
      return;
    }

    // Only allow one file - just set the file info, let backend handle page count
    const newFile: PDFFile = {
      id: generateId(),
      file: validFile,
      name: validFile.name,
      size: validFile.size,
    };

    setFile(newFile);
    setSplitPdfUrl(null);
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
    setFile(null);
    setSplitPdfUrl(null);
    setPageRanges("");
    setError(null);
  }, []);

  // Parse page ranges
  const parsePageRanges = (input: string, maxPages: number): number[] => {
    const pages: number[] = [];
    const ranges = input.split(",").map((r) => r.trim());

    for (const range of ranges) {
      if (range.includes("-")) {
        const [start, end] = range.split("-").map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end && i <= maxPages; i++) {
            if (i >= 1 && !pages.includes(i)) {
              pages.push(i);
            }
          }
        }
      } else {
        const pageNum = parseInt(range, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages && !pages.includes(pageNum)) {
          pages.push(pageNum);
        }
      }
    }

    return pages.sort((a, b) => a - b);
  };

  // Split PDF using API
  const splitPDF = async () => {
    if (!file || !pageRanges.trim()) return;

    setIsSplitting(true);
    setProgress(0);
    setSplitPdfUrl(null);
    setError(null);

    try {
      setProgress(20);

      // Validate page ranges
      if (!pageRanges.trim()) {
        setError("Please enter page numbers to extract");
        setIsSplitting(false);
        return;
      }

      setProgress(40);

      // Create FormData and append the PDF file
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("page_ranges", pageRanges);

      // Send API request
      const response = await axios.post("/api/split-pdf", formData, {
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

      setProgress(90);

      // Create blob URL for the split PDF
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setSplitPdfUrl(pdfUrl);
      setProgress(100);
    } catch (err) {
      console.error("Error splitting PDF:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.status}. Please try again.`);
        } else if (err.request) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Failed to split PDF. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSplitting(false);
    }
  };

  // Download split PDF
  const downloadPDF = () => {
    if (!splitPdfUrl || !file) return;

    const link = document.createElement("a");
    link.href = splitPdfUrl;
    link.download = `split-${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle page range input change
  const handlePageRangeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPageRanges(e.target.value);
    setError(null);
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
              Split <span className="gradient-text">PDF</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Extract pages from a PDF file quickly and easily.
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
              {/* Drag & Drop Area - Only show if no file */}
              <AnimatePresence mode="wait">
                {!file && (
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
                        accept="application/pdf"
                        onChange={(e) => e.target.files && handleFile(e.target.files)}
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
                            ? "Drop your PDF file here"
                            : "Drag & drop PDF file here"}
                        </p>
                        <p className="text-slate-500 mb-4">or click to browse</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="px-3 py-1 rounded-full bg-[#1e293b]">
                            PDF Only
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {/* File Preview - Show when file is uploaded */}
                {file && (
                  <motion.div
                    key="file-preview"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        File Selected
                      </h3>
                      <button
                        onClick={removeFile}
                        className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>

                    {/* File Info Card */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f172a]/50 border border-[#1e293b] group hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-slate-500 text-sm">
                              {formatFileSize(file.size)}
                            </p>
                            {file.pageCount && (
                              <span className="text-slate-600">•</span>
                            )}
                            {file.pageCount && (
                              <p className="text-blue-400 text-sm font-medium">
                                {file.pageCount} pages
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
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

              {/* Page Range Input - Show when file is uploaded */}
              <AnimatePresence>
                {file && !splitPdfUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <Scissors className="w-5 h-5 text-blue-400" />
                      Select Pages to Extract
                    </label>
                    <div className="space-y-2">
                      <textarea
                        value={pageRanges}
                        onChange={handlePageRangeChange}
                        placeholder="Enter page ranges (e.g., 1-3, 5, 7-10)"
                        className="w-full h-24 px-4 py-3 rounded-xl bg-[#0f172a]/50 border border-[#1e293b] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
                      />
                      <p className="text-slate-500 text-sm">
                        Enter page numbers or ranges separated by commas. Example:{" "}
                        <span className="text-blue-400">1-3</span> or{" "}
                        <span className="text-blue-400">1,3,5-10</span>
                      </p>
                      {file.pageCount && (
                        <p className="text-slate-400 text-sm">
                          Total pages in PDF: <span className="text-white font-medium">{file.pageCount}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar */}
              <AnimatePresence>
                {isSplitting && (
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
                          Splitting PDF...
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Split Button */}
                {!splitPdfUrl && (
                  <motion.button
                    onClick={splitPDF}
                    disabled={!file || !pageRanges.trim() || isSplitting}
                    whileHover={{ scale: !file || !pageRanges.trim() || isSplitting ? 1 : 1.02 }}
                    whileTap={{ scale: !file || !pageRanges.trim() || isSplitting ? 1 : 0.98 }}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold
                      transition-all duration-200
                      ${
                        !file || !pageRanges.trim() || isSplitting
                          ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                      }
                    `}
                  >
                    {isSplitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Splitting...</span>
                      </>
                    ) : (
                      <>
                        <Scissors className="w-5 h-5" />
                        <span>Split PDF</span>
                      </>
                    )}
                  </motion.button>
                )}

                {/* Download Button */}
                <AnimatePresence>
                  {splitPdfUrl && (
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
                      <span>Download Split PDF</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Split Another Button */}
                <AnimatePresence>
                  {splitPdfUrl && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => {
                        setSplitPdfUrl(null);
                        setPageRanges("");
                        setProgress(0);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold bg-[#1e293b] text-white hover:bg-[#2d3a4f] transition-all duration-200"
                    >
                      <Scissors className="w-5 h-5" />
                      <span>Split Another</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Info Text */}
              {file && !splitPdfUrl && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  Enter the page numbers you want to extract from the PDF
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
                Drag and drop or browse to upload your PDF file
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">High Quality</h3>
              <p className="text-slate-400 text-sm">
                Maintain original PDF quality with lossless extraction
              </p>
            </div>
            <div className="bg-[#0f172a]/30 backdrop-blur-sm border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Instant Download</h3>
              <p className="text-slate-400 text-sm">
                Download your extracted pages immediately after processing
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


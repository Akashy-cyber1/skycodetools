"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, Image, FileText, AlertCircle } from "lucide-react";

interface UploadBoxProps {
  onFileSelect?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
}

export default function UploadBox({
  onFileSelect,
  accept = "image/*,.pdf",
  multiple = true,
  maxSize = 10,
  label = "Drag & drop files here or click to browse"
}: UploadBoxProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFiles = (fileList: File[]): File[] => {
    const validFiles: File[] = [];
    const newError: string[] = [];

    fileList.forEach(file => {
      const fileSize = file.size / (1024 * 1024); // Convert to MB
      if (fileSize > maxSize) {
        newError.push(`${file.name} exceeds ${maxSize}MB limit`);
      } else {
        validFiles.push(file);
      }
    });

    if (newError.length > 0) {
      setError(newError[0]);
      setTimeout(() => setError(null), 3000);
    } else {
      setError(null);
    }

    return validFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(droppedFiles);
    
    if (validFiles.length > 0) {
      const newFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(newFiles);
      onFileSelect?.(newFiles);
    }
  }, [files, multiple, maxSize, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = validateFiles(selectedFiles);
      
      if (validFiles.length > 0) {
        const newFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(newFiles);
        onFileSelect?.(newFiles);
      }
    }
  }, [files, multiple, maxSize, onFileSelect]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileSelect?.(newFiles);
  }, [files, onFileSelect]);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type === "application/pdf") return FileText;
    return File;
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? "#3b82f6" : "#1e293b"
        }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging 
            ? "bg-blue-500/10 border-blue-500" 
            : "bg-[#0f172a]/50 border-[#1e293b] hover:border-blue-500/50"
          }
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4`}
          >
            <Upload className={`w-8 h-8 ${isDragging ? "text-blue-400" : "text-slate-400"}`} />
          </motion.div>
          
          <p className="text-white font-medium mb-2">
            {isDragging ? "Drop files here" : label}
          </p>
          <p className="text-sm text-slate-500">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 rounded-xl bg-[#0f172a]/50 border border-[#1e293b]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}


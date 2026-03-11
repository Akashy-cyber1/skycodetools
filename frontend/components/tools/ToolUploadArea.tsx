/**
 * ToolUploadArea - Unified drag-and-drop zone for all tool pages
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, AlertCircle, Loader2 } from 'lucide-react';

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
  name: string;
}

export interface ToolUploadAreaProps {
  acceptedFiles: string[];
  maxFiles: number;
  maxFileSizeMB: number;
  onFilesSelected: (files: File[]) => void;
  isProcessing?: boolean;
  progress?: number;
  /** Show file preview grid */
  showPreviews?: boolean;
  /** Custom accepted file extensions display */
  acceptedExtensions?: string[];
}

export function ToolUploadArea({
  acceptedFiles,
  maxFiles,
  maxFileSizeMB,
  onFilesSelected,
  isProcessing = false,
  progress = 0,
  showPreviews = true,
  acceptedExtensions = [],
}: ToolUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const validateFile = (file: File): boolean => {
    if (!acceptedFiles.includes(file.type)) {
      setError(`Invalid file type. Accepted: ${acceptedFiles.join(', ')}`);
      return false;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size: ${maxFileSizeMB}MB`);
      return false;
    }
    return true;
  };

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    setError(null);
    const newFiles = Array.from(fileList);
    
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: FileItem[] = [];
    for (const file of newFiles) {
      if (validateFile(file)) {
        validFiles.push({
          id: generateId(),
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          name: file.name,
        });
      }
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles.map(f => f.file));
  }, [files, maxFiles, acceptedFiles, maxFileSizeMB, onFilesSelected]);

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles.map(f => f.file));
  };

  const clearAll = () => {
    files.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
    setFiles([]);
    onFilesSelected([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const formatExtensions = (): string[] => {
    if (acceptedExtensions.length > 0) return acceptedExtensions;
    return acceptedFiles.map(f => f.split('/')[1]?.toUpperCase() || f).filter(Boolean);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? '#3b82f6' : '#1e293b',
        }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging ? 'bg-blue-500/10 border-blue-500' : 'bg-[#0f172a]/30 border-[#1e293b] hover:border-blue-500/50 hover:bg-[#0f172a]/50'}
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFiles.join(',')}
          multiple={maxFiles > 1}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          disabled={isProcessing}
        />

        <motion.div animate={{ y: isDragging ? -5 : 0 }} className="flex flex-col items-center">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 ${isDragging ? 'ring-4 ring-blue-500/30' : ''}`}>
            <Upload className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>
          <p className="text-white font-semibold text-lg mb-2">
            {isDragging ? 'Drop your files here' : 'Drag & drop files here'}
          </p>
          <p className="text-slate-500 mb-4">or click to browse</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {formatExtensions().map((ext) => (
              <span key={ext} className="px-3 py-1 rounded-full bg-[#1e293b]">{ext}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="text-sm font-medium text-slate-300">Processing...</span>
              </div>
              <span className="text-sm font-medium text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1e293b] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Previews */}
      <AnimatePresence>
        {showPreviews && files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FileImage className="w-5 h-5 text-blue-400" />
                {files.length} {files.length === 1 ? 'File' : 'Files'} Added
              </h3>
              <button
                onClick={clearAll}
                className="text-sm text-slate-400 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1e293b] border border-[#1e293b]">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-slate-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  <p className="text-xs text-slate-400 mt-2 truncate">{file.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ToolUploadArea;

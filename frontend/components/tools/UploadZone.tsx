'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';
import { FilePreviewItem } from '@/types/ui';
import { formatBytes } from '@/lib/utils';
import { validateFiles } from '@/lib/validation';

interface UploadZoneProps {
  acceptedFiles?: string[];
  maxFiles?: number;
  maxFileSizeMB?: number;
  onFilesChange?: (files: FilePreviewItem[]) => void;
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
  className?: string;
}

export default function UploadZone({
  acceptedFiles = ['image/png', 'image/jpeg', 'image/jpg'],
  maxFiles = 10,
  maxFileSizeMB = 10,
  onFilesChange,
  onFilesSelected,
  disabled = false,
  multiple = true,
  label = 'Drag & drop files here',
  sublabel = 'or click to browse',
  className = '',
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FilePreviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID for files
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Process selected files
  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList);
    
    // Validate files
    const validation = validateFiles(newFiles, acceptedFiles, maxFileSizeMB, maxFiles);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid files');
      return;
    }

    // Check total files (existing + new)
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setError(null);

    // Create preview items
    const previewItems: FilePreviewItem[] = newFiles.map((file) => ({
      id: generateId(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const updatedFiles = [...files, ...previewItems];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    onFilesSelected?.(newFiles);
  }, [acceptedFiles, maxFileSizeMB, maxFiles, files, onFilesChange, onFilesSelected]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [disabled, processFiles]);

  // Remove a file
  const removeFile = useCallback((id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    setError(null);
  }, [files, onFilesChange]);

  // Clear all files
  const clearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
    setError(null);
    onFilesChange?.([]);
  }, [files, onFilesChange]);

  // Get accepted file types for display
  const acceptedExtensions = acceptedFiles.map((type) => {
    const ext = type.split('/')[1]?.toUpperCase();
    return ext || type;
  });

  return (
    <div className={className}>
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? '#3b82f6' : '#1e293b',
        }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
          transition-colors duration-200
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed bg-slate-800/30'
              : isDragging
              ? 'bg-blue-500/10 border-blue-500'
              : 'bg-[#0f172a]/30 border-[#1e293b] hover:border-blue-500/50 hover:bg-[#0f172a]/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFiles.join(',')}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          className="flex flex-col items-center"
        >
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 ${
              isDragging ? 'ring-4 ring-blue-500/30' : ''
            }`}
          >
            <Upload
              className={`w-10 h-10 ${
                isDragging ? 'text-blue-400' : 'text-slate-400'
              }`}
            />
          </div>

          <p className="text-white font-semibold text-lg mb-2">
            {isDragging ? 'Drop your files here' : label}
          </p>
          <p className="text-slate-500 mb-4">{sublabel}</p>
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {acceptedExtensions.slice(0, 4).map((ext) => (
              <span key={ext} className="px-3 py-1 rounded-full bg-[#1e293b]">
                {ext}
              </span>
            ))}
            {acceptedExtensions.length > 4 && (
              <span className="px-3 py-1 rounded-full bg-[#1e293b]">
                +{acceptedExtensions.length - 4}
              </span>
            )}
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
            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview Grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FileImage className="w-5 h-5 text-blue-400" />
                {files.length} {files.length === 1 ? 'File' : 'Files'} Added
                <span className="text-slate-500 font-normal">
                  ({formatBytes(files.reduce((acc, f) => acc + f.size, 0))} total)
                </span>
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
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1e293b] border border-[#1e293b]">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-slate-500" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-2 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(file.size)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


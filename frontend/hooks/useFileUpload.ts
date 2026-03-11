/**
 * useFileUpload - Custom hook for file upload handling
 */

import { useState, useCallback, useRef } from 'react';
import { AxiosProgressEvent } from 'axios';
import { FilePreviewItem } from '@/types/ui';
import { validateFiles, validateFile } from '@/lib/validation';
import { generateId, formatBytes } from '@/lib/utils';

interface UseFileUploadOptions {
  acceptedTypes?: string[];
  maxFileSizeMB?: number;
  maxFiles?: number;
  onError?: (error: string) => void;
  onSuccess?: (files: File[]) => void;
}

interface UseFileUploadReturn {
  files: FilePreviewItem[];
  isDragging: boolean;
  isUploading: boolean;
  error: string | null;
  // Actions
  addFiles: (fileList: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setDragging: (value: boolean) => void;
  // Computed
  totalSize: number;
  fileCount: number;
  hasFiles: boolean;
}

export function useFileUpload({
  acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'],
  maxFileSizeMB = 10,
  maxFiles = 10,
  onError,
  onSuccess,
}: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [files, setFiles] = useState<FilePreviewItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID
  const generateFileId = useCallback(() => generateId(), []);

  // Add files
  const addFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList);
    
    // Validate
    const validation = validateFiles(newFiles, acceptedTypes, maxFileSizeMB, maxFiles);
    
    if (!validation.valid) {
      const errorMsg = validation.error || 'Invalid files';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Check total files
    if (files.length + newFiles.length > maxFiles) {
      const errorMsg = `Maximum ${maxFiles} files allowed`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setError(null);

    // Create preview items
    const previewItems: FilePreviewItem[] = newFiles.map((file) => ({
      id: generateFileId(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const updatedFiles = [...files, ...previewItems];
    setFiles(updatedFiles);
    onSuccess?.(newFiles);
  }, [acceptedTypes, maxFileSizeMB, maxFiles, files, generateFileId, onError, onSuccess]);

  // Remove file
  const removeFile = useCallback((id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    setError(null);
  }, [files]);

  // Clear all files
  const clearFiles = useCallback(() => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
    setError(null);
  }, [files]);

  // Set dragging state
  const setDragging = useCallback((value: boolean) => {
    setIsDragging(value);
  }, []);

  // Computed values
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const fileCount = files.length;
  const hasFiles = files.length > 0;

  return {
    files,
    isDragging,
    isUploading,
    error,
    addFiles,
    removeFile,
    clearFiles,
    setDragging,
    totalSize,
    fileCount,
    hasFiles,
  };
}

// Hook for file upload with progress tracking
interface UseFileUploadWithProgressOptions extends UseFileUploadOptions {
  apiEndpoint: string;
  onProgress?: (progress: number) => void;
  onComplete?: (response: unknown) => void;
  onUploadError?: (error: string) => void;
}

interface UseFileUploadWithProgressReturn extends UseFileUploadReturn {
  progress: number;
  uploadFiles: () => Promise<void>;
  response: unknown | null;
  isProcessing: boolean;
}

export function useFileUploadWithProgress({
  acceptedTypes,
  maxFileSizeMB,
  maxFiles,
  apiEndpoint,
  onProgress,
  onComplete,
  onUploadError,
  onError,
  onSuccess,
}: UseFileUploadWithProgressOptions): UseFileUploadWithProgressReturn {
  const {
    files,
    isDragging,
    error,
    addFiles,
    removeFile,
    clearFiles,
    setDragging,
    totalSize,
    fileCount,
    hasFiles,
  } = useFileUpload({
    acceptedTypes,
    maxFileSizeMB,
    maxFiles,
    onError,
    onSuccess,
  });

  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState<unknown | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setResponse(null);

    try {
      // Create FormData
      const formData = new FormData();
      files.forEach((item) => {
        formData.append('files', item.file);
      });

      // Make API call with progress tracking
      const api = (await import('@/lib/api')).default;
      
      const res = await api.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
            onProgress?.(percent);
          }
        },
      });

      setResponse(res.data);
      setProgress(100);
      onComplete?.(res.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      onUploadError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [files, apiEndpoint, onProgress, onComplete, onUploadError]);

  return {
    files,
    isDragging,
    isUploading: isProcessing,
    error,
    addFiles,
    removeFile,
    clearFiles,
    setDragging,
    totalSize,
    fileCount,
    hasFiles,
    progress,
    uploadFiles,
    response,
    isProcessing,
  };
}


/**
 * Validation Utilities
 * Input validation for files and form data
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate a single file based on allowed types and max size
 */
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSizeMB: number
): ValidationResult => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => {
      const parts = type.split('/');
      return parts[1]?.toUpperCase() || type;
    });
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}`,
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validate multiple files
 */
export const validateFiles = (
  files: File[],
  allowedTypes: string[],
  maxSizeMB: number,
  maxFiles: number
): ValidationResult & { validFiles?: File[]; invalidFiles?: { file: File; error: string }[] } => {
  // Check max files
  if (files.length > maxFiles) {
    return {
      valid: false,
      error: `Too many files. Maximum allowed: ${maxFiles}`,
    };
  }

  const validFiles: File[] = [];
  const invalidFiles: { file: File; error: string }[] = [];

  for (const file of files) {
    const result = validateFile(file, allowedTypes, maxSizeMB);
    if (result.valid) {
      validFiles.push(file);
    } else {
      invalidFiles.push({ file, error: result.error! });
    }
  }

  if (invalidFiles.length > 0) {
    return {
      valid: false,
      error: `${invalidFiles.length} file(s) rejected: ${invalidFiles.map(f => `${f.file.name}: ${f.error}`).join(', ')}`,
      validFiles,
      invalidFiles,
    };
  }

  return { valid: true, validFiles };
};

/**
 * Validate file extension (fallback for browsers that don't detect MIME type)
 */
export const validateFileExtension = (
  filename: string,
  allowedExtensions: string[]
): ValidationResult => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`,
    };
  }
  return { valid: true };
};

/**
 * Sanitize filename to prevent path traversal attacks
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove any path components
  const name = filename.split('/').pop() || filename;
  const baseName = name.split('.').slice(0, -1).join('.');
  const ext = name.split('.').pop();

  // Remove any non-alphanumeric characters except spaces, hyphens, underscores
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9\-_ ]/g, '');
  const sanitizedExt = ext?.replace(/[^a-zA-Z0-9]/g, '');

  // Combine and limit length
  const maxLength = 100;
  let result = sanitizedExt 
    ? `${sanitizedBaseName}.${sanitizedExt}` 
    : sanitizedBaseName;

  if (result.length > maxLength) {
    result = result.substring(0, maxLength);
  }

  return result || 'unnamed_file';
};

/**
 * Validate URL parameter
 */
export const validateUrlParam = (param: string, allowedValues: string[]): ValidationResult => {
  if (!allowedValues.includes(param)) {
    return {
      valid: false,
      error: `Invalid parameter. Allowed values: ${allowedValues.join(', ')}`,
    };
  }
  return { valid: true };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'Invalid email address',
    };
  }
  return { valid: true };
};

/**
 * Common file type mappings
 */
export const FILE_TYPES = {
  IMAGES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  PDF: ['application/pdf'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

/**
 * Get human-readable file type description
 */
export const getFileTypeDescription = (mimeType: string): string => {
  const descriptions: Record<string, string> = {
    'image/png': 'PNG Image',
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPEG Image',
    'image/gif': 'GIF Image',
    'image/webp': 'WebP Image',
    'application/pdf': 'PDF Document',
  };
  return descriptions[mimeType] || mimeType;
};


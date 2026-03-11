/**
 * API-related TypeScript type definitions
 */

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// API error response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

// File upload progress event
export interface ApiProgressEvent {
  loaded: number;
  total: number;
  percentage: number;
}

// API request options
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: FormData | unknown;
  responseType?: 'blob' | 'json' | 'text';
  onUploadProgress?: (event: ApiProgressEvent) => void;
  onDownloadProgress?: (event: ApiProgressEvent) => void;
}

// Tool API response types
export interface ToolUploadResponse {
  files: string[];
  taskId?: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface ToolProcessResponse {
  outputUrl: string;
  outputFilename: string;
  processingTime: number;
  fileSize: number;
}

export interface ToolStatusResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: ToolProcessResponse;
  error?: string;
}


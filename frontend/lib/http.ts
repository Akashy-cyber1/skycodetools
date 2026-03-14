/**
 * API Client
 * Axios-based HTTP client with types
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosProgressEvent, isAxiosError } from 'axios';
import { API_CONFIG } from './constants';

// Create axios instance
const API: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (isAxiosError(error)) {
      if (!error.response) {
        // Network error
        console.error('Network error:', error.message);
      } else {
        // Server error
        console.error('Server error:', error.response.status, error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Helper types for request config
interface ProgressCallback {
  (event: AxiosProgressEvent): void;
}

interface RequestConfig extends AxiosRequestConfig {
  onUploadProgress?: ProgressCallback;
  onDownloadProgress?: ProgressCallback;
}

// Re-export types and helpers
export { API, isAxiosError };

// Type-safe request helpers
export const api = {
  get: <T = unknown>(url: string, config?: RequestConfig) =>
    API.get<T>(url, config).then((res) => res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    API.post<T>(url, data, config).then((res) => res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    API.put<T>(url, data, config).then((res) => res.data),

  delete: <T = unknown>(url: string, config?: RequestConfig) =>
    API.delete<T>(url, config).then((res) => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    API.patch<T>(url, data, config).then((res) => res.data),
};

export default API;


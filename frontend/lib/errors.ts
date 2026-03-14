/**
 * Error Handling Utilities
 * Standardized error handling for the application
 */

// Error types for different scenarios
export type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_ERROR'
  | 'UNAUTHORIZED'
  | 'UNKNOWN_ERROR';

export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Standardized error messages
export const ERROR_MESSAGES: Record<ErrorType, string> = {
  VALIDATION_ERROR: 'Invalid input. Please check your data and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Create a standardized application error
 */
export const createError = (
  type: ErrorType,
  details?: Record<string, unknown>
): AppError => {
  return {
    type,
    message: ERROR_MESSAGES[type],
    statusCode: getStatusCodeForErrorType(type),
    details,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Map error type to HTTP status code
 */
export const getStatusCodeForErrorType = (type: ErrorType): number => {
  const statusCodes: Record<ErrorType, number> = {
    VALIDATION_ERROR: 400,
    NETWORK_ERROR: 0,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    RATE_LIMIT_ERROR: 429,
    UNAUTHORIZED: 401,
    UNKNOWN_ERROR: 500,
  };
  return statusCodes[type];
};

/**
 * Determine error type from axios error response
 */
export const getErrorTypeFromResponse = (status?: number): ErrorType => {
  if (!status) return 'NETWORK_ERROR';
  
  if (status === 400) return 'VALIDATION_ERROR';
  if (status === 401 || status === 403) return 'UNAUTHORIZED';
  if (status === 404) return 'NOT_FOUND';
  if (status === 429) return 'RATE_LIMIT_ERROR';
  if (status >= 500) return 'SERVER_ERROR';
  
  return 'UNKNOWN_ERROR';
};

/**
 * Format error for user display
 */
export const formatErrorForUser = (error: unknown): string => {
  if (typeof error === 'string') return error;
  
  if (error instanceof Error) {
    // Don't expose internal error details to users
    if (process.env.NODE_ENV === 'production') {
      return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string; response?: { data?: { error?: string } } };
    if (err.response?.data?.error) return err.response.data.error;
    if (err.message) return err.message;
  }
  
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

/**
 * Log error to console (can be extended for external logging services)
 */
export const logError = (
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>
): void => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    error: error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error,
    additionalInfo,
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', JSON.stringify(errorInfo, null, 2));
  } else {
    // In production, you could send to error tracking service
    // e.g., Sentry.captureException(error, { extra: { context, ...additionalInfo } });
    console.error('[ERROR]', context, error);
  }
};

/**
 * Create API error from failed request
 */
export const createApiError = (error: unknown): AppError => {
  // Handle axios errors
  if (typeof error === 'object' && error !== null) {
    const err = error as { 
      response?: { status?: number; data?: { error?: string } };
      request?: unknown;
      message?: string;
    };
    
    if (err.response?.status) {
      const type = getErrorTypeFromResponse(err.response.status);
      return createError(type, { 
        serverMessage: err.response.data?.error,
        status: err.response.status,
      });
    }
    
    if (err.request) {
      return createError('NETWORK_ERROR');
    }
  }
  
  return createError('UNKNOWN_ERROR');
};

/**
 * Validate error is retryable
 */
export const isRetryableError = (error: AppError): boolean => {
  const retryableTypes: ErrorType[] = ['NETWORK_ERROR', 'SERVER_ERROR', 'UNKNOWN_ERROR'];
  return retryableTypes.includes(error.type);
};

/**
 * Get user-friendly error title
 */
export const getErrorTitle = (error: AppError): string => {
  const titles: Record<ErrorType, string> = {
    VALIDATION_ERROR: 'Invalid Input',
    NETWORK_ERROR: 'Connection Issue',
    SERVER_ERROR: 'Server Problem',
    NOT_FOUND: 'Not Found',
    RATE_LIMIT_ERROR: 'Please Wait',
    UNAUTHORIZED: 'Access Denied',
    UNKNOWN_ERROR: 'Something Went Wrong',
  };
  return titles[error.type];
};


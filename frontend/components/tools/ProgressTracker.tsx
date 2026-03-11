'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type ProgressStatus = 'idle' | 'processing' | 'success' | 'error';

interface ProgressTrackerProps {
  progress: number;
  status?: ProgressStatus;
  message?: string;
  errorMessage?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProgressTracker({
  progress = 0,
  status = 'processing',
  message = 'Processing...',
  errorMessage,
  showPercentage = true,
  size = 'md',
  className = '',
}: ProgressTrackerProps) {
  // Determine icon based on status
  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  // Determine colors based on status
  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'from-blue-500 to-purple-500';
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'error':
        return 'from-red-500 to-orange-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  // Height based on size
  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className={className}>
      {/* Status and Message */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className={`text-sm font-medium ${
            status === 'error' ? 'text-red-400' : 
            status === 'success' ? 'text-green-400' : 
            'text-slate-300'
          }`}>
            {status === 'error' ? errorMessage || 'Error occurred' : message}
          </span>
        </div>
        
        {showPercentage && status !== 'error' && (
          <span className="text-sm font-medium text-slate-400">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`w-full ${heightClass} rounded-full bg-[#1e293b] overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full bg-gradient-to-r ${getStatusColor()} rounded-full`}
        />
      </div>
    </div>
  );
}

// Compact version for inline use
interface CompactProgressProps {
  progress: number;
  showLabel?: boolean;
}

export function CompactProgress({ progress, showLabel = true }: CompactProgressProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-[#1e293b] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-500 w-10 text-right">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

// Animated processing indicator
export function ProcessingIndicator({ text = 'Processing...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      <span className="text-sm font-medium text-blue-300">{text}</span>
    </div>
  );
}

// Success indicator
export function SuccessIndicator({ text = 'Complete!' }: { text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
    >
      <CheckCircle className="w-5 h-5 text-green-400" />
      <span className="text-sm font-medium text-green-300">{text}</span>
    </motion.div>
  );
}

// Error indicator
export function ErrorIndicator({ text = 'An error occurred' }: { text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
    >
      <XCircle className="w-5 h-5 text-red-400" />
      <span className="text-sm font-medium text-red-300">{text}</span>
    </motion.div>
  );
}


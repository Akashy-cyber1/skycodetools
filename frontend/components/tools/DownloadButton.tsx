'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, Check, Copy, ExternalLink } from 'lucide-react';
import { downloadBlob, downloadUrl } from '@/lib/utils';

interface DownloadButtonProps {
  url?: string;
  blob?: Blob;
  filename?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function DownloadButton({
  url,
  blob,
  filename = 'download',
  onClick,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: DownloadButtonProps) {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'copied'>('idle');

  const handleDownload = async () => {
    if (disabled || isLoading) return;

    setDownloadStatus('downloading');
    onClick?.();

    try {
      if (blob) {
        downloadBlob(blob, filename);
      } else if (url) {
        downloadUrl(url, filename);
      }
      
      setDownloadStatus('success');
      
      // Reset after 2 seconds
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('idle');
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Icon size
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200
        ${sizeClasses[size]}
        ${
          variant === 'primary'
            ? disabled || isLoading
              ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25'
            : disabled || isLoading
            ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
            : 'bg-[#1e293b] text-white hover:bg-[#334155] border border-[#334155]'
        }
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {downloadStatus === 'downloading' || isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Loader2 className={`${iconSize[size]} animate-spin`} />
          </motion.div>
        ) : downloadStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Check className={`${iconSize[size]} text-green-400`} />
          </motion.div>
        ) : downloadStatus === 'copied' ? (
          <motion.div
            key="copied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Copy className={`${iconSize[size]} text-blue-400`} />
          </motion.div>
        ) : (
          <motion.div
            key="download"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Download className={iconSize[size]} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <span>
        {children || (
          downloadStatus === 'downloading' || isLoading
            ? 'Downloading...'
            : downloadStatus === 'success'
            ? 'Downloaded!'
            : downloadStatus === 'copied'
            ? 'Link Copied!'
            : 'Download'
        )
        }
      </span>
    </motion.button>
  );
}

// Link-based download button (for opening in new tab)
interface DownloadLinkProps {
  href: string;
  filename?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function DownloadLink({
  href,
  filename,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: DownloadLinkProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <a
      href={href}
      download={filename}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200
        ${sizeClasses[size]}
        ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25'
            : 'bg-[#1e293b] text-white hover:bg-[#334155] border border-[#334155]'
        }
        ${className}
      `}
    >
      <Download className={iconSize[size]} />
      <span>{children || 'Download'}</span>
    </a>
  );
}

// Open in new tab button
interface OpenFileProps {
  href: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function OpenFile({
  href,
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
}: OpenFileProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200
        ${sizeClasses[size]}
        ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
            : 'bg-[#1e293b] text-white hover:bg-[#334155] border border-[#334155]'
        }
        ${className}
      `}
    >
      <ExternalLink className={iconSize[size]} />
      <span>{children || 'Open File'}</span>
    </a>
  );
}


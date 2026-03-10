"use client";

import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

interface ProgressBarProps {
  progress: number;
  status?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  progress, 
  status = "Processing...",
  showPercentage = true 
}: ProgressBarProps) {
  const isComplete = progress >= 100;

  return (
    <div className="w-full">
      {/* Status Text */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {!isComplete ? (
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
          <span className="text-sm font-medium text-slate-300">
            {isComplete ? "Complete!" : status}
          </span>
        </div>
        {showPercentage && (
          <span className="text-sm font-medium text-slate-400">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-[#1e293b] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isComplete 
              ? "bg-gradient-to-r from-green-500 to-emerald-500" 
              : "bg-gradient-to-r from-blue-500 to-purple-500"
          }`}
        />
      </div>

      {/* Animated particles effect when processing */}
      {!isComplete && (
        <div className="relative">
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-0 w-20 h-3 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent rounded-full"
            style={{ left: `${Math.max(0, progress - 20)}%` }}
          />
        </div>
      )}
    </div>
  );
}


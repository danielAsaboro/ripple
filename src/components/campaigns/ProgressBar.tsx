// File: /components/campaigns/ProgressBar.tsx

import React from "react";
import { cn } from "@/lib/utils/ts-merge";

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "success" | "warning";
}

const ProgressBar = ({
  progress,
  showPercentage = false,
  size = "md",
  className,
  variant = "default",
}: ProgressBarProps) => {
  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variants = {
    default: "bg-green-400",
    success: "bg-green-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className="w-full space-y-1">
      <div
        className={cn(
          "w-full bg-slate-700 rounded-full overflow-hidden",
          sizes[size],
          className
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-in-out",
            variants[variant]
          )}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Progress</span>
          <span className="text-slate-200">{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

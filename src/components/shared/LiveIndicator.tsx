// File: /components/shared/LiveIndicator.tsx
import React from "react";
import { cn } from "@/utils/ts-merge";

interface LiveIndicatorProps {
  isLive: boolean;
  className?: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  isLive,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            isLive ? "animate-ping bg-green-400" : "animate-none bg-slate-400"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-full w-full rounded-full",
            isLive ? "bg-green-500" : "bg-slate-500"
          )}
        />
      </span>
      <span
        className={cn(
          "text-xs font-medium",
          isLive ? "text-green-400" : "text-slate-400"
        )}
      >
        {isLive ? "Live" : "Offline"}
      </span>
    </div>
  );
};

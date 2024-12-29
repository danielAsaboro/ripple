// File: /components/shared/ConnectionStatus.tsx
import React from "react";
import { CloudOff, Wifi } from "lucide-react";
import { cn } from "@/utils/ts-merge";

interface ConnectionStatusProps {
  isConnected: boolean;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const ConnectionStatus = ({
  isConnected,
  className,
  showLabel = true,
  size = "md",
}: ConnectionStatusProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center gap-2 rounded-full", className)}>
      <div
        className={cn(
          "flex items-center justify-center",
          isConnected ? "text-green-400" : "text-yellow-400"
        )}
      >
        {isConnected ? (
          <Wifi className={sizes[size]} />
        ) : (
          <CloudOff className={sizes[size]} />
        )}
      </div>
      {showLabel && (
        <span
          className={cn(
            "text-sm font-medium",
            isConnected ? "text-green-400" : "text-yellow-400"
          )}
        >
          {isConnected ? "Connected" : "Reconnecting..."}
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;

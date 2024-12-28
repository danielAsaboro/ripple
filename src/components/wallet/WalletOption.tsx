// File: /components/wallet/WalletOption.tsx
import React from "react";
import { cn } from "@/utils/ts-merge";

interface WalletOptionProps {
  name: string;
  icon: string;
  status?: "connected" | "detected";
  actionLabel?: string;
  onClick?: () => void;
}

export const WalletOption: React.FC<WalletOptionProps> = ({
  name,
  icon,
  status,
  actionLabel,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3",
        "bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors",
        "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <img src={icon} alt={name} className="w-6 h-6" />
        <span className="text-white">{name}</span>
      </div>
      {status === "connected" ? (
        <span className="text-sm text-green-400">Connected</span>
      ) : status === "detected" ? (
        <span className="text-sm text-blue-400">Detected</span>
      ) : actionLabel ? (
        <span className="text-sm text-green-400 hover:text-green-500">
          {actionLabel} →
        </span>
      ) : null}
    </div>
  );
};

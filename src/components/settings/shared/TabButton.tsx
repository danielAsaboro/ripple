// File: /components/settings/shared/TabButton.tsx
import React from "react";
import { cn } from "@/utils/ts-merge";

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({
  children,
  active,
  onClick,
}) => {
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors",
        "border-b-2 -mb-[2px]",
        active
          ? "border-green-400 text-green-400"
          : "border-transparent text-slate-400 hover:text-slate-300"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// File: /components/support/FAQTabs.tsx
import React from "react";
import { cn } from "@/utils/ts-merge";

export type FAQCategory =
  | "wallet"
  | "donations"
  | "support"
  | "transparency"
  | "account";

interface FAQTabsProps {
  activeCategory: FAQCategory;
  onCategoryChange: (category: FAQCategory) => void;
  className?: string;
}

const tabs: { label: string; value: FAQCategory }[] = [
  { label: "Wallet & Security", value: "wallet" },
  { label: "Donations & Campaigns", value: "donations" },
  { label: "Support", value: "support" },
  { label: "Transparency & Funding", value: "transparency" },
  { label: "Account Management", value: "account" },
];

export const FAQTabs: React.FC<FAQTabsProps> = ({
  activeCategory,
  onCategoryChange,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-4 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onCategoryChange(tab.value)}
              className={cn(
                "whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200",
                activeCategory === tab.value
                  ? "border-green-400 text-green-400"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default FAQTabs;

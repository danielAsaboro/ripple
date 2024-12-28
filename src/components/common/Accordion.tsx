// File: /components/common/Accordion.tsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/ts-merge";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion = ({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("rounded-lg overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between p-4 text-left transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-800"
        )}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-white">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4 pt-6 text-sm text-slate-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;

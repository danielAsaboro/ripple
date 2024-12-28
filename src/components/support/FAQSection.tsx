// File: /components/support/FAQSection.tsx
import React from "react";
import Accordion from "@/components/common/Accordion";
import { FAQSection as FAQSectionType } from "@/data/faq/types";
import { cn } from "@/utils/ts-merge";

interface FAQSectionProps {
  section: FAQSectionType;
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  section,
  className,
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {section.items.map((item, index) => (
        <Accordion
          key={index}
          title={item.question}
          defaultOpen={index === 0}
          className="bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
        >
          <div className="text-slate-300 leading-relaxed">{item.answer}</div>
        </Accordion>
      ))}
    </div>
  );
};

export default FAQSection;

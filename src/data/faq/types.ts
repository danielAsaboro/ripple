// File: /data/faq/types.ts

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQSection = {
  title: string;
  items: FAQItem[];
};

export type FAQCategory =
  | "wallet"
  | "donations"
  | "support"
  | "transparency"
  | "account";

export type FAQData = {
  [key in FAQCategory]: FAQSection;
};

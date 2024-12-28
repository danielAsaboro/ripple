// File: /data/faq/supportFAQs.ts

import { FAQSection } from "./types";

export const supportFAQs: FAQSection = {
  title: "Support",
  items: [
    {
      question: "How can I contact customer support?",
      answer:
        'You can contact our support team through the "Support & FAQ" dashboard. Use the live chat option, submit a support ticket, or email us at support@rippl3.com.',
    },
    {
      question: "What should I do if my donation isn't reflected?",
      answer:
        "First, check your transaction hash and wallet history. If you still don't see your donation after 30 minutes, contact support with your transaction details.",
    },
    {
      question: "What if I accidentally donated to the wrong campaign?",
      answer:
        "Contact support immediately with your transaction details and the correct campaign information. We'll help resolve the situation.",
    },
    {
      question: "How can I check the status of my campaign submission?",
      answer:
        'Log into your dashboard and check the "My Campaigns" section. You can view the status and any feedback there.',
    },
    {
      question: "What should I do if my wallet isn't connecting?",
      answer:
        "Try refreshing your browser, ensure your wallet is unlocked, and check your internet connection. If issues persist, contact support.",
    },
    {
      question: "How long does it take to resolve support tickets?",
      answer:
        "We aim to respond to all support tickets within 24 hours. Complex issues may take longer to resolve.",
    },
  ],
};

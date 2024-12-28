// File: /app/(dashboard)/support/page.tsx
"use client";

import React, { useState } from "react";
import { FAQTabs } from "@/components/support/FAQTabs";
import FAQSection from "@/components/support/FAQSection";
import { faqData } from "@/data/faq";
import { FAQCategory } from "@/data/faq/types";

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("wallet");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Support & FAQ</h1>
        <p className="text-slate-400 mt-2">
          Find answers to common questions or get in touch with our support
          team.
        </p>
      </div>

      {/* FAQ Container */}
      <div className="bg-slate-800 rounded-lg">
        {/* Category Navigation */}
        <div className="p-6 pb-0">
          <FAQTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* FAQ Content */}
        <div className="p-6">
          <FAQSection section={faqData[activeCategory]} />
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Still need help?</h2>
          <p className="text-slate-400">
            Our support team is available 24/7 to assist you with any questions
            or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a
              href="mailto:support@rippl3.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-green-600 hover:bg-green-700 transition"
            >
              Contact Support
            </a>
            <button
              onClick={() => {
                // Open chat widget
                if (window.Intercom) {
                  window.Intercom("show");
                }
              }}
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 rounded-lg text-base font-medium text-white hover:bg-slate-700 transition"
            >
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// File: /app/(dashboard)/start-campaign/page.tsx
"use client";
import React from "react";
import CampaignForm from "@/components/campaigns/CampaignForm";
import type { CampaignFormDataF } from "@/types/campaign";

export default function StartCampaignPage() {
  const handleSubmit = (data: CampaignFormDataF) => {
    // Handle form submission
    console.log("Form submitted:", data);
  };

  const handlePreview = () => {
    // Handle campaign preview
    console.log("Preview campaign");
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Start a Campaign</h1>
        <p className="text-slate-400">
          Create a new campaign to raise funds for your cause.
        </p>
      </div>

      <CampaignForm onSubmit={handleSubmit} onPreview={handlePreview} />
    </div>
  );
}

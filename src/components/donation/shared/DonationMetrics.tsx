// File: /components/donation/shared/DonationMetrics.tsx
import React from "react";
import { Campaign } from "@/types";
import { DonationProgress } from "./DonationProgress";

interface DonationMetricsProps {
  campaign: Campaign;
}

export const DonationMetrics: React.FC<DonationMetricsProps> = ({
  campaign,
}) => {
  return (
    <div className="space-y-4">
      <DonationProgress campaign={campaign} />

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-400">Impact Metrics:</h4>
        <div className="text-sm text-white">
          {campaign.title.includes("Water") && (
            <>
              <p>40 families already served.</p>
              <p>4 water filtration systems installed.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

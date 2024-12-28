// File: /components/donation/shared/DonationProgress.tsx
import React from "react";
import { Campaign } from "@/types";
import { calculateProgress, lamportsToSol } from "@/utils/format";

interface DonationProgressProps {
  campaign: Campaign;
}

export const DonationProgress: React.FC<DonationProgressProps> = ({
  campaign,
}) => {
  const progress = calculateProgress(
    campaign.raisedAmount,
    campaign.targetAmount
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">
          Target: ${lamportsToSol(campaign.targetAmount)}
        </span>
        <span className="text-slate-400">
          Raised: ${lamportsToSol(campaign.raisedAmount)}
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-sm text-green-400">{progress}%</div>
    </div>
  );
};

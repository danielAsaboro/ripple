// File: /components/donation/RecentDonors.tsx
import React from "react";
import { WebhookEvent } from "@/types/events";
import { lamportsToSol } from "@/utils/format";
import { formatDistance } from "date-fns";

interface RecentDonorsProps {
  donations: WebhookEvent[];
}

export const RecentDonors = ({ donations }: RecentDonorsProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-400">Recent Donors</h3>
      <div className="flex flex-wrap gap-2">
        {donations.map((donation) => (
          <div
            key={donation.timestamp}
            className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1"
          >
            <div className="h-6 w-6 rounded-full bg-green-400/10 flex items-center justify-center">
              <span className="text-green-400 text-xs">◎</span>
            </div>
            <div className="text-xs">
              <span className="text-white">
                {lamportsToSol(donation.payload.data.amount)} SOL
              </span>
              <span className="text-slate-400 ml-1">
                {formatDistance(new Date(donation.timestamp), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

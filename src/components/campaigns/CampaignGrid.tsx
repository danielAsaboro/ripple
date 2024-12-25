// File: /components/campaigns/CampaignGrid.tsx

import React from "react";
import Image from "next/image";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ProgressBar from "./ProgressBar";

interface Campaign {
  id: string;
  title: string;
  target: number;
  raised: number;
  donorCount: number;
  daysRemaining: number;
  image: string;
  progress: number;
  isUrgent?: boolean;
}

interface CampaignGridProps {
  campaigns: Campaign[];
  onDonate?: (campaignId: string) => void;
  onShare?: (campaignId: string) => void;
}

const CampaignGrid = ({ campaigns, onDonate, onShare }: CampaignGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-800/80 rounded-full px-3 py-1 text-sm text-white">
              {campaign.donorCount} donations
            </div>
            {campaign.isUrgent && (
              <div className="absolute top-4 right-4 bg-red-500/90 rounded-full px-3 py-1 text-sm text-white">
                Urgent Campaign
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {campaign.title}
            </h3>

            <div className="space-y-4">
              <ProgressBar
                progress={campaign.progress}
                showPercentage
                size="md"
                variant={campaign.progress >= 75 ? "success" : "default"}
              />

              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-slate-400">Target</p>
                  <p className="text-white font-medium">
                    ${campaign.target.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Raised</p>
                  <p className="text-white font-medium">
                    ${campaign.raised.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div className="text-slate-400">
                  <span>{campaign.donorCount} Donors</span>
                </div>
                <div className="text-slate-400">
                  <span>{campaign.daysRemaining} Days Left</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => onDonate?.(campaign.id)}
                  className="flex-1"
                >
                  Donate Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onShare?.(campaign.id)}
                  className="flex-1"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CampaignGrid;

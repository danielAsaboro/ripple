// File: /components/campaign/CampaignCard.tsx

import React from "react";
import Image from "next/image";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

interface CampaignCardProps {
  id: string;
  title: string;
  organization: string;
  image: string;
  target: number;
  raised: number;
  progress: number;
  donationsCount: number;
  isUrgent?: boolean;
}

const CampaignCard = ({
  title,
  organization,
  image,
  target,
  raised,
  progress,
  donationsCount,
  isUrgent,
}: CampaignCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute top-4 left-4 bg-slate-800/80 rounded-full px-3 py-1 text-sm text-white">
          {donationsCount} donations
        </div>
        {isUrgent && (
          <div className="absolute top-4 right-4 bg-red-500/90 rounded-full px-3 py-1 text-sm text-white">
            Urgent Campaign
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-lg text-white mb-1">{title}</h3>
        <p className="text-slate-400 text-sm mb-4">by {organization}</p>

        <div className="space-y-4">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <div className="space-y-1">
              <p className="text-slate-400">Total Goal</p>
              <p className="text-white font-medium">
                ${target.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-slate-400">Raised</p>
              <p className="text-white font-medium">
                ${raised.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">Donate Now</Button>
            <Button variant="outline" className="flex-1">
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CampaignCard;

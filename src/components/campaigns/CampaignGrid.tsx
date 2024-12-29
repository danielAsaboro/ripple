// File: /components/campaigns/CampaignGrid.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ProgressBar from "./ProgressBar";
import { CampaignWithKey } from "@/types";
import { calculateProgress, formatDate, lamportsToSol } from "@/utils/format";
import { DonateModal } from "../donation/modal/DonateModal";
import { useRouter } from "next/navigation";

interface CampaignGridProps {
  campaigns: CampaignWithKey[];
  onShare?: (campaignId: string) => void;
}

const CampaignGrid = ({ campaigns, onShare }: CampaignGridProps) => {
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignWithKey | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaignWithKey) => {
          const { account: campaign, publicKey } = campaignWithKey;
          const progress = calculateProgress(
            campaign.raisedAmount,
            campaign.targetAmount
          );
          const solRaised = lamportsToSol(campaign.raisedAmount);
          const solTarget = lamportsToSol(campaign.targetAmount);
          const endDate = new Date(campaign.endDate.toNumber() * 1000);
          const daysRemaining = Math.ceil(
            (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const publicKeyAsString = publicKey.toBase58();

          return (
            <Card key={publicKeyAsString} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-800/80 rounded-full px-3 py-1 text-sm text-white">
                  {campaign.donorsCount} donations
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

                <p className="text-sm text-slate-400 line-clamp-2">
                  By {campaign.organizationName}
                </p>

                <div className="space-y-4">
                  <ProgressBar
                    progress={progress}
                    showPercentage
                    size="md"
                    variant={progress >= 75 ? "success" : "default"}
                  />

                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-slate-400">Target</p>
                      <p className="text-white font-medium">
                        ◎{solTarget.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Raised</p>
                      <p className="text-white font-medium">
                        ◎{solRaised.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="text-slate-400">
                      <span>{campaign.donorsCount} Donors</span>
                    </div>
                    <div className="text-slate-400">
                      <span>
                        {Math.abs(daysRemaining)} Days{" "}
                        {daysRemaining >= 0 ? "Left" : "Ago"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setSelectedCampaign(campaignWithKey)}
                      className="flex-1"
                    >
                      Donate Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onShare?.(publicKeyAsString)}
                      className="flex-1"
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedCampaign && (
        <DonateModal
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          campaign={selectedCampaign}
          fullPageUrl={`/campaigns/${selectedCampaign.publicKey.toBase58()}/donate`}
        />
      )}
    </>
  );
};

export default CampaignGrid;

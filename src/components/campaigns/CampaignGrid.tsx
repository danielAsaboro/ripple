// File: /components/campaigns/CampaignGrid.tsx
import React from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ProgressBar from "./ProgressBar";
import { Campaign } from "@/types";
import { calculateProgress, formatDate, lamportsToSol } from "@/utils/format";
import { useDonate } from "@/hooks/useDonation";
import { BN } from "@coral-xyz/anchor";

interface CampaignGridProps {
  campaigns: Campaign[];
  onShare?: (campaignId: string) => void;
}

const CampaignGrid = ({ campaigns, onShare }: CampaignGridProps) => {
  const { connected } = useWallet();
  const { donate, loading } = useDonate();

  const handleDonate = async (campaign: Campaign, amount: BN) => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const { tx } = await donate({
        campaignPDA: campaign.authority,
        amount,
        paymentMethod: { cryptoWallet: {} },
      });

      toast.success("Donation successful!");
      console.log("Transaction signature:", tx);
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to process donation");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => {
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

        return (
          <Card key={campaign.title} className="overflow-hidden">
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
                    <span>{daysRemaining} Days Left</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      handleDonate(campaign, new BN(1_000_000_000))
                    } // 1 SOL default donation
                    className="flex-1"
                    disabled={loading || !connected}
                  >
                    {loading ? "Processing..." : "Donate Now"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onShare?.(campaign.title)}
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
  );
};

export default CampaignGrid;

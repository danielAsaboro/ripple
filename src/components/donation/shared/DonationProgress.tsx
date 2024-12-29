// File: /components/donation/shared/DonationProgress.tsx
import React, { useEffect, useState } from "react";
import { Campaign } from "@/types";
import { calculateProgress, lamportsToSol } from "@/utils/format";
import { getSolPrice } from "@/utils/currency";
import toast from "react-hot-toast";

interface DonationProgressProps {
  campaign: Campaign;
}

export const DonationProgress: React.FC<DonationProgressProps> = ({
  campaign,
}) => {
  const [currentSolPrice, setCurrentSolPrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(true);

  // Separate useEffect for SOL price
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        setPriceLoading(true);
        const solPrice = await getSolPrice();
        setCurrentSolPrice(solPrice);
      } catch (error) {
        console.error("Error fetching sol price", error);
        toast.error("Failed to get current sol price");
      } finally {
        setPriceLoading(false);
      }
    };

    fetchSolPrice();

    // Set up an interval to fetch price every minute
    const intervalId = setInterval(fetchSolPrice, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  const progress = calculateProgress(
    campaign.raisedAmount,
    campaign.targetAmount
  ).toFixed(2);

  if (priceLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">
          Raised: ${(lamportsToSol(campaign.raisedAmount) * currentSolPrice).toFixed(2)}
        </span>
        <span className="text-slate-400">
          Target: ${(lamportsToSol(campaign.targetAmount) * currentSolPrice).toFixed(2)}
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

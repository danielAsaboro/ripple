// // File: /components/donation/modal/DonateModal.tsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Card from "@/components/common/Card";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { AmountStep } from "./AmountStep";
import { PaymentStep } from "./PaymentStep";
import { DonationMetrics } from "../shared/DonationMetrics";
import { CampaignWithKey } from "@/types";
import Link from "next/link";
import Button from "@/components/common/Button";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignWithKey;
  fullPageUrl: string;
}

type Step = "amount" | "payment";

const MIN_DONATION_USD = 1; // $1 minimum
const MAX_DONATION_USD = 50000; // $50,000 maximum

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  campaign,
  fullPageUrl,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("amount");
  const [amountUSD, setAmountUSD] = useState<number>(0);
  const [amountSOL, setAmountSOL] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<"one-time" | "monthly">(
    "one-time"
  );
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [isPriceFetching, setIsPriceFetching] = useState(true);
  const { connected } = useWallet();

  // Fetch SOL price on mount
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        setSolPrice(data.solana.usd);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      } finally {
        setIsPriceFetching(false);
      }
    };

    fetchSolPrice();
  }, []);

  // Calculate SOL amount when USD amount changes
  useEffect(() => {
    if (solPrice && amountUSD > 0) {
      const calculatedSolAmount = Number((amountUSD / solPrice).toFixed(4));
      setAmountSOL(calculatedSolAmount);
    } else {
      setAmountSOL(null);
    }
  }, [amountUSD, solPrice]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl relative flex">
        {/* Left Section - Campaign Info */}
        <div className="w-2/5 bg-slate-800 p-6 rounded-l-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            {campaign.account.title}
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            {campaign.account.description}
          </p>
          <DonationMetrics campaign={campaign.account} />
          <div className="mt-6">
            <Link href={fullPageUrl} target="_blank">
              <Button variant="outline" className="w-full">
                Open in Full Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Section - Donation Form */}
        <div className="w-3/5 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {!connected ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <p className="text-slate-400 text-center">
                Connect your wallet to start donating
              </p>
              <ConnectWalletButton />
            </div>
          ) : currentStep === "amount" ? (
            <AmountStep
              amountUSD={amountUSD}
              setAmountUSD={setAmountUSD}
              frequency={frequency}
              setFrequency={setFrequency}
              onNext={() => setCurrentStep("payment")}
              minAmountUSD={MIN_DONATION_USD}
              maxAmountUSD={MAX_DONATION_USD}
              solPrice={solPrice}
            />
          ) : (
            <PaymentStep
              amountUSD={amountUSD}
              amountSOL={amountSOL!}
              frequency={frequency}
              onBack={() => setCurrentStep("amount")}
              campaign={campaign}
              onSuccess={onClose}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

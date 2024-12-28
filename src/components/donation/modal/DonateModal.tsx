// File: /components/donation/modal/DonateModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import Card from "@/components/common/Card";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { AmountStep } from "./AmountStep";
import { PaymentStep } from "./PaymentStep";
import { DonationMetrics } from "../shared/DonationMetrics";
import { Campaign } from "@/types";
import { BN } from "@coral-xyz/anchor";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

type Step = "amount" | "payment";

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number>(0);
  const [frequency, setFrequency] = useState<"one-time" | "monthly">(
    "one-time"
  );
  const { connected } = useWallet();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl relative flex">
        {/* Left Section - Campaign Info */}
        <div className="w-2/5 bg-slate-800 p-6 rounded-l-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            {campaign.title}
          </h2>
          <p className="text-sm text-slate-400 mb-4">{campaign.description}</p>
          <DonationMetrics campaign={campaign} />
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
              amount={amount}
              setAmount={setAmount}
              frequency={frequency}
              setFrequency={setFrequency}
              onNext={() => setCurrentStep("payment")}
            />
          ) : (
            <PaymentStep
              amount={amount}
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

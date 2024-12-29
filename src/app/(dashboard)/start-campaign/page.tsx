// File: /app/(dashboard)/start-campaign/page.tsx
"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import CampaignForm from "@/components/campaigns/CampaignForm";
import CampaignPreview from "@/components/campaigns/CampaignPreview";
import { useCreateCampaign } from "@/hooks/useCampaign";
import { useRouter } from "next/navigation";
import { ConnectWalletPrompt } from "@/components/auth/ConnectWalletPrompt";

interface CampaignFormData {
  title: string;
  category: string;
  description: string;
  organizationName: string;
  fundraisingGoalUSD: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  isUrgent: boolean;
}

const StartCampaignPage = () => {
  const router = useRouter();
  const { connected } = useWallet();
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData | null>(null);

  const handlePreview = (data: CampaignFormData) => {
    setFormData(data);
    setIsPreview(true);
  };

  const handleBack = () => {
    setIsPreview(false);
  };

  const handleSuccess = () => {
    router.push("/active-campaigns");
  };

  // Show connect wallet prompt if not connected
  if (!connected) {
    return <ConnectWalletPrompt />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Start a Campaign</h1>
        <p className="text-slate-400">
          Create a new campaign to raise funds for your cause. Set your
          fundraising goal in USD - it will automatically be converted to SOL at
          current market rates.
        </p>
      </div>

      {isPreview && formData ? (
        <CampaignPreview
          data={formData}
          onBack={handleBack}
          onConfirm={() => {
            setIsPreview(false);
            handleSuccess();
          }}
        />
      ) : (
        <CampaignForm
          onSuccess={handleSuccess}
          onPreview={handlePreview}
          initialData={formData}
        />
      )}
    </div>
  );
};

export default StartCampaignPage;

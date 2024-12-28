//File: /app/(dashboard)/start-campaign/page.tsx
"use client";

import { withAuth } from "@/components/auth";
import { UserRole } from "@/services/auth";
import CampaignForm from "@/components/campaigns/CampaignForm";
import { useCreateCampaign } from "@/hooks/useCampaign";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const StartCampaignPage = () => {
  const router = useRouter();
  const { createCampaign } = useCreateCampaign();

  const handleSubmit = async (data: any) => {
    try {
      await createCampaign(data);
      toast.success("Campaign created successfully!");
      router.push("/active-campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Start a Campaign</h1>
        <p className="text-slate-400">
          Create a new campaign to raise funds for your cause.
        </p>
      </div>

      <CampaignForm onSubmit={handleSubmit} />
    </div>
  );
};

// Export with auth protection
export default withAuth(StartCampaignPage, {
  roles: [UserRole.CAMPAIGN_CREATOR],
  requireInit: true,
});

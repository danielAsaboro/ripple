// hooks/useCampaign/useCampaignDetails.ts
import { useEffect, useState } from "react";
import { useProgram } from "../useProgram";
import { Campaign } from "../../types";
import { PublicKey } from "@solana/web3.js";
import { lamportsToSol, calculateProgress } from "../../utils/format";

interface UseCampaignDetailsProps {
  campaignPDA?: PublicKey;
}

interface CampaignDetails extends Campaign {
  solRaised: number;
  solTarget: number;
  progressPercentage: number;
}

export const useCampaignDetails = ({
  campaignPDA,
}: UseCampaignDetailsProps) => {
  const { program } = useProgram();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!program || !campaignPDA) return;

      setLoading(true);
      setError(null);

      try {
        const campaignAccount = await program.account.campaign.fetch(
          campaignPDA
        );

        const campaignDetails: CampaignDetails = {
          ...campaignAccount,
          solRaised: lamportsToSol(campaignAccount.raisedAmount),
          solTarget: lamportsToSol(campaignAccount.targetAmount),
          progressPercentage: calculateProgress(
            campaignAccount.raisedAmount,
            campaignAccount.targetAmount
          ),
        };

        setCampaign(campaignDetails);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [program, campaignPDA]);

  return { campaign, loading, error };
};

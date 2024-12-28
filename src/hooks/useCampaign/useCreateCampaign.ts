// hooks/useCampaign/useCreateCampaign.ts
import { useState } from "react";
import { CreateCampaignParams } from "../../types";
import { findCampaignPDA, findUserPDA } from "../../utils/pdas";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  validateCampaignDuration,
  validateCampaignTarget,
} from "../../utils/validation";
import { useProgram } from "../useProgram";
import { SystemProgram } from "@solana/web3.js";

export const useCreateCampaign = () => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCampaign = async (params: CreateCampaignParams) => {
    if (!program || !authority) {
      throw new Error("Program or wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      // Validate campaign parameters
      if (
        !validateCampaignDuration(
          params.startDate.toNumber(),
          params.endDate.toNumber()
        )
      ) {
        throw new Error("Invalid campaign duration");
      }
      if (!validateCampaignTarget(params.targetAmount)) {
        throw new Error("Target amount too low");
      }

      // Get PDAs
      const [userPDA] = await findUserPDA(authority);
      const [campaignPDA] = await findCampaignPDA(params.title, authority);

      // Send transaction
      const tx = await program.methods
        .createCampaign(
          params.title,
          params.description,
          params.category,
          params.organizationName,
          params.targetAmount,
          params.startDate,
          params.endDate,
          params.imageUrl,
          params.isUrgent
        )
        .accounts({
          authority,
          user: userPDA,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { campaignPDA, tx };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCampaign, loading, error };
};

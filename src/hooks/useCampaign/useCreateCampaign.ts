// File: /hooks/useCampaign/useCreateCampaign.ts
import { useState } from "react";
import { CreateCampaignParams } from "../../types";
import { findCampaignPDA, findUserPDA } from "../../utils/pdas";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  validateCampaignDuration,
  validateCampaignTarget,
} from "../../utils/validation";
import { SystemProgram } from "@solana/web3.js";
import { useProgram } from "../useProgram";
import { handleTransaction } from "@/utils/transaction";

interface CreateCampaignResult {
  campaignPDA: string;
  signature: string;
  success: boolean;
}

export const useCreateCampaign = () => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCampaign = async (
    params: CreateCampaignParams
  ): Promise<CreateCampaignResult> => {
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

      // Generate PDAs
      const [userPDA] = await findUserPDA(authority);
      const [campaignPDA] = await findCampaignPDA(params.title, authority);

      // Prepare transaction
      const transaction = program.methods
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

      // Execute and confirm transaction
      const result = await handleTransaction<void>(transaction, connection, {
        confirmationMessage: "Campaign created successfully!",
        errorMessage: "Failed to create campaign",
        timeoutMs: 60000, // Increased timeout for campaign creation
        commitment: "confirmed",
      });

      if (!result.success || !result.signature) {
        throw new Error("Failed to create campaign");
      }

      return {
        campaignPDA: campaignPDA.toBase58(),
        signature: result.signature,
        success: true,
      };
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCampaign,
    loading,
    error,
  };
};

// File: /hooks/useCampaign/useWithdrawFunds.ts
import { useState } from "react";
import { findCampaignVaultPDA } from "../../utils/pdas";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useProgram } from "../useProgram";
import { handleTransaction } from "@/utils/transaction";

interface WithdrawParams {
  campaignPDA: PublicKey;
  amount: BN;
  recipient: PublicKey;
}

interface WithdrawResult {
  signature: string;
  success: boolean;
  campaignVaultPDA: PublicKey;
}

export const useWithdrawFunds = () => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const withdrawFunds = async ({
    campaignPDA,
    amount,
    recipient,
  }: WithdrawParams): Promise<WithdrawResult> => {
    if (!program || !authority) {
      throw new Error("Program or wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch campaign data and derive PDAs
      const campaign = await program.account.campaign.fetch(campaignPDA);
      const [campaignVaultPDA] = await findCampaignVaultPDA(
        campaign.title,
        campaign.authority
      );

      // Prepare withdrawal transaction
      const transaction = program.methods
        .withdrawFunds(amount)
        .accounts({
          authority,
          campaign: campaignPDA,
          campaignVault: campaignVaultPDA,
          recipient,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Execute and confirm transaction
      const result = await handleTransaction<void>(transaction, connection, {
        confirmationMessage: "Funds withdrawn successfully!",
        errorMessage: "Failed to withdraw funds",
        timeoutMs: 45000, // Adjusted timeout for withdrawal operations
        commitment: "confirmed",
      });

      if (!result.success || !result.signature) {
        throw new Error("Failed to withdraw funds");
      }

      return {
        signature: result.signature,
        success: true,
        campaignVaultPDA,
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
    withdrawFunds,
    loading,
    error,
  };
};

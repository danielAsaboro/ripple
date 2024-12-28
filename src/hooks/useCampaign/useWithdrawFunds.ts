// hooks/useWithdrawFunds.ts
import { useState } from "react";
import { findCampaignVaultPDA } from "../../utils/pdas";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useProgram } from "../useProgram";

interface WithdrawParams {
  campaignPDA: PublicKey;
  amount: BN;
  recipient: PublicKey;
}

export const useWithdrawFunds = () => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const withdrawFunds = async ({
    campaignPDA,
    amount,
    recipient,
  }: WithdrawParams) => {
    if (!program || !authority) {
      throw new Error("Program or wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      const campaign = await program.account.campaign.fetch(campaignPDA);
      const [campaignVaultPDA] = await findCampaignVaultPDA(
        campaign.title,
        campaign.authority
      );

      const tx = await program.methods
        .withdrawFunds(amount)
        .accounts({
          authority,
          campaign: campaignPDA,
          campaignVault: campaignVaultPDA,
          recipient,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { withdrawFunds, loading, error };
};

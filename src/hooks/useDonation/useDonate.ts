// hooks/useDonation/useDonate.ts
import { useState } from "react";
import {
  findDonationPDA,
  findCampaignVaultPDA,
  findUserPDA,
} from "../../utils/pdas";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { PaymentMethod } from "../../types";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useProgram } from "../useProgram";

interface DonateParams {
  campaignPDA: PublicKey;
  amount: BN;
  paymentMethod: PaymentMethod;
}

export const useDonate = () => {
  const { program } = useProgram();
  const { publicKey: donor } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const donate = async ({
    campaignPDA,
    amount,
    paymentMethod,
  }: DonateParams) => {
    if (!program || !donor) {
      throw new Error("Program or wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      const campaign = await program.account.campaign.fetch(campaignPDA);
      const [userPDA] = await findUserPDA(donor);
      const [campaignVaultPDA] = await findCampaignVaultPDA(
        campaign.title,
        campaign.authority
      );
      const donationCount = campaign.donorsCount.toString();
      const [donationPDA] = await findDonationPDA(
        campaignPDA,
        donor,
        donationCount
      );

      const tx = await program.methods
        .donate(amount, paymentMethod, donationCount)
        .accounts({
          donor,
          user: userPDA,
          campaign: campaignPDA,
          donation: donationPDA,
          campaignVault: campaignVaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { donationPDA, tx };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { donate, loading, error };
};

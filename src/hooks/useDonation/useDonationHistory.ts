// hooks/useDonation/useDonationHistory.ts
import { useEffect, useState } from "react";
import { useProgram } from "../useProgram";
import { PublicKey } from "@solana/web3.js";
import { Donation } from "../../types";

interface UseDonationHistoryProps {
  campaignPDA?: PublicKey;
  userPDA?: PublicKey;
}

export const useDonationHistory = ({
  campaignPDA,
  userPDA,
}: UseDonationHistoryProps) => {
  const { program } = useProgram();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!program) return;

      setLoading(true);
      setError(null);

      try {
        // Get all donation accounts
        const donationAccounts = await program.account.donation.all([
          // Add filters based on campaign or user if provided
          ...(campaignPDA
            ? [{ memcmp: { offset: 8 + 32, bytes: campaignPDA.toBase58() } }]
            : []),
          ...(userPDA
            ? [{ memcmp: { offset: 8, bytes: userPDA.toBase58() } }]
            : []),
        ]);

        setDonations(donationAccounts.map((account) => account.account));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [program, campaignPDA, userPDA]);

  return { donations, loading, error };
};

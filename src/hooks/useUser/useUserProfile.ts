// File: /hooks/useUser/useUserProfile.ts
import { useEffect, useState } from "react";
import { useProgram } from "../useProgram";
import { User, Campaign } from "../../types";
import { PublicKey } from "@solana/web3.js";
import { findUserPDA } from "../../utils/pdas";
import { lamportsToSol } from "../../utils/format";
import { toast } from "react-hot-toast";

interface UserProfile extends User {
  solDonated: number;
  supportedCampaigns?: Campaign[];
}

interface UseUserProfileProps {
  userPDA?: PublicKey;
  authority?: PublicKey;
  includeCampaigns?: boolean;
}

export const useUserProfile = ({
  userPDA,
  authority,
  includeCampaigns = false,
}: UseUserProfileProps) => {
  const { program } = useProgram();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!program) return;
      if (!userPDA && !authority) {
        throw new Error("Either userPDA or authority must be provided");
      }

      setLoading(true);
      setError(null);

      try {
        // Get user PDA if not provided
        const pda = userPDA || (await findUserPDA(authority!))[0];

        // Fetch user account
        const userAccount = await program.account.user.fetch(pda);

        // Fetch supported campaigns if requested
        let supportedCampaigns: Campaign[] | undefined;
        if (includeCampaigns) {
          const allCampaigns = await program.account.campaign.all([
            {
              memcmp: {
                offset: 8, // After discriminator
                bytes: authority!.toBase58(),
              },
            },
          ]);
          supportedCampaigns = allCampaigns.map((c) => c.account as Campaign);
        }

        const userProfile: UserProfile = {
          ...userAccount,
          solDonated: lamportsToSol(userAccount.totalDonations),
          supportedCampaigns,
        };

        setProfile(userProfile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err as Error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [program, userPDA, authority, includeCampaigns]);

  // Function to refresh profile data
  const refreshProfile = () => {
    setLoading(true);
    // Re-run the effect
  };

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
};

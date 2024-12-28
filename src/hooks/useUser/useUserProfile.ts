// hooks/useUser/useUserProfile.ts
import { useEffect, useState } from "react";
import { useProgram } from "../useProgram";
import { User } from "../../types";
import { PublicKey } from "@solana/web3.js";
import { findUserPDA } from "../../utils/pdas";
import { lamportsToSol } from "../../utils/format";

interface UserProfile extends User {
  solDonated: number;
}

interface UseUserProfileProps {
  userPDA?: PublicKey;
  authority?: PublicKey;
}

export const useUserProfile = ({ userPDA, authority }: UseUserProfileProps) => {
  const { program } = useProgram();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
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
        const pda = userPDA || (await findUserPDA(authority!))[0];
        const userAccount = await program.account.user.fetch(pda);

        const userProfile: UserProfile = {
          ...userAccount,
          solDonated: lamportsToSol(userAccount.totalDonations),
        };

        setProfile(userProfile);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [program, userPDA, authority]);

  return { profile, loading, error };
};

// hooks/useUser/useBadgeProgress.ts
import { useEffect, useState } from "react";
import { useProgram } from "../useProgram";
import {
  BADGE_THRESHOLDS,
  SUSTAINED_SUPPORTER_MIN_DONATIONS,
} from "../../utils/constants";
import { PublicKey } from "@solana/web3.js";

interface BadgeProgress {
  bronzeProgress: number;
  silverProgress: number;
  goldProgress: number;
  championProgress: number;
  sustainedProgress?: number;
}

export const useBadgeProgress = (userPDA: PublicKey) => {
  const { program } = useProgram();
  const [progress, setProgress] = useState<BadgeProgress>({
    bronzeProgress: 0,
    silverProgress: 0,
    goldProgress: 0,
    championProgress: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const calculateProgress = async () => {
      if (!program) return;

      setLoading(true);
      setError(null);

      try {
        const user = await program.account.user.fetch(userPDA);
        const totalDonations = user.totalDonations.toNumber();

        // Calculate progress towards each badge
        const newProgress = {
          bronzeProgress: Math.min(
            (totalDonations / BADGE_THRESHOLDS.BRONZE) * 100,
            100
          ),
          silverProgress: Math.min(
            (totalDonations / BADGE_THRESHOLDS.SILVER) * 100,
            100
          ),
          goldProgress: Math.min(
            (totalDonations / BADGE_THRESHOLDS.GOLD) * 100,
            100
          ),
          championProgress: Math.min(
            (totalDonations / BADGE_THRESHOLDS.CHAMPION) * 100,
            100
          ),
          sustainedProgress:
            (user.campaignsSupported / SUSTAINED_SUPPORTER_MIN_DONATIONS) * 100,
        };

        setProgress(newProgress);
      } catch (err) {
        setError(err as Error);
        console.error("Error calculating badge progress:", err);
      } finally {
        setLoading(false);
      }
    };

    calculateProgress();
  }, [program, userPDA]);

  return { progress, loading, error };
};

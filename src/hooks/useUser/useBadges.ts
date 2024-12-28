// hooks/useUser/useBadges.ts
import { useEffect, useState, useCallback } from "react";
import { useProgram } from "../useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Badge, BadgeType } from "../../types";
import { BADGE_THRESHOLDS } from "../../utils/constants";
import { PublicKey } from "@solana/web3.js";

interface UseBadgesProps {
  userPDA?: PublicKey;
}

interface BadgeSystem {
  badges: Badge[];
  hasBadge: (badgeType: BadgeType) => boolean;
  getNextBadgeThreshold: () => number;
  totalDonationValue: number;
  loading: boolean;
  error: Error | null;
}

export const useBadges = ({ userPDA }: UseBadgesProps): BadgeSystem => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [totalDonationValue, setTotalDonationValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user's badges and donation data
  useEffect(() => {
    const fetchBadges = async () => {
      if (!program || (!userPDA && !authority)) return;

      setLoading(true);
      setError(null);

      try {
        const user = await program.account.user.fetch(userPDA!);
        setBadges(user.badges);
        setTotalDonationValue(user.totalDonations.toNumber());
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching badges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [program, userPDA, authority]);

  // Check if user has a specific badge
  const hasBadge = useCallback(
    (badgeType: BadgeType): boolean => {
      return badges.some((badge) => {
        // Check if the badge type matches
        if ("gold" in badgeType && "gold" in badge.badgeType) return true;
        if ("silver" in badgeType && "silver" in badge.badgeType) return true;
        if ("bronze" in badgeType && "bronze" in badge.badgeType) return true;
        if (
          "championOfChange" in badgeType &&
          "championOfChange" in badge.badgeType
        )
          return true;
        if (
          "sustainedSupporter" in badgeType &&
          "sustainedSupporter" in badge.badgeType
        )
          return true;
        return false;
      });
    },
    [badges]
  );

  // Calculate next badge threshold
  const getNextBadgeThreshold = useCallback((): number => {
    if (totalDonationValue >= BADGE_THRESHOLDS.CHAMPION) {
      return 0; // Already at highest badge level
    }
    if (totalDonationValue >= BADGE_THRESHOLDS.GOLD) {
      return BADGE_THRESHOLDS.CHAMPION;
    }
    if (totalDonationValue >= BADGE_THRESHOLDS.SILVER) {
      return BADGE_THRESHOLDS.GOLD;
    }
    if (totalDonationValue >= BADGE_THRESHOLDS.BRONZE) {
      return BADGE_THRESHOLDS.SILVER;
    }
    return BADGE_THRESHOLDS.BRONZE;
  }, [totalDonationValue]);

  return {
    badges,
    hasBadge,
    getNextBadgeThreshold,
    totalDonationValue,
    loading,
    error,
  };
};

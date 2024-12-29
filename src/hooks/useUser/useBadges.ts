// File: /hooks/useUser/useBadges.ts
import { useEffect, useState, useCallback } from "react";
import { useProgram } from "../useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Badge, BadgeType } from "../../types";
import {
  BADGE_THRESHOLDS,
  SUSTAINED_SUPPORTER_MIN_DONATIONS,
} from "../../utils/constants";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-hot-toast";

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
  refreshBadges: () => Promise<void>;
}

export const useBadges = ({ userPDA }: UseBadgesProps): BadgeSystem => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [totalDonationValue, setTotalDonationValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBadges = useCallback(async () => {
    if (!program || !userPDA) {
      console.log("Missing requirements:", {
        program: !!program,
        userPDA: !!userPDA,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching badges for userPDA:", userPDA.toString());

      const user = await program.account.user.fetch(userPDA);
      console.log("User account data:", user);

      setBadges(user.badges || []);
      setTotalDonationValue(user.totalDonations?.toNumber() || 0);
    } catch (err) {
      console.error("Error fetching badges:", err);
      setError(err as Error);
      toast.error("Failed to load badges. Please try again.");

      // Set default values on error
      setBadges([]);
      setTotalDonationValue(0);
    } finally {
      setLoading(false);
    }
  }, [program, userPDA,]);

  // Initial fetch
  useEffect(() => {
    if (program) {
      fetchBadges();
    }
  }, [program, userPDA, authority, fetchBadges]);

  // Check if user has a specific badge
  const hasBadge = useCallback(
    (badgeType: BadgeType): boolean => {
      return badges.some((badge) => {
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

  // Helper function to get badge type name
  const getBadgeTypeName = (badgeType: BadgeType): string => {
    if ("gold" in badgeType) return "Gold";
    if ("silver" in badgeType) return "Silver";
    if ("bronze" in badgeType) return "Bronze";
    if ("championOfChange" in badgeType) return "Champion of Change";
    if ("sustainedSupporter" in badgeType) return "Sustained Supporter";
    return "Unknown";
  };

  // Function to refresh badges data
  const refreshBadges = async () => {
    await fetchBadges();
  };

  return {
    badges,
    hasBadge,
    getNextBadgeThreshold,
    totalDonationValue,
    loading,
    error,
    refreshBadges,
  };
};

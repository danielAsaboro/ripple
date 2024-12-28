import { BN } from "@coral-xyz/anchor";

// src/types/badge.ts

export type BadgeType = {
  gold?: Record<string, never>;
  silver?: Record<string, never>;
  bronze?: Record<string, never>;
  championOfChange?: Record<string, never>;
  sustainedSupporter?: Record<string, never>;
};

export interface Badge {
  badgeType: BadgeType;
  description: string;
  imageUrl: string;
  dateEarned: BN;
}

export interface BadgeAwardedEvent {
  user: string;
  badgeType: BadgeType;
  timestamp: BN;
}

// Helper function to convert Anchor's enum to our string type
export const getBadgeTypeString = (badgeType: BadgeType): string => {
  if (badgeType.gold) return "gold";
  if (badgeType.silver) return "silver";
  if (badgeType.bronze) return "bronze";
  if (badgeType.championOfChange) return "championOfChange";
  if (badgeType.sustainedSupporter) return "sustainedSupporter";
  throw new Error("Unknown badge type");
};

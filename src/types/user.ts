// File: /types/user.ts

import { PublicKey } from "@solana/web3.js";
import { Badge } from "./badge";
import { BN } from "@coral-xyz/anchor";

export interface UserF {
  id: string;
  name: string;
  walletAddress: string;
  email?: string;
  avatar?: string;
  totalDonations: number;
  campaignsSupported: number;
  impactAchieved: {
    mealsProvided: number;
    childrenEducated: number;
    familiesHoused: number;
    treesPlanted: number;
  };
  badges: BadgeF[];
  rank?: number;
}

export interface BadgeF {
  id: string;
  name: BadgeTypeF;
  description: string;
  imageUrl?: string;
  criteria: string;
}

export enum BadgeTypeF {
  GOLD = "Gold",
  SILVER = "Silver",
  BRONZE = "Bronze",
  CHAMPION = "Champion of Change",
  SUSTAINED = "Sustained Supporter",
}

// src/types/user.ts
export interface User {
  authority: PublicKey;
  name: string;
  walletAddress: PublicKey;
  email: string;
  avatarUrl: string;
  totalDonations: BN;
  campaignsSupported: number;
  impactMetrics: ImpactMetrics;
  badges: Badge[];
  rank: number;
  bump: number;
}

export interface ImpactMetrics {
  mealsProvided: number;
  childrenEducated: number;
  familiesHoused: number;
  treesPlanted: number;
}

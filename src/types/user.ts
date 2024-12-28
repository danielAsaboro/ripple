// File: /types/user.ts

import { PublicKey } from "@solana/web3.js";
import { Badge } from "./badge";
import { BN } from "@coral-xyz/anchor";

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

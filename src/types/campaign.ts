// File: /types/campaign.ts

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type CampaignCategory =
  | { healthcare: Record<string, never> }
  | { education: Record<string, never> }
  | { foodSupply: Record<string, never> }
  | { emergencyRelief: Record<string, never> }
  | { infrastructure: Record<string, never> }
  | { waterSanitation: Record<string, never> };

export type CampaignStatus =
  | { active: Record<string, never> }
  | { inProgress: Record<string, never> }
  | { completed: Record<string, never> }
  | { expired: Record<string, never> };

export interface Campaign {
  authority: PublicKey;
  title: string;
  description: string;
  category: CampaignCategory;
  organizationName: string;
  targetAmount: BN;
  raisedAmount: BN;
  donorsCount: number;
  startDate: BN;
  endDate: BN;
  status: CampaignStatus;
  imageUrl: string;
  isUrgent: boolean;
  bump: number;
}
export interface CampaignWithKey {
  publicKey: PublicKey;
  account: Campaign;
}

export interface UpdateCampaignParams {
  description: string | null;
  imageUrl: string | null;
  endDate: BN | null;
  status: CampaignStatus | null;
  isUrgent: boolean | null;
}

export interface CreateCampaignParams {
  title: string;
  description: string;
  category: CampaignCategory;
  organizationName: string;
  targetAmount: BN;
  startDate: BN;
  endDate: BN;
  imageUrl: string;
  isUrgent: boolean;
}

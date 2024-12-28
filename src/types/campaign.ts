// File: /types/campaign.ts

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export interface CampaignF {
  id: string;
  title: string;
  description: string;
  category: CampaignCategoryF;
  organizationName: string;
  target: number;
  raised: number;
  donorsCount: number;
  daysRemaining: number;
  progress: number;
  status: CampaignStatusF;
  image?: string;
  startDate: Date;
  endDate: Date;
  isUrgent?: boolean;
  impactMetrics: {
    livesImpacted: number;
    communitiesReached: number;
  };
}

export enum CampaignCategoryF {
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  FOOD_SUPPLY = "Food Supply",
  EMERGENCY_RELIEF = "Emergency Relief",
  INFRASTRUCTURE = "Infrastructure",
  WATER_SANITATION = "Water Sanitation",
}

export enum CampaignStatusF {
  ACTIVE = "Active",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  EXPIRED = "Expired",
}

export interface CampaignFormDataF {
  title: string;
  category: CampaignCategoryF;
  fundraisingGoal: number;
  startDate: Date;
  endDate: Date;
  description: string;
  impactMetrics: string;
  image?: File;
}

// src/types/campaign.ts

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

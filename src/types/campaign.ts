// File: /types/campaign.ts

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import _ from "lodash";

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

// Helper function to get status key
export function getStatusKey(status: CampaignStatus): string {
  return Object.keys(status)[0];
}

// Function to get dominant status from an array of campaign statuses
export function getDominantStatus(statuses: CampaignStatus[]): CampaignStatus {
  // Map complex status objects to their keys (e.g., "active", "inProgress", etc.)
  const statusKeys = statuses.map(getStatusKey);

  // Count occurrences of each status
  const statusCounts = _.countBy(statusKeys);

  // Find the status with the highest count
  const dominantStatusKey =
    _.maxBy(Object.entries(statusCounts), ([_, count]) => count)?.[0] ??
    "active"; // Default to 'active' if no statuses exist

  // Convert the dominant status key back to a CampaignStatus object
  const statusMap: Record<string, CampaignStatus> = {
    active: { active: {} },
    inProgress: { inProgress: {} },
    completed: { completed: {} },
    expired: { expired: {} },
  };

  return statusMap[dominantStatusKey];
}

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

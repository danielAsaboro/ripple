// File: /types/user.ts

export interface User {
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
  badges: Badge[];
  rank?: number;
}

export interface Badge {
  id: string;
  name: BadgeType;
  description: string;
  imageUrl?: string;
  criteria: string;
}

export enum BadgeType {
  GOLD = "Gold",
  SILVER = "Silver",
  BRONZE = "Bronze",
  CHAMPION = "Champion of Change",
  SUSTAINED = "Sustained Supporter",
}

// File: /types/campaign.ts

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: CampaignCategory;
  organizationName: string;
  target: number;
  raised: number;
  donorsCount: number;
  daysRemaining: number;
  progress: number;
  status: CampaignStatus;
  image?: string;
  startDate: Date;
  endDate: Date;
  isUrgent?: boolean;
  impactMetrics: {
    livesImpacted: number;
    communitiesReached: number;
  };
}

export enum CampaignCategory {
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  FOOD_SUPPLY = "Food Supply",
  EMERGENCY_RELIEF = "Emergency Relief",
  INFRASTRUCTURE = "Infrastructure",
  WATER_SANITATION = "Water Sanitation",
}

export enum CampaignStatus {
  ACTIVE = "Active",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  EXPIRED = "Expired",
}

export interface CampaignFormData {
  title: string;
  category: CampaignCategory;
  fundraisingGoal: number;
  startDate: Date;
  endDate: Date;
  description: string;
  impactMetrics: string;
  image?: File;
}

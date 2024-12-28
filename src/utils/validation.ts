// src/utils/validation.ts
import { BN } from "@coral-xyz/anchor";
import {
  MIN_CAMPAIGN_DURATION,
  MAX_CAMPAIGN_DURATION,
  MIN_CAMPAIGN_TARGET,
} from "./constants";

export const validateCampaignDuration = (
  startDate: number,
  endDate: number
): boolean => {
  const duration = endDate - startDate;
  return duration >= MIN_CAMPAIGN_DURATION && duration <= MAX_CAMPAIGN_DURATION;
};

export const validateCampaignTarget = (amount: number | BN): boolean => {
  return Number(amount) >= MIN_CAMPAIGN_TARGET;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

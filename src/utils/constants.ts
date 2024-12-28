// src/utils/constants.ts
import { PublicKey } from "@solana/web3.js";
import RippleIDL from "../types/ripple.json";

export const PROGRAM_ID = new PublicKey(RippleIDL.address);

export const SEEDS = {
  USER: "user",
  CAMPAIGN: "campaign",
  DONATION: "donation",
  VAULT: "vault",
} as const;

export const MIN_CAMPAIGN_DURATION = 24 * 60 * 60; // 24 hours in seconds
export const MAX_CAMPAIGN_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
export const MIN_CAMPAIGN_TARGET = 1_000_000; // 0.001 SOL (in lamports)
export const MIN_DONATION_AMOUNT = 100_000; // in lamports
export const SUSTAINED_SUPPORTER_MIN_DONATIONS = 10;

export const BADGE_THRESHOLDS = {
  BRONZE: 1_000_000_000, // 1 SOL
  SILVER: 2_000_000_000, // 2 SOL
  GOLD: 5_000_000_000, // 5 SOL
  CHAMPION: 10_000_000_000, // 10 SOL
} as const;

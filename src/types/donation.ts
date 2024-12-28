// File: /types/donation.ts

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type PaymentMethod =
  | { cryptoWallet: Record<string, never> }
  | { card: Record<string, never> };

export type DonationStatus =
  | { pending: Record<string, never> }
  | { completed: Record<string, never> }
  | { allocated: Record<string, never> }
  | { spent: Record<string, never> };

export interface Donation {
  donor: PublicKey;
  campaign: PublicKey;
  amount: BN;
  timestamp: BN;
  status: DonationStatus;
  paymentMethod: PaymentMethod;
  transactionHash: string;
  impactDescription: string;
  bump: number;
}

export interface DonationEvent {
  donation: string;
  campaign: string;
  donor: string;
  amount: BN;
  paymentMethod: PaymentMethod;
}

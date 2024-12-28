// File: /types/donation.ts

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export interface DonationF {
  id: string;
  donorId: string;
  campaignId: string;
  amount: number;
  date: Date;
  status: DonationStatusF;
  paymentMethod: PaymentMethodF;
  transactionHash?: string;
  impact?: string;
}

export interface TransactionHistoryF {
  donorId: string;
  amount: number;
  date: Date;
  purpose: string;
  status: DonationStatusF;
  receipt?: string;
}

export enum DonationStatusF {
  PENDING = "Pending",
  COMPLETED = "Completed",
  ALLOCATED = "Allocated",
  SPENT = "Spent",
}

export enum PaymentMethodF {
  CRYPTO_WALLET = "Crypto Wallet",
  CARD = "Card",
}

export interface DonationStatsF {
  totalFundsReceived: number;
  totalDonations: number;
  allocatedFunds: number;
  remainingFunds: number;
  allocationsByCategory: {
    [key: string]: {
      amount: number;
      percentage: number;
    };
  };
}

// src/types/donation.ts
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

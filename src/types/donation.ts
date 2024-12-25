// File: /types/donation.ts

export interface Donation {
  id: string;
  donorId: string;
  campaignId: string;
  amount: number;
  date: Date;
  status: DonationStatus;
  paymentMethod: PaymentMethod;
  transactionHash?: string;
  impact?: string;
}

export interface TransactionHistory {
  donorId: string;
  amount: number;
  date: Date;
  purpose: string;
  status: DonationStatus;
  receipt?: string;
}

export enum DonationStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  ALLOCATED = "Allocated",
  SPENT = "Spent",
}

export enum PaymentMethod {
  CRYPTO_WALLET = "Crypto Wallet",
  CARD = "Card",
}

export interface DonationStats {
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

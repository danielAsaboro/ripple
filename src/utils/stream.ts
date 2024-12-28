// src/utils/stream.ts
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";
import { BN } from "@coral-xyz/anchor";

export const createStreamFilter = () => ({
  accountIds: [PROGRAM_ID.toString()],
  typeIds: ["CampaignCreated", "DonationReceived", "BadgeAwarded"],
  startDate: new Date().toISOString(),
});

export const parseStreamEvent = (event: any) => {
  // Parse different event types from your contract
  switch (event.type) {
    case "CampaignCreated":
      return {
        type: "campaign",
        campaign: new PublicKey(event.data.campaign),
        authority: new PublicKey(event.data.authority),
        title: event.data.title,
        category: event.data.category,
        targetAmount: new BN(event.data.targetAmount),
      };
    case "DonationReceived":
      return {
        type: "donation",
        donation: new PublicKey(event.data.donation),
        campaign: new PublicKey(event.data.campaign),
        donor: new PublicKey(event.data.donor),
        amount: new BN(event.data.amount),
        paymentMethod: event.data.paymentMethod,
      };
    // Add other event types
    default:
      throw new Error(`Unknown event type: ${event.type}`);
  }
};

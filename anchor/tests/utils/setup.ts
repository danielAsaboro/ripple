// Path: ripple/tests/utils/setup.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Ripple } from "../../target/types/ripple";

export interface TestContext {
  program: Program<Ripple>;
  connection: Connection;
  provider: anchor.AnchorProvider;
}

export const setupTest = async (): Promise<TestContext> => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Ripple as Program<Ripple>;
  const connection = provider.connection;

  return { program, connection, provider };
};

export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const getFutureTimestamp = (daysFromNow: number): number => {
  return getCurrentTimestamp() + daysFromNow * 24 * 60 * 60;
};

export const TEST_CONSTANTS = {
  MIN_CAMPAIGN_DURATION: 24 * 60 * 60,
  MAX_CAMPAIGN_DURATION: 90 * 24 * 60 * 60,
  MIN_CAMPAIGN_TARGET: 0.1 * LAMPORTS_PER_SOL,
  MIN_DONATION_AMOUNT: 0.001 * LAMPORTS_PER_SOL,
  BADGE_THRESHOLDS: {
    BRONZE: 1 * LAMPORTS_PER_SOL,
    SILVER: 5 * LAMPORTS_PER_SOL,
    GOLD: 10 * LAMPORTS_PER_SOL,
    CHAMPION: 50 * LAMPORTS_PER_SOL,
  },
  SUSTAINED_SUPPORTER_MIN_DONATIONS: 10,
};

export const ERROR_MESSAGES = {
  TITLE_TOO_LONG: "Error: Max seed length exceeded",
  DESCRIPTION_TOO_LONG: "custom program error: 0x1772",
  CAMPAIGN_DURATION_TOO_SHORT: "Error Code: CampaignDurationTooShort",
  CAMPAIGN_DURATION_TOO_LONG: "Error Code: CampaignDurationTooLong",
  CAMPAIGN_ENDED: "Error Code: CampaignEnded",
  CAMPAIGN_NOT_ACTIVE: "Error Code: CampaignNotActive",
  DONATION_TOO_LOW: "Error Code: DonationTooLow",
  INVALID_AUTHORITY: "Error Code: InvalidAuthority",
  INSUFFICIENT_FUNDS: "Error Code: InsufficientFunds",
  TARGET_AMOUNT_TOO_LOW: "Error Code: TargetAmountTooLow",
  INVALID_STATUS_TRANSITION: "Error Code: InvalidStatusTransition",
  NAME_TOO_LONG:
    "Error Code: NameTooLong. Error Number: 6013. Error Message: Maximum name length exceeded",
  EMAIL_TOO_LONG: "custom program error: 0x177E",
};

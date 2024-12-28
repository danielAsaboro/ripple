// src/utils/pdas.ts
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID, SEEDS } from "./constants";

export const findUserPDA = async (
  authority: PublicKey
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.USER), authority.toBuffer()],
    PROGRAM_ID
  );
};

export const findCampaignPDA = async (
  title: string,
  authority: PublicKey
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.CAMPAIGN), Buffer.from(title), authority.toBuffer()],
    PROGRAM_ID
  );
};

export const findCampaignVaultPDA = async (
  title: string,
  authority: PublicKey
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.CAMPAIGN),
      Buffer.from(title),
      authority.toBuffer(),
      Buffer.from(SEEDS.VAULT),
    ],
    PROGRAM_ID
  );
};

export const findDonationPDA = async (
  campaign: PublicKey,
  donor: PublicKey,
  donationCount: string
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.DONATION),
      campaign.toBuffer(),
      donor.toBuffer(),
      Buffer.from(donationCount),
    ],
    PROGRAM_ID
  );
};

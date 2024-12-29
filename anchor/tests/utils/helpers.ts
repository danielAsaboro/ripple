// Path: rippl-dapp/tests/utils/helpers.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Ripple } from "../../target/types/ripple";
import { getCurrentTimestamp, getFutureTimestamp } from "./setup";

// PDA Finders
export const findUserPDA = async (
  authority: PublicKey,
  program: Program<Ripple>
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddressSync(
    [Buffer.from("user"), authority.toBuffer()],
    program.programId
  );
};

export const findCampaignPDA = async (
  title: string,
  authority: PublicKey,
  program: Program<Ripple>
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), Buffer.from(title), authority.toBuffer()],
    program.programId
  );
};

export const findCampaignVaultPDA = async (
  title: string,
  authority: PublicKey,
  program: Program<Ripple>
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddressSync(
    [
      Buffer.from("campaign"),
      Buffer.from(title),
      authority.toBuffer(),
      Buffer.from("vault"),
    ],
    program.programId
  );
};

export const findDonationPDA = async (
  campaign: PublicKey,
  donor: PublicKey,
  countInString: string,
  program: Program<Ripple>
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddressSync(
    [
      Buffer.from("donation"),
      campaign.toBuffer(),
      donor.toBuffer(),
      Buffer.from(countInString),
    ],
    program.programId
  );
};

export const createAndFundAccount = async (
  connection: anchor.web3.Connection,
  lamports: number = 100 * LAMPORTS_PER_SOL
): Promise<Keypair> => {
  const account = Keypair.generate();
  const signature = await connection.requestAirdrop(
    account.publicKey,
    lamports
  );
  await connection.confirmTransaction(signature);
  return account;
};

// Core Functions
export const createTestUser = async (
  program: Program<Ripple>,
  authority: Keypair,
  name: string = "Test User"
): Promise<PublicKey> => {
  const [userPDA] = await findUserPDA(authority.publicKey, program);

  await program.methods
    .initialize(name)
    .accounts({
      authority: authority.publicKey,
      user: userPDA,
      systemProgram: SystemProgram.programId,
    })
    .signers([authority])
    .rpc();

  return userPDA;
};

export type CampaignCreationParams = {
  title?: string;
  description?: string;
  category?:
    | { healthcare: {} }
    | { education: {} }
    | { foodSupply: {} }
    | { emergencyRelief: {} }
    | { infrastructure: {} }
    | { waterSanitation: {} };
  organizationName?: string;
  targetAmount?: number;
  daysToRun?: number;
  imageUrl?: string;
  isUrgent?: boolean;
};

export const createTestCampaign = async (
  program: Program<Ripple>,
  authority: Keypair,
  params: CampaignCreationParams = {}
): Promise<PublicKey> => {
  const defaultParams = {
    title: "Test Campaign",
    description: "Test campaign description",
    category: { healthcare: {} },
    organizationName: "Test Organization",
    targetAmount: 1 * LAMPORTS_PER_SOL,
    daysToRun: 30,
    imageUrl: "https://example.com/image.jpg",
    isUrgent: false,
    ...params,
  };

  const startDate = getCurrentTimestamp();
  const endDate = getFutureTimestamp(defaultParams.daysToRun);

  const [userPDA] = await findUserPDA(authority.publicKey, program);
  const [campaignPDA] = await findCampaignPDA(
    defaultParams.title,
    authority.publicKey,
    program
  );

  await program.methods
    .createCampaign(
      defaultParams.title,
      defaultParams.description,
      defaultParams.category,
      defaultParams.organizationName,
      new anchor.BN(defaultParams.targetAmount),
      new anchor.BN(startDate),
      new anchor.BN(endDate),
      defaultParams.imageUrl,
      defaultParams.isUrgent
    )
    .accounts({
      authority: authority.publicKey,
      user: userPDA,
      campaign: campaignPDA,
      systemProgram: SystemProgram.programId,
    })
    .signers([authority])
    .rpc();

  return campaignPDA;
};

export const createTestCampaignWithVault = async (
  program: Program<Ripple>,
  authority: Keypair,
  params: CampaignCreationParams = {}
): Promise<{ campaignPDA: PublicKey; vaultPDA: PublicKey }> => {
  const defaultParams = {
    title: "Test Campaign",
    description: "Test campaign description",
    category: { healthcare: {} },
    organizationName: "Test Organization",
    targetAmount: 1 * LAMPORTS_PER_SOL,
    daysToRun: 30,
    imageUrl: "https://example.com/image.jpg",
    isUrgent: false,
    ...params,
  };

  const startDate = getCurrentTimestamp();
  const endDate = getFutureTimestamp(defaultParams.daysToRun);

  const [userPDA] = await findUserPDA(authority.publicKey, program);
  const [campaignPDA] = await findCampaignPDA(
    defaultParams.title,
    authority.publicKey,
    program
  );

  const [vaultPDA] = await findCampaignVaultPDA(
    defaultParams.title,
    authority.publicKey,
    program
  );

  await program.methods
    .createCampaign(
      defaultParams.title,
      defaultParams.description,
      defaultParams.category,
      defaultParams.organizationName,
      new anchor.BN(defaultParams.targetAmount),
      new anchor.BN(startDate),
      new anchor.BN(endDate),
      defaultParams.imageUrl,
      defaultParams.isUrgent
    )
    .accounts({
      authority: authority.publicKey,
      user: userPDA,
      campaign: campaignPDA,
      systemProgram: SystemProgram.programId,
    })
    .signers([authority])
    .rpc();

  return { campaignPDA, vaultPDA };
};

export const makeTestDonation = async (
  program: Program<Ripple>,
  donor: Keypair,
  campaign: PublicKey,
  amount: number,
  campaignVault: PublicKey
): Promise<PublicKey> => {
  const [userPDA] = await findUserPDA(donor.publicKey, program);
  const campaignAccount = await program.account.campaign.fetch(campaign);

  const [donationPDA] = await findDonationPDA(
    campaign,
    donor.publicKey,
    campaignAccount.donorsCount.toString(),
    program
  );

  await program.methods
    .donate(
      new anchor.BN(amount),
      { cryptoWallet: {} },
      campaignAccount.donorsCount.toString()
    )
    .accounts({
      donor: donor.publicKey,
      user: userPDA,
      campaign: campaign,
      donation: donationPDA,
      campaignVault: campaignVault,
      systemProgram: SystemProgram.programId,
    })
    .signers([donor])
    .rpc();

  return donationPDA;
};

export type BadgeType =
  | { gold: {} }
  | { silver: {} }
  | { bronze: {} }
  | { championOfChange: {} }
  | { sustainedSupporter: {} };

export const verifyBadgeAward = async (
  program: Program<Ripple>,
  authority: PublicKey,
  expectedBadgeType: BadgeType
): Promise<boolean> => {
  const [userPDA] = await findUserPDA(authority, program);
  const userAccount = await program.account.user.fetch(userPDA);

  return userAccount.badges.some(
    (badge: any) =>
      JSON.stringify(badge.badgeType) === JSON.stringify(expectedBadgeType)
  );
};

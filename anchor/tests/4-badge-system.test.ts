import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import { expect } from "chai";
import { Ripple } from "../target/types/ripple";
import { setupTest, TEST_CONSTANTS } from "./utils/setup";
import {
  createAndFundAccount,
  findUserPDA,
  createTestUser,
  createTestCampaign,
  makeTestDonation,
  verifyBadgeAward,
} from "./utils/helpers";

describe("Badge System", () => {
  let program: Program<Ripple>;
  let connection: anchor.web3.Connection;
  let provider: anchor.AnchorProvider;
  let donor: Keypair;
  let campaignCreator: Keypair;
  let campaignPDA: anchor.web3.PublicKey;
  let campaignVaultPDA: anchor.web3.PublicKey;
  let userPDA: anchor.web3.PublicKey;

  before(async () => {
    const ctx = await setupTest();
    program = ctx.program;
    connection = ctx.connection;
    provider = ctx.provider;

    // Create and fund accounts
    donor = await createAndFundAccount(connection, 100 * LAMPORTS_PER_SOL);
    campaignCreator = await createAndFundAccount(connection);

    // Initialize accounts
    await createTestUser(program, donor);
    await createTestUser(program, campaignCreator);
    campaignPDA = await createTestCampaign(program, campaignCreator);

    // Fetch campaign account to get required data for vault PDA
    const campaign = await program.account.campaign.fetch(campaignPDA);

    // Find campaign vault PDA
    [campaignVaultPDA] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        Buffer.from(campaign.title),
        campaign.authority.toBuffer(),
        Buffer.from("vault"),
      ],
      program.programId
    );

    userPDA = (await findUserPDA(donor.publicKey, program))[0];
  });

  describe("Badge Awards", () => {
    it("should award Bronze badge", async () => {
      const donationPDA = await makeTestDonation(
        program,
        donor,
        campaignPDA,
        TEST_CONSTANTS.BADGE_THRESHOLDS.BRONZE,
        campaignVaultPDA
      );

      // Verify donation was successful
      const donationAccount = await program.account.donation.fetch(donationPDA);
      expect(donationAccount.amount.toNumber()).to.equal(
        TEST_CONSTANTS.BADGE_THRESHOLDS.BRONZE
      );

      // Verify the funds were transferred to vault
      const vaultBalance = await connection.getBalance(campaignVaultPDA);
      expect(vaultBalance).to.equal(TEST_CONSTANTS.BADGE_THRESHOLDS.BRONZE);

      // Verify badge was awarded
      const hasBronzeBadge = await verifyBadgeAward(program, donor.publicKey, {
        bronze: {},
      });
      expect(hasBronzeBadge).to.be.true;
    });

    it("should award Silver badge", async () => {
      const donationPDA = await makeTestDonation(
        program,
        donor,
        campaignPDA,
        TEST_CONSTANTS.BADGE_THRESHOLDS.SILVER,
        campaignVaultPDA
      );

      const donationAccount = await program.account.donation.fetch(donationPDA);
      expect(donationAccount.amount.toNumber()).to.equal(
        TEST_CONSTANTS.BADGE_THRESHOLDS.SILVER
      );

      // Verify vault balance is accumulating
      const vaultBalance = await connection.getBalance(campaignVaultPDA);
      expect(vaultBalance).to.equal(
        TEST_CONSTANTS.BADGE_THRESHOLDS.BRONZE +
          TEST_CONSTANTS.BADGE_THRESHOLDS.SILVER
      );

      const hasSilverBadge = await verifyBadgeAward(program, donor.publicKey, {
        silver: {},
      });
      expect(hasSilverBadge).to.be.true;
    });

    it("should award Gold badge", async () => {
      const donationPDA = await makeTestDonation(
        program,
        donor,
        campaignPDA,
        TEST_CONSTANTS.BADGE_THRESHOLDS.GOLD,
        campaignVaultPDA
      );

      const donationAccount = await program.account.donation.fetch(donationPDA);
      expect(donationAccount.amount.toNumber()).to.equal(
        TEST_CONSTANTS.BADGE_THRESHOLDS.GOLD
      );

      const hasGoldBadge = await verifyBadgeAward(program, donor.publicKey, {
        gold: {},
      });
      expect(hasGoldBadge).to.be.true;
    });

    it("should award Champion badge", async () => {
      const donationPDA = await makeTestDonation(
        program,
        donor,
        campaignPDA,
        TEST_CONSTANTS.BADGE_THRESHOLDS.CHAMPION,
        campaignVaultPDA
      );

      const donationAccount = await program.account.donation.fetch(donationPDA);
      expect(donationAccount.amount.toNumber()).to.equal(
        TEST_CONSTANTS.BADGE_THRESHOLDS.CHAMPION
      );

      const hasChampionBadge = await verifyBadgeAward(
        program,
        donor.publicKey,
        { championOfChange: {} }
      );
      expect(hasChampionBadge).to.be.true;
    });

    it("should award Sustained Supporter badge", async () => {
      const newDonor = await createAndFundAccount(
        connection,
        20 * LAMPORTS_PER_SOL
      );
      await createTestUser(program, newDonor);

      // Create new campaign for sustained supporter test
      const newCampaignPDA = await createTestCampaign(
        program,
        campaignCreator,
        { title: "Sustained Support Test" }
      );

      // Get new campaign vault PDA
      const newCampaign = await program.account.campaign.fetch(newCampaignPDA);
      const [newCampaignVaultPDA] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("campaign"),
          Buffer.from(newCampaign.title),
          newCampaign.authority.toBuffer(),
          Buffer.from("vault"),
        ],
        program.programId
      );

      // Make minimum required donations
      for (
        let i = 0;
        i < TEST_CONSTANTS.SUSTAINED_SUPPORTER_MIN_DONATIONS;
        i++
      ) {
        await makeTestDonation(
          program,
          newDonor,
          newCampaignPDA,
          TEST_CONSTANTS.MIN_DONATION_AMOUNT,
          newCampaignVaultPDA
        );
      }

      const hasSustainedBadge = await verifyBadgeAward(
        program,
        newDonor.publicKey,
        { sustainedSupporter: {} }
      );
      expect(hasSustainedBadge).to.be.true;
    });
  });

  describe("Badge Properties", () => {
    it("should store badge metadata correctly", async () => {
      const userAccount = await program.account.user.fetch(userPDA);
      const goldBadge = userAccount.badges.find(
        (badge) => badge.badgeType.gold !== undefined
      );

      expect(goldBadge).to.exist;
      expect(goldBadge.description).to.be.a("string");
      expect(goldBadge.dateEarned.toNumber()).to.be.greaterThan(0);
    });

    it("should not duplicate badges", async () => {
      // Make another donation that would qualify for bronze
      await makeTestDonation(
        program,
        donor,
        campaignPDA,
        TEST_CONSTANTS.BADGE_THRESHOLDS.BRONZE,
        campaignVaultPDA
      );

      const userAccount = await program.account.user.fetch(userPDA);
      const bronzeBadges = userAccount.badges.filter(
        (badge) => badge.badgeType.bronze !== undefined
      );
      expect(bronzeBadges).to.have.length(1);
    });

    it("should maintain badge order", async () => {
      const userAccount = await program.account.user.fetch(userPDA);
      const badgeDates = userAccount.badges.map((badge) =>
        badge.dateEarned.toNumber()
      );
      const sortedDates = [...badgeDates].sort((a, b) => a - b);
      expect(badgeDates).to.deep.equal(sortedDates);
    });
  });
});

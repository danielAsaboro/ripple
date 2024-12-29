// File: tests/7-edge-cases.test.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { expect } from "chai";
import { Ripple } from "../target/types/ripple";
import {
  setupTest,
  TEST_CONSTANTS,
  ERROR_MESSAGES,
  getCurrentTimestamp,
  getFutureTimestamp,
} from "./utils/setup";
import {
  createAndFundAccount,
  findUserPDA,
  findCampaignPDA,
  createTestUser,
  createTestCampaignWithVault,
  makeTestDonation,
} from "./utils/helpers";

describe("Edge Cases", () => {
  let program: Program<Ripple>;
  let connection: anchor.web3.Connection;
  let provider: anchor.Provider;

  // Test accounts
  let authority: Keypair;
  let donor: Keypair;

  before(async () => {
    const ctx = await setupTest();
    program = ctx.program;
    connection = ctx.connection;
    provider = ctx.provider;

    authority = await createAndFundAccount(connection);
    donor = await createAndFundAccount(connection);
    await createTestUser(program, authority);
    await createTestUser(program, donor);
  });

  describe("Campaign Edge Cases", () => {
    it("should fail to create campaign with exact minimum duration minus 1 second", async () => {
      try {
        const startDate = getCurrentTimestamp();
        const endDate = startDate + TEST_CONSTANTS.MIN_CAMPAIGN_DURATION - 1;
        const title = `TC${Date.now()}`;

        const [userPDA] = await findUserPDA(authority.publicKey, program);
        const [campaignPDA] = await findCampaignPDA(
          title,
          authority.publicKey,
          program
        );

        await program.methods
          .createCampaign(
            title,
            "Description",
            { healthcare: {} },
            "Test Org",
            new anchor.BN(TEST_CONSTANTS.MIN_CAMPAIGN_TARGET),
            new anchor.BN(startDate),
            new anchor.BN(endDate),
            "image.jpg",
            false
          )
          .accounts({
            authority: authority.publicKey,
            user: userPDA,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        expect.fail("Should fail with duration too short");
      } catch (error) {
        expect(error.toString()).to.include("Campaign duration is too short");
      }
    });

    it("should fail to create campaign with exact maximum duration plus 1 second", async () => {
      try {
        const startDate = getCurrentTimestamp();
        const endDate = startDate + TEST_CONSTANTS.MAX_CAMPAIGN_DURATION + 1;
        const title = `TC${Date.now()}`;

        const [userPDA] = await findUserPDA(authority.publicKey, program);
        const [campaignPDA] = await findCampaignPDA(
          title,
          authority.publicKey,
          program
        );

        await program.methods
          .createCampaign(
            title,
            "Description",
            { healthcare: {} },
            "Test Org",
            new anchor.BN(TEST_CONSTANTS.MIN_CAMPAIGN_TARGET),
            new anchor.BN(startDate),
            new anchor.BN(endDate),
            "image.jpg",
            false
          )
          .accounts({
            authority: authority.publicKey,
            user: userPDA,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        expect.fail("Should fail with duration too long");
      } catch (error) {
        expect(error.toString()).to.include("Campaign duration is too long");
      }
    });

    it("should fail to create campaign with target amount 1 lamport below minimum", async () => {
      try {
        const title = `TC${Date.now()}`;
        const [userPDA] = await findUserPDA(authority.publicKey, program);
        const [campaignPDA] = await findCampaignPDA(
          title,
          authority.publicKey,
          program
        );

        await program.methods
          .createCampaign(
            title,
            "Description",
            { healthcare: {} },
            "Test Org",
            new anchor.BN(TEST_CONSTANTS.MIN_CAMPAIGN_TARGET - 1),
            new anchor.BN(getCurrentTimestamp()),
            new anchor.BN(getFutureTimestamp(30)),
            "image.jpg",
            false
          )
          .accounts({
            authority: authority.publicKey,
            user: userPDA,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        expect.fail("Should fail with target amount too low");
      } catch (error) {
        expect(error.toString()).to.include(
          "Campaign target amount is too low"
        );
      }
    });
  });

  describe("Donation Edge Cases", () => {
    let campaignPDA: PublicKey;
    let vaultPDA: PublicKey;

    beforeEach(async () => {
      const title = `DC${Date.now()}`;
      const result = await createTestCampaignWithVault(program, authority, {
        title,
      });
      campaignPDA = result.campaignPDA;
      vaultPDA = result.vaultPDA;
    });

    it("should fail to donate 1 lamport below minimum", async () => {
      try {
        await makeTestDonation(
          program,
          donor,
          campaignPDA,
          TEST_CONSTANTS.MIN_DONATION_AMOUNT - 1,
          vaultPDA
        );
        expect.fail("Should fail with donation too low");
      } catch (error) {
        expect(error.toString()).to.include("Donation amount is too low");
      }
    });

    it("should fail to donate with exact balance (no funds for rent)", async () => {
      try {
        const poorDonor = await createAndFundAccount(
          connection,
          TEST_CONSTANTS.MIN_DONATION_AMOUNT
        );
        await createTestUser(program, poorDonor);

        await makeTestDonation(
          program,
          poorDonor,
          campaignPDA,
          TEST_CONSTANTS.MIN_DONATION_AMOUNT,
          vaultPDA
        );
        expect.fail("Should fail with insufficient funds for rent");
      } catch (error) {
        expect(error.toString()).to.include("0x1"); // Insufficient funds system error
      }
    });

    it("should fail to donate to campaign 1 second after end date", async () => {
      try {
        const title = `DC${Date.now()}`;

        // Create campaign with minimum valid duration (24 hours) but set to expire in 2 seconds
        const nowSeconds = Math.floor(Date.now() / 1000);
        const endDate = nowSeconds + 2; // End in 2 seconds
        const startDate = endDate - TEST_CONSTANTS.MIN_CAMPAIGN_DURATION; // Start 24 hours before end

        // Create campaign with explicit start and end dates
        const [userPDA] = await findUserPDA(authority.publicKey, program);
        const [campaignPDA] = await findCampaignPDA(
          title,
          authority.publicKey,
          program
        );

        await program.methods
          .createCampaign(
            title,
            "Description",
            { healthcare: {} },
            "Test Org",
            new anchor.BN(TEST_CONSTANTS.MIN_CAMPAIGN_TARGET),
            new anchor.BN(startDate),
            new anchor.BN(endDate),
            "image.jpg",
            false
          )
          .accounts({
            authority: authority.publicKey,
            user: userPDA,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        // Find vault PDA using the campaign title and authority after campaign is created
        const [vaultPDA] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from("campaign"),
            Buffer.from(title),
            authority.publicKey.toBuffer(),
            Buffer.from("vault"),
          ],
          program.programId
        );

        // Wait for 3 seconds to ensure campaign has ended
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Try to donate to expired campaign
        await makeTestDonation(
          program,
          donor,
          campaignPDA,
          TEST_CONSTANTS.MIN_DONATION_AMOUNT,
          vaultPDA
        );
        expect.fail("Should fail with campaign ended");
      } catch (error) {
        // Check for campaign ended error
        expect(error.toString()).to.include(" CampaignEnded");

        // expect(error.toString()).to.include("6007"); // Campaign ended error code
      }
    });
  });

  describe("Status Transition Edge Cases", () => {
    let campaignPDA: PublicKey;
    let vaultPDA: PublicKey;

    beforeEach(async () => {
      const title = `ST${Date.now()}`;
      const result = await createTestCampaignWithVault(program, authority, {
        title,
      });
      campaignPDA = result.campaignPDA;
      vaultPDA = result.vaultPDA;
    });

    it("should fail invalid status transitions", async () => {
      // Try to transition directly from Active to Completed
      try {
        await program.methods
          .updateCampaign({
            description: null,
            imageUrl: null,
            endDate: null,
            status: { completed: {} },
            isUrgent: null,
          })
          .accounts({
            authority: authority.publicKey,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        expect.fail("Should fail with invalid status transition");
      } catch (error) {
        expect(error.toString()).to.include("InvalidStatusTransition");
      }

      // Try to transition back from InProgress to Active
      await program.methods
        .updateCampaign({
          description: null,
          imageUrl: null,
          endDate: null,
          status: { inProgress: {} },
          isUrgent: null,
        })
        .accounts({
          authority: authority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      try {
        await program.methods
          .updateCampaign({
            description: null,
            imageUrl: null,
            endDate: null,
            status: { active: {} },
            isUrgent: null,
          })
          .accounts({
            authority: authority.publicKey,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        expect.fail("Should fail with invalid status transition");
      } catch (error) {
        expect(error.toString()).to.include("InvalidStatusTransition");
      }
    });
  });

  describe("Withdrawal Edge Cases", () => {
    it("should fail to withdraw with amount 1 lamport more than balance", async () => {
      try {
        const title = `WT${Date.now()}`;
        const { campaignPDA, vaultPDA } = await createTestCampaignWithVault(
          program,
          authority,
          { title }
        );

        // Make initial donation
        await makeTestDonation(
          program,
          donor,
          campaignPDA,
          TEST_CONSTANTS.MIN_DONATION_AMOUNT,
          vaultPDA
        );

        // Complete campaign
        await program.methods
          .updateCampaign({
            description: null,
            imageUrl: null,
            endDate: null,
            status: { inProgress: {} },
            isUrgent: null,
          })
          .accounts({
            authority: authority.publicKey,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        await program.methods
          .updateCampaign({
            description: null,
            imageUrl: null,
            endDate: null,
            status: { completed: {} },
            isUrgent: null,
          })
          .accounts({
            authority: authority.publicKey,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        // Try to withdraw more than balance
        await program.methods
          .withdrawFunds(new anchor.BN(TEST_CONSTANTS.MIN_DONATION_AMOUNT + 1))
          .accounts({
            authority: authority.publicKey,
            campaign: campaignPDA,
            campaignVault: vaultPDA,
            recipient: authority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        expect.fail("Should fail with insufficient funds");
      } catch (error) {
        expect(error.toString()).to.include("Insufficient funds");
      }
    });

    it("should fail to withdraw from non-completed campaign", async () => {
      try {
        const title = `WT${Date.now()}`;
        const { campaignPDA, vaultPDA } = await createTestCampaignWithVault(
          program,
          authority,
          { title }
        );

        // Make donation but don't complete campaign
        await makeTestDonation(
          program,
          donor,
          campaignPDA,
          TEST_CONSTANTS.MIN_DONATION_AMOUNT,
          vaultPDA
        );

        // Try to withdraw
        await program.methods
          .withdrawFunds(new anchor.BN(TEST_CONSTANTS.MIN_DONATION_AMOUNT))
          .accounts({
            authority: authority.publicKey,
            campaign: campaignPDA,
            campaignVault: vaultPDA,
            recipient: authority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        expect.fail("Should fail with campaign not completed");
      } catch (error) {
        expect(error.toString()).to.include("Campaign is not active");
      }
    });
  });
});

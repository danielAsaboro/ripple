// Path: rippl-dapp/tests/2-campaign-management.test.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
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
  createTestCampaign,
  CampaignCreationParams,
} from "./utils/helpers";

describe("Campaign Management", () => {
  let program: Program<Ripple>;
  let connection: anchor.web3.Connection;
  let provider: anchor.Provider;

  // Test accounts
  let campaignCreator: Keypair;
  let anotherCreator: Keypair;

  before(async () => {
    const ctx = await setupTest();
    program = ctx.program;
    connection = ctx.connection;
    provider = ctx.provider;

    campaignCreator = await createAndFundAccount(connection);
    anotherCreator = await createAndFundAccount(connection);

    await createTestUser(program, campaignCreator, "Campaign Creator");
    await createTestUser(program, anotherCreator, "Another Creator");
  });

  describe("Campaign Creation - Happy Path", () => {
    it("should successfully create a campaign with minimum values", async () => {
      const title = "Test Campaign";
      const [userPDA] = await findUserPDA(campaignCreator.publicKey, program);
      const [campaignPDA] = await findCampaignPDA(
        title,
        campaignCreator.publicKey,
        program
      );

      const startDate = getCurrentTimestamp();
      const endDate = getFutureTimestamp(30);

      await program.methods
        .createCampaign(
          title,
          "Test Description",
          { healthcare: {} },
          "Test Organization",
          new anchor.BN(TEST_CONSTANTS.MIN_CAMPAIGN_TARGET),
          new anchor.BN(startDate),
          new anchor.BN(endDate),
          "https://example.com/image.jpg",
          false
        )
        .accounts({
          authority: campaignCreator.publicKey,
          user: userPDA,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignCreator])
        .rpc();

      const campaignAccount = await program.account.campaign.fetch(campaignPDA);
      expect(campaignAccount.authority).to.eql(campaignCreator.publicKey);
      expect(campaignAccount.title).to.eq(title);
      expect(campaignAccount.raisedAmount.toNumber()).to.eq(0);
      expect(campaignAccount.donorsCount).to.eq(0);
      expect(campaignAccount.status).to.deep.equal({ active: {} });
    });

    it("should create campaign with helper function", async () => {
      const campaignPDA = await createTestCampaign(program, anotherCreator);
      const campaignAccount = await program.account.campaign.fetch(campaignPDA);

      expect(campaignAccount.authority).to.eql(anotherCreator.publicKey);
      expect(campaignAccount.isUrgent).to.be.false;
      expect(campaignAccount.status).to.deep.equal({ active: {} });
    });

    it("should create urgent campaign", async () => {
      const campaignPDA = await createTestCampaign(program, campaignCreator, {
        title: "Urgent Campaign",
        isUrgent: true,
      });

      const campaignAccount = await program.account.campaign.fetch(campaignPDA);
      expect(campaignAccount.isUrgent).to.be.true;
    });
  });

  describe("Campaign Updates - Happy Path", () => {
    let campaignPDA: anchor.web3.PublicKey;

    before(async () => {
      campaignPDA = await createTestCampaign(program, campaignCreator, {
        title: "Update Test Campaign",
      });
    });

    it("should update campaign description", async () => {
      const newDescription = "Updated description";

      await program.methods
        .updateCampaign({
          description: newDescription,
          imageUrl: null,
          endDate: null,
          status: null,
          isUrgent: null,
        })
        .accounts({
          authority: campaignCreator.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignCreator])
        .rpc();

      const campaignAccount = await program.account.campaign.fetch(campaignPDA);
      expect(campaignAccount.description).to.eq(newDescription);
    });

    it("should update campaign status to in progress", async () => {
      await program.methods
        .updateCampaign({
          description: null,
          imageUrl: null,
          endDate: null,
          status: { inProgress: {} },
          isUrgent: null,
        })
        .accounts({
          authority: campaignCreator.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignCreator])
        .rpc();

      const campaignAccount = await program.account.campaign.fetch(campaignPDA);
      expect(campaignAccount.status).to.deep.eq({ inProgress: {} });
    });

    it("should extend campaign end date", async () => {
      const newEndDate = getFutureTimestamp(60);

      await program.methods
        .updateCampaign({
          description: null,
          imageUrl: null,
          endDate: new anchor.BN(newEndDate),
          status: null,
          isUrgent: null,
        })
        .accounts({
          authority: campaignCreator.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignCreator])
        .rpc();

      const campaignAccount = await program.account.campaign.fetch(campaignPDA);
      expect(campaignAccount.endDate.toNumber()).to.eq(newEndDate);
    });
  });

  describe("Campaign Management - Sad Path", () => {
    it("should fail to create campaign with title too long", async () => {
      try {
        const longTitle = "x".repeat(101);
        await createTestCampaign(program, campaignCreator, {
          title: longTitle,
        });
        expect.fail("Expected long title to fail");
      } catch (error) {
        expect(error.toString()).to.include("Max seed length exceeded");
      }
    });

    it("should fail to create campaign with target amount too low", async () => {
      try {
        const title = "Low Target Campaign";
        const [userPDA] = await findUserPDA(campaignCreator.publicKey, program);
        const [campaignPDA] = await findCampaignPDA(
          title,
          campaignCreator.publicKey,
          program
        );

        await program.methods
          .createCampaign(
            title,
            "Test Description",
            { healthcare: {} },
            "Test Organization",
            new anchor.BN(TEST_CONSTANTS.MIN_CAMPAIGN_TARGET - 1),
            new anchor.BN(getCurrentTimestamp()),
            new anchor.BN(getFutureTimestamp(30)),
            "https://example.com/image.jpg",
            false
          )
          .accounts({
            authority: campaignCreator.publicKey,
            user: userPDA,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([campaignCreator])
          .rpc();

        expect.fail("Expected low target amount to fail");
      } catch (error) {
        const errorMsg = error.error?.errorMessage || error.toString();
        expect(errorMsg).to.include("Campaign target amount is too low");
      }
    });

    it("should fail to create campaign with invalid duration", async () => {
      try {
        const startDate = getCurrentTimestamp();
        const endDate = startDate + (TEST_CONSTANTS.MIN_CAMPAIGN_DURATION - 1);

        const [userPDA] = await findUserPDA(campaignCreator.publicKey, program);
        const [campaignPDA] = await findCampaignPDA(
          "Invalid Duration",
          campaignCreator.publicKey,
          program
        );

        await program.methods
          .createCampaign(
            "Invalid Duration",
            "Test Description",
            { healthcare: {} },
            "Test Org",
            new anchor.BN(TEST_CONSTANTS.MIN_CAMPAIGN_TARGET),
            new anchor.BN(startDate),
            new anchor.BN(endDate),
            "https://example.com/image.jpg",
            false
          )
          .accounts({
            authority: campaignCreator.publicKey,
            user: userPDA,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([campaignCreator])
          .rpc();

        expect.fail("Expected invalid duration to fail");
      } catch (error) {
        expect(error.toString()).to.include("Campaign duration is too short");
      }
    });

    it("should fail to update campaign by non-authority", async () => {
      try {
        const campaignPDA = await createTestCampaign(program, campaignCreator, {
          title: "Auth Test Campaign",
        });

        await program.methods
          .updateCampaign({
            description: "Unauthorized update",
            imageUrl: null,
            endDate: null,
            status: null,
            isUrgent: null,
          })
          .accounts({
            authority: anotherCreator.publicKey,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([anotherCreator])
          .rpc();

        expect.fail("Expected unauthorized update to fail");
      } catch (error) {
        expect(error.message).to.include("A seeds constraint was violated");
      }
    });

    it("should fail invalid status transition", async () => {
      try {
        const campaignPDA = await createTestCampaign(program, campaignCreator, {
          title: "Status Test Campaign",
        });

        await program.methods
          .updateCampaign({
            description: null,
            imageUrl: null,
            endDate: null,
            status: { completed: {} },
            isUrgent: null,
          })
          .accounts({
            authority: campaignCreator.publicKey,
            campaign: campaignPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([campaignCreator])
          .rpc();

        expect.fail("Expected invalid status transition to fail");
      } catch (error) {
        expect(error.message).to.include("Invalid campaign status transition");
      }
    });
  });
});

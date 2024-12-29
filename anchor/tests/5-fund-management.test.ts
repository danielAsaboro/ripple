// File: tests/5-fund-management.test.ts
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
  createTestUser,
  createTestCampaignWithVault,
  makeTestDonation,
  findCampaignVaultPDA,
} from "./utils/helpers";

describe("Fund Management", () => {
  let program: Program<Ripple>;
  let connection: anchor.web3.Connection;

  // Test accounts
  let campaignAuthority: Keypair;
  let donor1: Keypair;
  let donor2: Keypair;
  let recipientAccount: Keypair;

  // Test PDAs
  let campaignPDA: PublicKey;
  let vaultPDA: PublicKey;

  const campaignTarget = 5 * LAMPORTS_PER_SOL;
  const donation1Amount = 2 * LAMPORTS_PER_SOL;
  const donation2Amount = 1 * LAMPORTS_PER_SOL;

  beforeEach(async () => {
    const ctx = await setupTest();
    program = ctx.program;
    connection = ctx.connection;

    campaignAuthority = await createAndFundAccount(
      connection,
      10 * LAMPORTS_PER_SOL
    );
    donor1 = await createAndFundAccount(connection, 5 * LAMPORTS_PER_SOL);
    donor2 = await createAndFundAccount(connection, 5 * LAMPORTS_PER_SOL);
    recipientAccount = await createAndFundAccount(connection, LAMPORTS_PER_SOL);

    await createTestUser(program, campaignAuthority);

    // Create campaign and get PDAs
    const { campaignPDA: newCampaignPDA, vaultPDA: newVaultPDA } =
      await createTestCampaignWithVault(program, campaignAuthority, {
        targetAmount: campaignTarget,
        daysToRun: 30,
      });

    campaignPDA = newCampaignPDA;
    vaultPDA = newVaultPDA;
  });

  describe("Happy Path Tests", () => {
    it("should successfully receive and track multiple donations", async () => {
      await createTestUser(program, donor1);
      await makeTestDonation(
        program,
        donor1,
        campaignPDA,
        donation1Amount,
        vaultPDA
      );

      let campaignAccount = await program.account.campaign.fetch(campaignPDA);
      let vaultBalance = await connection.getBalance(vaultPDA);

      expect(campaignAccount.raisedAmount.toNumber()).to.equal(donation1Amount);
      expect(vaultBalance).to.equal(donation1Amount);

      await createTestUser(program, donor2);
      await makeTestDonation(
        program,
        donor2,
        campaignPDA,
        donation2Amount,
        vaultPDA
      );

      campaignAccount = await program.account.campaign.fetch(campaignPDA);
      vaultBalance = await connection.getBalance(vaultPDA);

      expect(campaignAccount.raisedAmount.toNumber()).to.equal(
        donation1Amount + donation2Amount
      );
      expect(vaultBalance).to.equal(donation1Amount + donation2Amount);
    });

    it("should allow withdrawal after campaign completion", async () => {
      // Make initial donation
      await createTestUser(program, donor1);
      await makeTestDonation(
        program,
        donor1,
        campaignPDA,
        donation1Amount,
        vaultPDA
      );

      // Transition to InProgress
      await program.methods
        .updateCampaign({
          description: null,
          imageUrl: null,
          endDate: null,
          status: { inProgress: {} },
          isUrgent: null,
        })
        .accounts({
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
        .rpc();

      // Transition to Completed
      await program.methods
        .updateCampaign({
          description: null,
          imageUrl: null,
          endDate: null,
          status: { completed: {} },
          isUrgent: null,
        })
        .accounts({
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
        .rpc();

      const initialVaultBalance = await connection.getBalance(vaultPDA);
      const initialRecipientBalance = await connection.getBalance(
        recipientAccount.publicKey
      );

      await program.methods
        .withdrawFunds(new anchor.BN(donation1Amount))
        .accounts({
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          campaignVault: vaultPDA,
          recipient: recipientAccount.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
        .rpc();

      const finalVaultBalance = await connection.getBalance(vaultPDA);
      const finalRecipientBalance = await connection.getBalance(
        recipientAccount.publicKey
      );

      expect(finalVaultBalance).to.equal(initialVaultBalance - donation1Amount);
      expect(finalRecipientBalance).to.equal(
        initialRecipientBalance + donation1Amount
      );
    });

    it("should allow partial withdrawals", async () => {
      // Make initial donation
      await createTestUser(program, donor1);
      await makeTestDonation(
        program,
        donor1,
        campaignPDA,
        donation1Amount,
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
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
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
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
        .rpc();

      const partialAmount = donation1Amount / 2;
      const initialVaultBalance = await connection.getBalance(vaultPDA);

      await program.methods
        .withdrawFunds(new anchor.BN(partialAmount))
        .accounts({
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          campaignVault: vaultPDA,
          recipient: recipientAccount.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
        .rpc();

      const finalVaultBalance = await connection.getBalance(vaultPDA);
      expect(finalVaultBalance).to.equal(initialVaultBalance - partialAmount);
    });
  });

  describe("Sad Path Tests", () => {
    it("should not allow withdrawal from active campaign", async () => {
      // Make initial donation
      await createTestUser(program, donor1);
      await makeTestDonation(
        program,
        donor1,
        campaignPDA,
        donation1Amount,
        vaultPDA
      );

      try {
        await program.methods
          .withdrawFunds(new anchor.BN(donation1Amount))
          .accounts({
            authority: campaignAuthority.publicKey,
            campaign: campaignPDA,
            campaignVault: vaultPDA,
            recipient: recipientAccount.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([campaignAuthority])
          .rpc();

        expect.fail("Should not allow withdrawal from active campaign");
      } catch (error) {
        expect(error.toString()).to.include(ERROR_MESSAGES.CAMPAIGN_NOT_ACTIVE);
      }
    });

    it("should not allow withdrawal by non-authority", async () => {
      // Make initial donation
      await createTestUser(program, donor1);
      await makeTestDonation(
        program,
        donor1,
        campaignPDA,
        donation1Amount,
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
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
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
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
        .rpc();

      try {
        await program.methods
          .withdrawFunds(new anchor.BN(donation1Amount))
          .accounts({
            authority: donor1.publicKey,
            campaign: campaignPDA,
            campaignVault: vaultPDA,
            recipient: recipientAccount.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([donor1])
          .rpc();

        expect.fail("Should not allow withdrawal by non-authority");
      } catch (error) {
        expect(error.toString()).to.include("caused by account: campaign");
        expect(error.toString()).to.include("A seeds constraint was violated");
      }
    });

    it("should not allow withdrawal of more than available funds", async () => {
      // Make initial donation
      await createTestUser(program, donor1);
      await makeTestDonation(
        program,
        donor1,
        campaignPDA,
        donation1Amount,
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
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
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
          authority: campaignAuthority.publicKey,
          campaign: campaignPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignAuthority])
        .rpc();

      try {
        const excessAmount = donation1Amount * 2;
        await program.methods
          .withdrawFunds(new anchor.BN(excessAmount))
          .accounts({
            authority: campaignAuthority.publicKey,
            campaign: campaignPDA,
            campaignVault: vaultPDA,
            recipient: recipientAccount.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([campaignAuthority])
          .rpc();

        expect.fail("Should not allow withdrawal of more than available funds");
      } catch (error) {
        expect(error.toString()).to.include(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
      }
    });
  });
});

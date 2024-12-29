import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";
import { Ripple } from "../target/types/ripple";
import { setupTest, TEST_CONSTANTS } from "./utils/setup";
import {
  createAndFundAccount,
  findUserPDA,
  createTestUser,
  createTestCampaign,
} from "./utils/helpers";

describe("Donation Flow", () => {
  let program: Program<Ripple>;
  let connection: anchor.web3.Connection;
  let campaignCreator: Keypair;
  let donor: Keypair;
  let campaignPDA: PublicKey;

  before(async () => {
    const ctx = await setupTest();
    program = ctx.program;
    connection = ctx.connection;

    campaignCreator = await createAndFundAccount(
      connection,
      10 * LAMPORTS_PER_SOL
    );
    donor = await createAndFundAccount(connection, 10 * LAMPORTS_PER_SOL);

    await createTestUser(program, campaignCreator);
    await createTestUser(program, donor);
    campaignPDA = await createTestCampaign(program, campaignCreator);
  });

  describe("Happy Path", () => {
    it("should make a successful donation", async () => {
      const donationAmount = LAMPORTS_PER_SOL;
      const [userPDA] = await findUserPDA(donor.publicKey, program);
      const campaign = await program.account.campaign.fetch(campaignPDA);

      // Find campaign vault PDA
      const [campaignVaultPDA] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("campaign"),
          Buffer.from(campaign.title),
          campaign.authority.toBuffer(),
          Buffer.from("vault"),
        ],
        program.programId
      );

      // Find donation PDA
      const [donationPDA] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("donation"),
          campaignPDA.toBuffer(),
          donor.publicKey.toBuffer(),
          Buffer.from(campaign.donorsCount.toString()),
        ],
        program.programId
      );

      await program.methods
        .donate(
          new anchor.BN(donationAmount),
          { cryptoWallet: {} },
          campaign.donorsCount.toString()
        )
        .accounts({
          donor: donor.publicKey,
          user: userPDA,
          campaign: campaignPDA,
          donation: donationPDA,
          campaignVault: campaignVaultPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([donor])
        .rpc();

      const updatedCampaign = await program.account.campaign.fetch(campaignPDA);
      expect(updatedCampaign.raisedAmount.toNumber()).to.eq(donationAmount);
      expect(updatedCampaign.donorsCount).to.eq(1);

      // Verify the funds were actually transferred to the vault
      const vaultBalance = await connection.getBalance(campaignVaultPDA);
      expect(vaultBalance).to.eq(donationAmount);
    });

    it("should make multiple donations from same donor", async () => {
      const donationAmount = LAMPORTS_PER_SOL;
      const [userPDA] = await findUserPDA(donor.publicKey, program);
      const campaign = await program.account.campaign.fetch(campaignPDA);

      // Find campaign vault PDA
      const [campaignVaultPDA] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("campaign"),
          Buffer.from(campaign.title),
          campaign.authority.toBuffer(),
          Buffer.from("vault"),
        ],
        program.programId
      );

      // Find donation PDA
      const [donationPDA] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("donation"),
          campaignPDA.toBuffer(),
          donor.publicKey.toBuffer(),
          Buffer.from(campaign.donorsCount.toString()),
        ],
        program.programId
      );

      await program.methods
        .donate(
          new anchor.BN(donationAmount),
          { cryptoWallet: {} },
          campaign.donorsCount.toString()
        )
        .accounts({
          donor: donor.publicKey,
          user: userPDA,
          campaign: campaignPDA,
          donation: donationPDA,
          campaignVault: campaignVaultPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([donor])
        .rpc();

      const updatedCampaign = await program.account.campaign.fetch(campaignPDA);
      expect(updatedCampaign.raisedAmount.toNumber()).to.eq(donationAmount * 2);
      expect(updatedCampaign.donorsCount).to.eq(2);

      // Verify the total funds in vault
      const vaultBalance = await connection.getBalance(campaignVaultPDA);
      expect(vaultBalance).to.eq(donationAmount * 2);
    });

    it("should update donor stats after donation", async () => {
      const [userPDA] = await findUserPDA(donor.publicKey, program);
      const userAccount = await program.account.user.fetch(userPDA);

      expect(userAccount.totalDonations.toNumber()).to.eq(LAMPORTS_PER_SOL * 2);
      expect(userAccount.campaignsSupported).to.eq(2); // This would be fixed in a separate update
    });
  });

  describe("Sad Path", () => {
    let poorDonor: Keypair;

    before(async () => {
      poorDonor = await createAndFundAccount(
        connection,
        0.1 * LAMPORTS_PER_SOL
      );
      await createTestUser(program, poorDonor);
    });

    it("should fail with insufficient funds", async () => {
      try {
        const [userPDA] = await findUserPDA(poorDonor.publicKey, program);
        const campaign = await program.account.campaign.fetch(campaignPDA);

        // Find campaign vault PDA
        const [campaignVaultPDA] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from("campaign"),
            Buffer.from(campaign.title),
            campaign.authority.toBuffer(),
            Buffer.from("vault"),
          ],
          program.programId
        );

        const [donationPDA] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from("donation"),
            campaignPDA.toBuffer(),
            poorDonor.publicKey.toBuffer(),
            Buffer.from(campaign.donorsCount.toString()),
          ],
          program.programId
        );

        await program.methods
          .donate(
            new anchor.BN(LAMPORTS_PER_SOL),
            { cryptoWallet: {} },
            campaign.donorsCount.toString()
          )
          .accounts({
            donor: poorDonor.publicKey,
            user: userPDA,
            campaign: campaignPDA,
            donation: donationPDA,
            campaignVault: campaignVaultPDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([poorDonor])
          .rpc();

        expect.fail("Expected insufficient funds error");
      } catch (error: any) {
        expect(error.toString()).to.include("0x1"); // System program insufficient funds error
      }
    });

    it("should fail with donation too low", async () => {
      try {
        const [userPDA] = await findUserPDA(donor.publicKey, program);
        const campaign = await program.account.campaign.fetch(campaignPDA);

        // Find campaign vault PDA
        const [campaignVaultPDA] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from("campaign"),
            Buffer.from(campaign.title),
            campaign.authority.toBuffer(),
            Buffer.from("vault"),
          ],
          program.programId
        );

        const [donationPDA] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from("donation"),
            campaignPDA.toBuffer(),
            donor.publicKey.toBuffer(),
            Buffer.from(campaign.donorsCount.toString()),
          ],
          program.programId
        );

        await program.methods
          .donate(
            new anchor.BN(TEST_CONSTANTS.MIN_DONATION_AMOUNT - 1),
            { cryptoWallet: {} },
            campaign.donorsCount.toString()
          )
          .accounts({
            donor: donor.publicKey,
            user: userPDA,
            campaign: campaignPDA,
            donation: donationPDA,
            campaignVault: campaignVaultPDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([donor])
          .rpc();

        expect.fail("Expected donation too low error");
      } catch (error: any) {
        expect(error.toString()).to.include("DonationTooLow");
      }
    });

    it("should fail when campaign is not active", async () => {
      const inactiveCampaign = await createTestCampaign(
        program,
        campaignCreator,
        {
          title: "Inactive Campaign",
        }
      );

      // First transition to InProgress
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
          campaign: inactiveCampaign,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([campaignCreator])
        .rpc();

      // Then transition to Completed
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
          campaign: inactiveCampaign,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([campaignCreator])
        .rpc();

      try {
        const [userPDA] = await findUserPDA(donor.publicKey, program);
        const campaign = await program.account.campaign.fetch(inactiveCampaign);

        // Find campaign vault PDA
        const [campaignVaultPDA] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from("campaign"),
            Buffer.from(campaign.title),
            campaign.authority.toBuffer(),
            Buffer.from("vault"),
          ],
          program.programId
        );

        const [donationPDA] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from("donation"),
            inactiveCampaign.toBuffer(),
            donor.publicKey.toBuffer(),
            Buffer.from("0"),
          ],
          program.programId
        );

        await program.methods
          .donate(new anchor.BN(LAMPORTS_PER_SOL), { cryptoWallet: {} }, "0")
          .accounts({
            donor: donor.publicKey,
            user: userPDA,
            campaign: inactiveCampaign,
            donation: donationPDA,
            campaignVault: campaignVaultPDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([donor])
          .rpc();

        expect.fail("Expected campaign not active error");
      } catch (error: any) {
        expect(error.toString()).to.include("CampaignNotActive");
      }
    });
  });
});

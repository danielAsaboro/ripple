// // File: tests/6-event-emission.test.ts
// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { expect } from "chai";
// import { Ripple } from "../target/types/ripple";
// import {
//   setupTest,
//   TEST_CONSTANTS,
//   getCurrentTimestamp,
//   getFutureTimestamp,
// } from "./utils/setup";
// import {
//   createAndFundAccount,
//   createTestUser,
//   createTestCampaign,
//   makeTestDonation,
// } from "./utils/helpers";

// describe("Event Emission", () => {
//   let program: Program<Ripple>;
//   let connection: anchor.web3.Connection;

//   // Test accounts
//   let authority: Keypair;
//   let donor: Keypair;
//   let campaignVault: Keypair;

//   before(async () => {
//     const ctx = await setupTest();
//     program = ctx.program;
//     connection = ctx.connection;

//     // Create and fund test accounts
//     authority = await createAndFundAccount(connection);
//     donor = await createAndFundAccount(connection);
//     campaignVault = Keypair.generate();

//     // Initialize user accounts
//     await createTestUser(program, authority, "Campaign Creator");
//     await createTestUser(program, donor, "Campaign Donor");
//   });

//   it("should emit CampaignCreated event", async () => {
//     // Listen for the event
//     const campaignCreatedPromise = new Promise((resolve) => {
//       const listener = program.addEventListener("CampaignCreated", (event) => {
//         program.removeEventListener(listener);
//         resolve(event);
//       });
//     });

//     // Create a campaign
//     const title = "Event Test Campaign";
//     const campaignPDA = await createTestCampaign(program, authority, {
//       title,
//       targetAmount: 5 * LAMPORTS_PER_SOL,
//     });

//     // Wait for and verify the event
//     const event: any = await campaignCreatedPromise;
//     expect(event.campaign.toString()).to.equal(campaignPDA.toString());
//     expect(event.authority.toString()).to.equal(authority.publicKey.toString());
//     expect(event.title).to.equal(title);
//     expect(event.targetAmount.toNumber()).to.equal(5 * LAMPORTS_PER_SOL);
//   });

//   it("should emit DonationReceived event", async () => {
//     // Create campaign first
//     const campaignPDA = await createTestCampaign(program, authority);

//     // Listen for the event
//     const donationReceivedPromise = new Promise((resolve) => {
//       const listener = program.addEventListener("DonationReceived", (event) => {
//         program.removeEventListener(listener);
//         resolve(event);
//       });
//     });

//     // Make donation
//     const amount = 1 * LAMPORTS_PER_SOL;
//     const donationPDA = await makeTestDonation(
//       program,
//       donor,
//       campaignPDA,
//       amount,
//       campaignVault,
//       0 // CryptoWallet
//     );

//     // Wait for and verify the event
//     const event: any = await donationReceivedPromise;
//     expect(event.donation.toString()).to.equal(donationPDA.toString());
//     expect(event.campaign.toString()).to.equal(campaignPDA.toString());
//     expect(event.donor.toString()).to.equal(donor.publicKey.toString());
//     expect(event.amount.toNumber()).to.equal(amount);
//     expect(event.paymentMethod).to.equal(0); // CryptoWallet
//   });

//   it("should emit CampaignUpdated event", async () => {
//     // Create campaign
//     const campaignPDA = await createTestCampaign(program, authority);

//     // Listen for the event
//     const campaignUpdatedPromise = new Promise((resolve) => {
//       const listener = program.addEventListener("CampaignUpdated", (event) => {
//         program.removeEventListener(listener);
//         resolve(event);
//       });
//     });

//     // Update campaign status
//     await program.methods
//       .updateCampaign({
//         description: null,
//         imageUrl: null,
//         endDate: null,
//         status: { inProgress: {} },
//         isUrgent: null,
//       })
//       .accounts({
//         authority: authority.publicKey,
//         campaign: campaignPDA,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([authority])
//       .rpc();

//     // Wait for and verify the event
//     const event: any = await campaignUpdatedPromise;
//     expect(event.campaign.toString()).to.equal(campaignPDA.toString());
//     expect(event.authority.toString()).to.equal(authority.publicKey.toString());
//     expect(event.newStatus).to.deep.include({ inProgress: {} });
//   });

//   it("should emit FundsWithdrawn event", async () => {
//     // Create and fund campaign
//     const campaignPDA = await createTestCampaign(program, authority);
//     await makeTestDonation(
//       program,
//       donor,
//       campaignPDA,
//       2 * LAMPORTS_PER_SOL,
//       campaignVault
//     );

//     // Set campaign to completed status
//     await program.methods
//       .updateCampaign({
//         description: null,
//         imageUrl: null,
//         endDate: null,
//         status: { completed: {} },
//         isUrgent: null,
//       })
//       .accounts({
//         authority: authority.publicKey,
//         campaign: campaignPDA,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([authority])
//       .rpc();

//     // Listen for the event
//     const fundsWithdrawnPromise = new Promise((resolve) => {
//       const listener = program.addEventListener("FundsWithdrawn", (event) => {
//         program.removeEventListener(listener);
//         resolve(event);
//       });
//     });

//     // Withdraw funds
//     const withdrawAmount = 1 * LAMPORTS_PER_SOL;
//     await program.methods
//       .withdrawFunds(new anchor.BN(withdrawAmount))
//       .accounts({
//         authority: authority.publicKey,
//         campaign: campaignPDA,
//         campaignVault: campaignVault.publicKey,
//         recipient: authority.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([authority])
//       .rpc();

//     // Wait for and verify the event
//     const event: any = await fundsWithdrawnPromise;
//     expect(event.campaign.toString()).to.equal(campaignPDA.toString());
//     expect(event.recipient.toString()).to.equal(authority.publicKey.toString());
//     expect(event.amount.toNumber()).to.equal(withdrawAmount);
//   });

//   it("should emit BadgeAwarded event", async () => {
//     // Create campaign
//     const campaignPDA = await createTestCampaign(program, authority);

//     // Listen for the event
//     const badgeAwardedPromise = new Promise((resolve) => {
//       const listener = program.addEventListener("BadgeAwarded", (event) => {
//         program.removeEventListener(listener);
//         resolve(event);
//       });
//     });

//     // Make large donation to trigger badge award
//     const amount = TEST_CONSTANTS.BADGE_THRESHOLDS.BRONZE;
//     await makeTestDonation(program, donor, campaignPDA, amount, campaignVault);

//     // Wait for and verify the event
//     const event: any = await badgeAwardedPromise;
//     expect(event.user.toString()).to.equal(donor.publicKey.toString());
//     expect(event.badgeType).to.deep.include({ bronze: {} });
//     expect(event.timestamp.toNumber()).to.be.greaterThan(0);
//   });

//   // Test multiple events
//   it("should emit multiple events in sequence", async () => {
//     const events: any[] = [];
//     const eventPromise = new Promise((resolve) => {
//       let eventCount = 0;
//       const listener = program.addEventListener("DonationReceived", (event) => {
//         events.push(event);
//         eventCount++;
//         if (eventCount === 2) {
//           program.removeEventListener(listener);
//           resolve(events);
//         }
//       });
//     });

//     // Create campaign
//     const campaignPDA = await createTestCampaign(program, authority);

//     // Make multiple donations
//     await makeTestDonation(
//       program,
//       donor,
//       campaignPDA,
//       1 * LAMPORTS_PER_SOL,
//       campaignVault
//     );

//     await makeTestDonation(
//       program,
//       donor,
//       campaignPDA,
//       0.5 * LAMPORTS_PER_SOL,
//       campaignVault
//     );

//     // Wait for and verify events
//     const receivedEvents = await eventPromise;
//     expect(events).to.have.length(2);
//     expect(events[0].amount.toNumber()).to.equal(1 * LAMPORTS_PER_SOL);
//     expect(events[1].amount.toNumber()).to.equal(0.5 * LAMPORTS_PER_SOL);
//   });
// });

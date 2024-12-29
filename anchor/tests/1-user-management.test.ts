// File: tests/1-user-management.test.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";
import { Ripple } from "../target/types/ripple";
import { setupTest, TEST_CONSTANTS, ERROR_MESSAGES } from "./utils/setup";
import {
  createAndFundAccount,
  findUserPDA,
  createTestUser,
} from "./utils/helpers";

describe("User Management", () => {
  let program: Program<Ripple>;
  let connection: anchor.web3.Connection;
  let provider: anchor.Provider;

  // Test accounts
  let userAuthority: Keypair;
  let anotherUserAuthority: Keypair;

  before(async () => {
    // Initialize test context
    const ctx = await setupTest();
    program = ctx.program;
    connection = ctx.connection;
    provider = ctx.provider;

    // Create and fund test accounts
    userAuthority = await createAndFundAccount(connection);
    anotherUserAuthority = await createAndFundAccount(connection);
  });

  describe("Happy Path Tests", () => {
    it("should successfully initialize a new user", async () => {
      // Find PDA for user account
      const [userPDA] = await findUserPDA(userAuthority.publicKey, program);
      const userName = "Test User";

      // Create user account
      await program.methods
        .initialize(userName)
        .accounts({
          authority: userAuthority.publicKey,
          user: userPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([userAuthority])
        .rpc();

      // Fetch and verify user account data
      const userAccount = await program.account.user.fetch(userPDA);

      expect(userAccount.authority).to.eql(userAuthority.publicKey);
      expect(userAccount.name).to.eq(userName);
      expect(userAccount.walletAddress).to.eql(userAuthority.publicKey);
      expect(userAccount.totalDonations.toNumber()).to.eq(0);
      expect(userAccount.campaignsSupported).to.eq(0);
      expect(userAccount.badges).to.have.length(0);
      expect(userAccount.rank).to.eq(0);
    });

    it("should successfully create multiple users", async () => {
      const userName = "Another User";
      const [userPDA] = await findUserPDA(
        anotherUserAuthority.publicKey,
        program
      );

      await program.methods
        .initialize(userName)
        .accounts({
          authority: anotherUserAuthority.publicKey,
          user: userPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([anotherUserAuthority])
        .rpc();

      const userAccount = await program.account.user.fetch(userPDA);
      expect(userAccount.authority).to.eql(anotherUserAuthority.publicKey);
      expect(userAccount.name).to.eq(userName);
    });

    it("should create user with helper function", async () => {
      const newUser = await createAndFundAccount(connection);
      const userName = "Helper Created User";

      const userPDA = await createTestUser(program, newUser, userName);
      const userAccount = await program.account.user.fetch(userPDA);

      expect(userAccount.name).to.eq(userName);
    });
  });

  describe("Sad Path Tests", () => {
    it("should fail to initialize duplicate user", async () => {
      try {
        // Try to create another user account with same authority
        const [userPDA] = await findUserPDA(userAuthority.publicKey, program);

        await program.methods
          .initialize("Duplicate User")
          .accounts({
            authority: userAuthority.publicKey,
            user: userPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([userAuthority])
          .rpc();

        expect.fail("Expected duplicate user creation to fail");
      } catch (error) {
        // Anchor error for account already initialized
        expect(error.toString()).to.include("already in use");
      }
    });

    it("should fail with empty name", async () => {
      try {
        const newUser = await createAndFundAccount(connection);
        const [userPDA] = await findUserPDA(newUser.publicKey, program);

        await program.methods
          .initialize("")
          .accounts({
            authority: newUser.publicKey,
            user: userPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([newUser])
          .rpc();

        expect.fail("Expected empty name to fail");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });

    it("should fail with name too long", async () => {
      try {
        const newUser = await createAndFundAccount(connection);
        const [userPDA] = await findUserPDA(newUser.publicKey, program);

        const longName = "x".repeat(51); // Max length is 50

        await program.methods
          .initialize(longName)
          .accounts({
            authority: newUser.publicKey,
            user: userPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([newUser])
          .rpc();

        expect.fail("Expected long name to fail");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.include(ERROR_MESSAGES.NAME_TOO_LONG);
      }
    });

    it("should fail without signer", async () => {
      try {
        const newUser = await createAndFundAccount(connection);
        const [userPDA] = await findUserPDA(newUser.publicKey, program);

        // Try to create without signing
        await program.methods
          .initialize("Test User")
          .accounts({
            authority: newUser.publicKey,
            user: userPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        expect.fail("Expected missing signer to fail");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.toString()).to.include("Signature verification failed");
      }
    });

    it("should fail with insufficient funds", async () => {
      try {
        // Create account without funding it
        const poorUser = Keypair.generate();
        const [userPDA] = await findUserPDA(poorUser.publicKey, program);

        await program.methods
          .initialize("Poor User")
          .accounts({
            authority: poorUser.publicKey,
            user: userPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([poorUser])
          .rpc();

        expect.fail("Expected insufficient funds to fail");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.toString()).to.include("custom program error: 0x1"); // Insufficient funds error
      }
    });
  });
});



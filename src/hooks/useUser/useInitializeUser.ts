// File: /hooks/useUser/useInitializeUser.ts
import { useState } from "react";
import { findUserPDA } from "../../utils/pdas";
import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useProgram } from "../useProgram";
import { toast } from "react-hot-toast";

export const useInitializeUser = () => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initializeUser = async (name: string, email?: string) => {
    if (!program || !authority) {
      throw new Error("Program or wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      const [userPDA] = await findUserPDA(authority);

      const tx = await program.methods
        .initialize(name)
        .accounts({
          authority,
          user: userPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Wait for confirmation
      const confirmation = await program.provider.connection.confirmTransaction(
        tx
      );
      if (confirmation.value.err) throw new Error("Transaction failed");

      toast.success("Profile created successfully!");
      return { userPDA, tx };
    } catch (err) {
      console.error("Error initializing user:", err);
      setError(err as Error);
      toast.error("Failed to create profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkUserExists = async () => {
    if (!program || !authority) return false;

    try {
      const [userPDA] = await findUserPDA(authority);
      await program.account.user.fetch(userPDA);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    initializeUser,
    checkUserExists,
    loading,
    error,
  };
};

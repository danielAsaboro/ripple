// hooks/useUser/useInitializeUser.ts
import { useState } from "react";
import { findUserPDA } from "../../utils/pdas";
import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useProgram } from "../useProgram";

export const useInitializeUser = () => {
  const { program } = useProgram();
  const { publicKey: authority } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initializeUser = async (name: string) => {
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

      return { userPDA, tx };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { initializeUser, loading, error };
};

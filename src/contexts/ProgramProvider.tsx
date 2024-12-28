// src/contexts/ProgramProvider.tsx
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Ripple } from "../types/ripple";
import RippleIDL from "../types/ripple.json";

interface ProgramContextState {
  program: Program<Ripple> | null;
  loading: boolean;
  error: Error | null;
}

export const ProgramContext = createContext<ProgramContextState>({
  program: null,
  loading: true,
  error: null,
});

interface ProgramProviderProps {
  children: ReactNode;
}

export const ProgramProvider = ({ children }: ProgramProviderProps) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [state, setState] = useState<ProgramContextState>({
    program: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!wallet.publicKey) {
      setState({
        program: null,
        loading: false,
        error: new Error("Wallet not connected"),
      });
      return;
    }

    try {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        AnchorProvider.defaultOptions()
      );
      const program = new Program(RippleIDL as Ripple, provider);

      setState({
        program,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        program: null,
        loading: false,
        error: error as Error,
      });
    }
  }, [connection, wallet]);

  return (
    <ProgramContext.Provider value={state}>{children}</ProgramContext.Provider>
  );
};

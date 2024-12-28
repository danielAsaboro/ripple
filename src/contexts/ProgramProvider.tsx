// File: /contexts/ProgramProvider.tsx
"use client";
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
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { toast } from "react-hot-toast";

interface ProgramContextState {
  program: Program<Ripple> | null;
  loading: boolean;
  error: Error | null;
  reconnect: () => Promise<void>;
}

export const ProgramContext = createContext<ProgramContextState>({
  program: null,
  loading: true,
  error: null,
  reconnect: async () => {},
});

interface ProgramProviderProps {
  children: ReactNode;
}

export const ProgramProvider = ({ children }: ProgramProviderProps) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [state, setState] = useState<Omit<ProgramContextState, "reconnect">>({
    program: null,
    loading: true,
    error: null,
  });

  const initializeProgram = async () => {
    if (!wallet.publicKey) {
      setState({
        program: null,
        loading: false,
        error: new Error("Wallet not connected"),
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        AnchorProvider.defaultOptions()
      );

      // Initialize program
      const program = new Program(
        RippleIDL as Ripple,
        RippleIDL.address,
        provider
      );

      // Test connection
      await program.account.campaign.all();

      setState({
        program,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Program initialization error:", error);
      setState({
        program: null,
        loading: false,
        error: error as Error,
      });
      toast.error("Failed to connect to the program");
    }
  };

  // Initialize on mount and wallet/connection changes
  useEffect(() => {
    initializeProgram();
  }, [connection, wallet.publicKey]);

  // Setup connection error listener
  useEffect(() => {
    const handleConnectionError = () => {
      toast.error("Connection lost. Attempting to reconnect...");
      initializeProgram();
    };

    connection.onError = handleConnectionError;
    return () => {
      connection.onError = undefined;
    };
  }, [connection]);

  const programContextValue: ProgramContextState = {
    ...state,
    reconnect: initializeProgram,
  };

  return (
    <ErrorBoundary>
      <ProgramContext.Provider value={programContextValue}>
        {children}
      </ProgramContext.Provider>
    </ErrorBoundary>
  );
};

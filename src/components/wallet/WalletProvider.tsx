// File: /components/wallet/WalletProvider.tsx
import { createContext, useContext, ReactNode } from "react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return <WalletModalProvider>{children}</WalletModalProvider>;
}

export const WalletModalContext = createContext<{
  visible: boolean;
  setVisible: (open: boolean) => void;
} | null>(null);

export function useWalletModal() {
  const context = useContext(WalletModalContext);
  if (!context) {
    throw new Error("useWalletModal must be used within WalletModalProvider");
  }
  return context;
}

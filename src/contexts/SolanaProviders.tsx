// File: /contexts/SolanaProviders.tsx
"use client";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Commitment } from "@solana/web3.js";
import { ReactNode, useMemo } from "react";
import { useCluster } from "@/components/cluster/cluster-data-access";

require("@solana/wallet-adapter-react-ui/styles.css");

interface SolanaProvidersProps {
  children: ReactNode;
}

export const SolanaProviders = ({ children }: SolanaProvidersProps) => {
  // Get current cluster from context
  const { cluster } = useCluster();

  // Initialize wallet adapters based on the current network
  const wallets = useMemo(() => {
    return [new PhantomWalletAdapter({ network: cluster.network })];
  }, [cluster.network]);

  // Connection config with confirmation commitment
  const config = useMemo(
    () => ({
      commitment: "confirmed" as Commitment,
      wsEndpoint: cluster.endpoint.replace("https", "wss"),
    }),
    [cluster.endpoint]
  );

  return (
    <ConnectionProvider endpoint={cluster.endpoint} config={config}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

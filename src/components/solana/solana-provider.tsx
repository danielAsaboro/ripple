"use client";

import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import { ReactNode, useCallback, useMemo } from "react";
import { useCluster } from "../cluster/cluster-data-access";
import { Commitment } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
  }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const endpoint = useMemo(() => {
    console.log("Using endpoint:", cluster.endpoint); // Add debugging
    return cluster.endpoint;
  }, [cluster.endpoint]);
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  const config = useMemo(
    () => ({
      commitment: "confirmed" as Commitment,
    }),
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={config}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// File: /hooks/useWalletDetection.ts
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WALLET_CONFIGS } from "@/config/wallets";
import { detectWallet } from "@/utils/walletDetection";

export interface DetectedWallet {
  name: string;
  icon: string;
  url: string;
  adapter: string;
  detected: boolean;
}

export function useWalletDetection() {
  const { wallets } = useWallet();
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function detectWallets() {
      setIsLoading(true);
      setError(null);

      try {
        const detectionResults = await Promise.all(
          Object.entries(WALLET_CONFIGS).map(async ([key, config]) => {
            // Check adapter availability
            const hasAdapter = wallets.some(
              (w) => w.adapter.name === config.adapter
            );

            // Check browser detection
            const isDetected = await detectWallet(key, config);

            return {
              ...config,
              detected: hasAdapter || isDetected,
            };
          })
        );

        // Sort wallets with detected ones first
        const sortedWallets = detectionResults.sort((a, b) => {
          if (a.detected === b.detected) {
            return a.name.localeCompare(b.name);
          }
          return a.detected ? -1 : 1;
        });

        setDetectedWallets(sortedWallets);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to detect wallets")
        );
      } finally {
        setIsLoading(false);
      }
    }

    detectWallets();
  }, [wallets]);

  return { detectedWallets, isLoading, error };
}

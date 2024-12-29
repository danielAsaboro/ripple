// File: /app/connect-wallet/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import Card from "@/components/common/Card";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useUser } from "@/contexts/UserProvider";
import { WalletOption } from "@/components/wallet/WalletOption";
import { useWalletDetection } from "@/hooks/useWalletDetection";

export default function ConnectWalletPage() {
  const router = useRouter();
  const { connected } = useWallet();
  const { initialized } = useUser();
  const { detectedWallets, isLoading, error } = useWalletDetection();

  useEffect(() => {
    if (connected) {
      router.push(initialized ? "/dashboard" : "/create-account");
    }
  }, [connected, initialized, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (error) {
    console.error("Wallet detection error:", error);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Connect Your Wallet
            </h1>
            <p className="text-slate-400">
              Connect your wallet to start donating and tracking your
              contributions in real time.
            </p>
          </div>

          <div className="flex justify-center">
            <WalletMultiButton className="btn btn-lg bg-green-500 hover:bg-green-600" />
          </div>

          {detectedWallets.length > 0 && (
            <>
              <div className="text-center text-sm text-slate-400">Or</div>

              <div className="space-y-3">
                {detectedWallets.map((wallet) => (
                  <WalletOption
                    key={wallet.name}
                    name={wallet.name}
                    icon={wallet.icon}
                    status={wallet.detected ? "detected" : undefined}
                    actionLabel={!wallet.detected ? "Get" : undefined}
                    onClick={() => {
                      if (!wallet.detected) {
                        window.open(
                          wallet.url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    }}
                  />
                ))}
              </div>
            </>
          )}

          <footer className="text-center text-sm text-slate-400 space-y-2">
            <p>
              New to web3?{" "}
              <a
                href="/getting-started"
                className="text-green-400 hover:underline"
              >
                Learn how to get started
              </a>
            </p>
            <p>
              By connecting, you agree to our{" "}
              <a href="/terms" className="text-green-400 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-green-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </footer>
        </div>
      </Card>
    </div>
  );
}

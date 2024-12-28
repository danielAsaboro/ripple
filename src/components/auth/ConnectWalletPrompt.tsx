//File: /components/auth/ConnectWalletPrompt.tsx
import { useWallet } from "@solana/wallet-adapter-react";
import Card from "../common/Card";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const ConnectWalletPrompt = () => {
  const { connected } = useWallet();

  if (connected) return null;

  return (
    <Card className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold text-white mb-4">
        Connect Your Wallet
      </h2>
      <p className="text-slate-400 mb-6">
        Please connect your wallet to access this feature.
      </p>
      <div className="flex justify-center">
        <WalletMultiButton />
      </div>
    </Card>
  );
};
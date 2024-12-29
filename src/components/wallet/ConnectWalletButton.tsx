// File: /components/wallet/ConnectWalletButton.tsx
import { useWallet } from "@solana/wallet-adapter-react";
import Button from "../common/Button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";

const DynamicWalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton = ({
  className,
}: ConnectWalletButtonProps) => {
  const { connected } = useWallet();

  return <DynamicWalletMultiButton className={className} />;
};

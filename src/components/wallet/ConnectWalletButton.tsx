// // File: /components/wallet/ConnectWalletButton.tsx
// import React from "react";
// import Button from "@/components/common/Button";
// import { useWalletModal } from "./WalletProvider";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { shortenAddress } from "@/utils/format";

// export const ConnectWalletButton: React.FC = () => {
//   const { showWalletModal } = useWalletModal();
//   const { connected, publicKey } = useWallet();

//   if (connected && publicKey) {
//     return (
//       <Button variant="outline">{shortenAddress(publicKey.toString())}</Button>
//     );
//   }

//   return <Button onClick={showWalletModal}>Connect Wallet</Button>;
// };

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

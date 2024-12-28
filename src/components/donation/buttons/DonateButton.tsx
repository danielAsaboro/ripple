// File: /components/donation/buttons/DonateButton.tsx
import React from "react";
import Button from "@/components/common/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { Campaign } from "@/types";

interface DonateButtonProps {
  campaign: Campaign;
  onDonate: () => void;
}

export const DonateButton: React.FC<DonateButtonProps> = ({
  campaign,
  onDonate,
}) => {
  const { connected } = useWallet();

  return (
    <Button onClick={onDonate} disabled={!connected} className="w-full">
      {connected ? "Donate Now" : "Connect Wallet to Donate"}
    </Button>
  );
};

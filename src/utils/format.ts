// src/utils/format.ts
import { BN } from "@coral-xyz/anchor";

export const lamportsToSol = (lamports: number | BN | BN): number => {
  const amount =
    lamports instanceof BN ? lamports.toNumber() : Number(lamports);
  return amount / 1e9;
};

export const solToLamports = (sol: number): BN => {
  return BN(sol * 1e9);
};

export const formatDate = (timestamp: number | BN | BN): string => {
  const date = new Date(
    Number(timestamp instanceof BN ? timestamp.toString() : timestamp) * 1000
  );
  return date.toLocaleDateString();
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const calculateProgress = (raised: BN | BN, target: BN | BN): number => {
  const raisedNum = raised instanceof BN ? raised.toNumber() : Number(raised);
  const targetNum = target instanceof BN ? target.toNumber() : Number(target);
  return (raisedNum / targetNum) * 100;
};

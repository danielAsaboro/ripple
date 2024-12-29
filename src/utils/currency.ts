// File: /utils/currency.ts
import { BN } from "@coral-xyz/anchor";
import { lamportsToSol } from "./format";

export async function getSolPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const data = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    return 0;
  }
}

export function lamportsToUSD(lamports: number | BN, solPrice: number): number {
  const solAmount = lamportsToSol(lamports);
  return solAmount * solPrice;
}

export function solToUSD(sol: number, solPrice: number): number {
  return sol * solPrice;
}

export function usdToSol(usd: number, solPrice: number): number {
  if (!solPrice) return 0;
  return Number((usd / solPrice).toFixed(4));
}

// File: /utils/walletDetection.ts
import { WalletConfig } from "@/config/wallets";

interface WalletWindow extends Window {
  [key: string]: any;
}

export async function detectWallet(
  walletKey: string,
  walletConfig: WalletConfig
): Promise<boolean> {
  const win = window as WalletWindow;

  // Dynamically check for wallet adapter properties
  const walletNameLower = walletKey.toLowerCase();
  const walletGlobal = win[walletNameLower];

  if (!walletGlobal) return false;

  // Get wallet provider identifier property (e.g., isPhantom, isSolflare)
  const identifierProp = `is${walletKey}`;

  try {
    // Check if the wallet is installed and initialized
    const isInstalled = walletGlobal?.[identifierProp] || false;

    // Additional connection check if available
    const isReady =
      typeof walletGlobal?.isConnected === "function"
        ? await walletGlobal.isConnected()
        : true;

    return isInstalled && isReady;
  } catch (error) {
    console.error(`Error detecting ${walletKey} wallet:`, error);
    return false;
  }
}

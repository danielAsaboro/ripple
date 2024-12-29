// File: /config/wallets.ts
export interface WalletConfig {
  name: string;
  icon: string;
  url: string;
  adapter: string;
}

export const WALLET_CONFIGS: Record<string, WalletConfig> = {
  Phantom: {
    name: "Phantom",
    icon: "/icons/phantom-icon.png",
    url: "https://phantom.app",
    adapter: "PhantomWalletAdapter",
  },
  Solflare: {
    name: "Solflare",
    icon: "/icons/solflare-icon.png",
    url: "https://solflare.com",
    adapter: "SolflareWalletAdapter",
  },
  Backpack: {
    name: "Backpack",
    icon: "/icons/backpack-icon.png",
    url: "https://backpack.app",
    adapter: "BackpackWalletAdapter",
  },
  // Add more wallets here as needed
};

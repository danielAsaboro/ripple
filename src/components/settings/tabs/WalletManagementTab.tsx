// File: /components/settings/tabs/WalletManagementTab.tsx
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SettingsSection } from "../shared/SettingsSection";
import Button from "@/components/common/Button";
import { useCluster } from "@/components/cluster/cluster-data-access";

export const WalletManagementTab = () => {
  const { publicKey, wallet, disconnect } = useWallet();
  const { cluster, clusters, setCluster } = useCluster();

  return (
    <div className="space-y-6">
      <SettingsSection title="Connected Wallet">
        {wallet ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{wallet.adapter.name}</p>
                <p className="text-sm text-slate-400">
                  {publicKey?.toString()}
                </p>
              </div>
              <Button variant="outline" onClick={disconnect}>
                Disconnect Wallet
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No wallet connected</p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Cluster"
        description="Select the Solana cluster to connect to"
      >
        <select
          value={cluster.name}
          onChange={(e) => {
            const selected = clusters.find((c) => c.name === e.target.value);
            if (selected) setCluster(selected);
          }}
          className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700"
        >
          {clusters.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </SettingsSection>
    </div>
  );
};

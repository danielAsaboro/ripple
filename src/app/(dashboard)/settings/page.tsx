// File: /app/(dashboard)/settings/page.tsx
"use client";

import React, { useState } from "react";
import { SettingsLayout } from "@/components/settings/layout/SettingsLayout";
import { WalletManagementTab } from "@/components/settings/tabs/WalletManagementTab";
import { SecurityTab } from "@/components/settings/tabs/SecurityTab";
import { PreferencesTab } from "@/components/settings/tabs/PreferencesTab";
import { PrivacyTab } from "@/components/settings/tabs/PrivacyTab";
import { AccountTab } from "@/components/settings/tabs/AccountTab";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

type TabType = "wallet" | "security" | "preferences" | "privacy" | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("wallet");
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-white mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-slate-400 mb-6">
          Please connect your wallet to access settings
        </p>
        <ConnectWalletButton />
      </div>
    );
  }

  return (
    <div className="py-6">
      <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "wallet" && <WalletManagementTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "preferences" && <PreferencesTab />}
        {activeTab === "privacy" && <PrivacyTab />}
        {activeTab === "account" && <AccountTab />}
      </SettingsLayout>
    </div>
  );
}

// File: /components/settings/layout/SettingsLayout.tsx
import React, { useState } from "react";
import Card from "@/components/common/Card";
import { TabButton } from "../shared/TabButton";

type TabType = "wallet" | "security" | "preferences" | "privacy" | "account";

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="flex space-x-2 border-b border-slate-700 mb-6 justify-evenly">
          <TabButton
            active={activeTab === "wallet"}
            onClick={() => onTabChange("wallet")}
          >
            Wallet Management
          </TabButton>
          <TabButton
            active={activeTab === "security"}
            onClick={() => onTabChange("security")}
          >
            Security
          </TabButton>
          <TabButton
            active={activeTab === "preferences"}
            onClick={() => onTabChange("preferences")}
          >
            Preferences
          </TabButton>
          <TabButton
            active={activeTab === "privacy"}
            onClick={() => onTabChange("privacy")}
          >
            Privacy
          </TabButton>
          <TabButton
            active={activeTab === "account"}
            onClick={() => onTabChange("account")}
          >
            Account Management
          </TabButton>
        </div>
        {children}
      </Card>
    </div>
  );
};

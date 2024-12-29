// File: /components/settings/tabs/PreferencesTab.tsx
import React, { useState } from "react";
import { SettingsSection } from "../shared/SettingsSection";
import { SettingsToggle } from "../shared/SettingsToggle";
import Button from "@/components/common/Button";

export const PreferencesTab = () => {
  const [preferences, setPreferences] = useState({
    campaignUpdates: true,
    fundAllocation: true,
    donationReceipts: false,
    gasFee: "low",
  });

  return (
    <div className="space-y-6">
      <SettingsSection title="Notification Preference">
        <div className="space-y-4">
          <SettingsToggle
            label="Campaign Updates (Email)"
            checked={preferences.campaignUpdates}
            onChange={(checked) =>
              setPreferences((prev) => ({ ...prev, campaignUpdates: checked }))
            }
          />
          <SettingsToggle
            label="Fund Allocation Updates"
            checked={preferences.fundAllocation}
            onChange={(checked) =>
              setPreferences((prev) => ({ ...prev, fundAllocation: checked }))
            }
          />
          <SettingsToggle
            label="Donation Receipts"
            checked={preferences.donationReceipts}
            onChange={(checked) =>
              setPreferences((prev) => ({ ...prev, donationReceipts: checked }))
            }
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Blockchain Preference"
        description="Configure your blockchain settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Gas Fee Preference
            </label>
            <div className="space-y-2">
              {["Fast", "Standard", "Low Cost"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gasFee"
                    value={option.toLowerCase().replace(" ", "-")}
                    checked={
                      preferences.gasFee ===
                      option.toLowerCase().replace(" ", "-")
                    }
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        gasFee: e.target.value,
                      }))
                    }
                    className="text-green-400"
                  />
                  <span className="text-white">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <Button className="">Save Changes</Button>
      </div>
    </div>
  );
};

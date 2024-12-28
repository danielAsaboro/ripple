// File: /components/settings/tabs/SecurityTab.tsx
import React, { useState } from "react";
import { SettingsSection } from "../shared/SettingsSection";
import { SettingsToggle } from "../shared/SettingsToggle";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export const SecurityTab = () => {
  const [requireConfirmation, setRequireConfirmation] = useState(false);
  const [passphrase, setPassphrase] = useState("");

  return (
    <div className="space-y-6">
      <SettingsSection title="Authorization for Transaction">
        <SettingsToggle
          label="Require extra confirmation for transactions above 0.5 SOL"
          checked={requireConfirmation}
          onChange={setRequireConfirmation}
        />
      </SettingsSection>

      <SettingsSection
        title="Private Key"
        description="Your private key is the unique access code to your wallet and funds. Never share it with anyone. Losing it may result in permanent wallet loss."
      >
        <div className="space-y-4">
          <Input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Enter your 24-word passphrase here"
            className="w-full"
          />
          <Button>Unlock With Passphrase</Button>
        </div>
      </SettingsSection>
    </div>
  );
};

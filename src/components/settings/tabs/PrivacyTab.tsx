// File: /components/settings/tabs/PrivacyTab.tsx
import React, { useState } from 'react';
import { SettingsSection } from '../shared/SettingsSection';
import { SettingsToggle } from '../shared/SettingsToggle';

export const PrivacyTab = () => {
  const [privacy, setPrivacy] = useState({
    donateAnonymously: true,
    showActivity: false,
    shareData: true,
  });

  return (
    <div className="space-y-6">
      <SettingsSection title="Privacy Preference">
        <div className="space-y-4">
          <SettingsToggle
            label="Donate Anonymously"
            checked={privacy.donateAnonymously}
            onChange={(checked) => 
              setPrivacy(prev => ({ ...prev, donateAnonymously: checked }))
            }
          />
          <SettingsToggle
            label="Show Activity Publicly"
            checked={privacy.showActivity}
            onChange={(checked) => 
              setPrivacy(prev => ({ ...prev, showActivity: checked }))
            }
          />
          <SettingsToggle
            label="Share Data with DApps"
            checked={privacy.shareData}
            onChange={(checked) => 
              setPrivacy(prev => ({ ...prev, shareData: checked }))
            }
          />
        </div>
      </SettingsSection>
    </div>
  );
};
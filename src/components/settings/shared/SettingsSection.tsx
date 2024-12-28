// File: /components/settings/shared/SettingsSection.tsx
import React from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {description && (
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

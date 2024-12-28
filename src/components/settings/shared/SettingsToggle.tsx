// File: /components/settings/shared/SettingsToggle.tsx
import React from "react";

interface SettingsToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label className="flex items-center justify-between">
      <span className="text-white">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? "bg-green-400" : "bg-slate-700"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </label>
  );
};

// File: /components/settings/tabs/AccountTab.tsx
import React, { useState } from "react";
import { SettingsSection } from "../shared/SettingsSection";
import Button from "@/components/common/Button";
import { useUser } from "@/contexts/UserProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import { AppModal } from "@/components/ui/ui-layout";

export const AccountTab = () => {
  const { user } = useUser();
  const { disconnect } = useWallet();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExportData = () => {
    try {
      const data = JSON.stringify(user, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ripple-account-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const handleDeactivate = () => {
    // In a real implementation, you'd call an API to deactivate the account
    toast.success("Account deactivated successfully");
    disconnect();
  };

  const handleDelete = () => {
    // In a real implementation, you'd call an API to delete the account
    toast.success("Account deleted successfully");
    disconnect();
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Account Management"
        description="Manage your account settings and data"
      >
        <div className="space-y-6">
          {/* Deactivate Account */}
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Deactivate my Account</h4>
              <p className="text-sm text-slate-400 mt-1">
                Temporarily disable your account and hide your activity
              </p>
            </div>
            <Button variant="outline" onClick={handleDeactivate}>
              Deactivate
            </Button>
          </div>

          {/* Export Data */}
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Export my Data</h4>
              <p className="text-sm text-slate-400 mt-1">
                Download a copy of your data and activity
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-red-500/20">
            <div>
              <h4 className="text-red-500 font-medium">Delete my Account</h4>
              <p className="text-sm text-slate-400 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-500/10"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </SettingsSection>

      {/* Delete Confirmation Modal */}
      <AppModal
        title="Delete Account"
        show={showDeleteModal}
        hide={() => setShowDeleteModal(false)}
        submit={handleDelete}
        submitLabel="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
            <li>Your account will be permanently deleted</li>
            <li>All your donation history will be removed</li>
            <li>Your badges and achievements will be lost</li>
            <li>You won't be able to recover this data</li>
          </ul>
        </div>
      </AppModal>
    </div>
  );
};

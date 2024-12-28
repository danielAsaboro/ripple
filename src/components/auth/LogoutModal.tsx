// File: /components/auth/LogoutModal.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@/contexts/UserProvider";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { toast } from "react-hot-toast";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const router = useRouter();
  const { disconnect } = useWallet();
  const { refreshUser } = useUser();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      // Disconnect the wallet
      await disconnect();
      // Clear user context
      await refreshUser();
      // Show success message
      toast.success("Successfully logged out");
      // Close modal
      onClose();
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Confirm Logout
        </h2>
        <p className="text-slate-400 mb-6">
          Are you sure you want to logout? You will need to reconnect your
          wallet to access your account again.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LogoutModal;

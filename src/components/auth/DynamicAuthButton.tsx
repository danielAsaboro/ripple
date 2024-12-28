// src/components/auth/DynamicAuthButton.tsx
"use client";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@/contexts/UserProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { toast } from "react-hot-toast";
import { UsernameSelectionModal } from "./UsernameSelectionModal";

export const DynamicAuthButton = () => {
  const { connected } = useWallet();
  const { initialized, initializeUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const handleCreateAccount = async (username: string) => {
    setLoading(true);
    try {
      await initializeUser(username);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account");
    } finally {
      setLoading(false);
      setShowUsernameModal(false);
    }
  };

  if (!connected) {
    return <WalletMultiButton className="bg-green-600 text-white rounded-lg" />;
  }

  if (!initialized) {
    return (
      <>
        <Button
          onClick={() => setShowUsernameModal(true)}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Account
        </Button>

        <UsernameSelectionModal
          isOpen={showUsernameModal}
          onClose={() => setShowUsernameModal(false)}
          onSubmit={handleCreateAccount}
          loading={loading}
        />
      </>
    );
  }

  return (
    <Button
      onClick={() => router.push("/dashboard")}
      className="bg-green-600 hover:bg-green-700"
    >
      Dashboard
    </Button>
  );
};

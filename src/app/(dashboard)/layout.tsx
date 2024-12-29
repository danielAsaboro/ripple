// File: /app/(dashboard)/layout.tsx
"use client";

import React from "react";
import Sidebar from "@/components/common/Navigation/Sidebar";
import { NotificationsDropdown } from "@/components/common/Navigation/NotificationsDropdown";
import { ProfileMenu } from "@/components/common/Navigation/ProfileMenu";
import Button from "@/components/common/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUserProfile } from "@/hooks/useUser/useUserProfile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey: authority } = useWallet();
  const { profile, loading } = useUserProfile({ authority });

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-800 px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">
              {loading ? (
                <span className="animate-pulse">Welcome...</span>
              ) : (
                `Welcome, ${profile?.name || "Guest"}`
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <NotificationsDropdown />
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

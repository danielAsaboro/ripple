// File: /app/(dashboard)/layout.tsx

import React from "react";
import Sidebar from "@/components/common/Navigation/Sidebar";
import { Bell } from "lucide-react";
import Button from "@/components/common/Button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-800 px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">Welcome, Dara</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button>Donate Now</Button>
            <button className="rounded-full p-2 text-slate-200 hover:bg-slate-700">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-700" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// File: /components/common/Navigation/ProfileMenu.tsx
import React, { useState } from "react";
import Image from "next/image";
import { useClickOutside } from "@/hooks/useClickOutside";
import { User, Settings, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUser/useUserProfile";
import { useWallet } from "@solana/wallet-adapter-react";
import { shortenAddress } from "@/utils/format";

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const router = useRouter();
  const { publicKey: authority } = useWallet();
  const { profile, loading } = useUserProfile({ authority });

  const menuItems = [
    {
      icon: User,
      label: "View Profile",
      onClick: () => router.push("/settings"),
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => router.push("/settings"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => router.push("/support"),
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-lg p-2 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
          {profile?.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold text-white">
              {profile?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-800 shadow-lg ring-1 ring-slate-700 z-50">
          <div className="p-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-white">
                {loading ? "Loading..." : profile?.name || "Guest"}
              </p>
              <p className="text-xs text-slate-400">
                {loading
                  ? "Loading..."
                  : authority
                  ? shortenAddress(authority.toString())
                  : "No wallet connected"}
              </p>
            </div>
            <div className="border-t border-slate-700 my-2" />
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                    item.onClick();
                  }}
                  className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

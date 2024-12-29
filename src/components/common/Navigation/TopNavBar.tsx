// src/components/common/Navigation/TopNavBar.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DynamicAuthButton } from "../../auth/DynamicAuthButton";

export default function TopNavBar() {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.svg"
          alt="Rippl"
          className="h-16 w-32"
          width={16}
          height={16}
        />
        {/* <span className="text-xl font-bold text-white">Rippl</span> */}
      </Link>

      <nav className="hidden md:flex items-center space-x-8 text-slate-200">
        <Link href="/" className="hover:text-green-400">
          Home
        </Link>
        <a href="/campaigns/live" className="hover:text-green-400">
          Donate
        </a>
        <Link href="/about" className="hover:text-green-400">
          About
        </Link>
        <Link href="/process" className="hover:text-green-400">
          How It Works
        </Link>
        <Link href="/transparent-tracking" className="hover:text-green-400">
          Track Donation
        </Link>
      </nav>

      <DynamicAuthButton />
    </div>
  );
}

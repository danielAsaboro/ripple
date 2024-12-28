import React from "react";
import Button from "@/components/common/Button";
import Image from "next/image";

export default function TopNavBar() {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Image
          src="/logo.svg"
          alt="Rippl"
          className="h-8 w-8"
          width={8}
          height={8}
        />
        <span className="text-xl font-bold text-white">Rippl</span>
      </div>
      <nav className="hidden md:flex items-center space-x-8 text-slate-200">
        <a href="/" className="hover:text-green-400">
          Home
        </a>
        <a href="/about" className="hover:text-green-400">
          About
        </a>
        <a href="/process" className="hover:text-green-400">
          How It Works
        </a>
        <a href="/transparent-tracking" className="hover:text-green-400">
          Track Donation
        </a>
      </nav>
      <Button variant="outline" className="hidden md:inline-flex">
        Create Account
      </Button>
    </div>
  );
}

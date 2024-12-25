// File: /components/landing/Hero.tsx

import React from "react";
import Button from "@/components/common/Button";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative flex min-h-[600px] w-full flex-col items-center justify-center bg-slate-900 px-4 py-20 text-center">
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
          <a href="#" className="hover:text-green-400">
            Home
          </a>
          <a href="#" className="hover:text-green-400">
            About
          </a>
          <a href="#" className="hover:text-green-400">
            How It Works
          </a>
          <a href="#" className="hover:text-green-400">
            Track Donation
          </a>
        </nav>
        <Button variant="outline" className="hidden md:inline-flex">
          Create Account
        </Button>
      </div>

      <div className="max-w-4xl space-y-6 pt-16">
        <span className="inline-block rounded-full bg-slate-800 px-4 py-1.5 text-sm text-green-400">
          Built on Blockchain for Transparent Giving
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Transform Lives with Every Donation
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-300">
          Join a community dedicated to transparency, impact, and be part of the
          change you want to see
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg">Donate Now</Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

// src/components/landing/Hero.tsx
"use client";
import React from "react";
import Button from "@/components/common/Button";
import TopNavBar from "../common/Navigation/TopNavBar";
import { DynamicAuthButton } from "../auth/DynamicAuthButton";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="relative flex min-h-[600px] w-full flex-col items-center justify-center bg-slate-900 px-4 py-20 text-center">
      <TopNavBar />

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
          <DynamicAuthButton />
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              router.push("/process");
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

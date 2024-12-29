// File: /app/process/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import {
  ArrowRight,
  LucideIcon,
  Wallet,
  Search,
  Heart,
  ChartBar,
} from "lucide-react";
import TopNavBar from "@/components/common/Navigation/TopNavBar";
import { useRouter } from "next/navigation";
import DonateCTA from "@/components/landing/DonateCTA";

const StepCard = ({
  title,
  description,
  icon: Icon,
  image,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
}) => {
  return (
    <Card className="p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-400/10 rounded-lg">
            <Icon className="h-6 w-6 text-green-400" />
          </div>

          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-slate-400">{description}</p>
      </div>
      {image && (
        <div className="relative w-full md:w-1/3 aspect-[4/3]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
    </Card>
  );
};

const Feature = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <div className="text-center space-y-2">
      <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
        <Icon className="h-6 w-6 text-green-400" />
      </div>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
};

export default function ProcessPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="py-10">
        <TopNavBar />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/ripple-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple Steps to Make a Big Impact
            </h1>
            <p className="text-xl text-slate-300">
              Join us in creating waves of change. Together, we can transform
              ripples into swells of lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl space-y-12">
          <StepCard
            icon={Wallet}
            title="Connect Your Wallet"
            description="Securely connect your cryptocurrency wallet, such as Solflare, Phantom or Backpack, through our streamlined and user-friendly interface. This ensures a safe and efficient way to handle donations while leveraging the transparency of blockchain technology."
            image="/images/connect-wallet.png"
          />
          <StepCard
            icon={Search}
            title="Browse Campaigns"
            description="Navigate through a curated selection of verified campaigns categorized by causes such as education, healthcare, disaster relief, and more. Each campaign provides detailed information about its goals, the beneficiaries, and how your donation will make an impact."
            image="/images/browse-campaigns.png"
          />
          <StepCard
            icon={Heart}
            title="Donate"
            description="Select a campaign that aligns with your values, specify the amount you'd like to contribute, and confirm your transaction. With blockchain-backed technology, you can trust that your funds will be allocated exactly as intended."
            image="/images/donate.png"
          />
          <StepCard
            icon={ChartBar}
            title="Track Your Impact"
            description="Stay informed about the progress of your donation with real-time updates, including detailed breakdowns of fund allocation and success metrics. View reports, stories, and milestones achieved by the campaign to see how your generosity is making a tangible difference."
            image="/images/track-impact.png"
          />
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Why Choose Rippl
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Feature
              icon={ChartBar}
              title="100% Transparency"
              description="Detailed fund tracking ensures accountability."
            />
            <Feature
              icon={Heart}
              title="Impact-Driven"
              description="Every donation directly changes lives."
            />
            <Feature
              icon={Heart}
              title="Community Recognition"
              description="Celebrate your generosity with badges and rankings."
            />
            <Feature
              icon={Wallet}
              title="Easy Donations"
              description="Quick and secure payment options."
            />
          </div>

          <DonateCTA />
        </div>
      </section>
    </main>
  );
}

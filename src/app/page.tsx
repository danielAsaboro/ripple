// File: /app/page.tsx

import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/common/Navigation/Footer";
import DonateCTA from "@/components/landing/DonateCTA";

interface Campaign {
  id: string;
  title: string;
  organization: string;
  image: string;
  donationsCount: number;
  target: number;
  raised: number;
  progress: number;
}

const activeCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Build Classrooms for 200 Students",
    organization: "Grace for Education",
    image: "/images/classroom.jpg",
    donationsCount: 928,
    target: 750000,
    raised: 562500,
    progress: 75,
  },
  {
    id: "2",
    title: "Provide Vaccines to Rural Areas",
    organization: "Metro for Medicals",
    image: "/images/vaccination.jpg",
    donationsCount: 928,
    target: 400000,
    raised: 200000,
    progress: 50,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Active Campaigns Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Support a Campaign Today
            </h2>
            <span className="text-slate-400">Active Campaigns</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-800/80 rounded-full px-3 py-1 text-sm text-white">
                    {campaign.donationsCount} donations
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {campaign.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    by {campaign.organization}
                  </p>

                  <div className="space-y-4">
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-green-400 rounded-full"
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        ${campaign.raised.toLocaleString()} raised
                      </span>
                      <span className="text-slate-300">
                        {campaign.progress}% Funded
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">Donate Now</Button>
                      <Button variant="outline" className="flex-1">
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Call to Action Section */}
      <DonateCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}

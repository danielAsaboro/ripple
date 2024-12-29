// File: /app/page.tsx

import React, { Suspense } from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/common/Navigation/Footer";
import DonateCTA from "@/components/landing/DonateCTA";
import FeaturedCampaigns from "@/components/campaigns/FeaturedCampaigns";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Active Campaigns Section */}
      <Suspense>
        <FeaturedCampaigns maxCampaigns={3} />
      </Suspense>

      <hr />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Call to Action Section */}
      <DonateCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}

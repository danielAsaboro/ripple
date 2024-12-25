// File: /app/(dashboard)/dashboard/page.tsx
"use client";
import React from "react";
import StatusCard from "@/components/dashboard/StatusCard";
import DonationChart from "@/components/dashboard/DonationChart";
import ImpactMetrics from "@/components/dashboard/ImpactMetrics";
import CampaignCard from "@/components/dashboard/CampaignCard";

const successStories = [
  {
    id: "1",
    title:
      "Your donation helped build a school in Kano State for 300 children.",
    description: "Students can now attend school every day without worries.",
  },
  {
    id: "2",
    title:
      "Boreholes installed in Ogun State provide clean water to 1,000 people.",
    description: "Access to clean water has transformed the community.",
  },
];

const featuredCampaigns = [
  {
    id: "1",
    title: "Build Classrooms for 200 Students",
    organization: "Grace for Education",
    image: "/images/classroom.jpg",
    target: 750000,
    raised: 562500,
    progress: 75,
    donationsCount: 928,
  },
  {
    id: "2",
    title: "Provide Vaccines to Rural Areas",
    organization: "Metro for Medicals",
    image: "/images/vaccination.jpg",
    target: 400000,
    raised: 200000,
    progress: 50,
    donationsCount: 928,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          title="Total Funds Donated"
          value="$1,250,500"
          change={{
            type: "increase",
            value: "12%",
            text: "+$1,200",
          }}
          footer={{
            text: "View Report",
          }}
        />
        <StatusCard
          title="Lives Impacted"
          value="15,000"
          change={{
            type: "increase",
            value: "12%",
            text: "+10 communities",
          }}
          footer={{
            text: "View Report",
          }}
        />
        <StatusCard
          title="Funds Allocated"
          value="85%"
          footer={{
            text: "$187,575 remaining",
          }}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DonationChart />
        <ImpactMetrics stories={successStories} />
      </div>

      {/* Featured Campaigns */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Featured Campaign
          </h2>
          <span className="text-green-400">View All</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} {...campaign} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-slate-800 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Recent Activities
            </h3>
            <div className="space-y-4">
              <p className="text-slate-300">
                Your badge upgraded to (Gold) on 12th December, 2024.
              </p>
              <p className="text-slate-300">
                You donated N5,000 to Health Campaign on 9th December, 2024.
              </p>
              <p className="text-slate-300">
                Education Campaign reached 75% funding
              </p>
              <p className="text-slate-300">
                $50 donated by 0xABC...123 at 12:45 PM.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Donor Recognition
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-white">Your Contribution ranked</p>
              <p className="text-2xl font-bold text-white">$1500</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Top Donors</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">1. Dara Daniels</span>
                  <span className="text-green-400">$1500 (Gold)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">2. Chinyere Okoro</span>
                  <span className="text-slate-300">$1000 (Silver)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">3. Aminu Ahmed</span>
                  <span className="text-slate-300">$500 (Bronze)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

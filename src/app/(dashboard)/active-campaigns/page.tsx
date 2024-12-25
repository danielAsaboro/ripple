// File: /app/(dashboard)/active-campaigns/page.tsx

import React from "react";
import { Search } from "lucide-react";
import CampaignCard from "@/components/dashboard/CampaignCard";
import Button from "@/components/common/Button";

const campaigns = [
  {
    id: "1",
    title: "School Kits for Kaduna",
    organization: "Education First",
    image: "/images/education.jpg",
    target: 20000,
    raised: 5000,
    progress: 25,
    donationsCount: 75,
    daysRemaining: 20,
  },
  {
    id: "2",
    title: "Medical Aid for Kano",
    organization: "Health Care Initiative",
    image: "/images/medical.jpg",
    target: 10000,
    raised: 6500,
    progress: 65,
    donationsCount: 120,
    daysRemaining: 7,
  },
  {
    id: "3",
    title: "Clean Water for Jos",
    organization: "Water Access",
    image: "/images/water.jpg",
    target: 15000,
    raised: 12000,
    progress: 80,
    donationsCount: 200,
    daysRemaining: 10,
  },
  {
    id: "4",
    title: "Rebuild Schools in Enugu",
    organization: "Build Nigeria",
    image: "/images/rebuild.jpg",
    target: 25000,
    raised: 18000,
    progress: 72,
    donationsCount: 300,
    daysRemaining: 5,
  },
  {
    id: "5",
    title: "Emergency Food Relief",
    organization: "Food Bank Nigeria",
    image: "/images/food.jpg",
    target: 50000,
    raised: 45000,
    progress: 90,
    donationsCount: 400,
    daysRemaining: 2,
    isUrgent: true,
  },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Active Campaigns</h1>
        <Button>Start a Campaign</Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400">
          <option value="">Sort by</option>
          <option value="urgent">Urgent First</option>
          <option value="ending-soon">Ending Soon</option>
          <option value="most-funded">Most Funded</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} {...campaign} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline">Load More Campaigns</Button>
      </div>
    </div>
  );
}

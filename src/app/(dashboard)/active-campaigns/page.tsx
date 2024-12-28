// File: /app/(dashboard)/active-campaigns/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Button from "@/components/common/Button";
import CampaignGrid from "@/components/campaigns/CampaignGrid";
import { useProgram } from "@/hooks/useProgram";
import { Campaign } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CampaignsPage() {
  const router = useRouter();
  const { program } = useProgram();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!program) return;

      try {
        const allCampaigns = await program.account.campaign.all();
        setCampaigns(allCampaigns.map((c) => c.account as Campaign));
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [program]);

  const handleShare = (campaignId: string) => {
    // Implement share functionality
    const shareUrl = `${window.location.origin}/campaign/${campaignId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this campaign",
          text: "Support this important cause",
          url: shareUrl,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Campaign link copied to clipboard!");
    }
  };

  const filteredCampaigns = React.useMemo(() => {
    let filtered = [...campaigns];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "urgent":
        filtered.sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));
        break;
      case "ending-soon":
        filtered.sort((a, b) => a.endDate.toNumber() - b.endDate.toNumber());
        break;
      case "most-funded":
        filtered.sort(
          (a, b) => b.raisedAmount.toNumber() - a.raisedAmount.toNumber()
        );
        break;
      case "newest":
        filtered.sort(
          (a, b) => b.startDate.toNumber() - a.startDate.toNumber()
        );
        break;
    }

    return filtered;
  }, [campaigns, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Active Campaigns</h1>
        <Button onClick={() => router.push("/start-campaign")}>
          Start a Campaign
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Sort by</option>
          <option value="urgent">Urgent First</option>
          <option value="ending-soon">Ending Soon</option>
          <option value="most-funded">Most Funded</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length > 0 ? (
        <CampaignGrid campaigns={filteredCampaigns} onShare={handleShare} />
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">
            No campaigns found matching your criteria.
          </p>
        </div>
      )}

      {/* Load More - Implement pagination if needed */}
      {campaigns.length > filteredCampaigns.length && (
        <div className="flex justify-center">
          <Button variant="outline">Load More Campaigns</Button>
        </div>
      )}
    </div>
  );
}

// File: /components/tracking/MetricsOverview.tsx
import React, { useEffect, useState } from "react";
import { useProgram } from "@/hooks/useProgram";
import StatusCard from "@/components/shared/StatusCard";
import { Campaign } from "@/types";
import { lamportsToSol } from "@/utils/format";
import { BN } from "@coral-xyz/anchor";
import { Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveIndicator } from "@/components/shared/LiveIndicator";
import { useEventStream } from "@/hooks/useEventStream";

interface MetricState {
  value: number | BN;
  change: {
    value: number;
    type: "increase" | "decrease";
    text?: string;
  };
}

export const MetricsOverview: React.FC = () => {
  const { program } = useProgram();
  const [metrics, setMetrics] = useState({
    totalFunds: new BN(0),
    activeCampaigns: 0,
    successRate: 0,
    averageDonation: new BN(0),
    totalDonors: 0,
    fundingProgress: 0
  });
  
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time events
  const { events, isConnected } = useEventStream({
    eventTypes: ["donation_received", "campaign_created", "campaign_updated"],
    limit: 100
  });

  useEffect(() => {
    const fetchInitialMetrics = async () => {
      if (!program) return;

      try {
        const campaigns = await program.account.campaign.all();
        const campaignData = campaigns.map(c => c.account as Campaign);

        const totalFunds = campaignData.reduce(
          (sum, c) => sum.add(c.raisedAmount),
          new BN(0)
        );

        const activeCampaigns = campaignData.filter(
          c => "active" in c.status || "inProgress" in c.status
        ).length;

        const completedCampaigns = campaignData.filter(
          c => "completed" in c.status
        ).length;

        const successRate = campaignData.length > 0
          ? (completedCampaigns / campaignData.length) * 100
          : 0;

        const totalDonors = campaignData.reduce(
          (sum, c) => sum + c.donorsCount,
          0
        );

        const avgDonation = totalDonors > 0
          ? new BN(totalFunds.div(new BN(totalDonors)))
          : new BN(0);

        const totalTarget = campaignData.reduce(
          (sum, c) => sum.add(c.targetAmount),
          new BN(0)
        );

        const progress = totalTarget.gt(new BN(0))
          ? (totalFunds.toNumber() / totalTarget.toNumber()) * 100
          : 0;

        setMetrics({
          totalFunds,
          activeCampaigns,
          successRate,
          averageDonation: avgDonation,
          totalDonors,
          fundingProgress: progress
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMetrics();
  }, [program]);

  // Handle real-time updates
  useEffect(() => {
    if (events.length === 0) return;

    const latestEvent = events[0];

    setMetrics(prev => {
      const updated = { ...prev };

      switch (latestEvent.eventType) {
        case "donation_received":
          const amount = new BN(latestEvent.payload.data.amount);
          updated.totalFunds = prev.totalFunds.add(amount);
          updated.totalDonors += 1;
          updated.averageDonation = updated.totalFunds.div(new BN(updated.totalDonors));
          break;

        case "campaign_created":
          updated.activeCampaigns += 1;
          break;

        case "campaign_updated":
          if (latestEvent.payload.metadata?.status === "completed") {
            updated.successRate = ((prev.successRate * prev.activeCampaigns) + 100) / prev.activeCampaigns;
          }
          break;
      }

      return updated;
    });
  }, [events]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-800 rounded-lg h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Grid className="h-5 w-5" />
          Overview Metrics
        </h2>
        <LiveIndicator isLive={isConnected} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Total Funds Raised"
          value={lamportsToSol(metrics.totalFunds)}
          isSol={true}
          change={{
            type: "increase",
            value: 0,
            text: "Last 24h"
          }}
        />

        <StatusCard
          title="Active Campaigns"
          value={metrics.activeCampaigns}
          change={{
            type: "increase",
            value: events.filter(e => e.eventType === "campaign_created").length,
            text: "New campaigns"
          }}
        />

        <StatusCard
          title="Success Rate"
          value={`${metrics.successRate.toFixed(1)}%`}
          change={{
            type: "increase",
            value: 0,
            text: "Overall"
          }}
        />

        <StatusCard
          title="Average Donation"
          value={lamportsToSol(metrics.averageDonation)}
          isSol={true}
        />

        <StatusCard
          title="Total Donors"
          value={metrics.totalDonors}
          change={{
            type: "increase",
            value: events.filter(e => e.eventType === "donation_received").length,
            text: "New donors"
          }}
        />

        <StatusCard
          title="Funding Progress"
          value={`${metrics.fundingProgress.toFixed(1)}%`}
          change={{
            type: "increase",
            value: 0,
            text: "Overall"
          }}
        />
      </div>
    </div>
  );
};
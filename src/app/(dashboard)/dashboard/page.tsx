// File: /app/(dashboard)/dashboard/page.tsx
"use client";
import React from "react";
import { useUserProfile } from "@/hooks/useUser/useUserProfile";
import { useBadges } from "@/hooks/useUser/useBadges";
import { useDonationHistory } from "@/hooks/useDonation";
import { useWallet } from "@solana/wallet-adapter-react";
import { findUserPDA } from "@/utils/pdas";
import StatusCard from "@/components/dashboard/StatusCard";
import DonationChart from "@/components/dashboard/DonationChart";
import ImpactMetrics from "@/components/dashboard/ImpactMetrics";
import CampaignCard from "@/components/dashboard/CampaignCard";
import { getBadgeTypeString } from "@/types/badge";
import { lamportsToSol } from "@/utils/format";

export default function DashboardPage() {
  const { publicKey: authority } = useWallet();
  const userPDA = authority ? findUserPDA(authority)[0] : undefined;

  const { profile, loading: profileLoading } = useUserProfile({
    authority,
    includeCampaigns: true,
  });

  const {
    badges,
    totalDonationValue,
    loading: badgesLoading,
  } = useBadges({
    userPDA,
  });

  const { donations, loading: donationsLoading } = useDonationHistory({
    userPDA,
  });

  // Calculate changes (you'd replace this with actual historical data)
  const donationChange = {
    type: "increase" as const,
    value: "12%",
    text: "+◎1.2",
  };

  if (!authority) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">
          Welcome to Ripple
        </h2>
        <p className="text-slate-400">
          Please connect your wallet to view your dashboard
        </p>
      </div>
    );
  }

  if (profileLoading || badgesLoading || donationsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          title="Total Funds Donated"
          value={totalDonationValue}
          isSol={true}
          change={donationChange}
          footer={{
            text: "View Report",
            onClick: () => (window.location.href = "/donations"),
          }}
        />
        <StatusCard
          title="Campaigns Supported"
          value={profile?.campaignsSupported || 0}
          footer={{
            text: "View Campaigns",
            onClick: () => (window.location.href = "/active-campaigns"),
          }}
        />
        <StatusCard
          title="Current Badge"
          value={
            profile?.badges?.length
              ? getBadgeTypeString(
                  profile.badges[profile.badges.length - 1].badgeType
                )
              : "No Badge Yet"
          }
          footer={{
            text: "View All Badges",
            onClick: () => (window.location.href = "/donor-recognition"),
          }}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DonationChart />
        <ImpactMetrics />
      </div>

      {/* Recent Activity & Recognition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-slate-800 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {donations?.slice(0, 4).map((donation, index) => (
                <p key={index} className="text-slate-300">
                  You donated ◎{lamportsToSol(donation.amount)} to{" "}
                  {donation.campaign.toString()} on{" "}
                  {new Date(
                    donation.timestamp.toNumber() * 1000
                  ).toLocaleDateString()}
                </p>
              ))}
              {(!donations || donations.length === 0) && (
                <p className="text-slate-400">No recent donations</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Badges Earned
          </h3>
          <div className="space-y-4">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white">
                    {getBadgeTypeString(badge.badgeType)}
                  </p>
                  <p className="text-sm text-slate-400">
                    Earned on{" "}
                    {new Date(
                      badge.dateEarned.toNumber() * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {badges.length === 0 && (
              <p className="text-slate-400">No badges earned yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      {profile?.supportedCampaigns && profile.supportedCampaigns.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Your Active Campaigns
            </h2>
            <a href="/active-campaigns" className="text-green-400">
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.supportedCampaigns.slice(0, 2).map((campaign) => (
              <CampaignCard
                key={campaign.title}
                id={campaign.title}
                title={campaign.title}
                organization={campaign.organizationName}
                image={campaign.imageUrl}
                target={campaign.targetAmount.toNumber()}
                raised={campaign.raisedAmount.toNumber()}
                progress={Number(
                  (
                    (campaign.raisedAmount.toNumber() /
                      campaign.targetAmount.toNumber()) *
                    100
                  ).toFixed(2)
                )}
                donationsCount={campaign.donorsCount}
                isUrgent={campaign.isUrgent}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

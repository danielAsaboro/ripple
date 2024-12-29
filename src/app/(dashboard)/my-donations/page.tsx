// File: /app/(dashboard)/donations/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import StatusCard from "@/components/shared/StatusCard";
import Card from "@/components/common/Card";
import { Download } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDonationHistory } from "@/hooks/useDonation";
import { useUserProfile } from "@/hooks/useUser/useUserProfile";
import { findUserPDA } from "@/utils/pdas";
import { lamportsToSol } from "@/utils/format";
import { getBadgeTypeString } from "@/types/badge";
import { convertSolToUSDWithPrice, getSolPrice } from "@/utils/currency";

export default function DonationsPage() {
  const { publicKey: authority } = useWallet();
  const userPDA = authority ? findUserPDA(authority)[0] : undefined;
  const [currentSolPrice, setCurrentSolPrice] = useState(0);

  const { profile, loading: profileLoading } = useUserProfile({
    authority,
    includeCampaigns: true,
  });

  const { donations, loading: donationsLoading } = useDonationHistory({
    userPDA,
  });

  useEffect(() => {
    const fetchSolPrice = async () => {
      const solPrice = await getSolPrice();
      setCurrentSolPrice(solPrice);
    };

    fetchSolPrice();
  }, []);

  // Load actual donation history
  const [donationStats, setDonationStats] = React.useState({
    totalAmount: 0,
    campaignsSupported: 0,
    impactMetrics: {
      mealsProvided: 0,
      childrenEducated: 0,
      familiesHoused: 0,
      treesPlanted: 0,
    },
  });

  React.useEffect(() => {
    if (profile) {
      setDonationStats({
        totalAmount: lamportsToSol(profile.totalDonations),
        campaignsSupported: profile.campaignsSupported,
        impactMetrics: profile.impactMetrics,
      });
    }
  }, [profile]);

  if (!authority) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
        <p className="text-slate-400">
          Please connect your wallet to view your donations
        </p>
      </div>
    );
  }

  if (profileLoading || donationsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Total Donations"
          value={donationStats.totalAmount * currentSolPrice}
          prefix="$"
        />
        <StatusCard
          title="Campaigns Supported"
          value={`${donationStats.campaignsSupported} Campaigns`}
        />
        <StatusCard
          title="Impact Achieved"
          value={`${donationStats.impactMetrics.mealsProvided} Meals, ${donationStats.impactMetrics.childrenEducated} Children Educated`}
        />
      </div>

      {/* Recent Donations */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">
              Recent Donations
            </h2>
            <button
              className="text-green-400 hover:text-green-500"
              onClick={() => {
                // Generate CSV of donations
                const csvContent =
                  "Campaign,Amount,Date,Status,Impact,Payment Method\n" +
                  donations
                    ?.map(
                      (d) =>
                        `${d.campaign},${lamportsToSol(d.amount)},${new Date(
                          d.timestamp.toNumber() * 1000
                        ).toLocaleDateString()},${Object.keys(d.status)[0]},${
                          d.impactDescription
                        },${Object.keys(d.paymentMethod)[0]}`
                    )
                    .join("\n");

                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "donation_history.csv";
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">
                    Campaign
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">
                    Impact
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-slate-400">
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {donations?.map((donation, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm text-white">
                      {donation.campaign.toString().slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      $
                      {convertSolToUSDWithPrice(
                        lamportsToSol(donation.amount),
                        currentSolPrice
                      ).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {new Date(
                        donation.timestamp.toNumber() * 1000
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          Object.keys(donation.status)[0] === "completed"
                            ? "bg-green-400/10 text-green-400"
                            : "bg-blue-400/10 text-blue-400"
                        }`}
                      >
                        {Object.keys(donation.status)[0]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {donation.impactDescription}
                    </td>
                    <td className="px-4 py-3 text-sm text-white capitalize">
                      {Object.keys(donation.paymentMethod)[0]
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </td>
                  </tr>
                ))}
                {(!donations || donations.length === 0) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      No donations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Impact & Recognition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Impact Highlights
            </h2>
            <div className="space-y-4">
              {Object.entries(donationStats.impactMetrics).map(
                ([metric, value]) => (
                  <div
                    key={metric}
                    className="flex justify-between items-center"
                  >
                    <span className="text-slate-400 capitalize">
                      {metric.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recognition & Rewards
            </h2>
            <div className="space-y-4">
              {profile?.badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-full ${
                      badge.badgeType.gold
                        ? "bg-yellow-400"
                        : badge.badgeType.silver
                        ? "bg-slate-300"
                        : badge.badgeType.bronze
                        ? "bg-amber-600"
                        : "bg-green-400"
                    }`}
                  />
                  <span className="text-white">
                    {getBadgeTypeString(badge.badgeType)}
                  </span>
                </div>
              ))}
              {(!profile?.badges || profile.badges.length === 0) && (
                <p className="text-slate-400">No badges earned yet</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

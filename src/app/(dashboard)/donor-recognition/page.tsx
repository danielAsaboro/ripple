// File: /app/(dashboard)/donor-recognition/page.tsx
"use client";
import React from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Clock } from "lucide-react";
import { useProgram } from "@/hooks/useProgram";
import { useBadges } from "@/hooks/useUser/useBadges";
import { useWallet } from "@solana/wallet-adapter-react";
import { findUserPDA } from "@/utils/pdas";
import { BADGE_THRESHOLDS } from "@/utils/constants";
import { lamportsToSol } from "@/utils/format";
import { getBadgeTypeString } from "@/types/badge";
import { toast } from "react-hot-toast";

export default function DonorRecognitionPage() {
  const { publicKey: authority } = useWallet();
  const { program } = useProgram();
  const [loading, setLoading] = React.useState(true);
  const [leaderboard, setLeaderboard] = React.useState<any[]>([]);
  const [recentDonations, setRecentDonations] = React.useState<any[]>([]);

  // Get current user's badges
  const userPDA = authority ? findUserPDA(authority)[0] : undefined;
  const {
    badges,
    totalDonationValue,
    loading: badgesLoading,
  } = useBadges({ userPDA });

  React.useEffect(() => {
    const fetchData = async () => {
      if (!program) return;

      try {
        // Fetch all users for leaderboard
        const users = await program.account.user.all();
        const sortedUsers = users
          .sort(
            (a, b) =>
              b.account.totalDonations.toNumber() -
              a.account.totalDonations.toNumber()
          )
          .slice(0, 5)
          .map((user) => ({
            name: user.account.name,
            totalDonation: lamportsToSol(user.account.totalDonations),
            impactedLives:
              user.account.impactMetrics.mealsProvided +
              user.account.impactMetrics.childrenEducated +
              user.account.impactMetrics.familiesHoused,
            walletAddress: user.account.authority.toString(),
          }));

        setLeaderboard(sortedUsers);

        // Fetch recent donations
        const recentDonationAccounts = await program.account.donation.all();
        const recent = recentDonationAccounts
          .sort(
            (a, b) =>
              b.account.timestamp.toNumber() - a.account.timestamp.toNumber()
          )
          .slice(0, 3)
          .map((donation) => ({
            donor: donation.account.donor.toString().slice(0, 4) + "...",
            amount: lamportsToSol(donation.account.amount),
            campaign: donation.account.campaign.toString().slice(0, 4) + "...",
            timeAgo: getTimeAgo(donation.account.timestamp.toNumber() * 1000),
          }));

        setRecentDonations(recent);
      } catch (error) {
        console.error("Error fetching recognition data:", error);
        toast.error("Failed to load recognition data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [program]);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!authority) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
        <p className="text-slate-400">
          Please connect your wallet to view donor recognition
        </p>
      </div>
    );
  }

  if (loading || badgesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">
                    {getBadgeTypeString(badge.badgeType)} Badge
                  </p>
                  <p className="text-xl font-semibold text-white mt-1">
                    {badge.description}
                  </p>
                </div>
                <div
                  className={`h-8 w-8 rounded-full ${
                    badge.badgeType.gold
                      ? "bg-yellow-400"
                      : badge.badgeType.silver
                      ? "bg-slate-300"
                      : badge.badgeType.bronze
                      ? "bg-amber-600"
                      : "bg-green-400"
                  }`}
                />
              </div>
              <p className="text-sm text-slate-400">
                Earned on{" "}
                {new Date(
                  badge.dateEarned.toNumber() * 1000
                ).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Leaderboard */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Donor Leaderboard
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="text-left text-sm font-medium text-slate-400 pb-4">
                    Rank
                  </th>
                  <th className="text-left text-sm font-medium text-slate-400 pb-4">
                    Donor Name
                  </th>
                  <th className="text-left text-sm font-medium text-slate-400 pb-4">
                    Total Donation
                  </th>
                  <th className="text-left text-sm font-medium text-slate-400 pb-4">
                    Impacted Lives
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leaderboard.map((donor, index) => (
                  <tr
                    key={index}
                    className={
                      donor.walletAddress === authority.toString()
                        ? "bg-green-400/10"
                        : ""
                    }
                  >
                    <td className="py-4 text-white">{index + 1}</td>
                    <td className="py-4 text-white">{donor.name}</td>
                    <td className="py-4 text-white">
                      ◎{donor.totalDonation.toFixed(2)}
                    </td>
                    <td className="py-4 text-white">{donor.impactedLives}+</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Recent Donations and Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recent Donations
            </h2>
            <div className="space-y-4">
              {recentDonations.map((donation, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-white">{donation.donor}</p>
                    <p className="text-sm text-slate-400">
                      donated ◎{donation.amount} to {donation.campaign}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {donation.timeAgo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Badge Progress */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Badge Progress
            </h2>
            <div className="space-y-4">
              {Object.entries(BADGE_THRESHOLDS).map(([badge, threshold]) => {
                const progress = Math.min(
                  (totalDonationValue / threshold) * 100,
                  100
                );
                return (
                  <div key={badge} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">{badge}</span>
                      <span className="text-slate-400">
                        ◎{lamportsToSol(threshold)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Share Impact Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            const text = `I've donated ◎${lamportsToSol(
              totalDonationValue
            )} on Ripple and earned ${badges.length} badges!`;
            if (navigator.share) {
              navigator
                .share({
                  title: "My Impact on Ripple",
                  text,
                  url: window.location.origin,
                })
                .catch(console.error);
            } else {
              navigator.clipboard.writeText(text);
              toast.success("Impact stats copied to clipboard!");
            }
          }}
        >
          Share your Impact
        </Button>
      </div>
    </div>
  );
}

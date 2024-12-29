"use client";

// File: /app/donors/leaderboard/page.tsx
import React, { useEffect, useState } from "react";
import { useProgram } from "@/hooks/useProgram";
import Card from "@/components/common/Card";
import { LiveIndicator } from "@/components/shared/LiveIndicator";
import Button from "@/components/common/Button";
import { lamportsToSol } from "@/utils/format";
import { Download, Crown, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { convertSolToUSDWithPrice, getSolPrice } from "@/utils/currency";
import { useEventStream } from "@/hooks/useEventStream";
import TopNavBar from "@/components/common/Navigation/TopNavBar";

interface DonorRank {
  name: string;
  walletAddress: string;
  totalDonations: number;
  campaignsSupported: number;
  rank: number;
  impactMetrics: {
    mealsProvided: number;
    childrenEducated: number;
    familiesHoused: number;
    treesPlanted: number;
  };
}

export default function DonorLeaderboard() {
  const { program } = useProgram();
  const [donors, setDonors] = useState<DonorRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<"all" | "month" | "week">("all");

  const { events, isConnected } = useEventStream({
    eventTypes: ["donation_received"],
    limit: 50,
  });
  useEffect(() => {
    const fetchDonors = async () => {
      if (!program) return;

      try {
        const price = await getSolPrice();
        setSolPrice(price);

        const userAccounts = await program.account.user.all();
        const rankedDonors = userAccounts
          .map((account) => ({
            name: account.account.name,
            walletAddress: account.account.walletAddress.toString(),
            totalDonations: account.account.totalDonations.toNumber(),
            campaignsSupported: account.account.campaignsSupported,
            rank: account.account.rank,
            impactMetrics: account.account.impactMetrics,
          }))
          .sort((a, b) => b.totalDonations - a.totalDonations)
          .map((donor, index) => ({ ...donor, rank: index + 1 }));

        setDonors(rankedDonors);
      } catch (error) {
        console.error("Error fetching donor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [program]);

  const handleExport = () => {
    const csv = [
      [
        "Rank",
        "Name",
        "Wallet",
        "Total Donated (SOL)",
        "Campaigns Supported",
        "Impact",
      ].join(","),
      ...donors.map((donor) =>
        [
          donor.rank,
          donor.name,
          donor.walletAddress,
          lamportsToSol(donor.totalDonations),
          donor.campaignsSupported,
          `${donor.impactMetrics.mealsProvided} meals, ${donor.impactMetrics.childrenEducated} children educated`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donor-leaderboard.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="py-10">
        <TopNavBar />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Donor Leaderboard</h1>
          <p className="text-slate-400">
            Recognizing our most impactful contributors
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LiveIndicator isLive={isConnected} />
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top 3 Donors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {donors.slice(0, 3).map((donor, index) => (
            <Card
              key={donor.walletAddress}
              className="p-6 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                {index === 0 && <Crown className="h-6 w-6 text-yellow-400" />}
                {index === 1 && <Trophy className="h-6 w-6 text-slate-300" />}
                {index === 2 && <Trophy className="h-6 w-6 text-amber-600" />}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {donor.name}
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {donor.walletAddress.slice(0, 4)}...
                {donor.walletAddress.slice(-4)}
              </p>
              <div className="space-y-2">
                <p className="text-green-400 text-2xl font-bold">
                  $
                  {convertSolToUSDWithPrice(
                    lamportsToSol(donor.totalDonations),
                    solPrice
                  ).toFixed(2)}
                </p>
                <p className="text-slate-400">
                  {donor.campaignsSupported} campaigns supported
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="text-left text-sm font-medium text-slate-400 pb-4">
                      Rank
                    </th>
                    <th className="text-left text-sm font-medium text-slate-400 pb-4">
                      Donor
                    </th>
                    <th className="text-right text-sm font-medium text-slate-400 pb-4">
                      Total Donated
                    </th>
                    <th className="text-right text-sm font-medium text-slate-400 pb-4">
                      Campaigns
                    </th>
                    <th className="text-right text-sm font-medium text-slate-400 pb-4">
                      Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <AnimatePresence>
                    {donors.map((donor, index) => (
                      <motion.tr
                        key={donor.walletAddress}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <td className="py-4 text-white">#{donor.rank}</td>
                        <td className="py-4">
                          <div>
                            <p className="text-white">{donor.name}</p>
                            <p className="text-sm text-slate-400">
                              {donor.walletAddress.slice(0, 4)}...
                              {donor.walletAddress.slice(-4)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div>
                            <p className="text-white">
                              $
                              {convertSolToUSDWithPrice(
                                lamportsToSol(donor.totalDonations),
                                solPrice
                              ).toFixed(2)}
                            </p>
                            <p className="text-sm text-slate-400">
                              ◎{lamportsToSol(donor.totalDonations).toFixed(2)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-right text-white">
                          {donor.campaignsSupported}
                        </td>
                        <td className="py-4 text-right text-slate-400">
                          {donor.impactMetrics.mealsProvided} meals provided,{" "}
                          {donor.impactMetrics.childrenEducated} children
                          educated
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

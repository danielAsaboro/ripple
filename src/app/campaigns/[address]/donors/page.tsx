// File: /app/campaign/[address]/donors/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/hooks/useProgram";
import Card from "@/components/common/Card";
import { LiveIndicator } from "@/components/shared/LiveIndicator";
import Button from "@/components/common/Button";
import { useEventStream } from "@/hooks/useEventStream";
import { lamportsToSol } from "@/utils/format";
import { Download } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { Campaign } from "@/types";
import { getSolPrice, convertSolToUSDWithPrice } from "@/utils/currency";
import TopNavBar from "@/components/common/Navigation/TopNavBar";

type SortType = "amount" | "recent" | "frequency";

interface CampaignDonor {
  publicKey: string;
  name: string;
  totalAmount: number;
  donationCount: number;
  lastDonation: Date;
}

export default function CampaignDonors() {
  const params = useParams();
  const { program } = useProgram();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donors, setDonors] = useState<CampaignDonor[]>([]);
  const [sortBy, setSortBy] = useState<SortType>("amount");
  const [loading, setLoading] = useState(true);
  const [solPrice, setSolPrice] = useState<number>(0);

  const { events, isConnected } = useEventStream({
    eventTypes: ["donation_received"],
    limit: 50,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!program || !params.address) return;

      try {
        const price = await getSolPrice();
        setSolPrice(price);

        // Fetch campaign
        const campaignPDA = new PublicKey(params.address);
        const campaignAccount = await program.account.campaign.fetch(
          campaignPDA
        );
        setCampaign(campaignAccount as Campaign);

        // Fetch all donations for this campaign
        const donations = await program.account.donation.all([
          {
            memcmp: {
              offset: 40, // After discriminator and donor pubkey
              bytes: campaignPDA.toBase58(),
            },
          },
        ]);

        // Group donations by donor
        const donorMap = donations.reduce((acc, donation) => {
          const donorKey = donation.account.donor.toString();
          if (!acc[donorKey]) {
            acc[donorKey] = {
              publicKey: donorKey,
              name: "Anonymous", // Will be updated with user fetch
              totalAmount: 0,
              donationCount: 0,
              lastDonation: new Date(0),
            };
          }
          acc[donorKey].totalAmount += donation.account.amount.toNumber();
          acc[donorKey].donationCount += 1;
          const donationDate = new Date(
            donation.account.timestamp.toNumber() * 1000
          );
          if (donationDate > acc[donorKey].lastDonation) {
            acc[donorKey].lastDonation = donationDate;
          }
          return acc;
        }, {} as Record<string, CampaignDonor>);

        // Fetch donor names
        for (const donorKey of Object.keys(donorMap)) {
          try {
            const [userPDA] = await PublicKey.findProgramAddress(
              [Buffer.from("user"), new PublicKey(donorKey).toBuffer()],
              program.programId
            );
            const userAccount = await program.account.user.fetch(userPDA);
            donorMap[donorKey].name = userAccount.name;
          } catch (error) {
            console.log(`Could not fetch name for donor ${donorKey}`);
          }
        }

        setDonors(Object.values(donorMap));
      } catch (error) {
        console.error("Error fetching campaign donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [program, params.address]);

  // Sort donors based on selected criteria
  const sortedDonors = React.useMemo(() => {
    const sorted = [...donors];
    switch (sortBy) {
      case "amount":
        return sorted.sort((a, b) => b.totalAmount - a.totalAmount);
      case "recent":
        return sorted.sort(
          (a, b) => b.lastDonation.getTime() - a.lastDonation.getTime()
        );
      case "frequency":
        return sorted.sort((a, b) => b.donationCount - a.donationCount);
      default:
        return sorted;
    }
  }, [donors, sortBy]);

  const handleExport = () => {
    const csv = [
      ["Donor", "Total Donated (SOL)", "Frequency", "Last Donation"].join(","),
      ...sortedDonors.map((donor) =>
        [
          donor.name,
          lamportsToSol(donor.totalAmount),
          donor.donationCount,
          donor.lastDonation.toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${campaign?.title}-donors.csv`;
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
    <>
      <div className="py-10">
        <TopNavBar />
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">{campaign?.title}</h1>
            <p className="text-slate-400">Campaign Donors</p>
          </div>
          <div className="flex items-center gap-4">
            <LiveIndicator isLive={isConnected} />
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <div className="p-4 flex items-center gap-4">
            <span className="text-slate-400">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: "amount", label: "Largest Donations" },
                { value: "recent", label: "Most Recent" },
                { value: "frequency", label: "Most Frequent" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "primary" : "outline"}
                  onClick={() => setSortBy(option.value as SortType)}
                  size="sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="text-left text-sm font-medium text-slate-400 pb-4">
                      Donor
                    </th>
                    <th className="text-right text-sm font-medium text-slate-400 pb-4">
                      Total Donated
                    </th>
                    <th className="text-right text-sm font-medium text-slate-400 pb-4">
                      Frequency
                    </th>
                    <th className="text-right text-sm font-medium text-slate-400 pb-4">
                      Last Donation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {sortedDonors.map((donor) => (
                    <tr key={donor.publicKey}>
                      <td className="py-4">
                        <div>
                          <p className="text-white">{donor.name}</p>
                          <p className="text-sm text-slate-400">
                            {donor.publicKey.slice(0, 4)}...
                            {donor.publicKey.slice(-4)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div>
                          <p className="text-white">
                            $
                            {convertSolToUSDWithPrice(
                              lamportsToSol(donor.totalAmount),
                              solPrice
                            ).toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-400">
                            ◎{lamportsToSol(donor.totalAmount).toFixed(2)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-right text-white">
                        {donor.donationCount}{" "}
                        {donor.donationCount === 1 ? "donation" : "donations"}
                      </td>
                      <td className="py-4 text-right text-slate-400">
                        {donor.lastDonation.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

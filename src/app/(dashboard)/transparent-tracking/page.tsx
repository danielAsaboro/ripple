// File: /app/(dashboard)/transparent-tracking/page.tsx
"use client";
import React from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { MoreVertical, Download } from "lucide-react";
import { useProgram } from "@/hooks/useProgram";
import { Campaign, Donation, CampaignStatus, getDominantStatus } from "@/types";
import { lamportsToSol } from "@/utils/format";
import { toast } from "react-hot-toast";
import { BN } from "@coral-xyz/anchor";
import _ from "lodash";
import {
  getSolPrice,
  lamportsToUSD,
  convertSolToUSDWithPrice,
} from "@/utils/currency";

export default function TransparentTrackingPage() {
  const { program } = useProgram();
  const [loading, setLoading] = React.useState(true);
  const [currentSolPrice, setCurrentSolPrice] = React.useState<number>(0);

  const [stats, setStats] = React.useState({
    totalFunds: 0,
    allocatedFunds: 0,
    remainingFunds: 0,
    totalDonations: 0,
  });
  const [allocationsByCategory, setAllocationsByCategory] = React.useState<{
    [key: string]: {
      amount: BN;
      percentage: number;
      progress: number;
      status: CampaignStatus;
    };
  }>({});
  const [transactions, setTransactions] = React.useState<Donation[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!program) return;
      const solPrice = await getSolPrice();
      setCurrentSolPrice(solPrice);

      try {
        // Fetch all campaigns
        const campaignAccounts = await program.account.campaign.all();
        const campaigns = campaignAccounts.map((c) => c.account as Campaign);

        // Fetch all donations
        const donationAccounts = await program.account.donation.all();
        const donations = donationAccounts.map((d) => d.account as Donation);

        // Calculate total stats
        const totalFunds = donations.reduce(
          (sum, d) => sum.add(d.amount),
          new BN(0)
        );
        const allocatedFunds = donations
          .filter((d) => d.status.allocated)
          .reduce((sum, d) => sum.add(d.amount), new BN(0));
        const remainingFunds = totalFunds.sub(allocatedFunds);

        // Group campaigns by category and calculate allocations
        const groupedCampaigns = _.groupBy(
          campaigns,
          (c) => Object.keys(c.category)[0]
        );
        const allocations = Object.entries(groupedCampaigns).reduce(
          (acc, [category, campaigns]) => {
            const amount = campaigns.reduce(
              (sum, c) => sum.add(c.raisedAmount),
              new BN(0)
            );
            const percentage = totalFunds.gt(new BN(0))
              ? (amount.toNumber() / totalFunds.toNumber()) * 100
              : 0;
            const progress =
              campaigns.reduce(
                (avg, c) =>
                  avg +
                  (c.raisedAmount.toNumber() / c.targetAmount.toNumber()) * 100,
                0
              ) / campaigns.length;

            // Get the dominant status
            const statuses: CampaignStatus[] = campaigns.map((c) => c.status);

            const dominantStatus = getDominantStatus(statuses);

            acc[category] = {
              amount: new BN(
                convertSolToUSDWithPrice(amount.toNumber(), solPrice)
              ),
              percentage,
              progress,
              status: dominantStatus || { active: {} },
            };
            return acc;
          },
          {} as any
        );

        setStats({
          totalFunds: convertSolToUSDWithPrice(
            lamportsToSol(totalFunds),
            solPrice
          ),
          allocatedFunds: convertSolToUSDWithPrice(
            lamportsToSol(allocatedFunds),
            solPrice
          ),
          remainingFunds: convertSolToUSDWithPrice(
            lamportsToSol(remainingFunds),
            solPrice
          ),
          totalDonations: donations.length,
        });
        setAllocationsByCategory(allocations);
        setTransactions(donations.slice(0, 10)); // Last 10 transactions
      } catch (error) {
        console.error("Error fetching tracking data:", error);
        toast.error("Failed to load tracking data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [program]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-slate-400">Total Funds Received</h3>
              <p className="text-2xl font-bold text-white mt-2">
                ${stats.totalFunds.toFixed(2)}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {stats.totalDonations} Donations
              </p>
            </div>
            <button className="text-slate-400 hover:text-slate-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-slate-400">Allocated Funds</h3>
              <p className="text-2xl font-bold text-white mt-2">
                ${stats.allocatedFunds.toFixed(2)}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {Object.keys(allocationsByCategory).length} Categories
              </p>
            </div>
            <button className="text-slate-400 hover:text-slate-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-slate-400">Remaining Funds</h3>
              <p className="text-2xl font-bold text-white mt-2">
                ${stats.remainingFunds.toFixed(2)}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {((stats.remainingFunds / stats.totalFunds) * 100).toFixed(1)}%
                Unallocated
              </p>
            </div>
            <button className="text-slate-400 hover:text-slate-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Fund Allocation Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Fund Allocation</h2>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              // Generate CSV data
              const csvContent =
                `Category,Amount,Percentage,Progress\n` +
                Object.entries(allocationsByCategory)
                  .map(
                    ([category, data]) =>
                      `${category},${lamportsToSol(
                        data.amount
                      )},${data.percentage.toFixed(1)}%,${data.progress.toFixed(
                        1
                      )}%`
                  )
                  .join("\n");

              // Create download link
              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "fund-allocation.csv";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Category
                </th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Amount Allocated
                </th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Percentage
                </th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Progress
                </th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {Object.entries(allocationsByCategory).map(([category, data]) => (
                <tr key={category}>
                  <td className="p-4 text-white capitalize">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </td>
                  <td className="p-4 text-white">
                    ${lamportsToSol(data.amount).toFixed(2)}
                  </td>
                  <td className="p-4 text-white">
                    {data.percentage.toFixed(2)}%
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400 rounded-full"
                          style={{ width: `${data.progress}%` }}
                        />
                      </div>
                      <span className="text-white min-w-[40px]">
                        {data.progress.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        Object.keys(data.status)[0] === "completed"
                          ? "bg-green-400/10 text-green-400"
                          : Object.keys(data.status)[0] === "active"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {Object.keys(data.status)[0]
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Donor
                </th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Amount
                </th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Date
                </th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Status
                </th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactions.map((tx, idx) => (
                <tr key={idx}>
                  <td className="p-4 text-white">
                    {tx.donor.toString().slice(0, 4)}...
                    {tx.donor.toString().slice(-4)}
                  </td>
                  <td className="p-4 text-white">
                    $
                    {convertSolToUSDWithPrice(
                      lamportsToSol(tx.amount),
                      currentSolPrice
                    ).toFixed(2)}
                  </td>
                  <td className="p-4 text-white">
                    {new Date(
                      tx.timestamp.toNumber() * 1000
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        Object.keys(tx.status)[0] === "completed"
                          ? "bg-green-400/10 text-green-400"
                          : Object.keys(tx.status)[0] === "pending"
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "bg-blue-400/10 text-blue-400"
                      }`}
                    >
                      {Object.keys(tx.status)[0]
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </span>
                  </td>
                  <td className="p-4 text-white capitalize">
                    {Object.keys(tx.paymentMethod)[0]
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

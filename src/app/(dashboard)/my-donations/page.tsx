// File: /app/(dashboard)/donations/page.tsx

import React from "react";
import StatusCard from "@/components/dashboard/StatusCard";
import Card from "@/components/common/Card";
import { Download } from "lucide-react";

const recentDonations = [
  {
    campaign: "Clean water for Jos",
    amount: 1500,
    date: "2024-12-02",
    status: "Completed",
    impact: "10 Families Served",
    paymentMethod: "Crypto Wallet",
  },
  {
    campaign: "Medical Aid Kano",
    amount: 1000,
    date: "2024-12-03",
    status: "Active",
    impact: "Nil",
    paymentMethod: "Card",
  },
  {
    campaign: "Food Relief Lagos",
    amount: 1000,
    date: "2024-11-25",
    status: "Completed",
    impact: "40 Meals Provided",
    paymentMethod: "Crypto Wallet",
  },
];

const impactMetrics = [
  { label: "Meals Provided", value: 200 },
  { label: "Children Educated", value: 10 },
  { label: "Families Housed", value: 10 },
  { label: "Trees Planted", value: 50 },
];

export default function DonationsPage() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard title="Total Donations" value="$5,000" />
        <StatusCard title="Campaign Supported" value="30 Campaigns" />
        <StatusCard
          title="Impact Achieved"
          value="200 Meals Provided, 10 Children Educated"
        />
      </div>

      {/* Recent Donations */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Donations
          </h2>
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
                  <th className="px-4 py-3 text-left text-sm text-slate-400">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {recentDonations.map((donation, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm text-white">
                      {donation.campaign}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      ${donation.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {donation.date}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          donation.status === "Completed"
                            ? "bg-green-400/10 text-green-400"
                            : "bg-blue-400/10 text-blue-400"
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {donation.impact}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {donation.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-green-400 hover:text-green-500">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Impact Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Impact Highlights
            </h2>
            <div className="space-y-4">
              {impactMetrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-slate-400">{metric.label}</span>
                  <span className="text-white font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recognition & Rewards
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-yellow-400" />
                <span className="text-white">Gold Donor Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-slate-700" />
                <span className="text-white">Certificate of Recognition</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-slate-700" />
                <span className="text-white">
                  Position: 1st on the Leaderboard
                </span>
              </div>
              <button className="text-green-400 hover:text-green-500 text-sm">
                Share Your Impact →
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

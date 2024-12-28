// File: /components/donations/DonationHistory.tsx
import React from "react";
import { useDonationHistory } from "@/hooks/useDonation";
import { useWallet } from "@solana/wallet-adapter-react";
import Card from "@/components/common/Card";
import { Download } from "lucide-react";
import { lamportsToSol } from "@/utils/format";
import { DonationStatus, PaymentMethod } from "@/types";

interface DonationHistoryProps {
  campaignPDA?: string;
  limit?: number;
  showFilters?: boolean;
}

export default function DonationHistory({
  campaignPDA,
  limit,
  showFilters = true,
}: DonationHistoryProps) {
  const { publicKey: donor } = useWallet();
  const { donations, loading, error } = useDonationHistory({
    campaignPDA: campaignPDA ? new PublicKey(campaignPDA) : undefined,
    userPDA: donor,
  });

  const [filter, setFilter] = React.useState<DonationStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = React.useState<
    PaymentMethod | "all"
  >("all");

  const filteredDonations = React.useMemo(() => {
    let filtered = [...(donations || [])];

    if (filter !== "all") {
      filtered = filtered.filter((d) => d.status === filter);
    }

    if (paymentFilter !== "all") {
      filtered = filtered.filter((d) => d.paymentMethod === paymentFilter);
    }

    return limit ? filtered.slice(0, limit) : filtered;
  }, [donations, filter, paymentFilter, limit]);

  if (loading) {
    return (
      <Card>
        <div className="p-6 animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6 text-center">
          <p className="text-red-400">Failed to load donation history</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Donation History
        </h2>

        {showFilters && (
          <div className="flex gap-4 mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as DonationStatus)}
              className="bg-slate-700 text-white rounded-lg px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="allocated">Allocated</option>
              <option value="spent">Spent</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value as PaymentMethod)
              }
              className="bg-slate-700 text-white rounded-lg px-3 py-2"
            >
              <option value="all">All Payment Methods</option>
              <option value="cryptoWallet">Crypto Wallet</option>
              <option value="card">Card</option>
            </select>
          </div>
        )}

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
                  Payment Method
                </th>
                <th className="px-4 py-3 text-left text-sm text-slate-400">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredDonations.map((donation, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-white">
                    {donation.campaign.toString().slice(0, 4)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    ◎{lamportsToSol(donation.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {new Date(
                      donation.timestamp.toNumber() * 1000
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        donation.status === "completed"
                          ? "bg-green-400/10 text-green-400"
                          : donation.status === "pending"
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "bg-blue-400/10 text-blue-400"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {Object.keys(donation.paymentMethod)[0]}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {donation.transactionHash && (
                      <button className="text-green-400 hover:text-green-500">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && (
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
  );
}

// File: /app/(dashboard)/withdraw/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWalletPrompt } from "@/components/auth/ConnectWalletPrompt";
import { useProgram } from "@/hooks/useProgram";
import { useWithdrawFunds } from "@/hooks/useCampaign";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import StatusCard from "@/components/shared/StatusCard";
import { Campaign, CampaignWithKey } from "@/types";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { lamportsToSol } from "@/utils/format";
import { toast } from "react-hot-toast";
import { formatDistance } from "date-fns";
import { convertSolToUSDWithPrice, getSolPrice } from "@/utils/currency";
import { Lock, Clock } from "lucide-react";

interface GroupedCampaigns {
  ready: CampaignWithKey[];
  pending: CampaignWithKey[];
}

export default function WithdrawFundsPage() {
  const router = useRouter();
  const { publicKey: authority, connected } = useWallet();
  const { program } = useProgram();
  const { withdrawFunds, loading: withdrawLoading } = useWithdrawFunds();
  const [campaigns, setCampaigns] = useState<GroupedCampaigns>({
    ready: [],
    pending: [],
  });
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignWithKey | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [solPrice, setSolPrice] = useState<number>(0);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!program || !authority) return;

      try {
        const userCampaigns = await program.account.campaign.all([
          {
            memcmp: {
              offset: 8,
              bytes: authority.toBase58(),
            },
          },
        ]);

        const now = Date.now() / 1000;
        const grouped = userCampaigns.reduce<GroupedCampaigns>(
          (acc, c) => {
            const campaign = {
              publicKey: c.publicKey,
              account: c.account as Campaign,
            };

            // Campaign is ready for withdrawal if completed and has funds
            if (
              "completed" in c.account.status &&
              c.account.raisedAmount.gt(new BN(0))
            ) {
              acc.ready.push(campaign);
            }
            // Campaign is pending if active/in progress and end date hasn't passed
            else if (c.account.raisedAmount.gt(new BN(0))) {
              acc.pending.push(campaign);
            }
            return acc;
          },
          { ready: [], pending: [] }
        );

        setCampaigns(grouped);
        const price = await getSolPrice();
        setSolPrice(price);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [program, authority]);

  const getDaysRemaining = (campaign: Campaign): string => {
    const now = Date.now() / 1000;
    const endDate = campaign.endDate.toNumber();
    const distance = formatDistance(endDate * 1000, now * 1000);
    return distance;
  };

  const handleWithdraw = async () => {
    if (!selectedCampaign || !authority) return;

    try {
      const amount = new BN(parseFloat(withdrawAmount) * 1e9);

      await withdrawFunds({
        campaignPDA: selectedCampaign.publicKey,
        amount,
        recipient: authority,
      });

      toast.success("Funds withdrawn successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to withdraw funds");
    }
  };

  if (!connected) return <ConnectWalletPrompt />;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white mb-6">Withdraw Funds</h1>

      {/* Ready for Withdrawal Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          Ready for Withdrawal
        </h2>
        {campaigns.ready.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-slate-400">
              No campaigns ready for withdrawal
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.ready.map((campaign) => (
              <StatusCard
                key={campaign.publicKey.toString()}
                title={campaign.account.title}
                value={lamportsToSol(campaign.account.raisedAmount)}
                prefix="◎"
                footer={{
                  text: `$${convertSolToUSDWithPrice(
                    lamportsToSol(campaign.account.raisedAmount),
                    solPrice
                  ).toFixed(2)} USD`,
                }}
                onClick={() => setSelectedCampaign(campaign)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pending Campaigns Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-400 flex items-center gap-2">
          <Lock className="h-4 w-4" /> Pending Campaigns
        </h2>
        {campaigns.pending.length === 0 ? (
          <Card className="p-6 bg-slate-800/50">
            <p className="text-center text-slate-500">
              No pending campaigns found
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.pending.map((campaign) => (
              <Card
                key={campaign.publicKey.toString()}
                className="p-6 bg-slate-800/50"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-slate-400">
                    {campaign.account.title}
                  </h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Raised</span>
                    <span className="text-slate-400">
                      ◎{lamportsToSol(campaign.account.raisedAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Time Remaining
                    </span>
                    <span className="text-yellow-400">
                      {getDaysRemaining(campaign.account)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {selectedCampaign && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Withdraw from {selectedCampaign.account.title}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Amount (SOL)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                max={lamportsToSol(selectedCampaign.account.raisedAmount)}
                placeholder={`Max: ${lamportsToSol(
                  selectedCampaign.account.raisedAmount
                )} SOL`}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setSelectedCampaign(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || withdrawLoading}
              >
                {withdrawLoading ? "Processing..." : "Withdraw Funds"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

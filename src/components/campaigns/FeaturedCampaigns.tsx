"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProgram } from "@/hooks/useProgram";
import { Campaign, CampaignWithKey } from "@/types";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { toast } from "react-hot-toast";
import { getSolPrice } from "@/utils/currency";
import { lamportsToSol } from "@/utils/format";

const FeaturedCampaigns = ({ maxCampaigns = 6 }) => {
  const router = useRouter();
  const { program } = useProgram();
  const [campaigns, setCampaigns] = useState<CampaignWithKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSolPrice, setCurrentSolPrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(true);

  // Separate useEffect for SOL price
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        setPriceLoading(true);
        const solPrice = await getSolPrice();
        setCurrentSolPrice(solPrice);
      } catch (error) {
        console.error("Error fetching sol price", error);
        toast.error("Failed to get current sol price");
      } finally {
        setPriceLoading(false);
      }
    };

    fetchSolPrice();

    // Set up an interval to fetch price every minute
    const intervalId = setInterval(fetchSolPrice, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 

  // Separate useEffect for campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!program) return;

      try {
        setLoading(true);
        const allCampaigns = await program.account.campaign.all();
        const sortedCampaigns = allCampaigns
          .map((c) => ({
            publicKey: c.publicKey,
            account: c.account as Campaign,
          }))
          .filter((c) => "active" in c.account.status)
          .sort(
            (a, b) =>
              b.account.raisedAmount.toNumber() -
              a.account.raisedAmount.toNumber()
          )
          .slice(0, maxCampaigns);

        setCampaigns(sortedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [program, maxCampaigns]);

  const handleShare = (campaignId: string) => {
    const shareUrl = `${window.location.origin}/campaign/${campaignId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this campaign",
          text: "Support this important cause",
          url: shareUrl,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Campaign link copied to clipboard!");
    }
  };

  if (loading || priceLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">No active campaigns at the moment.</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Support a Campaign Today
          </h2>
          <span className="text-slate-400">Active Campaigns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const progress = Math.min(
              100,
              Math.round(
                (campaign.account.raisedAmount.toNumber() /
                  campaign.account.targetAmount.toNumber()) *
                  100
              )
            );

            const raisedInUSD = (
              lamportsToSol(campaign.account.raisedAmount) * currentSolPrice
            ).toFixed(2);

            return (
              <Card
                key={campaign.publicKey.toString()}
                className="overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={campaign.account.imageUrl || "/images/placeholder.jpg"}
                    alt={campaign.account.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-800/80 rounded-full px-3 py-1 text-sm text-white">
                    {campaign.account.donorsCount} donations
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {campaign.account.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    by {campaign.account.organizationName}
                  </p>

                  <div className="space-y-4">
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-green-400 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        ${raisedInUSD} raised
                      </span>
                      <span className="text-slate-300">{progress}% Funded</span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        onClick={() =>
                          router.push(
                            `/campaigns/${campaign.publicKey.toString()}/donate`
                          )
                        }
                      >
                        Donate Now
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          handleShare(campaign.publicKey.toString())
                        }
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {campaigns.length === maxCampaigns && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => router.push("/active-campaigns")}
            >
              See More Campaigns
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCampaigns;

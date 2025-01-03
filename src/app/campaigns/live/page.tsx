// File: /app/campaigns/live/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { Wifi, WifiOff } from "lucide-react";
import Card from "@/components/common/Card";
import { lamportsToSol } from "@/utils/format";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { useEventStream } from "@/hooks/useEventStream";
import { WebhookEvent } from "@/types/events";
import { formatDate } from "@/utils/date";
import { PublicKey } from "@solana/web3.js";
import TopNavBar from "@/components/common/Navigation/TopNavBar";

interface CampaignData {
  category: string;
  description: string;
  endDate: number;
  imageUrl: string;
  isUrgent: boolean;
  organizationName: string;
  startDate: number;
  targetAmount: string;
  title: string;
}

export default function LiveCampaignsPage() {
  console.log("LiveCampaignsPage rendered", new Date().toISOString());

  useEffect(() => {
    console.log("LiveCampaignsPage mounted", new Date().toISOString());
    return () => {
      console.log("LiveCampaignsPage unmounted", new Date().toISOString());
    };
  }, []);

  const router = useRouter();
  const { events, isConnected, error } = useEventStream({
    eventTypes: ["campaign_created"],
    showToasts: true,
    limit: 50,
  });
  // Filter and type cast campaign events
  console.log("Printing events", events);
  const campaignEvents = events!.filter(
    (event) =>
      event.eventType === "campaign_created" &&
      !!event.payload?.parsedData?.data
  );

  const handleViewCampaign = (campaignId: string) => {
    router.push(`/campaign/${campaignId}`);
  };

  return (
    <>
      <div className="py-10">
        <TopNavBar />
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Live Campaign Updates
          </h1>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center text-green-400 text-sm">
                <Wifi className="h-4 w-4 mr-1" />
                Connected - Watching for new campaigns
              </div>
            ) : (
              <div className="flex items-center text-red-400 text-sm">
                <WifiOff className="h-4 w-4 mr-1" />
                Connection lost - Attempting to reconnect...
              </div>
            )}
          </div>
        </div>

        {error ? (
          <Card className="p-6">
            <div className="text-red-400">
              Error connecting to campaign updates: {error.message}
            </div>
          </Card>
        ) : campaignEvents.length === 0 ? (
          <Card className="p-6">
            <div className="text-center text-slate-400">
              Waiting for new campaigns...
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignEvents.map((event, index) => {
              const campaign = event.payload.parsedData.data;
              const campaignAddress = event.payload.accounts[2].pubkey; // Campaign PDA
              const authority = event.payload.accounts[0].pubkey; // Authority address

              return (
                <Card
                  key={`${event.timestamp}-${index}`}
                  className="overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          by {campaign.organizationName}
                        </p>
                      </div>
                      {campaign.isUrgent && (
                        <span className="px-2 py-1 bg-red-400/10 text-red-400 rounded-full text-xs">
                          Urgent
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Category</span>
                        <span className="text-white">{campaign.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Target</span>
                        <span className="text-white">
                          ◎
                          {lamportsToSol(
                            Math.abs(parseInt(campaign.targetAmount))
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Duration</span>
                        <span className="text-white">
                          {formatDate(campaign.startDate)} -{" "}
                          {formatDate(campaign.endDate)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 mb-4">
                      <div>Campaign ID: {campaignAddress}</div>
                      <div>Created by: {authority}</div>
                      <div>
                        Created at: {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleViewCampaign(campaignAddress)}
                      className="w-full"
                    >
                      View Campaign
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

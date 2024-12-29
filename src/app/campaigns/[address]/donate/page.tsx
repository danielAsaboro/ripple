// File: /app/campaign/[address]/donate/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgram } from "@/hooks/useProgram";
import { Campaign, CampaignWithKey } from "@/types";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AmountStep } from "@/components/donation/modal/AmountStep";
import { PaymentStep } from "@/components/donation/modal/PaymentStep";
import { DonationMetrics } from "@/components/donation/shared/DonationMetrics";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import Card from "@/components/common/Card";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";
import { NotificationsDropdown } from "@/components/common/Navigation/NotificationsDropdown";
import { ProfileMenu } from "@/components/common/Navigation/ProfileMenu";
import { useUserProfile } from "@/hooks/useUser/useUserProfile";

type Step = "amount" | "payment";

interface LoadingState {
  campaign: boolean;
  profile: boolean;
  transaction: boolean;
  priceConversion: boolean;
}

interface DonationFormState {
  amountUSD: number;
  amountSOL: number | null;
  frequency: "one-time" | "monthly";
  step: Step;
}

const MIN_DONATION_USD = 1; // $1 minimum
const MAX_DONATION_USD = 50000; // $50,000 maximum

export default function DonatePage() {
  const params = useParams();
  const router = useRouter();
  const { program } = useProgram();
  const { connected, publicKey } = useWallet();

  // Campaign State
  const [campaign, setCampaign] = useState<CampaignWithKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);

  // Loading States
  const [loading, setLoading] = useState<LoadingState>({
    campaign: true,
    profile: false,
    transaction: false,
    priceConversion: true,
  });

  // Form State
  const [formState, setFormState] = useState<DonationFormState>({
    amountUSD: 0,
    amountSOL: null,
    frequency: "one-time",
    step: "amount",
  });

  // Profile
  const { profile, loading: profileLoading } = useUserProfile({
    authority: publicKey || undefined,
  });

  // Fetch SOL price with better error handling and retry logic
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        // First try the main CoinGecko API
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
          {
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data?.solana?.usd) {
          throw new Error("Invalid price data received");
        }

        setSolPrice(data.solana.usd);
      } catch (error) {
        console.error("Detailed error fetching SOL price:", error);

        // Fallback to alternative price source
        try {
          // You might want to add your preferred fallback price API here
          const fallbackResponse = await fetch(
            "https://price.jup.ag/v4/price?ids=SOL",
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!fallbackResponse.ok) {
            throw new Error(
              `Fallback HTTP error! status: ${fallbackResponse.status}`
            );
          }

          const fallbackData = await fallbackResponse.json();
          if (fallbackData?.data?.SOL?.price) {
            setSolPrice(fallbackData.data.SOL.price);
          } else {
            throw new Error("Invalid fallback price data");
          }
        } catch (fallbackError) {
          console.error("Both price sources failed:", fallbackError);
          setError("Unable to fetch SOL price. Please refresh the page.");
        }
      } finally {
        setLoading((prev) => ({ ...prev, priceConversion: false }));
      }
    };

    fetchSolPrice();
  }, []);

  // Reset to amount step if wallet disconnects
  useEffect(() => {
    if (!connected && formState.step === "payment") {
      setFormState((prev) => ({ ...prev, step: "amount" }));
    }
  }, [connected]);

  // Fetch campaign
  useEffect(() => {
    const fetchCampaign = async () => {
      // Don't set error immediately if program is null - it might be initializing
      if (!params.address) {
        setError("Invalid campaign address");
        setLoading((prev) => ({ ...prev, campaign: false }));
        return;
      }

      // Only proceed with fetch if program is available
      if (program) {
        try {
          const campaignPDA = new PublicKey(params.address);
          const campaignAccount = await program.account.campaign.fetch(
            campaignPDA
          );

          if (
            campaignAccount.status.completed ||
            campaignAccount.status.expired
          ) {
            setError("This campaign is no longer accepting donations");
            return;
          }

          setCampaign({
            publicKey: campaignPDA,
            account: campaignAccount as Campaign,
          });
        } catch (err) {
          console.error("Error fetching campaign:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load campaign"
          );
        } finally {
          setLoading((prev) => ({ ...prev, campaign: false }));
        }
      }
    };

    fetchCampaign();
  }, [program, params.address]);

  const handleAmountSubmit = (amountUSD: number) => {
    if (!solPrice) {
      setError("Unable to process donation. SOL price not available.");
      return;
    }

    if (amountUSD < MIN_DONATION_USD || amountUSD > MAX_DONATION_USD) {
      setError(
        `Donation must be between $${MIN_DONATION_USD} and $${MAX_DONATION_USD}`
      );
      return;
    }

    const amountSOL = Number((amountUSD / solPrice).toFixed(4));

    setFormState((prev) => ({
      ...prev,
      amountUSD,
      amountSOL,
      step: "payment",
    }));
  };

  const handleBack = () => {
    if (formState.step === "payment") {
      setFormState((prev) => ({ ...prev, step: "amount" }));
    } else {
      router.back();
    }
  };

  const handleSuccess = async () => {
    await router.push(`/campaign/${params.address}`);
  };

  if (loading.campaign || loading.priceConversion) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
        <p className="text-slate-400">
          {loading.priceConversion
            ? "Fetching latest SOL price..."
            : "Loading campaign..."}
        </p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-red-400">{error || "Campaign not found"}</p>
        <Button onClick={() => router.push("/active-campaigns")}>
          View All Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-800 px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">
            {loading.profile ? (
              <span className="animate-pulse">Welcome...</span>
            ) : (
              `Welcome, ${profile?.name || "Guest"}`
            )}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/active-campaigns">
            <Button>Donate Now</Button>
          </Link>
          <NotificationsDropdown />
          <ProfileMenu />
        </div>
      </header>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="inline-flex items-center text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Campaign Info */}
        <div className="space-y-6">
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src={campaign.account.imageUrl}
              alt={campaign.account.title}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {campaign.account.title}
            </h1>
            <p className="text-slate-400 mb-4">
              {campaign.account.description}
            </p>
            <p className="text-sm text-slate-400">
              By {campaign.account.organizationName}
            </p>
          </div>

          <Card className="p-6">
            <DonationMetrics campaign={campaign.account} />
          </Card>
        </div>

        {/* Donation Form */}
        <Card className="p-6">
          {!connected ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
              <p className="text-slate-400 text-center">
                Connect your wallet to start donating
              </p>
              <ConnectWalletButton />
            </div>
          ) : formState.step === "amount" ? (
            <AmountStep
              amountUSD={formState.amountUSD}
              setAmountUSD={handleAmountSubmit}
              frequency={formState.frequency}
              setFrequency={(freq) =>
                setFormState((prev) => ({ ...prev, frequency: freq }))
              }
              onNext={() =>
                setFormState((prev) => ({ ...prev, step: "payment" }))
              }
              minAmountUSD={MIN_DONATION_USD}
              maxAmountUSD={MAX_DONATION_USD}
              solPrice={solPrice}
            />
          ) : (
            <PaymentStep
              amountUSD={formState.amountUSD}
              amountSOL={formState.amountSOL!}
              frequency={formState.frequency}
              onBack={handleBack}
              campaign={campaign}
              onSuccess={handleSuccess}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

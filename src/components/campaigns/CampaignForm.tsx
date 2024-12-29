// File: /components/campaigns/CampaignForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { ImagePlus } from "lucide-react";
import { useCreateCampaign } from "@/hooks/useCampaign";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import {
  validateCampaignDuration,
  validateCampaignTarget,
} from "@/utils/validation";

interface CampaignFormData {
  title: string;
  category: string;
  description: string;
  organizationName: string;
  fundraisingGoalUSD: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  isUrgent: boolean;
}

interface CampaignFormProps {
  onSuccess?: () => void;
  onPreview?: (data: CampaignFormData) => void;
  initialData?: CampaignFormData | null;
}

const categories = [
  { label: "Healthcare", value: { healthcare: {} } },
  { label: "Education", value: { education: {} } },
  { label: "Food Supply", value: { foodSupply: {} } },
  { label: "Emergency Relief", value: { emergencyRelief: {} } },
  { label: "Infrastructure", value: { infrastructure: {} } },
  { label: "Water Sanitation", value: { waterSanitation: {} } },
] as const;

// Min and max in USD
const MIN_GOAL_USD = 1; // $100 minimum
const MAX_GOAL_USD = 1000000; // $1M maximum

const CampaignForm = ({
  onSuccess,
  onPreview,
  initialData,
}: CampaignFormProps) => {
  const { connected } = useWallet();
  const { createCampaign, loading, error } = useCreateCampaign();
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [isPriceFetching, setIsPriceFetching] = useState(true);

  const [formData, setFormData] = useState<CampaignFormData>(() => ({
    title: "",
    category: "",
    description: "",
    organizationName: "",
    fundraisingGoalUSD: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    isUrgent: false,
    ...(initialData || {}), // Initialize with initial data if provided
  }));

  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const handlePreviewClick = () => {
    if (validateForm()) {
      onPreview?.(formData);
    }
  };

  const validateForm = (): boolean => {
    // Implement form validation logic here
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const startTimestamp = Math.floor(
      new Date(formData.startDate).getTime() / 1000
    );
    const endTimestamp = Math.floor(
      new Date(formData.endDate).getTime() / 1000
    );

    if (!validateCampaignDuration(startTimestamp, endTimestamp)) {
      toast.error("Invalid campaign duration");
      return false;
    }

    const usdAmount = parseFloat(formData.fundraisingGoalUSD);
    if (usdAmount < MIN_GOAL_USD || usdAmount > MAX_GOAL_USD) {
      toast.error(`Goal must be between $${MIN_GOAL_USD} and $${MAX_GOAL_USD}`);
      return false;
    }

    return true;
  };
  // Fetch SOL price
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        setSolPrice(data.solana.usd);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
        toast.error("Failed to fetch SOL price. Please try again.");
      } finally {
        setIsPriceFetching(false);
      }
    };

    fetchSolPrice();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, you'd upload to IPFS/Arweave here
      const fakeUrl = URL.createObjectURL(file);
      setImagePreview(fakeUrl);
      setFormData((prev) => ({
        ...prev,
        imageUrl: fakeUrl,
      }));
    }
  };

  const calculateSolAmount = (usdAmount: number): number => {
    if (!solPrice) return 0;
    return Number((usdAmount / solPrice).toFixed(4));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!solPrice) {
      toast.error("Unable to fetch SOL price. Please try again.");
      return;
    }

    try {
      const startTimestamp = Math.floor(
        new Date(formData.startDate).getTime() / 1000
      );
      const endTimestamp = Math.floor(
        new Date(formData.endDate).getTime() / 1000
      );

      // Validate duration
      if (!validateCampaignDuration(startTimestamp, endTimestamp)) {
        toast.error("Invalid campaign duration");
        return;
      }

      const usdAmount = parseFloat(formData.fundraisingGoalUSD);

      // Validate USD amount
      if (usdAmount < MIN_GOAL_USD || usdAmount > MAX_GOAL_USD) {
        toast.error(
          `Goal must be between $${MIN_GOAL_USD} and $${MAX_GOAL_USD}`
        );
        return;
      }

      // Convert USD to SOL
      const solAmount = calculateSolAmount(usdAmount);
      const targetAmount = new BN(solAmount * 1e9); // Convert to lamports

      // Validate SOL target amount
      if (!validateCampaignTarget(targetAmount)) {
        toast.error("Target amount in SOL is too low");
        return;
      }

      // Find the selected category object
      const selectedCategory = categories.find(
        (c) => c.label === formData.category
      );
      if (!selectedCategory) {
        toast.error("Please select a valid category");
        return;
      }

      const campaignData = {
        title: formData.title,
        description: formData.description,
        category: selectedCategory.value,
        organizationName: formData.organizationName,
        targetAmount,
        startDate: new BN(startTimestamp),
        endDate: new BN(endTimestamp),
        imageUrl: formData.imageUrl,
        isUrgent: formData.isUrgent,
      };

      const result = await createCampaign(campaignData);
      toast.success("Campaign created successfully!");
      onSuccess?.();
    } catch (err) {
      console.error("Error creating campaign:", err);
      toast.error("Failed to create campaign");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">
            Create a campaign to raise funds and make a difference.
          </h2>
          <p className="text-slate-400">
            Fill in the details below to start your fundraising campaign.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Campaign Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter campaign title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.label} value={category.label}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="organizationName"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Organization Name
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter organization name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fundraisingGoalUSD"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Fundraising Goal (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  id="fundraisingGoalUSD"
                  name="fundraisingGoalUSD"
                  value={formData.fundraisingGoalUSD}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter target amount in USD"
                  min={MIN_GOAL_USD}
                  max={MAX_GOAL_USD}
                  required
                />
              </div>
              {solPrice && formData.fundraisingGoalUSD && (
                <p className="text-sm text-slate-400 mt-1">
                  ≈ ◎
                  {calculateSolAmount(parseFloat(formData.fundraisingGoalUSD))}{" "}
                  SOL
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-slate-200 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-slate-200 mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Describe your campaign"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Upload Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative h-40 w-40 mx-auto">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <ImagePlus className="mx-auto h-12 w-12 text-slate-400" />
                )}
                <div className="flex text-sm text-slate-400">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer text-green-400 hover:text-green-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isUrgent: e.target.checked,
                  }))
                }
                className="form-checkbox h-4 w-4 text-green-400 rounded border-slate-700 bg-slate-800 focus:ring-0"
              />
              <span className="text-sm text-slate-200">
                Mark as Urgent Campaign
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewClick}
              disabled={loading || isPriceFetching}
            >
              Preview Campaign
            </Button>
            <Button
              type="submit"
              disabled={loading || !connected || isPriceFetching}
            >
              {loading
                ? "Creating..."
                : isPriceFetching
                ? "Loading..."
                : "Submit Campaign"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default CampaignForm;

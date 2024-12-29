// File: /components/campaigns/CampaignPreview.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
  Calendar,
  Target,
  Building2,
  Tag,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { formatDate } from "@/utils/format";
import Card from "../common/Card";
import Button from "../common/Button";

interface CampaignPreviewProps {
  data: {
    title: string;
    category: string;
    description: string;
    organizationName: string;
    fundraisingGoalUSD: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    isUrgent: boolean;
  };
  onBack: () => void;
  onConfirm: () => void;
}

const CampaignPreview = ({ data, onBack, onConfirm }: CampaignPreviewProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to editing
        </button>
        <h2 className="text-xl font-semibold text-white">Campaign Preview</h2>
      </div>

      <Card className="overflow-hidden">
        {/* Campaign Header with Image */}
        <div className="relative h-64 w-full">
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={data.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <span className="text-slate-400">No image uploaded</span>
            </div>
          )}
          {data.isUrgent && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Urgent Campaign</span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Campaign Title and Basic Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">{data.title}</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <Building2 className="w-4 h-4" />
                <span>{data.organizationName}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Tag className="w-4 h-4" />
                <span>{data.category}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Target className="w-4 h-4" />
                <span>${data.fundraisingGoalUSD}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(new Date(data.startDate).getTime() / 1000)}
                </span>
              </div>
            </div>
          </div>

          {/* Campaign Description */}
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-white">
              About this campaign
            </h3>
            <p className="text-slate-300 whitespace-pre-wrap">
              {data.description}
            </p>
          </div>

          {/* Campaign Timeline */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Campaign Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Start Date</p>
                <p className="text-white">
                  {formatDate(new Date(data.startDate).getTime() / 1000)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">End Date</p>
                <p className="text-white">
                  {formatDate(new Date(data.endDate).getTime() / 1000)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="text-slate-300 hover:text-white"
            >
              Edit Campaign
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CampaignPreview;

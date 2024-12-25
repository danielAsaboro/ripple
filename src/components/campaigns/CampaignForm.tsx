// File: /components/campaigns/CampaignForm.tsx
"use client";
import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { ImagePlus } from "lucide-react";

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
  onPreview?: () => void;
}

interface CampaignFormData {
  title: string;
  category: string;
  fundraisingGoal: number;
  startDate: string;
  endDate: string;
  description: string;
  impactMetrics: string;
  image?: File;
}

const categories = [
  "Healthcare",
  "Education",
  "Food Supply",
  "Emergency Relief",
  "Infrastructure",
  "Water Sanitation",
];

const CampaignForm = ({ onSubmit, onPreview }: CampaignFormProps) => {
  const [formData, setFormData] = React.useState<CampaignFormData>({
    title: "",
    category: "",
    fundraisingGoal: 0,
    startDate: "",
    endDate: "",
    description: "",
    impactMetrics: "",
  });

  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
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
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fundraisingGoal"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Fundraising Goal ($)
              </label>
              <input
                type="number"
                id="fundraisingGoal"
                name="fundraisingGoal"
                value={formData.fundraisingGoal}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter target amount"
                required
              />
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
            <label
              htmlFor="impactMetrics"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Impact Metrics
            </label>
            <input
              type="text"
              id="impactMetrics"
              name="impactMetrics"
              value={formData.impactMetrics}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g., Number of lives to be impacted"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Upload Image/Video
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

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-sm font-medium text-white mb-2">
              Guidelines and Tips
            </h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>
                • Set a realistic fundraising goal to build trust with donors.
              </li>
              <li>• Use high-quality images to connect emotionally.</li>
              <li>
                • Clearly define your impact metrics to attract donations.
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onPreview}>
              Preview Campaign
            </Button>
            <Button type="submit">Submit for Review</Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default CampaignForm;

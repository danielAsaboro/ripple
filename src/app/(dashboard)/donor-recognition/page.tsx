// File: /app/(dashboard)/donor-recognition/page.tsx

import React from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Clock } from "lucide-react";

const topDonors = [
  {
    name: "Dara Daniel",
    amount: 5000,
    impactedLives: "500+",
    badge: "Gold",
  },
  {
    name: "Jane Smith",
    amount: 3200,
    impactedLives: "300+",
    badge: "Silver",
  },
  {
    name: "Anonymous",
    amount: 2500,
    impactedLives: "250+",
    badge: "Bronze",
  },
];

const leaderboard = [
  {
    rank: 1,
    name: "Dara Daniel",
    totalDonation: 5000,
    impactedLives: "500+",
  },
  {
    rank: 2,
    name: "Jane Smith",
    totalDonation: 3200,
    impactedLives: "300+",
  },
  {
    rank: 3,
    name: "Anonymous",
    totalDonation: 2500,
    impactedLives: "250+",
  },
  {
    rank: 4,
    name: "David Johnson",
    totalDonation: 1800,
    impactedLives: "180+",
  },
  {
    rank: 5,
    name: "Maria Lukman",
    totalDonation: 1500,
    impactedLives: "150+",
  },
];

const recentDonations = [
  {
    donor: "Jane Smith",
    amount: 200,
    campaign: "Medical Aid",
    timeAgo: "2 mins ago",
  },
  {
    donor: "David Johnson",
    amount: 100,
    campaign: "Food Relief",
    timeAgo: "10 mins ago",
  },
  {
    donor: "Anonymous",
    amount: 500,
    campaign: "Clean Water",
    timeAgo: "30 mins ago",
  },
];

const badges = [
  {
    name: "Dara Daniel",
    type: "Gold Donor",
    color: "bg-yellow-400",
  },
  {
    name: "Jane Smith",
    type: "Silver Donor",
    color: "bg-slate-300",
  },
  {
    name: "Anonymous",
    type: "Bronze Donor",
    color: "bg-amber-600",
  },
];

const testimonials = [
  {
    message: "Thank you, John Doe, for helping us rebuild our school!",
    author: "Amina, Beneficiary",
  },
  {
    message: "Your support brought medical care to our community.",
    author: "Dr. Ahmed, Project Lead",
  },
];

export default function DonorRecognitionPage() {
  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topDonors.map((donor, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">
                    {index === 0
                      ? "Top Donor"
                      : index === 1
                      ? "Second Donor"
                      : "Third Donor"}
                  </p>
                  <h3 className="text-xl font-semibold text-white mt-1">
                    {donor.name}
                  </h3>
                </div>
                <div
                  className={`h-8 w-8 rounded-full ${
                    donor.badge === "Gold"
                      ? "bg-yellow-400"
                      : donor.badge === "Silver"
                      ? "bg-slate-300"
                      : "bg-amber-600"
                  }`}
                />
              </div>
              <p className="text-2xl font-bold text-white">${donor.amount}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Leaderboard */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Donor Leaderboard
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="text-left text-sm font-medium text-slate-400 pb-4">
                    Rank
                  </th>
                  <th className="text-left text-sm font-medium text-slate-400 pb-4">
                    Donor Name
                  </th>
                  <th className="text-left text-sm font-medium text-slate-400 pb-4">
                    Total Donation
                  </th>
                  <th className="text-left text-sm font-medium text-slate-400 pb-4">
                    Impacted Lives
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leaderboard.map((donor) => (
                  <tr key={donor.rank}>
                    <td className="py-4 text-white">{donor.rank}</td>
                    <td className="py-4 text-white">{donor.name}</td>
                    <td className="py-4 text-white">${donor.totalDonation}</td>
                    <td className="py-4 text-white">{donor.impactedLives}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Recent Donations and Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recent Donations
            </h2>
            <div className="space-y-4">
              {recentDonations.map((donation, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-white">{donation.donor}</p>
                    <p className="text-sm text-slate-400">
                      donated ${donation.amount} to {donation.campaign}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {donation.timeAgo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recognition & Badges
            </h2>
            <div className="space-y-4">
              {badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full ${badge.color}`} />
                  <div>
                    <p className="text-white">{badge.name}</p>
                    <p className="text-sm text-slate-400">{badge.type}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center">
                    ⭐
                  </div>
                  <p className="text-sm text-slate-400">
                    Champion of Change: Earned by donating $5,000+
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Thank You Notes */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Thank You Notes From Beneficiaries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-slate-300 italic">
                  &ldquo;{testimonial.message}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-700" />
                  <p className="text-sm text-slate-400">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Share Impact Button */}
      <div className="flex justify-end">
        <Button>Share your Impact</Button>
      </div>
    </div>
  );
}

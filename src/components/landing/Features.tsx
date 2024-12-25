// File: /components/landing/Features.tsx

import React from "react";
import { LineChart, Shield, Trophy, CreditCard } from "lucide-react";
import Card from "@/components/common/Card";

const features = [
  {
    title: "Transparent Fund Tracking",
    description:
      "Track every dollar donated and see how it's allocated to charitable projects in real time.",
    icon: LineChart,
    action: "Track Funds",
    color: "text-green-400",
  },
  {
    title: "Impact Measurement",
    description:
      "Measure the impact of your contributions with real-time data and success stories shared by our partner organizations.",
    icon: Shield,
    action: "View Impact",
    color: "text-blue-400",
  },
  {
    title: "Donor Recognition",
    description:
      "Your contributions deserve recognition. See your name, or wallet ID, featured on our donor wall.",
    icon: Trophy,
    action: "Join the Leaderboard",
    color: "text-yellow-400",
  },
  {
    title: "Easy Donations",
    description: "Quick and secure payment options.",
    icon: CreditCard,
    action: "Start Donating",
    color: "text-purple-400",
  },
];

const Features = () => {
  return (
    <section className="bg-slate-900 py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-white mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="flex flex-col items-start p-6"
              >
                <div
                  className={`rounded-lg p-3 ${feature.color} bg-opacity-10`}
                >
                  <IconComponent className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-grow text-slate-300">
                  {feature.description}
                </p>
                <button
                  className={`mt-4 text-sm font-medium ${feature.color} hover:underline`}
                >
                  {feature.action} →
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

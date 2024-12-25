// File: /components/dashboard/ImpactMetrics.tsx

import React from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { ChevronRight, MoreVertical } from "lucide-react";

interface SuccessStory {
  id: string;
  title: string;
  description: string;
}

interface ImpactMetricsProps {
  stories: SuccessStory[];
  totalLives?: number;
}

const ImpactMetrics = ({ stories, totalLives = 10000 }: ImpactMetricsProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm text-slate-400">Success Stories</h3>
        <button className="text-slate-400 hover:text-slate-300">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {stories.map((story) => (
          <div key={story.id} className="space-y-2">
            <p className="text-white">{story.title}</p>
            <p className="text-sm text-slate-400">{story.description}</p>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-4 text-sm">
          Read More <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Total Lives Changed</span>
          <span className="text-white font-medium">
            {totalLives.toLocaleString()} people
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ImpactMetrics;

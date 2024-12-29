// File: /components/dashboard/ImpactMetrics.tsx
import React from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { ChevronRight, MoreVertical } from "lucide-react";
import { useProgram } from "@/hooks/useProgram";
import { Campaign } from "@/types";
import { lamportsToSol } from "@/utils/format";

interface ImpactMetricsProps {
  campaignPDA?: string;
  showTotalImpact?: boolean;
}

const ImpactMetrics = ({
  campaignPDA,
  showTotalImpact = true,
}: ImpactMetricsProps) => {
  const { program } = useProgram();
  const [impact, setImpact] = React.useState({
    totalLives: 0,
    totalRaised: 0,
    successStories: [] as { title: string; description: string }[],
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchImpactData = async () => {
      if (!program) return;

      try {
        // Fetch all campaigns or specific campaign
        const campaigns = campaignPDA
          ? [await program.account.campaign.fetch(campaignPDA)]
          : (await program.account.campaign.all()).map((c) => c.account);

        // Calculate total impact
        const completedCampaigns = campaigns.filter(
          (c: Campaign) => "completed" in c.status
        );

        const totalRaised = completedCampaigns.reduce(
          (sum: number, c: Campaign) => sum + c.raisedAmount.toNumber(),
          0
        );

        // Estimate lives impacted (this would need to be adjusted based on your actual impact metrics)
        const estimatedLives = Math.floor(lamportsToSol(totalRaised) * 10); // Example: 10 lives per SOL

        // Generate success stories from completed campaigns
        const stories = completedCampaigns
          .map((c: Campaign) => ({
            title: c.title,
            description: `Raised ◎${lamportsToSol(c.raisedAmount).toFixed(
              2
            )} from ${c.donorsCount} donors`,
          }))
          .slice(0, 3); // Take latest 3 stories

        setImpact({
          totalLives: estimatedLives,
          totalRaised: totalRaised,
          successStories: stories,
        });
      } catch (error) {
        console.error("Error fetching impact data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, [program, campaignPDA]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm text-slate-400">Success Stories</h3>
        <button className="text-slate-400 hover:text-slate-300">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {impact.successStories.map((story, index) => (
          <div key={index} className="space-y-2">
            <p className="text-white">{story.title}</p>
            <p className="text-sm text-slate-400">{story.description}</p>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-4 text-sm">
          Read More <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {showTotalImpact && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total Lives Changed</span>
            <span className="text-white font-medium">
              {impact.totalLives.toLocaleString()} people
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-slate-400">
              Total Funds Distributed
            </span>
            <span className="text-white font-medium">
              ◎{lamportsToSol(impact.totalRaised).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ImpactMetrics;

// File: /app/(dashboard)/impact-stories/page.tsx
"use client";
import React from "react";
import StatusCard from "@/components/shared/StatusCard";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useProgram } from "@/hooks/useProgram";
import { Campaign } from "@/types";
import { lamportsToSol } from "@/utils/format";
import { toast } from "react-hot-toast";

export default function ImpactStoriesPage() {
  const { program } = useProgram();
  const [loading, setLoading] = React.useState(true);
  const [impactMetrics, setImpactMetrics] = React.useState({
    totalLives: 0,
    projectsCompleted: 0,
    communitiesReached: 0,
  });
  const [successStories, setSuccessStories] = React.useState<Campaign[]>([]);
  const [projectProgress, setProjectProgress] = React.useState<{
    [key: string]: {
      title: string;
      achievement: string;
      details: string;
    };
  }>({});

  React.useEffect(() => {
    const fetchImpactData = async () => {
      if (!program) return;

      try {
        // Fetch all completed campaigns
        const campaigns = await program.account.campaign.all([
          {
            memcmp: {
              offset: 8 + 32 + 8 + 8, // After discriminator, authority, title length, and description length
              bytes: "completed", // Filter for completed campaigns
            },
          },
        ]);

        const completedCampaigns = campaigns.map((c) => c.account as Campaign);

        // Calculate total impact
        const totalRaised = completedCampaigns.reduce(
          (sum, c) => sum + c.raisedAmount.toNumber(),
          0
        );

        // Get top success stories
        const stories = completedCampaigns
          .sort((a, b) => b.raisedAmount.toNumber() - a.raisedAmount.toNumber())
          .slice(0, 4);

        // Calculate progress for ongoing projects
        const ongoingCampaigns = (
          await program.account.campaign.all([
            {
              memcmp: {
                offset: 8 + 32 + 8 + 8,
                bytes: "inProgress",
              },
            },
          ])
        ).map((c) => c.account as Campaign);

        const progress = ongoingCampaigns.reduce((acc, campaign) => {
          const progress =
            (campaign.raisedAmount.toNumber() /
              campaign.targetAmount.toNumber()) *
            100;
          acc[campaign.title] = {
            title: campaign.title,
            achievement: `Achieved ${progress.toFixed(0)}% of ${
              campaign.category
            } goal`,
            details: `Raised ◎${lamportsToSol(campaign.raisedAmount)} from ${
              campaign.donorsCount
            } donors`,
          };
          return acc;
        }, {} as any);

        setImpactMetrics({
          totalLives: Math.floor(lamportsToSol(totalRaised) * 10), // Estimate: 10 lives per SOL
          projectsCompleted: completedCampaigns.length,
          communitiesReached: new Set(
            completedCampaigns.map((c) => c.organizationName)
          ).size,
        });

        setSuccessStories(stories);
        setProjectProgress(progress);
      } catch (error) {
        console.error("Error fetching impact data:", error);
        toast.error("Failed to load impact data");
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, [program]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Total Lives Impacted"
          value={`${impactMetrics.totalLives.toLocaleString()}+`}
        />
        <StatusCard
          title="Projects Completed"
          value={`${impactMetrics.projectsCompleted}+`}
        />
        <StatusCard
          title="Communities Reached"
          value={`${impactMetrics.communitiesReached}+`}
        />
      </div>

      {/* Success Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {successStories.map((story) => (
          <Card key={story.title}>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">
                {story.title}
              </h3>
              <p className="text-slate-400">
                Impact: ◎{lamportsToSol(story.raisedAmount)} raised from{" "}
                {story.donorsCount} donors
              </p>
              <p className="text-slate-300">{story.description}</p>
              <p className="text-green-400">By {story.organizationName}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = `/campaign/${story.title}`;
                }}
              >
                View Full Story
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Project Progress */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Project Progress
          </h2>
          <div className="space-y-6">
            {Object.values(projectProgress).map((project) => (
              <div key={project.title} className="space-y-2">
                <h3 className="text-white font-medium">{project.title}</h3>
                <p className="text-green-400">{project.achievement}</p>
                <p className="text-sm text-slate-400">{project.details}</p>
              </div>
            ))}
            {Object.keys(projectProgress).length === 0 && (
              <p className="text-slate-400">No active projects</p>
            )}
          </div>
        </div>
      </Card>

      {/* Testimonials */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Community Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {successStories.slice(0, 2).map((story) => (
              <div key={story.title} className="space-y-2">
                <p className="text-slate-300 italic">
                  &quot;{story.description}&quot;
                </p>
                <p className="text-sm text-slate-400">
                  - {story.organizationName}
                </p>
                <p className="text-sm text-green-400">
                  ◎{lamportsToSol(story.raisedAmount)} raised
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Be Part of Our Impact Story
        </h3>
        <p className="text-slate-400 mb-6">
          Join us in making a difference. Start your own campaign or support
          existing ones.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => (window.location.href = "/start-campaign")}>
            Start a Campaign
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/active-campaigns")}
          >
            Support a Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}

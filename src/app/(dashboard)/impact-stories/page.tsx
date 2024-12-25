// File: /app/(dashboard)/impact-stories/page.tsx

import React from "react";
import StatusCard from "@/components/dashboard/StatusCard";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

const impactMetrics = {
  totalLives: "25,000+",
  projectsCompleted: "50+",
  communitiesReached: "120+",
};

const projectMilestones = [
  {
    title: "Healthcare Outreach",
    achievement: "Achieved 90% of medical aid goal.",
    details: "Treated 200 out of 220 targeted patients",
  },
  {
    title: "Food Distribution",
    achievement: "Achieved 75% of supply goal.",
    details: "Delivered 3,750 out of 5,000 meals",
  },
];

const successStories = [
  {
    id: "1",
    title: "Building a Future for Amina",
    impact: "150 school kits provided in Kano",
    quote: "I can now attend school every day without worries...",
    image: "/images/success-1.jpg",
  },
  {
    id: "2",
    title: "Medical Aid in Rural Areas",
    impact: "Healthcare access provided to 500 families",
    quote: "Access to care changed everything for my family...",
    image: "/images/success-2.jpg",
  },
];

const testimonials = [
  {
    quote: "This project gave me hope again. Thank you so much!",
    author: "Maryam, Beneficiary",
  },
  {
    quote: "We have witnessed lives changing through this platform.",
    author: "Dr. Ali, Project Lead",
  },
];

export default function ImpactStoriesPage() {
  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Total Lives Impacted"
          value={impactMetrics.totalLives}
          //   subtitle="Lives"
        />
        <StatusCard
          title="Projects Completed"
          value={impactMetrics.projectsCompleted}
          //   subtitle="Completed Across Sectors"
        />
        <StatusCard
          title="Communities Reached"
          value={impactMetrics.communitiesReached}
          //   subtitle="Communities"
        />
      </div>

      {/* Impact Visualization */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Impact Visualization
          </h2>
          <div className="space-y-4">
            {["Healthcare", "Education", "Food Supply"].map((category) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{category}</span>
                  <span className="text-white">12,000 Lives</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: "35%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Project Milestones */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Project Milestones
          </h2>
          <div className="space-y-6">
            {projectMilestones.map((milestone, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-white font-medium">{milestone.title}</h3>
                <p className="text-green-400">{milestone.achievement}</p>
                <p className="text-sm text-slate-400">{milestone.details}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Success Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {successStories.map((story) => (
          <Card key={story.id}>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">
                {story.title}
              </h3>
              <p className="text-slate-400">Impact: {story.impact}</p>
              <p className="text-slate-300 italic">
                &ldquo;{story.quote}&rdquo;
              </p>
              <Button variant="outline" className="w-full">
                View Full Story
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Testimonials */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-slate-300 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="text-sm text-slate-400">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

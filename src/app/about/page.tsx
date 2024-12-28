"use client";

import React from "react";
import DonateCTA from "@/components/landing/DonateCTA";
import Footer from "@/components/common/Navigation/Footer";
import TopNavBar from "@/components/common/Navigation/TopNavBar";

// Ripple Component
const RippleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="ripple-container absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`ripple absolute rounded-full border border-blue-300/20 animate-ripple`}
            style={{
              left: "20%",
              top: "30%",
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const textList = [
  "When a single drop of water touches a still pond, it creates ripples that extend far beyond its point of impact.",
  "At Ripple, we believe positive change works the same way - one small action can create waves of transformation that reach further than we imagine. We're a platform that helps you see the expanding circles of impact from your charitable giving.",
  "Just as ripples in water move outward in concentric rings, touching everything in their path, your donations create cascading effects that transform communities, influence lives, and inspire others to join the movement.",
  "Our mission is to make these ripples visible. Through our impact tracking and monitoring tools, you can watch your contribution join with others, building momentum like waves combining in the ocean.",
  "Every donation you make sends out its own set of ripples - funding vital programs, supporting communities in need, and encouraging others to participate in positive change.",
  "We built Ripple because we believe in the power of informed giving. When you can see the real impact of your donations - from immediate effects to long-term transformations - giving becomes more than a transaction. It becomes a way to be part of something bigger, to create ripples that keep expanding long after that first drop.",
  "Join us in creating waves of change. Together, we can transform ripples into swells of lasting impact.",
];

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 px-4 py-20 text-center">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap");

        .handwritten {
          font-family: "Kalam", cursive;
        }

        .ripple {
          width: 12px;
          height: 12px;
          transform: translate(-50%, -50%) scale(1);
          animation: ripple 6s linear infinite;
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(100);
            opacity: 0;
          }
        }
      `}</style>

      <TopNavBar />

      <main className="relative min-h-screen w-full bg-slate-900">
        <RippleBackground />

        {/* Main Content */}
        <div className="relative z-10 flex justify-center py-10">
          <section className="flex max-w-3xl space-y-8 justify-center">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-10 shadow-lg">
              {/* Center Header */}
              <h2 className="handwritten text-5xl font-semibold mb-4 text-center text-white">
                The Power of a Single Action
              </h2>

              <br />

              {/* Left-Aligned Paragraphs */}
              <div className="handwritten text-gray-300 text-left space-y-6">
                {textList.map((text, index) => (
                  <p key={index} className="leading-relaxed text-xl">
                    {text}
                  </p>
                ))}
              </div>

              <ProfileCard />
            </div>
          </section>
        </div>

        {/* Call to Action Section */}
        <DonateCTA />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export function ProfileCard() {
  return (
    <div className="flex items-center space-x-4 p-6 mt-8 rounded-lg bg-slate-700/50">
      <img
        src="/api/placeholder/112/112"
        alt="Ivy Zion"
        className="w-28 h-28 rounded-full border-2 border-gray-400"
      />
      <div className="handwritten">
        <h3 className="text-lg font-semibold text-white">Ivy Zion</h3>
        <p className="text-sm text-gray-400">CEO</p>
      </div>
    </div>
  );
}

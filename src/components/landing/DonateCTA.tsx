import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";

export default function DonateCTA() {
  return (
    <section className="py-20 px-4 bg-slate-900">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between">
        <div className="mb-8 md:mb-0 md:mr-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-slate-300 max-w-lg mb-6">
            Join us in creating waves of change. Together, we can transform
            ripples into swells of lasting impact.
          </p>
          <div className="flex gap-4">
            <Button size="lg">Donate Now</Button>
            <Button variant="outline" size="lg">
              Start a Campaign
            </Button>
          </div>
        </div>
        <div className="relative w-full md:w-1/3 aspect-[4/3]">
          <Image
            src="/images/impact.jpg"
            alt="Make a difference"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}

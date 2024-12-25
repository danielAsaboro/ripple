// File: /components/landing/Testimonials.tsx

import React from "react";
import Card from "@/components/common/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    content:
      "I love how transparent this platform is. I can see the real impact of my donations.",
    author: "Joan Anderson",
    role: "Regular Donor",
  },
  {
    id: "2",
    content:
      "It feels amazing to know my money is making a difference in someone's life.",
    author: "Christian Luke",
    role: "Community Member",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-slate-800 py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-white mb-12">
          What Our Donors Are Saying
        </h2>

        <div className="relative">
          <div className="flex space-x-6 overflow-hidden">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="flex-shrink-0 w-full md:w-1/2 p-6"
              >
                <blockquote>
                  <p className="text-lg text-slate-200 mb-4">
                    "{testimonial.content}"
                  </p>
                  <footer className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-700" />
                    <div>
                      <cite className="font-medium text-white not-italic">
                        {testimonial.author}
                      </cite>
                      <p className="text-sm text-slate-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </Card>
            ))}
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full">
            <button className="rounded-full p-2 bg-slate-700 text-white hover:bg-slate-600">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button className="rounded-full p-2 bg-slate-700 text-white hover:bg-slate-600">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="text-green-400 hover:underline">
            Submit Your Testimonial
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

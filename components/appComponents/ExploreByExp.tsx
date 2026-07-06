// src/components/appComponents/ExploreByExp.tsx
"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const EXPLORE_BY = [
  {
    title: "Family",
    emoji: "👨‍👩‍👧",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Couple",
    emoji: "❤️",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Friends",
    emoji: "👥",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Solo Traveler",
    emoji: "👤",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Photography",
    emoji: "📸",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Nature",
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  },
];

interface ExploreByExpProps {
  selectedExperiences?: string[];
  onToggle?: (experience: string) => void;
}

const ExploreByExp = ({ selectedExperiences = [], onToggle }: ExploreByExpProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Explore by Experience
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Find the perfect places based on your travel style.
          </p>
        </div>
        {selectedExperiences.length > 0 && (
          <button
            type="button"
            onClick={() => onToggle && onToggle("")}
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {EXPLORE_BY.map((item) => {
          const isSelected = selectedExperiences.includes(item.title);
          return (
            <button
              type="button"
              key={item.title}
              onClick={() => onToggle && onToggle(item.title)}
              className={cn(
                "group cursor-pointer relative h-44 rounded-3xl overflow-hidden shadow-sm transition-all duration-300",
                isSelected ? "ring-4 ring-blue-600 ring-offset-2 scale-[1.02]" : "hover:shadow-xl hover:-translate-y-1"
              )}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-left">
                <h3 className="text-white font-bold text-base leading-tight">
                  {item.title}
                </h3>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 bg-blue-600 rounded-full p-1">
<CheckIcon className="w-5 h-5 text-white stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreByExp;
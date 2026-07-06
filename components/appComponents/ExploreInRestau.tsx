"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const DINING_EXPERIENCES = [
  {
    title: "Date Night",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Family",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Friends",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Business Meeting",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Celebration",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Rooftop",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
];

interface ExploreInRestauProps {
  selectedExperiences?: string[];
  onToggle?: (experience: string) => void;
}

const ExploreInRestau = ({ selectedExperiences = [], onToggle }: ExploreInRestauProps) => {
  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Explore by Experience
          </h2>
          <p className="mt-1 text-slate-500">
            Find the perfect restaurant for every occasion.
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

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
        {DINING_EXPERIENCES.map((item) => {
          const isSelected = selectedExperiences.includes(item.title);
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onToggle && onToggle(item.title)}
              className={cn(
                "group cursor-pointer relative h-52 overflow-hidden rounded-3xl transition-all duration-300",
                isSelected
                  ? "ring-4 ring-blue-600 ring-offset-2 scale-[1.02]"
                  : "hover:scale-105"
              )}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-bold text-white">
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

export default ExploreInRestau;
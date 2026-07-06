// src/app/places/page.tsx
"use client";

import { useState, useMemo } from "react";
import type { GetPlacesParams } from "@/actions/place.action";
import FilterSidebar from "@/components/appComponents/FilterSidebar";
import PlaceCard from "@/components/appComponents/PlaceCard";
import Pagination from "@/components/appComponents/Pagination";
import { useFetchPlaces } from "@/hooks/usePlaces";
import { useFetchAreas } from "@/hooks/useAreas";
import { MapPin, Search, Sparkles } from "lucide-react";
import ExploreByExp from "@/components/appComponents/ExploreByExp";

const PAGE_SIZE = 6;
const CATEGORIES = [
  "Museum",
  "Historical",
  "Park",
  "Monument",
  "Cultural",
  "Religious",
];

export default function PlacesPage() {
  const [params, setParams] = useState<GetPlacesParams>({
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: "",
  });

  const { data, isLoading } = useFetchPlaces(params);
  const { data: areasData } = useFetchAreas();

  const places = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const filterSections = useMemo(
    () => [
      {
        title: "Area",
        multiSelect: true,
        searchable: true,
        options: (areasData || []).map((a: { name: string }) => ({
          label: a.name,
          value: a.name,
        })),
        selected: params.areas || [],
        onChange: (v: string[]) =>
          setParams((prev) => ({ ...prev, areas: v, page: 1 })),
      },
      {
        title: "Category",
        multiSelect: true,
        searchable: false,
        options: CATEGORIES.map((c) => ({ label: c, value: c })),
        selected: params.categories || [],
        onChange: (v: string[]) =>
          setParams((prev) => ({ ...prev, categories: v, page: 1 })),
      },
    ],
    [areasData, params.areas, params.categories],
  );

  const handleSearch = (search: string) =>
    setParams((prev) => ({ ...prev, search, page: 1 }));

  const handleSort = (value: string) => {
    const sortMap: Record<
      string,
      Pick<GetPlacesParams, "sortBy" | "sortOrder">
    > = {
      popular: { sortBy: "rating", sortOrder: "desc" },
      newest: { sortBy: "createdAt", sortOrder: "desc" },
      rating: { sortBy: "rating", sortOrder: "desc" },
    };
    setParams((prev) => ({ ...prev, ...sortMap[value], page: 1 }));
  };

  const handleExperienceToggle = (experience: string) => {
    setParams((prev) => {
      const current = prev.experiences || [];
      const updated = current.includes(experience)
        ? current.filter((e) => e !== experience)
        : [...current, experience];
      return { ...prev, experiences: updated.length ? updated : undefined, page: 1 };
    });
  };

  const selectedExperiences = params.experiences || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <main className="flex-grow py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ExploreByExp
            selectedExperiences={selectedExperiences}
            onToggle={handleExperienceToggle}
          />

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight flex items-center gap-2">
                Explore Dhaka <Sparkles className="w-8 h-8 text-blue-600" />
              </h1>
              <p className="text-slate-500">
                Discover landmarks and cultural gems across the city.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search places..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <select
                onChange={(e) => handleSort(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <FilterSidebar
              sections={filterSections}
              onClearAll={() =>
                setParams((prev) => ({
                  ...prev,
                  areas: [],
                  categories: [],
                  search: "",
                  experiences: undefined,
                  page: 1,
                }))
              }
            />

            <div className="flex-grow">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(PAGE_SIZE)].map((_, i) => (
                    <div
                      key={i}
                      className="h-72 animate-pulse rounded-[2rem] bg-slate-200"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {places.map((place: any) => (
                      <PlaceCard key={place._id} {...place} />
                    ))}
                  </div>
                  <div className="mt-12">
                    <Pagination
                      currentPage={params.page || 1}
                      totalPages={totalPages}
                      onPageChange={(p) =>
                        setParams((prev) => ({ ...prev, page: p }))
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
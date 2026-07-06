"use client";

import { useState, useMemo } from "react";
import FilterSidebar from "@/components/appComponents/FilterSidebar";
import Pagination from "@/components/appComponents/Pagination";
import RestaurantsCard, {
  type RestaurantCardProps,
} from "@/components/appComponents/RestaurantsCard";
import { useFetchRestaurants } from "@/hooks/useRestaurants";
import { useFetchAreas } from "@/hooks/useAreas";
import { Search, Utensils } from "lucide-react";
import ExploreInRestau from "@/components/appComponents/ExploreInRestau";

const PAGE_SIZE = 6;
const CATEGORIES = ["Fast Food", "Fine Dining", "Cafe", "Buffet", "Street Food", "Bakery"];

export default function DinePage() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);

  const { data: areasData, isLoading: areasLoading } = useFetchAreas();

  const { data, isLoading, error } = useFetchRestaurants({
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
    search: search || undefined,
    areas: selectedAreas.length ? selectedAreas : undefined,
    categories: selectedCategories.length ? selectedCategories : undefined,
    experiences: selectedExperiences.length ? selectedExperiences : undefined,
  });

  const filterSections = useMemo(
    () => [
      {
        title: "Area",
        multiSelect: true,
        searchable: true,
        options: (areasData || []).map((a: any) => ({ label: a.name, value: a.name })),
        selected: selectedAreas,
        onChange: (v: string[]) => {
          setPage(1);
          setSelectedAreas(v);
        },
      },
      {
        title: "Category",
        multiSelect: true,
        searchable: false,
        options: CATEGORIES.map((c) => ({ label: c, value: c })),
        selected: selectedCategories,
        onChange: (v: string[]) => {
          setPage(1);
          setSelectedCategories(v);
        },
      },
    ],
    [areasData, selectedAreas, selectedCategories]
  );

  const handleClearAll = () => {
    setSelectedAreas([]);
    setSelectedCategories([]);
    setSelectedExperiences([]);
    setSearch("");
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleExperienceToggle = (experience: string) => {
    setSelectedExperiences((prev) =>
      prev.includes(experience)
        ? prev.filter((e) => e !== experience)
        : [...prev, experience]
    );
    setPage(1);
  };

  const totalPages = Math.ceil((data?.totalCount || 0) / PAGE_SIZE);

  if (error)
    return <div className="py-20 text-center text-red-500">Error loading restaurants...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <ExploreInRestau
            selectedExperiences={selectedExperiences}
            onToggle={handleExperienceToggle}
          />

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight flex items-center gap-3">
                Best Dining in Dhaka <Utensils className="text-orange-500 w-8 h-8" />
              </h1>
              <p className="text-slate-500">
                Explore {data?.totalCount || 0} varieties of cuisines and flavors.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="name-asc">A - Z</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <FilterSidebar sections={filterSections} onClearAll={handleClearAll} />

            <div className="flex-grow">
              {isLoading || areasLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="h-72 animate-pulse rounded-[2rem] bg-slate-200/60"
                    />
                  ))}
                </div>
              ) : data?.items?.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">
                    No restaurants found matching your filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-blue-600 font-bold text-sm mt-2 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data?.items?.map((item: RestaurantCardProps) => (
                    <RestaurantsCard key={String(item._id)} {...item} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
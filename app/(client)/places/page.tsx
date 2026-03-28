"use client";
import { useState } from "react";
import type { GetPlacesParams } from "@/actions/place.action";
import FilterSidebar from "@/components/appComponents/FilterSidebar";
import PlaceCard from "@/components/appComponents/PlaceCard";
import { useFetchPlaces } from "@/hooks/usePlaces";

const PAGE_SIZE = 6;

export default function PlacesPage() {
	const [params, setParams] = useState<GetPlacesParams>({
		page: 1,
		pageSize: 10,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const { data, isLoading } = useFetchPlaces(params);
	const {data:da}=useFetchPlaces(params)
	console.log(da, "daaaaaaaaaaaaataaaaaaaaaaaaaaaaa");
	

	const places = data?.items ?? [];
	const totalCount = data?.totalCount ?? 0;
	const currentPage = data?.currentPage ?? 1;
	const totalPages = Math.ceil(totalCount / PAGE_SIZE);

	const goToPage = (page: number) => setParams((prev) => ({ ...prev, page }));

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

	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="flex-grow py-12 px-6 md:px-12">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
								Explore Places in Dhaka
							</h1>
							<p className="text-slate-500">
								Discover {totalCount}+ cultural landmarks and hidden gems.
							</p>
						</div>

						<div className="flex items-center gap-3">
							{/* Search */}
							<input
								type="text"
								placeholder="Search places..."
								onChange={(e) => handleSearch(e.target.value)}
								className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
							/>

							{/* Sort */}
							<span className="text-sm text-slate-500 font-medium">
								Sort by:
							</span>
							<select
								onChange={(e) => handleSort(e.target.value)}
								className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
							>
								<option value="popular">Most Popular</option>
								<option value="newest">Newest</option>
								<option value="rating">Rating: High to Low</option>
							</select>
						</div>
					</div>

					<div className="flex gap-10">
						{/* Sidebar */}
						<FilterSidebar />

						{/* Content */}
						<div className="flex-grow">
							{/* Loading skeleton */}
							{isLoading ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{Array.from({ length: PAGE_SIZE }).map((_, i) => (
										<div
											key={`skeleton-${i}`}
											className="h-64 animate-pulse rounded-2xl bg-slate-200"
										/>
									))}
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{places.map(
										(place: {
											_id: string;
											name: string;
											category: string;
											location: string;
											rating?: number;
											detail?: string;
											gallery?: string[];
										}) => (
											<PlaceCard
												key={place._id.toString()}
												{...place}
												_id={place._id.toString()}
											/>
										),
									)}
								</div>
							)}

							{/* ── Pagination ─────────────────────────────────────────── */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-10 flex-wrap gap-4">
									<p className="text-sm text-slate-500">
										Showing{" "}
										<span className="font-semibold text-slate-700">
											{(currentPage - 1) * PAGE_SIZE + 1}–
											{Math.min(currentPage * PAGE_SIZE, totalCount)}
										</span>{" "}
										of{" "}
										<span className="font-semibold text-slate-700">
											{totalCount}
										</span>{" "}
										places
									</p>

									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => goToPage(currentPage - 1)}
											disabled={currentPage === 1}
											className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
										>
											← Previous
										</button>

										{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
											let page: number;
											if (totalPages <= 5) page = i + 1;
											else if (currentPage <= 3) page = i + 1;
											else if (currentPage >= totalPages - 2)
												page = totalPages - 4 + i;
											else page = currentPage - 2 + i;

											return (
												<button
													type="button"
													key={page}
													onClick={() => goToPage(page)}
													className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
														page === currentPage
															? "bg-blue-600 text-white shadow-sm"
															: "border border-slate-200 text-slate-600 hover:bg-slate-100"
													}`}
												>
													{page}
												</button>
											);
										})}

										<button
											type="button"
											onClick={() => goToPage(currentPage + 1)}
											disabled={currentPage === totalPages}
											className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
										>
											Next →
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

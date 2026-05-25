"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "@/components/appComponents/FilterSidebar";
import FilterDrawer from "@/components/appComponents/FilterDrawer";
import HospitalCard, {
	type HospitalCardProps,
} from "@/components/appComponents/HospitalCard";
import Pagination from "@/components/appComponents/Pagination";
import { useFetchHospitals } from "@/hooks/useHospitals";
import { HOSPITAL_TYPES } from "@/lib/hospitalTypes";

const DHAKA_AREAS = [
	"Adabor",
	"Agargaon",
	"Badda",
	"Banani",
	"Baridhara",
	"Bashabo",
	"Bashundhara",
	"Cantonment",
	"Dakshinkhan",
	"Demra",
	"Dhanmondi",
	"Farmgate",
	"Gendaria",
	"Gulshan",
	"Hazaribagh",
	"Jatrabari",
	"Kafrul",
	"Kalabagan",
	"Khilgaon",
	"Khilkhet",
	"Lalbagh",
	"Lalmatia",
	"Mirpur",
	"Mohakhali",
	"Mohammadpur",
	"Motijheel",
	"Mugda",
	"Old Dhaka",
	"Pallabi",
	"Rayer Bazar",
	"Rupnagar",
	"Shyamoli",
	"Tejgaon",
	"Uttara",
	"Wari",
];

const RATING_OPTIONS = [
	{ label: "4.5+ Stars", value: "4.5" },
	{ label: "4.0+ Stars", value: "4.0" },
	{ label: "3.5+ Stars", value: "3.5" },
];

const PAGE_SIZE = 10;

const ANIMAL_TYPES = ["Veterinary Hospital", "Animal Specialty Hospital", "Exotic Animal Hospital", "Equine Hospital", "Wildlife Hospital"];

const TYPE_OPTIONS = [...HOSPITAL_TYPES]
	.filter((t) => !ANIMAL_TYPES.includes(t))
	.map((t) => ({ label: t, value: t }));

export default function HospitalsPage() {
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState<"popular" | "rating_desc">("popular");
	const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedRating, setSelectedRating] = useState<string[]>([]);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const activeFilterCount =
		selectedAreas.length + selectedTypes.length + selectedRating.length;

	const minRating = selectedRating[0] ? Number(selectedRating[0]) : undefined;

	const { data, isLoading } = useFetchHospitals({
		page,
		pageSize: PAGE_SIZE,
		sortBy,
		areas: selectedAreas.length ? selectedAreas : undefined,
		types: selectedTypes.length ? selectedTypes : undefined,
		minRating,
	});

	console.log(data);
	

	const totalPages = Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE);

	const handleAreaChange = (v: string[]) => { setPage(1); setSelectedAreas(v); };
	const handleTypeChange = (v: string[]) => { setPage(1); setSelectedTypes(v); };
	const handleRatingChange = (v: string[]) => { setPage(1); setSelectedRating(v); };
	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPage(1);
		setSortBy(e.target.value as "popular" | "rating_desc");
	};

	const handleClearAll = () => {
		setPage(1);
		setSelectedAreas([]);
		setSelectedTypes([]);
		setSelectedRating([]);
	};

	const filterSections = [
		{
			title: "Area",
			multiSelect: true,
			options: DHAKA_AREAS.map((a) => ({ label: a, value: a })),
			selected: selectedAreas,
			onChange: handleAreaChange,
		},
		{
			title: "Category",
			multiSelect: true,
			options: TYPE_OPTIONS,
			selected: selectedTypes,
			onChange: handleTypeChange,
		},
		{
			title: "Rating",
			multiSelect: false,
			options: RATING_OPTIONS,
			selected: selectedRating,
			onChange: handleRatingChange,
		},
	];

	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
								Top Hospitals in Dhaka
							</h1>
							<p className="text-slate-500">
								Find the best healthcare facilities near you.
							</p>
						</div>

						<div className="flex items-center gap-3">						{/* Mobile filter button — hidden on lg+ */}
						<button
							type="button"
							onClick={() => setDrawerOpen(true)}
							className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
						>
							<SlidersHorizontal className="w-4 h-4" />
							Filters
							{activeFilterCount > 0 && (
								<span className="bg-blue-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
									{activeFilterCount}
								</span>
							)}
						</button>							<span className="text-sm text-slate-500 font-medium">
								Sort by:
							</span>
							<select
								value={sortBy}
								onChange={handleSortChange}
								className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
							>
								<option value="popular">Most Popular</option>
								<option value="rating_desc">Rating: High to Low</option>
							</select>
						</div>
					</div>

					{/* Mobile filter drawer */}
					<FilterDrawer
						open={drawerOpen}
						onClose={() => setDrawerOpen(false)}
						sections={filterSections}
						onClearAll={handleClearAll}
						activeFilterCount={activeFilterCount}
					/>

					<div className="flex gap-10">
						<FilterSidebar
							sections={filterSections}
							onClearAll={handleClearAll}
						/>
						<div className="grow">
							{isLoading ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{Array.from({ length: 6 }).map((_, i) => (
									<div
										key={`skeleton-${i}`}
										className="h-64 animate-pulse rounded-2xl bg-slate-200"
									/>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
									{data?.items?.map((item: HospitalCardProps) => (
										<HospitalCard key={item._id} {...item} />
									))}
								</div>
							)}
							<Pagination
								currentPage={page}
								totalPages={totalPages}
								onPageChange={setPage}
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

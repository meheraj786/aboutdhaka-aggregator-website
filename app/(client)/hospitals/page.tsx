"use client";
import FilterSidebar from "@/components/appComponents/FilterSidebar";
import HospitalCard, {
	type HospitalCardProps,
} from "@/components/appComponents/HospitalCard";
import Pagination from "@/components/appComponents/Pagination";
import { useFetchHospitals } from "@/hooks/useHospitals";

export default function HospitalsPage() {
	const { data, isLoading } = useFetchHospitals();
	console.log(data, "hospital data");

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

						<div className="flex items-center gap-3">
							<span className="text-sm text-slate-500 font-medium">
								Sort by:
							</span>
							<select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
								<option>Most Popular</option>
								<option>Rating: High to Low</option>
							</select>
						</div>
					</div>

					<div className="flex gap-10">
						<FilterSidebar />
						<div className="flex-grow">
							{isLoading ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{Array.from({ length: 4 }).map((_, i) => (
										<div
											key={`skeleton-${i}`}
											className="h-64 animate-pulse rounded-2xl bg-slate-200"
										/>
									))}
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{data?.items?.map((item: HospitalCardProps) => (
										<HospitalCard key={item._id} {...item} />
									))}
								</div>
							)}
							<Pagination />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

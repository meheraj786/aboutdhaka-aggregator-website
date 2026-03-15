import FilterSidebar from "@/components/appComponents/FilterSidebar";
import ListingCard from "@/components/appComponents/ListingCard";
import Pagination from "@/components/appComponents/Pagination";

const hospitalsData = [
	{
		title: "Evercare Hospital",
		category: "General",
		location: "Bashundhara R/A, Dhaka",
		rating: 4.7,
		description:
			"A multi-disciplinary super-specialty tertiary care hospital in Bangladesh.",
		image:
			"https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "United Hospital",
		category: "General",
		location: "Gulshan, Dhaka",
		rating: 4.6,
		description:
			"One of the leading private sector healthcare providers in Bangladesh.",
		image:
			"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Square Hospital",
		category: "Specialized",
		location: "Panthapath, Dhaka",
		rating: 4.8,
		description:
			"A tertiary care hospital that provides high-quality healthcare services.",
		image:
			"https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Labaid Specialized",
		category: "Cardiac",
		location: "Dhanmondi, Dhaka",
		rating: 4.5,
		description:
			"Specialized in cardiac care and other multi-disciplinary treatments.",
		image:
			"https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
	},
];

export default function HospitalsPage() {
	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
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
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{hospitalsData.map((item) => (
									<ListingCard key={item.title} {...item} />
								))}
							</div>
							<Pagination />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

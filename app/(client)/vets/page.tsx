import FilterSidebar from "@/components/appComponents/FilterSidebar";
import ListingCard from "@/components/appComponents/ListingCard";
import Pagination from "@/components/appComponents/Pagination";

const vetsData = [
	{
		title: "Central Veterinary Hospital",
		category: "General",
		location: "Bakshibazar, Dhaka",
		rating: 4.6,
		description:
			"The largest government-run veterinary hospital in the country.",
		image:
			"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Pet Care Center",
		category: "Private",
		location: "Dhanmondi, Dhaka",
		rating: 4.8,
		description:
			"A modern private clinic offering a wide range of services for pets.",
		image:
			"https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Animal Medical Center",
		category: "Specialized",
		location: "Gulshan, Dhaka",
		rating: 4.7,
		description:
			"Specialized medical care and surgery for all types of animals.",
		image:
			"https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Vet Care Clinic",
		category: "General",
		location: "Uttara, Dhaka",
		rating: 4.5,
		description: "Comprehensive veterinary services for your beloved pets.",
		image:
			"https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
	},
];

export default function VetsPage() {
	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
								Veterinary Services in Dhaka
							</h1>
							<p className="text-slate-500">
								Find the best care for your pets and animals.
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
								{vetsData.map((item) => (
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

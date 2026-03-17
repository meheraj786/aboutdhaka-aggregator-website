import FilterSidebar from "@/components/appComponents/FilterSidebar";
import ListingCard from "@/components/appComponents/ListingCard";
import Pagination from "@/components/appComponents/Pagination";
import PCBuilder from "@/components/appComponents/Pc-build";

const pcBuildData = [
	{
		title: "Star Tech",
		category: "Computer Shop",
		location: "Multiplan Center, Dhaka",
		rating: 4.8,
		description:
			"A leading computer shop in Bangladesh offering a wide range of PC components.",
		image:
			"https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Ryans Computers",
		category: "Computer Shop",
		location: "IDB Bhaban, Dhaka",
		rating: 4.7,
		description:
			"One of the largest retail chains for computer hardware and accessories.",
		image:
			"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Binary Logic",
		category: "Computer Shop",
		location: "Elephant Road, Dhaka",
		rating: 4.6,
		description: "Specialized in high-end PC builds and gaming peripherals.",
		image:
			"https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "TechLand",
		category: "Computer Shop",
		location: "Multiplan Center, Dhaka",
		rating: 4.5,
		description: "A popular destination for PC enthusiasts and gamers.",
		image:
			"https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
	},
];

export default function PCBuildPage() {
	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
								PC Build Shops in Dhaka
							</h1>
							<p className="text-slate-500">
								Build your dream PC with the best components and service.
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
								{pcBuildData.map((item) => (
									<ListingCard key={item.title} {...item} />
								))}
							</div>
							<Pagination />
						</div>
					</div>
				</div>
			</main>
			<PCBuilder />
		</div>
	);
}

import FilterSidebar from "@/components/appComponents/FilterSidebar";
import ListingCard from "@/components/appComponents/ListingCard";
import Pagination from "@/components/appComponents/Pagination";

const rentData = [
	{
		title: "Luxury Apartment",
		category: "Residential",
		location: "Gulshan 2, Dhaka",
		rating: 4.9,
		description:
			"A spacious 3-bedroom apartment with modern amenities and a great view.",
		image:
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Modern Studio",
		category: "Residential",
		location: "Banani, Dhaka",
		rating: 4.7,
		description: "A cozy studio apartment perfect for young professionals.",
		image:
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Office Space",
		category: "Commercial",
		location: "Motijheel, Dhaka",
		rating: 4.5,
		description:
			"A large office space in the heart of the commercial district.",
		image:
			"https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Family Home",
		category: "Residential",
		location: "Uttara, Dhaka",
		rating: 4.6,
		description: "A beautiful family home with a garden and parking space.",
		image:
			"https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800",
	},
];

export default function RentPage() {
	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
								Properties for Rent in Dhaka
							</h1>
							<p className="text-slate-500">
								Find your perfect home or office space.
							</p>
						</div>

						<div className="flex items-center gap-3">
							<span className="text-sm text-slate-500 font-medium">
								Sort by:
							</span>
							<select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
								<option>Most Popular</option>
								<option>Price: Low to High</option>
								<option>Price: High to Low</option>
							</select>
						</div>
					</div>

					<div className="flex gap-10">
						<FilterSidebar />
						<div className="flex-grow">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{rentData.map((item) => (
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

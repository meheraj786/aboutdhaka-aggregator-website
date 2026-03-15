import FilterSidebar from "@/components/appComponents/FilterSidebar";
import Pagination from "@/components/appComponents/Pagination";
import PlaceCard from "@/components/appComponents/PlaceCard";

const placesData = [
	{
		title: "Ahsan Manzil",
		category: "Museum",
		location: "Sadarghat, Dhaka",
		rating: 4.8,
		description:
			"The official residential palace and seat of the Nawab of Dhaka, a stunning example of Indo-Saracenic Revival...",
		image:
			"https://images.unsplash.com/photo-1590053419082-936306541334?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Lalbagh Fort",
		category: "Historical",
		location: "Lalbagh, Old Dhaka",
		rating: 4.7,
		description:
			"An incomplete 17th-century Mughal fort complex that stands as a symbol of Dhaka's rich imperial history.",
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg/1280px-%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg",
	},
	{
		title: "Hatirjheel",
		category: "Park",
		location: "Gulshan/Tejgaon",
		rating: 4.9,
		description:
			"A popular waterfront area for recreation, offering scenic boat rides and illuminated bridges at night.",
		image:
			"https://images.unsplash.com/photo-1623059528907-735992983794?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "National Museum",
		category: "Cultural",
		location: "Shahbagh, Dhaka",
		rating: 4.6,
		description:
			"Housing thousands of artifacts, this is the largest museum in Bangladesh, showcasing history and art.",
		image:
			"https://images.unsplash.com/photo-1590053419082-936306541334?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Ramna Park",
		category: "Park",
		location: "Ramna, Dhaka",
		rating: 4.5,
		description:
			"A large historical park and garden, famous for the annual Pohela Boishakh celebrations.",
		image:
			"https://images.unsplash.com/photo-1623059528929-417163013d33?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Jatiya Sangsad",
		category: "Architectural",
		location: "Sher-e-Bangla Nagar",
		rating: 4.9,
		description:
			"Louis Kahn's architectural masterpiece and the house of the Parliament of Bangladesh.",
		image:
			"https://images.unsplash.com/photo-1623059528929-417163013d33?auto=format&fit=crop&q=80&w=800",
	},
];

export default function page() {
	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="flex-grow py-12 px-6  md:px-12">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
								Explore Places in Dhaka
							</h1>
							<p className="text-slate-500">
								Discover 120+ cultural landmarks and hidden gems.
							</p>
						</div>

						<div className="flex items-center gap-3">
							<span className="text-sm text-slate-500 font-medium">
								Sort by:
							</span>
							<select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
								<option>Most Popular</option>
								<option>Newest</option>
								<option>Rating: High to Low</option>
							</select>
						</div>
					</div>

					<div className="flex gap-10">
						{/* Sidebar */}
						<FilterSidebar />

						{/* Content Grid */}
						<div className="flex-grow">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{placesData.map((place) => (
									<PlaceCard key={place.title} {...place} />
								))}
							</div>

							{/* Pagination */}
							<Pagination />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

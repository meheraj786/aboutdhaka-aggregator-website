import FilterSidebar from "@/components/appComponents/FilterSidebar";
import ListingCard from "@/components/appComponents/ListingCard";
import Pagination from "@/components/appComponents/Pagination";

const blogsData = [
	{
		title: "Exploring Old Dhaka",
		category: "Travel",
		location: "Old Dhaka",
		rating: 4.9,
		description:
			"A journey through the narrow streets and rich history of Old Dhaka.",
		image:
			"https://images.unsplash.com/photo-1590053419082-936306541334?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Top 10 Street Foods",
		category: "Food",
		location: "Dhaka City",
		rating: 4.8,
		description:
			"A guide to the most delicious and iconic street foods in Dhaka.",
		image:
			"https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Modern Architecture",
		category: "Architecture",
		location: "Dhaka City",
		rating: 4.7,
		description: "Discovering the modern architectural marvels of the city.",
		image:
			"https://images.unsplash.com/photo-1623059528929-417163013d33?auto=format&fit=crop&q=80&w=800",
	},
	{
		title: "Weekend Getaways",
		category: "Travel",
		location: "Near Dhaka",
		rating: 4.6,
		description: "The best places to escape the city for a quick weekend trip.",
		image:
			"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
	},
];

export default function BlogsPage() {
	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
								Dhaka City Blogs
							</h1>
							<p className="text-slate-500">
								Read the latest stories and guides about our city.
							</p>
						</div>

						<div className="flex items-center gap-3">
							<span className="text-sm text-slate-500 font-medium">
								Sort by:
							</span>
							<select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
								<option>Newest</option>
								<option>Most Popular</option>
							</select>
						</div>
					</div>

					<div className="flex gap-10">
						<FilterSidebar />
						<div className="flex-grow">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{blogsData.map((item) => (
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

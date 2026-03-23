import Image from "next/image";
import { SectionHeader } from "./SectionHeader";

const MALLS = [
	{
		id: "m1",
		name: "Jamuna Future Park",
		location: "Kuril, Dhaka",
		image: "https://picsum.photos/seed/jamuna/800/600",
	},
	{
		id: "m2",
		name: "Bashundhara City",
		location: "Panthapath, Dhaka",
		image: "https://picsum.photos/seed/bashundhara/800/600",
	},
	{
		id: "m3",
		name: "Police Plaza",
		location: "Gulshan, Dhaka",
		image: "https://picsum.photos/seed/police/800/600",
	},
	{
		id: "m4",
		name: "Shimanto Square",
		location: "Dhanmondi, Dhaka",
		image: "https://picsum.photos/seed/shimanto/800/600",
	},
];

export function ShoppingMallsSection() {
	return (
		<section className="py-16 px-4 max-w-7xl mx-auto">
			<SectionHeader
				title="Top Shopping Malls"
				viewAllText="See All"
				viewAllHref="/malls"
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{MALLS.map((mall) => (
					<div
						key={mall.id}
						className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer"
					>
						<Image
							src={mall.image}
							alt={mall.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-110"
							referrerPolicy="no-referrer"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
							<h3 className="text-white font-bold text-xl mb-1">{mall.name}</h3>
							<p className="text-white/70 text-sm">{mall.location}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

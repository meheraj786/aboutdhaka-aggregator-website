import Image from "next/image";
import { SectionHeader } from "./SectionHeader";

const RENTALS = [
	{
		id: "r1",
		title: "3BHK Apartment",
		location: "Banani, Dhaka",
		price: "45,000/mo",
		image: "https://picsum.photos/seed/apartment1/600/400",
	},
	{
		id: "r2",
		title: "Luxury Studio",
		location: "Gulshan 2, Dhaka",
		price: "60,000/mo",
		image: "https://picsum.photos/seed/apartment2/600/400",
	},
	{
		id: "r3",
		title: "2BHK Family Flat",
		location: "Dhanmondi 27, Dhaka",
		price: "32,000/mo",
		image: "https://picsum.photos/seed/apartment3/600/400",
	},
	{
		id: "r4",
		title: "Executive Suite",
		location: "Bashundhara R/A, Dhaka",
		price: "28,000/mo",
		image: "https://picsum.photos/seed/apartment4/600/400",
	},
];

export function RentalsSection() {
	return (
		<section className="py-16 px-4 max-w-7xl mx-auto">
			<SectionHeader
				title="Premium Rentals"
				subtitle="Handpicked residential listings for comfortable living"
				viewAllText="See Listings"
				viewAllHref="/rent"
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{RENTALS.map((rental) => (
					<div
						key={rental.id}
						className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
					>
						<div className="relative aspect-[3/2] w-full">
							<Image
								src={rental.image}
								alt={rental.title}
								fill
								className="object-cover"
								referrerPolicy="no-referrer"
							/>
						</div>
						<div className="p-6">
							<h3 className="text-lg font-bold text-slate-900 mb-1">
								{rental.title}
							</h3>
							<p className="text-slate-500 text-xs mb-4">{rental.location}</p>
							<div className="flex items-center gap-2">
								<div className="w-1 h-4 bg-blue-600 rounded-full"></div>
								<p className="text-blue-600 font-bold text-lg">
									{rental.price}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

"use client";

import {
	Bath,
	Bed,
	Filter,
	Home,
	MapPin,
	Maximize,
	Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RENTALS } from "@/lib/data";

export default function RentalsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedType, setSelectedType] = useState("All");

	const rentalTypes = [
		"All",
		"Flat",
		"Apartment",
		"Room",
		"Sublet",
		"Store",
		"Bachelor Seat",
	];

	const filteredRentals = RENTALS.filter((rental) => {
		const matchesSearch =
			rental.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			rental.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			rental.area.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = selectedType === "All" || rental.type === selectedType;
		return matchesSearch && matchesType;
	});

	return (
		<main className="min-h-screen bg-slate-50 pt-24 pb-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-10">
					<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
						Rentals in Dhaka
					</h1>
					<h3 className="text-lg text-slate-600">
						Find your next home, room, or store in the city&apos;s best
						locations.
					</h3>
				</div>

				{/* Filters & Search */}
				<div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
					<div className="relative w-full md:w-96">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search by area or title..."
							className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
						<Filter className="text-slate-400 w-5 h-5 flex-shrink-0" />
						{rentalTypes.map((type) => (
							<button
								type="button"
								key={type}
								onClick={() => setSelectedType(type)}
								className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
									selectedType === type
										? "bg-blue-600 text-white shadow-md"
										: "bg-slate-100 text-slate-600 hover:bg-slate-200"
								}`}
							>
								{type}
							</button>
						))}
					</div>
				</div>

				{/* Rentals Grid */}
				{filteredRentals.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredRentals.map((rental) => (
							<Link
								key={rental.id}
								href={`/rent/${rental.id}`}
								className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
							>
								<div className="relative h-56 w-full overflow-hidden">
									<Image
										src={rental.images[0]}
										alt={rental.title}
										fill
										className="object-cover group-hover:scale-110 transition-transform duration-500"
										referrerPolicy="no-referrer"
									/>
									<div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
										{rental.type}
									</div>
									<div className="absolute bottom-4 left-4 right-4">
										<div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/20">
											<div className="text-white font-bold text-lg">
												৳{rental.price.toLocaleString()}{" "}
												<span className="text-xs font-normal opacity-80">
													/ month
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="p-5 flex-grow flex flex-col">
									<div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-2">
										<MapPin className="w-3 h-3" />
										{rental.area}, Dhaka
									</div>
									<h3 className="text-slate-800 font-bold text-lg leading-tight mb-3 group-hover:text-blue-600 transition-colors">
										{rental.title}
									</h3>

									<div className="flex items-center gap-4 mb-4 text-slate-500 text-sm">
										{rental.bedrooms && (
											<div className="flex items-center gap-1">
												<Bed className="w-4 h-4" />
												<span>{rental.bedrooms} Bed</span>
											</div>
										)}
										{rental.bathrooms && (
											<div className="flex items-center gap-1">
												<Bath className="w-4 h-4" />
												<span>{rental.bathrooms} Bath</span>
											</div>
										)}
										{rental.size && (
											<div className="flex items-center gap-1">
												<Maximize className="w-4 h-4" />
												<span>{rental.size} sqft</span>
											</div>
										)}
									</div>

									<p className="text-slate-600 text-sm line-clamp-2 mb-6">
										{rental.description}
									</p>

									<div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
										<span className="text-xs text-slate-400 font-medium">
											Posted on {new Date(rental.postedAt).toLocaleDateString()}
										</span>
										<span className="text-blue-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
											View Details →
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
						<Home className="w-16 h-16 text-slate-200 mx-auto mb-4" />
						<h3 className="text-xl font-bold text-slate-800">
							No rentals found
						</h3>
						<p className="text-slate-500">
							Try adjusting your filters or search query.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}

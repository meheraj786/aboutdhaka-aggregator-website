"use client";

import {
	ChevronDown,
	Coffee,
	Dumbbell,
	Heart,
	Map as MapIcon,
	Search,
	SlidersHorizontal,
	Star,
	Waves,
	Wifi,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import Pagination from "@/components/appComponents/Pagination";

const hotelsData = [
	{
		id: 1,
		name: "Pan Pacific Sonargaon",
		location: "Karwan Bazar, Dhaka",
		rating: 4.8,
		price: "18,500",
		image:
			"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
		featured: true,
		amenities: ["wifi", "pool", "gym", "parking"],
	},
	{
		id: 2,
		name: "Radisson Blu Dhaka",
		location: "Cantonment Area, Dhaka",
		rating: 4.7,
		price: "22,000",
		image:
			"https://images.unsplash.com/photo-1551882547-ff43c63efe81?auto=format&fit=crop&q=80&w=800",
		featured: false,
		amenities: ["wifi", "breakfast", "restaurant", "pool"],
	},
	{
		id: 3,
		name: "InterContinental Dhaka",
		location: "Shahbagh, Dhaka",
		rating: 4.9,
		price: "25,000",
		image:
			"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
		featured: false,
		amenities: ["wifi", "pool", "spa", "bar"],
	},
	{
		id: 4,
		name: "The Westin Dhaka",
		location: "Gulshan-2, Dhaka",
		rating: 4.6,
		price: "20,000",
		image:
			"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
		featured: false,
		amenities: ["wifi", "restaurant", "gym", "parking"],
	},
];

interface AmenityIconProps {
	type: string;
}

const AmenityIcon: React.FC<AmenityIconProps> = ({ type }) => {
	switch (type) {
		case "wifi":
			return <Wifi className="w-4 h-4" />;
		case "pool":
			return <Waves className="w-4 h-4" />;
		case "gym":
			return <Dumbbell className="w-4 h-4" />;
		case "breakfast":
			return <Coffee className="w-4 h-4" />;
		default:
			return null;
	}
};

export default function HotelsPage() {
	const [priceRange, setPriceRange] = useState(50000);

	return (
		<div className="min-h-screen bg-slate-50/30 flex flex-col">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col lg:flex-row gap-10">
						{/* Sidebar Filters */}
						<aside className="w-full lg:w-72 flex-shrink-0">
							<div className="bg-white border border-slate-100 rounded-[2rem] p-8 sticky top-6 shadow-sm">
								<div className="flex items-center gap-2 mb-8">
									<SlidersHorizontal className="w-5 h-5 text-blue-600" />
									<h2 className="font-bold text-slate-900 text-lg">Filters</h2>
								</div>

								{/* Area Filter */}
								<div className="mb-10">
									<h3 className="text-sm font-bold text-slate-900 mb-5">
										Area / Location
									</h3>
									<div className="space-y-4">
										{["Gulshan", "Dhanmondi", "Banani", "Uttara"].map(
											(area) => (
												<label
													key={area}
													className="flex items-center gap-3 cursor-pointer group"
												>
													<div className="relative flex items-center">
														<input
															type="checkbox"
															defaultChecked={area === "Dhanmondi"}
															className="peer w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
														/>
													</div>
													<span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
														{area}
													</span>
												</label>
											),
										)}
									</div>
								</div>

								{/* Price Range */}
								<div className="mb-10">
									<h3 className="text-sm font-bold text-slate-900 mb-5">
										Price Range (BDT)
									</h3>
									<input
										type="range"
										min="2000"
										max="50000"
										value={priceRange}
										onChange={(e) =>
											setPriceRange(parseInt(e.target.value || "2", 10))
										}
										className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
									/>
									<div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										<span>2,000</span>
										<span>50,000</span>
									</div>
								</div>

								{/* Star Rating */}
								<div className="mb-10">
									<h3 className="text-sm font-bold text-slate-900 mb-5">
										Star Rating
									</h3>
									<div className="space-y-4">
										{[5, 4].map((stars) => (
											<label
												key={stars}
												className="flex items-center gap-3 cursor-pointer group"
											>
												<input
													type="checkbox"
													className="w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
												/>
												<div className="flex items-center gap-0.5">
													{[1, 2, 3, 4, 5].map((star, i) => (
														<Star
															key={star}
															className={`w-3.5 h-3.5 ${i < stars ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`}
														/>
													))}{" "}
													{stars === 4 && (
														<span className="text-xs text-slate-400 ml-1">
															& up
														</span>
													)}
												</div>
											</label>
										))}
									</div>
								</div>

								{/* Amenities */}
								<div>
									<h3 className="text-sm font-bold text-slate-900 mb-5">
										Amenities
									</h3>
									<div className="space-y-4">
										{["Free WiFi", "Swimming Pool", "Gym", "Breakfast"].map(
											(amenity) => (
												<label
													key={amenity}
													className="flex items-center gap-3 cursor-pointer group"
												>
													<input
														type="checkbox"
														className="w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
													/>
													<span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
														{amenity}
													</span>
												</label>
											),
										)}
									</div>
								</div>
							</div>
						</aside>

						{/* Main Content */}
						<div className="flex-grow">
							{/* Search and Sort */}
							<div className="flex flex-col md:flex-row gap-4 mb-10">
								<div className="relative flex-grow">
									<div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
										<Search className="w-5 h-5" />
									</div>
									<input
										type="text"
										placeholder="Search hotels by name or location"
										className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
									/>
								</div>
								<div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm min-w-[240px]">
									<span className="text-sm text-slate-400 font-medium whitespace-nowrap">
										Sort by:
									</span>
									<select className="flex-grow bg-transparent font-bold text-slate-900 text-sm focus:outline-none appearance-none cursor-pointer">
										<option>Recommended</option>
										<option>Price: Low to High</option>
										<option>Rating: High to Low</option>
									</select>
									<ChevronDown className="w-4 h-4 text-slate-400" />
								</div>
							</div>

							{/* Hotel Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
								{hotelsData.map((hotel) => (
									<div
										key={hotel.id}
										className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
									>
										<div className="relative h-64 w-full">
											<Image
												src={hotel.image}
												alt={hotel.name}
												fill
												className="object-cover transition-transform duration-700 group-hover:scale-105"
												referrerPolicy="no-referrer"
											/>
											<button
												type="button"
												className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
											>
												<Heart className="w-5 h-5" />
											</button>
											{hotel.featured && (
												<div className="absolute bottom-6 left-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg tracking-wider uppercase">
													Featured
												</div>
											)}
										</div>

										<div className="p-8">
											<div className="flex justify-between items-start mb-4">
												<div>
													<h3 className="text-xl font-bold text-slate-900 mb-1">
														{hotel.name}
													</h3>
													<div className="flex items-center gap-1.5 text-slate-400 text-sm">
														<MapIcon className="w-3.5 h-3.5" />
														{hotel.location}
													</div>
												</div>
												<div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
													<span className="text-sm font-bold text-emerald-600">
														{hotel.rating}
													</span>
													<Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
												</div>
											</div>

											<div className="flex gap-4 text-slate-300 mb-8">
												{hotel.amenities.map((amenity) => (
													<AmenityIcon key={amenity} type={amenity} />
												))}
											</div>

											<div className="flex items-center justify-between pt-6 border-t border-slate-50">
												<div>
													<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
														Starting from
													</span>
													<div className="flex items-baseline gap-1">
														<span className="text-2xl font-black text-blue-600">
															৳{hotel.price}
														</span>
														<span className="text-sm text-slate-400 font-medium">
															/night
														</span>
													</div>
												</div>
												<button
													type="button"
													className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 text-sm"
												>
													Book Now
												</button>
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Pagination */}
							<Pagination />

							{/* Map CTA Section */}
							<div className="mt-20 relative rounded-[3rem] overflow-hidden h-[400px] group">
								<Image
									src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1920"
									alt="Dhaka Map"
									fill
									className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
									referrerPolicy="no-referrer"
								/>
								<div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-900/40 flex items-center p-12 md:p-20">
									<div className="max-w-md">
										<h2 className="text-4xl font-black text-white mb-6 leading-tight">
											Prefer a Map View?
										</h2>
										<p className="text-blue-50 text-lg mb-10 leading-relaxed">
											Browse all available hotels in Dhaka using our interactive
											map. Find properties near the airport or in the heart of
											the city.
										</p>
										<button
											type="button"
											className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-blue-50 transition-all shadow-xl"
										>
											<MapIcon className="w-5 h-5" />
											Open Interactive Map
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

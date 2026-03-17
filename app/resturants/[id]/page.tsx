"use client";

import {
	Camera,
	Car,
	Heart,
	MapPin,
	Share2,
	Star,
	Utensils,
	Wifi,
	Wind,
} from "lucide-react";
import Image from "next/image";

const gallery = [
	"https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400",
	"https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=400",
	"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
];

const menuHighlights = [
	{
		name: "Burrata with Heirloom Tomatoes",
		category: "STARTERS",
		price: "1,450",
		desc: "Creamy burrata, basil pesto, balsamic glaze",
	},
	{
		name: "Calamari Fritti",
		category: "STARTERS",
		price: "1,150",
		desc: "Crispy squid with spicy marinara dip",
	},
	{
		name: "Wagyu Ribeye Steak",
		category: "MAIN COURSE",
		price: "4,200",
		desc: "Grade 7 Wagyu, garlic mash, red wine jus",
	},
	{
		name: "Seafood Risotto",
		category: "MAIN COURSE",
		price: "2,800",
		desc: "Saffron infused arborio, prawns, scallops",
	},
];

const amenities = [
	{ icon: Wifi, label: "Free WiFi" },
	{ icon: Car, label: "Parking" },
	{ icon: Wind, label: "Outdoor" },
	{ icon: Utensils, label: "Fully AC" },
];

export default function RestaurantDetailPage() {
	return (
		<div className="min-h-screen bg-slate-50/30 pb-20">
			{/* Hero Section */}
			<div className="relative h-[600px] w-full">
				<Image
					src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920"
					alt="The Glasshouse Brasserie"
					fill
					className="object-cover"
					referrerPolicy="no-referrer"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

				<div className="absolute top-8 right-8 flex gap-3">
					<button
						type="button"
						className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
					>
						<Share2 className="w-5 h-5" />
					</button>
					<button
						type="button"
						className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
					>
						<Heart className="w-5 h-5" />
					</button>
				</div>

				<div className="absolute bottom-16 left-6 md:left-12 lg:left-24 max-w-4xl">
					<div className="flex gap-2 mb-6">
						<span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider">
							Fine Dining
						</span>
						<span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider">
							Italian Cuisine
						</span>
					</div>
					<h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
						The Glasshouse Brasserie
					</h1>
					<div className="flex flex-wrap items-center gap-6 text-blue-50/80 font-bold">
						<div className="flex items-center gap-2">
							<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
							<span>4.8 (1.2k reviews)</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin className="w-5 h-5" />
							<span>Gulshan 2, Dhaka</span>
						</div>
						<div className="flex items-center gap-2">
							<Utensils className="w-5 h-5" />
							<span>$$$ (Premium)</span>
						</div>
						<div className="flex items-center gap-2 text-emerald-400">
							<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
							<span>Open Now</span>
						</div>
					</div>
				</div>
			</div>

			{/* Action Bar */}
			<div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
				<div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-4">
					<button
						type="button"
						className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
					>
						<Utensils className="w-5 h-5" />
						Book a Table
					</button>
					<button
						type="button"
						className="w-full md:w-auto bg-blue-50 hover:bg-blue-100 text-blue-600 font-black px-12 py-5 rounded-2xl transition-all flex items-center justify-center gap-3"
					>
						<Camera className="w-5 h-5" />
						Order Online
					</button>
					<button
						type="button"
						className="w-full md:w-auto bg-slate-50 hover:bg-slate-100 text-slate-900 font-black px-12 py-5 rounded-2xl transition-all border border-slate-100 flex items-center justify-center gap-3"
					>
						<MapPin className="w-5 h-5" />
						Get Directions
					</button>
				</div>
			</div>

			{/* Content Grid */}
			<div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
				{/* Left Column */}
				<div className="lg:col-span-8 space-y-20">
					{/* About */}
					<section>
						<h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
							About the Experience
						</h2>
						<p className="text-slate-500 text-xl leading-relaxed font-medium">
							Experience culinary artistry in the heart of Dhaka. The Glasshouse
							Brasserie offers a sophisticated urban retreat featuring
							floor-to-ceiling glass walls and an open kitchen. Our signature{" "}
							<span className="text-blue-600 font-bold">
								Truffle Infused Tagliatelle
							</span>{" "}
							and{" "}
							<span className="text-blue-600 font-bold">
								Oak-Smoked Sea Bass
							</span>{" "}
							are crafted using locally sourced ingredients and authentic
							Italian techniques.
						</p>
					</section>

					{/* Gallery */}
					<section>
						<div className="flex items-center justify-between mb-8">
							<h2 className="text-3xl font-black text-slate-900 tracking-tight">
								Food Gallery
							</h2>
							<button
								type="button"
								className="text-blue-600 font-bold hover:underline"
							>
								View All
							</button>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{gallery.map((img) => (
								<div
									key={img}
									className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg shadow-slate-200"
								>
									<Image
										src={img}
										alt="Food"
										fill
										className="object-cover group-hover:scale-110 transition-transform duration-700"
										referrerPolicy="no-referrer"
									/>
									<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
							))}
						</div>
					</section>

					{/* Menu Highlights */}
					<section>
						<h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">
							Menu Highlights
						</h2>
						<div className="space-y-12">
							{["STARTERS", "MAIN COURSE"].map((cat) => (
								<div key={cat}>
									<h3 className="text-blue-600 font-black text-xs tracking-[0.2em] mb-8 border-b border-blue-100 pb-4 uppercase">
										{cat}
									</h3>
									<div className="space-y-8">
										{menuHighlights
											.filter((item) => item.category === cat)
											.map((item) => (
												<div
													key={item.name}
													className="flex justify-between items-start group"
												>
													<div className="space-y-1">
														<h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
															{item.name}
														</h4>
														<p className="text-slate-400 text-sm">
															{item.desc}
														</p>
													</div>
													<span className="text-xl font-black text-slate-900 flex items-center gap-1">
														<span className="text-slate-300 text-sm">৳</span>{" "}
														{item.price}
													</span>
												</div>
											))}
									</div>
								</div>
							))}
							<button
								type="button"
								className="w-full py-5 rounded-2xl border-2 border-slate-100 text-slate-900 font-black hover:bg-slate-50 transition-all"
							>
								View Full Menu
							</button>
						</div>
					</section>

					{/* Reviews */}
					<section>
						<h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">
							Customer Reviews
						</h2>
						<div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
							<div className="flex items-center gap-6 mb-8">
								<div className="relative w-16 h-16 rounded-2xl overflow-hidden">
									<Image
										src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
										alt="User"
										fill
										className="object-cover"
									/>
								</div>
								<div>
									<h4 className="text-lg font-black text-slate-900">
										Anika Rahman
									</h4>
									<div className="flex gap-0.5 mt-1">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"
											/>
										))}{" "}
									</div>
								</div>
								<span className="ml-auto text-slate-400 text-xs font-bold">
									2 days ago
								</span>
							</div>
							<p className="text-slate-600 text-lg leading-relaxed italic">
								"The ambiance is unmatched in Dhaka. The steak was cooked to
								perfection and the service was impeccable. Truly a premium
								experience!"
							</p>
						</div>
					</section>
				</div>

				{/* Right Column */}
				<div className="lg:col-span-4 space-y-12">
					{/* Location Sidebar */}
					<section className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
						<div className="relative h-64 bg-slate-100 flex items-center justify-center group cursor-pointer">
							<div className="absolute inset-0 bg-blue-500/5" />
							<div className="relative z-10 flex flex-col items-center gap-4">
								<div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
									<MapPin className="w-7 h-7" />
								</div>
								<span className="font-black text-slate-900">Open in Maps</span>
							</div>
						</div>
						<div className="p-10 space-y-10">
							<div>
								<h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
									Location
								</h3>
								<p className="text-slate-600 font-bold leading-relaxed">
									Plot 14, Road 53, Gulshan 2 Circle, Dhaka 1212, Bangladesh
								</p>
							</div>

							<div>
								<h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
									Amenities
								</h3>
								<div className="grid grid-cols-2 gap-6">
									{amenities.map((item) => (
										<div key={item.label} className="flex items-center gap-3">
											<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
												<item.icon className="w-5 h-5" />
											</div>
											<span className="text-sm font-bold text-slate-600">
												{item.label}
											</span>
										</div>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
									Opening Hours
								</h3>
								<div className="space-y-4">
									{[
										{ days: "Mon - Thu", time: "12:00 PM - 11:00 PM" },
										{
											days: "Fri - Sat",
											time: "12:00 PM - 12:00 AM",
											active: true,
										},
										{ days: "Sunday", time: "01:00 PM - 10:00 PM" },
									].map((item) => (
										<div
											key={item.days}
											className="flex justify-between text-sm"
										>
											<span className="text-slate-500 font-bold">
												{item.days}
											</span>
											<span
												className={`font-black ${item.active ? "text-blue-600" : "text-slate-900"}`}
											>
												{item.time}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

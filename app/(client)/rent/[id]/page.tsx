"use client";

import {
	ArrowRight,
	Bath,
	Bed,
	Bookmark,
	Calendar,
	CheckCircle2,
	ChevronLeft,
	Home,
	Info,
	MapPin,
	Maximize,
	Phone,
	Share2,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { RENTALS } from "@/lib/data";

export default function RentalDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const rental = RENTALS.find((r) => r.id === id);
	const [activeTab, setActiveTab] = useState("Overview");

	if (!rental) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50 pt-24">
				<div className="text-center">
					<Home className="w-16 h-16 text-slate-200 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-slate-800">
						Rental Not Found
					</h1>
					<p className="text-slate-500 mb-6">
						The rental listing you are looking for doesn&apos;t exist.
					</p>
					<Link
						href="/rent"
						className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
					>
						<ChevronLeft className="w-5 h-5" />
						Back to Rentals
					</Link>
				</div>
			</div>
		);
	}

	const nearbyRentals = RENTALS.filter(
		(r) => r.id !== id && r.area === rental.area,
	).slice(0, 2);

	return (
		<main className="min-h-screen bg-slate-50 pb-16">
			{/* Hero Section */}
			<div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
				<Image
					src={rental.images[0]}
					alt={rental.title}
					fill
					className="object-cover"
					priority
					referrerPolicy="no-referrer"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

				<div className="absolute top-24 left-4 sm:left-8">
					<Link
						href="/rent"
						className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all border border-white/20"
					>
						<ChevronLeft className="w-4 h-4" />
						Back to Rentals
					</Link>
				</div>

				<div className="absolute bottom-8 left-4 right-4 sm:left-8 sm:right-8 max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
						<div className="space-y-4 max-w-2xl">
							<div className="flex flex-wrap items-center gap-3">
								<span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
									{rental.type}
								</span>
								<div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
									<Calendar className="w-3 h-3" />
									Posted on {new Date(rental.postedAt).toLocaleDateString()}
								</div>
							</div>
							<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
								{rental.title}
							</h1>
							<div className="flex items-center gap-2 text-white/80 text-lg">
								<MapPin className="w-5 h-5 text-blue-400" />
								{rental.location}
							</div>
						</div>

						<div className="flex items-center gap-3">
							<button
								type="button"
								className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all border border-white/20"
							>
								<Share2 className="w-5 h-5" />
							</button>
							<button
								type="button"
								className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all border border-white/20"
							>
								<Bookmark className="w-5 h-5" />
							</button>
							<div className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 text-center">
								<div className="text-2xl">৳{rental.price.toLocaleString()}</div>
								<div className="text-xs opacity-80 font-normal">per month</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					{/* Left Column: Details */}
					<div className="lg:col-span-2 space-y-12">
						{/* Stats Grid */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
								<Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
								<p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
									Type
								</p>
								<p className="text-slate-800 font-bold">{rental.type}</p>
							</div>
							{rental.bedrooms && (
								<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
									<Bed className="w-6 h-6 text-blue-600 mx-auto mb-2" />
									<p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
										Bedrooms
									</p>
									<p className="text-slate-800 font-bold">{rental.bedrooms}</p>
								</div>
							)}
							{rental.bathrooms && (
								<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
									<Bath className="w-6 h-6 text-blue-600 mx-auto mb-2" />
									<p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
										Bathrooms
									</p>
									<p className="text-slate-800 font-bold">{rental.bathrooms}</p>
								</div>
							)}
							{rental.size && (
								<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
									<Maximize className="w-6 h-6 text-blue-600 mx-auto mb-2" />
									<p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
										Size
									</p>
									<p className="text-slate-800 font-bold">{rental.size} sqft</p>
								</div>
							)}
						</div>

						{/* Tabs */}
						<div className="flex items-center gap-8 border-b border-slate-200 overflow-x-auto pb-1">
							{["Overview", "Amenities", "Gallery"].map((tab) => (
								<button
									type="button"
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
										activeTab === tab
											? "text-blue-600"
											: "text-slate-400 hover:text-slate-600"
									}`}
								>
									{tab}
									{activeTab === tab && (
										<motion.div
											layoutId="activeTab"
											className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
										/>
									)}
								</button>
							))}
						</div>

						{activeTab === "Overview" && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="space-y-10"
							>
								<div className="space-y-4">
									<h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
										<Info className="w-6 h-6 text-blue-600" />
										Description
									</h2>
									<p className="text-slate-600 text-lg leading-relaxed">
										{rental.description}
									</p>
								</div>
							</motion.div>
						)}

						{activeTab === "Amenities" && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="grid grid-cols-2 sm:grid-cols-3 gap-4"
							>
								{rental.amenities.map((amenity) => (
									<div
										key={amenity}
										className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3"
									>
										<div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
											<CheckCircle2 className="w-4 h-4 text-blue-600" />
										</div>
										<h4 className="font-bold text-slate-800 text-sm">
											{amenity}
										</h4>
									</div>
								))}
							</motion.div>
						)}

						{activeTab === "Gallery" && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="grid grid-cols-1 sm:grid-cols-2 gap-4"
							>
								{rental.images.map((img, idx) => (
									<div
										key={img}
										className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
									>
										<Image
											src={img}
											alt={`${rental.title} gallery ${idx + 1}`}
											fill
											className="object-cover group-hover:scale-110 transition-transform duration-500"
											referrerPolicy="no-referrer"
										/>
										<div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
									</div>
								))}
							</motion.div>
						)}
					</div>

					{/* Right Column: Sidebar */}
					<div className="space-y-8">
						{/* Quick Info Card */}
						<div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
							<div className="bg-slate-900 p-6 text-white">
								<h3 className="text-xl font-bold">Contact Owner</h3>
								<p className="text-slate-400 text-sm mt-1">
									Get in touch to view the property
								</p>
							</div>
							<div className="p-6 space-y-6">
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
										<Phone className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
											Phone Number
										</p>
										<p className="text-slate-700 font-medium">
											{rental.contact}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
										<MapPin className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
											Location
										</p>
										<p className="text-slate-700 font-medium">
											{rental.location}
										</p>
									</div>
								</div>

								<button
									type="button"
									className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
								>
									Call Now
								</button>
								<button
									type="button"
									className="w-full bg-slate-100 text-slate-800 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
								>
									Send Message
								</button>
							</div>
						</div>

						{/* Nearby Rentals */}
						{nearbyRentals.length > 0 && (
							<div className="space-y-4">
								<h3 className="text-xl font-bold text-slate-800">
									Nearby Rentals
								</h3>
								<div className="space-y-4">
									{nearbyRentals.map((r) => (
										<Link
											key={r.id}
											href={`/rent/${r.id}`}
											className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group"
										>
											<div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
												<Image
													src={r.images[0]}
													alt={r.title}
													fill
													className="object-cover"
													referrerPolicy="no-referrer"
												/>
											</div>
											<div className="flex-grow">
												<h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
													{r.title}
												</h4>
												<div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
													<span className="text-blue-600 font-bold">
														৳{r.price.toLocaleString()}
													</span>
													<span>• {r.area}</span>
												</div>
											</div>
											<ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}

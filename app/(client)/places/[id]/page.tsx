"use client";

import {
	CheckCircle2,
	ChevronRight,
	Clock,
	CreditCard,
	Heart,
	Info,
	MapPin,
	Phone,
	Share2,
	Star,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetchPlaceById } from "@/hooks/usePlaces";
import { PLACES } from "@/lib/data";

export default function PlaceDetailPage() {
	const params = useParams();
	const place = PLACES.find((p) => p.id === params.id);
	const { data } = useFetchPlaceById(params.id as string);
	console.log(data, "data");

	return (
		<div className="min-h-screen bg-white">
			<main>
				{/* Hero Section */}
				<section className="relative h-[60vh] min-h-[400px] w-full">
					<Image
						src={data?.gallery[0] || ""}
						alt={data?.name || ""}
						fill
						className="object-cover"
						priority
						referrerPolicy="no-referrer"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

					<div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
						<div className="max-w-7xl mx-auto">
							<div className="flex flex-wrap items-center gap-2 mb-4">
								<Link
									href="/"
									className="text-white/80 hover:text-white text-sm"
								>
									Home
								</Link>
								<ChevronRight className="w-3 h-3 text-white/60" />
								<Link
									href="/places"
									className="text-white/80 hover:text-white text-sm"
								>
									Places
								</Link>
								<ChevronRight className="w-3 h-3 text-white/60" />
								<span className="text-white text-sm font-bold">
									{data?.name}
								</span>
							</div>

							<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
								<div>
									<div className="flex items-center gap-3 mb-4">
										<span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md tracking-widest uppercase">
											{data?.category}
										</span>
										<div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
											<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
											<span className="text-xs font-bold">
												{data?.rating} ({data?.reviews} reviews)
											</span>
										</div>
									</div>
									<h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
										{data?.name}
									</h1>
									<p className="text-white/90 flex items-center gap-2 text-lg">
										<MapPin className="w-5 h-5 text-blue-400" />{" "}
										{data?.location}
									</p>
								</div>

								<div className="flex items-center gap-4">
									<button
										type="button"
										className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white hover:bg-white/20 transition-all"
									>
										<Share2 className="w-5 h-5" />
									</button>
									<button
										type="button"
										className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white hover:bg-white/20 transition-all"
									>
										<Heart className="w-5 h-5" />
									</button>
									<button
										type="button"
										className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30"
									>
										Get Directions
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Content Section */}
				<section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
					<div className="flex flex-col lg:flex-row gap-16">
						{/* Left Column: Details */}
						<div className="flex-grow space-y-12">
							<div>
								<h2 className="text-3xl font-bold text-slate-900 mb-6">
									About this place
								</h2>
								<p className="text-slate-600 text-lg leading-relaxed">
									{data?.detail}
								</p>
							</div>

							<div>
								<h3 className="text-2xl font-bold text-slate-900 mb-6">
									Facilities & Features
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{data?.facilities.map((facility: string) => (
										<div
											key={facility}
											className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl"
										>
											<CheckCircle2 className="w-5 h-5 text-blue-600" />
											<span className="text-slate-700 font-medium">
												{facility}
											</span>
										</div>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-2xl font-bold text-slate-900 mb-6">
									Photo Gallery
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									{data?.gallery.map((img: string, idx: number) => (
										<motion.div
											key={img}
											initial={{ opacity: 0, y: 20 }}
											whileInView={{ opacity: 1, y: 0 }}
											transition={{ delay: idx * 0.1 }}
											className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
										>
											<Image
												src={img}
												alt={`${place?.name} Gallery ${idx + 1}`}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-110"
												referrerPolicy="no-referrer"
											/>
										</motion.div>
									))}
								</div>
							</div>
						</div>

						{/* Right Column: Quick Info */}
						<aside className="w-full lg:w-96 flex-shrink-0">
							<div className="bg-slate-50 rounded-[32px] p-8 space-y-8 sticky top-28">
								<h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
									<Info className="w-5 h-5 text-blue-600" /> Quick Information
								</h3>

								<div className="space-y-6">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
											<Clock className="w-5 h-5 text-slate-400" />
										</div>
										<div>
											<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
												Opening Hours
											</p>
											<p className="text-slate-700 font-medium">
												{data?.openingHours}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
											<CreditCard className="w-5 h-5 text-slate-400" />
										</div>
										<div>
											<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
												Entry Fee
											</p>
											<p className="text-slate-700 font-medium">
												{data?.entryFee}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
											<Phone className="w-5 h-5 text-slate-400" />
										</div>
										<div>
											<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
												Contact
											</p>
											<p className="text-slate-700 font-medium">
												{data?.contact}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
											<MapPin className="w-5 h-5 text-slate-400" />
										</div>
										<div>
											<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
												Area
											</p>
											<p className="text-slate-700 font-medium">
												{data?.area?.name}
											</p>
										</div>
									</div>
								</div>

								<div className="pt-8 border-t border-slate-200">
									<div className="bg-white p-4 rounded-2xl shadow-sm">
										<div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm italic">
											Interactive Map Placeholder
										</div>
										<button
											type="button"
											className="w-full mt-4 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all"
										>
											Open in Google Maps
										</button>
									</div>
								</div>
							</div>
						</aside>
					</div>
				</section>

				{/* Nearby Places */}
				<section className="bg-slate-50 py-20 px-4">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-end justify-between mb-12">
							<div>
								<h2 className="text-3xl font-bold text-slate-900">
									Nearby Places
								</h2>
								<p className="text-slate-500 mt-2">
									Explore other interesting spots in {place?.area}.
								</p>
							</div>
							<Link
								href="/places"
								className="text-blue-600 font-bold hover:underline"
							>
								View All
							</Link>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{PLACES.filter((p) => p.id !== place?.id)
								.slice(0, 3)
								.map((nearby) => (
									<Link
										key={nearby.id}
										href={`/places/${nearby.id}`}
										className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
									>
										<div className="relative aspect-[16/10] w-full overflow-hidden">
											<Image
												src={nearby.image}
												alt={nearby.name}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
												referrerPolicy="no-referrer"
											/>
										</div>
										<div className="p-6">
											<h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
												{nearby.name}
											</h3>
											<p className="text-slate-400 text-sm flex items-center gap-1">
												<MapPin className="w-3 h-3" /> {nearby.location}
											</p>
										</div>
									</Link>
								))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

"use client";

import {
	CheckCircle2,
	ChevronRight,
	Clock,
	CreditCard,
	Heart,
	Info,
	Loader2,
	MapPin,
	Phone,
	Share2,
	Star,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetchPlaceById } from "@/hooks/usePlaces";

export default function PlaceDetailPage() {
	const params = useParams();
	const { data, isLoading, error } = useFetchPlaceById(params.id as string);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<Loader2 className="w-10 h-10 animate-spin text-blue-600" />
			</div>
		);
	}

	if (error || !data) {
		return <div className="text-center py-20 font-bold">Place not found.</div>;
	}

	// Format opening hours from the object { open, close }
	const formattedOpeningHours = 
		data.hours?.open && data.hours?.close 
			? `${data.hours.open} — ${data.hours.close}` 
			: "Check timings on arrival";

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative h-[65vh] w-full overflow-hidden">
				<Image
					src={data.gallery?.[0] || "/placeholder-place.jpg"}
					alt={data.name}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
				
				<div className="absolute bottom-12 left-0 w-full px-6 md:px-12 lg:px-24">
					<div className="max-w-7xl mx-auto">
						<div className="flex gap-2 mb-4">
							<Badge text={data.category} />
							<div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/10">
								<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
								{data.rating || "New"} ({data.reviews || 0} reviews)
							</div>
						</div>
						<h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight uppercase">
							{data.name}
						</h1>
						<div className="flex flex-wrap items-center gap-6">
							<p className="text-white/90 flex items-center gap-2 text-lg font-medium">
								<MapPin className="w-5 h-5 text-blue-400" /> {data.location}
							</p>
							<div className="flex gap-3">
								<button type="button" className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white border border-white/20 hover:bg-white/20 transition-all">
									<Share2 className="w-5 h-5" />
								</button>
								<button type="button" className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white border border-white/20 hover:bg-white/20 transition-all">
									<Heart className="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Content Grid */}
			<section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
				<div className="lg:col-span-8 space-y-16">
					{/* Description */}
					<div>
						<h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight uppercase">The Story</h2>
						<p className="text-slate-600 text-xl leading-relaxed font-medium">
							{data.detail}
						</p>
					</div>

					{/* Facilities */}
					{data.facilities?.length > 0 && (
						<div>
							<h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Available Facilities</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{data.facilities.map((facility: string) => (
									<div key={facility} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
										<CheckCircle2 className="w-6 h-6 text-blue-600" />
										<span className="text-slate-800 font-bold uppercase text-xs tracking-widest">{facility}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Image Gallery */}
					{data.gallery?.length > 1 && (
						<div>
							<h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Visuals</h3>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{data.gallery.slice(1).map((img: string, idx: number) => (
									<motion.div
										key={idx}
										initial={{ opacity: 0, scale: 0.95 }}
										whileInView={{ opacity: 1, scale: 1 }}
										className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-lg"
									>
										<Image src={img} alt="Gallery" fill className="object-cover hover:scale-110 transition-transform duration-700" />
									</motion.div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Quick Info Sidebar */}
				<aside className="lg:col-span-4">
					<div className="bg-slate-50 rounded-[3rem] p-10 space-y-10 sticky top-28 border border-slate-100">
						<div className="flex items-center gap-3 border-b border-slate-200 pb-6">
							<Info className="w-6 h-6 text-blue-600" />
							<h3 className="text-xl font-black text-slate-900 uppercase">Quick Info</h3>
						</div>

						<div className="space-y-8">
							<InfoItem icon={Clock} label="Opening Hours" value={formattedOpeningHours} />
							<InfoItem 
								icon={CreditCard} 
								label="Entry Fee" 
								value={data.fee === 0 ? "Free Entry" : `৳${data.fee}`} 
								isHighlight={data.fee === 0}
							/>
							<InfoItem icon={MapPin} label="Area" value={data.area?.name || "Dhaka Central"} />
							{data.contact && <InfoItem icon={Phone} label="Official Contact" value={data.contact} />}
						</div>

						<button 
							type="button" 
							className="w-full py-5 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest text-sm"
						>
							Open Navigation
						</button>
					</div>
				</aside>
			</section>
		</div>
	);
}

// --- Helper Components ---
function Badge({ text }: { text: string }) {
	return (
		<span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-lg tracking-[0.2em] uppercase">
			{text}
		</span>
	);
}

function InfoItem({ icon: Icon, label, value, isHighlight = false }: any) {
	return (
		<div className="flex items-start gap-4">
			<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm text-slate-400">
				<Icon className="w-5 h-5" />
			</div>
			<div>
				<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
				<p className={`font-bold text-sm ${isHighlight ? "text-emerald-600" : "text-slate-800"}`}>{value}</p>
			</div>
		</div>
	);
}
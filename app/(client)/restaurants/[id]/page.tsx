"use client";

import {
	ChevronLeft,
	Clock,
	Cookie,
	Heart,
	Info,
	Loader2,
	MapPin,
	Share2,
	Star,
	Utensils,
	CheckCircle2,
	Phone,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useFetchRestaurantById } from "@/hooks/useRestaurants";
import Link from "next/link";
import FindBusButton from "@/components/appComponents/FindBusButton";

export default function RestaurantDetailPage() {
	const id = useParams().id;
	const router = useRouter();
	const { data, isLoading } = useFetchRestaurantById(id as string);

	console.log(data)

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-white">
				<Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
				<p className="text-slate-400 font-medium italic">Preparing your dining experience...</p>
			</div>
		);
	}

	if (!data) return <div className="text-center py-20">Restaurant not found.</div>;

	const mainImage = data.gallery?.[0] || "/placeholder-restaurant.jpg";

	return (
		<div className="min-h-screen bg-slate-50/30 pb-20">
			{/* --- Hero Section --- */}
			<div className="relative h-[550px] md:h-[650px] w-full">
				<Image
					src={mainImage}
					alt={data.name}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

				{/* Top Controls */}
				<div className="absolute top-8 left-8">
					<button
						type="button"
						onClick={() => router.back()}
						className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20"
					>
						<ChevronLeft className="w-6 h-6" />
					</button>
				</div>

				<div className="absolute top-8 right-8 flex gap-3">
					<button type="button" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20">
						<Share2 className="w-5 h-5" />
					</button>
					<button type="button" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20">
						<Heart className="w-5 h-5" />
					</button>
				</div>

				{/* Restaurant Info Overlay */}
				<div className="absolute bottom-16 left-6 md:left-12 lg:left-24 max-w-4xl pr-6">
					<div className="flex gap-2 mb-6">
						<span className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider">
							{data.category}
						</span>
						<span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider border border-white/10">
							Featured Spot
						</span>
					</div>
					<h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
						{data.name}
					</h1>
					<div className="flex flex-wrap items-center gap-6 text-white font-bold">
						<div className="flex items-center gap-2 bg-yellow-400/20 px-3 py-1 rounded-lg backdrop-blur-sm border border-yellow-400/30">
							<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
							<span>{data.rating || "5.0"}</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin className="w-5 h-5 text-blue-400" />
							<span>{data.area?.name || "Dhaka"}</span>
						</div>

					</div>
				</div>
			</div>

			{/* --- Content Grid --- */}
			<div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
				
				{/* Left Column (Main Info) */}
				<div className="lg:col-span-8 space-y-20">
					
					{/* About Section */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<Info className="w-6 h-6 text-blue-600" />
							<h2 className="text-3xl font-black text-slate-900 tracking-tight">The Story</h2>
						</div>
						<p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
							{data.detail || "Experience culinary excellence at " + data.name + ". Our chefs use the finest ingredients to create a memorable dining experience for you and your loved ones."}
						</p>
					</section>

					{/* Menu Highlights */}
					<section>
						<div className="flex items-center gap-3 mb-10">
							<Utensils className="w-6 h-6 text-blue-600" />
							<h2 className="text-3xl font-black text-slate-900 tracking-tight">Menu Highlights</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{data.menu?.length > 0 ? data.menu.map((item: any) => (
								<div key={item.name} className="flex justify-between items-start group border-b border-slate-100 pb-4">
									<div className="space-y-1">
										<h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
											{item.name}
										</h4>
										<p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Chef's Special Recommendation</p>
									</div>
									<span className="text-lg font-black text-blue-600 flex items-center gap-1">
										<span className="text-xs text-slate-300">৳</span> {item.price}
									</span>
								</div>
							)) : (
								<p className="text-slate-400 italic">Menu is currently being updated...</p>
							)}
						</div>
					</section>

					{/* Gallery Grid */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<Image className="w-6 h-6 text-blue-600" src="/favicon.ico" alt="" width={24} height={24} />
							<h2 className="text-3xl font-black text-slate-900 tracking-tight">Gallery</h2>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
							{data.gallery?.map((img: string, idx: number) => (
								<div
									key={idx}
									className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-md"
								>
									<Image
										src={img}
										alt="Ambiance"
										fill
										className="object-cover group-hover:scale-110 transition-transform duration-700"
									/>
									<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
							))}
						</div>
					</section>

					{/* Simple Review Placeholder */}
					{/* <section>
						<h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Verified Reviews</h2>
						<div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 p-6">
								<Star className="w-12 h-12 text-slate-50" fill="currentColor" />
							</div>
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold">AR</div>
								<div>
									<h4 className="font-bold text-slate-900">Anika Rahman</h4>
									<div className="flex gap-0.5">
										{[1, 2, 3, 4, 5].map((i) => (
											<Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
										))}
									</div>
								</div>
							</div>
							<p className="text-slate-500 italic leading-relaxed font-medium">
								"One of the best places in {data.area?.name || "the city"}. The atmosphere is amazing and the staff were very attentive. Will definitely visit again!"
							</p>
						</div>
					</section> */}
				</div>

				{/* --- Right Column (Sidebar) --- */}
				<div className="lg:col-span-4 space-y-12">
					
					{/* Contact & Reservation */}
					<section className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
						<h3 className="text-xl font-black mb-6">Contact Info</h3>
						<div className="space-y-6">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
									<Phone className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs text-blue-100 uppercase font-bold tracking-widest">Call for booking</p>
									<p className="font-bold">{data?.phone || "Not provided"}</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
									<Clock className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs text-blue-100 uppercase font-bold tracking-widest">Standard Hours</p>
									<p className="font-bold">{data?.hours?.open || "Not provided"} - {data?.hours?.close || "Not provided"}</p>
								</div>
							</div>
						</div>
						{
							data?.phone && (
						<Link href={`tel:${data.phone}`} className="w-full mt-10 bg-white text-blue-600 font-black py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20">
						<button type="button" className="w-full mt-10 bg-white text-blue-600 font-black py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20">
							Book a Table
						</button>
						</Link>
							)
						}

					</section>

					{/* Location Sidebar */}
					<section className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
						<div className="relative h-48 bg-slate-100 flex items-center justify-center group cursor-pointer">
							<div className="absolute inset-0 bg-blue-500/5 transition-colors group-hover:bg-blue-500/10" />
							<div className="relative z-10 flex flex-col items-center gap-3">
								<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg group-hover:scale-110 transition-transform">
									<MapPin className="w-6 h-6" />
								</div>
								<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Get Directions</span>
							</div>
						</div>
						<div className="p-8">
							<h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Location</h3>
							<p className="text-slate-600 font-bold leading-relaxed mb-8">
								{data.location}
							</p>
							<FindBusButton  />

							<Separator className="mb-8" />

							<h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Amenities</h3>
							<div className="grid grid-cols-1 gap-4">
								{data.amenities?.length > 0 ? data.amenities.map((item: string) => (
									<div key={item} className="flex items-center gap-3">
										<CheckCircle2 className="w-5 h-5 text-emerald-500" />
										<span className="text-sm font-bold text-slate-600">{item}</span>
									</div>
								)) : (
									<p className="text-xs text-slate-400 italic">Standard dining facilities</p>
								)}
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

function Separator({ className }: { className?: string }) {
	return <div className={`h-px bg-slate-100 w-full ${className}`} />;
}
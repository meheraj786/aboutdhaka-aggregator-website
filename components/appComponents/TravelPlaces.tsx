"use client";

import { useFetchRandomPlaces } from "@/hooks/usePlaces";
import { ArrowRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PlaceSkeleton = () => (
	<div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
		<div className="relative h-64 bg-slate-200 flex items-center justify-center">
			<ImageIcon className="w-12 h-12 text-slate-300" />
		</div>
		<div className="p-8 space-y-4">
			<div className="h-6 w-20 bg-slate-200 rounded-lg" />
			<div className="h-7 w-3/4 bg-slate-200 rounded-md" />
			<div className="space-y-2">
				<div className="h-4 w-full bg-slate-200 rounded" />
				<div className="h-4 w-5/6 bg-slate-200 rounded" />
			</div>
		</div>
	</div>
);

const TravelPlaces = () => {
	const { data: places, isLoading } = useFetchRandomPlaces();

	return (
		<section
			id="travel-places"
			className="py-16 px-6 md:px-12 lg:px-24 bg-slate-50/50"
		>
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-end mb-10">
					<div>
						<h2 className="text-3xl font-bold text-slate-900 mb-2">
							Top Travel Places
						</h2>
						<p className="text-slate-500">
							Must-visit historical and cultural landmarks
						</p>
					</div>
					<Link
						href="/places"
						className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
					>
						See more <ArrowRight className="w-5 h-5" />
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{isLoading
						? Array.from({ length: 3 }).map((_, i) => <PlaceSkeleton key={i} />)
						: places?.map((place) => (
								<div
									key={place._id}
									className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
								>
									<Link href={`/places/${place._id}`}>
									<div className="relative h-64 overflow-hidden bg-slate-100">
										<Image
											src={place.gallery?.[0] || "/placeholder.jpg"}
											alt={place.name}
											width={500}
											height={500}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											referrerPolicy="no-referrer"
										/>
									</div>
									<div className="p-8">
										<span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider mb-4 bg-blue-50 text-blue-500 uppercase">
											{place.category}
										</span>
										<h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-1">
											{place.name}
										</h3>
										<p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
											{place.detail}
										</p>
									</div>
									</Link>
								</div>
						  ))}
				</div>
			</div>
		</section>
	);
};

export default TravelPlaces;
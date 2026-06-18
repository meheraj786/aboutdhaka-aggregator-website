"use client";

import { useFetchRandomPetCare } from "@/hooks/useHospitals";
import { ArrowRight, MapPin, Phone, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

const PetSkeleton = () => (
	<div className="bg-white border border-slate-100 rounded-[2rem] p-5 flex items-center gap-6 animate-pulse">
		<div className="w-28 h-28 bg-slate-200 rounded-2xl shrink-0" />
		<div className="flex-1 space-y-3">
			<div className="h-5 w-3/4 bg-slate-200 rounded" />
			<div className="h-3 w-1/2 bg-slate-100 rounded" />
			<div className="h-6 w-24 bg-slate-50 rounded-md" />
			<div className="h-4 w-20 bg-slate-100 rounded" />
		</div>
	</div>
);

export function PetCareSection() {
	const { data: services, isLoading } = useFetchRandomPetCare();

	return (
		<section className="py-20 px-6 max-w-7xl mx-auto">
			<SectionHeader
				title="Vets & Pet Care"
				subtitle="Compassionate care for your furry friends"
				viewAllText="All Pet Services"
				viewAllHref="/pet-care"
			/>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{isLoading
					? Array.from({ length: 3 }).map((_, i) => <PetSkeleton key={i} />)
					: services?.map((service: any) => (
							<div
								key={service._id}
								className="group bg-white border border-slate-100 rounded-[2rem] p-5 flex items-center gap-5 shadow-sm hover:shadow-xl hover:shadow-emerald-100/40 hover:-translate-y-1 transition-all duration-300"
							>
								<div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-50">
									{service.thumbnail || service.images?.[0] ? (
										<Image
											src={service.thumbnail || service.images[0]}
											alt={service.name}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-slate-300">
											<ImageIcon className="w-8 h-8" />
										</div>
									)}
								</div>

								<div className="flex flex-col min-w-0">
									<h3 className="text-lg font-bold text-slate-900 mb-0.5 truncate group-hover:text-emerald-600 transition-colors">
										{service.name}
									</h3>
									
									<div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
										<MapPin className="w-3 h-3" />
										<span className="truncate">{service.address?.area || "Dhaka"}</span>
									</div>

									<div className="mb-4">
										<span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
											{service.types?.[0]?.split(' ')[0] || "Veterinary"}
										</span>
									</div>

									<Link
										href={`/hospitals/${service._id}`}
										className="text-emerald-600 font-bold text-xs flex items-center gap-1 group/btn"
									>
										View Details 
										<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
									</Link>
								</div>
							</div>
					  ))}
			</div>
		</section>
	);
}
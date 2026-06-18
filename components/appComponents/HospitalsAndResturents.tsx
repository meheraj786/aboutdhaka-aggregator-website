"use client";

import { useFetchRandomHospitals } from "@/hooks/useHospitals";
import { useFetchRandomRestaurants } from "@/hooks/useRestaurants";
import { Hospital as HospitalIcon, Phone, Star, Utensils, ImageIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ListSkeleton = () => (
	<div className="space-y-4">
		{Array.from({ length: 4 }).map((_, i) => (
			<div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl animate-pulse">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
						<ImageIcon className="w-5 h-5 text-slate-300" />
					</div>
					<div className="space-y-2">
						<div className="h-4 w-32 bg-slate-200 rounded" />
						<div className="h-3 w-20 bg-slate-100 rounded" />
					</div>
				</div>
				<div className="w-8 h-8 bg-slate-100 rounded-lg" />
			</div>
		))}
	</div>
);

const HospitalsAndRestaurants = () => {
	const { data: hospitals, isLoading: isLoadingHosp } = useFetchRandomHospitals();
	const { data: restaurants, isLoading: isLoadingRest } = useFetchRandomRestaurants();

	return (
		<section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
				
				<div>
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold text-slate-900">Popular Hospitals</h2>
						<Link href="/hospitals" className="group flex items-center gap-1 text-blue-600 font-medium text-sm">
							See all <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>
					
					{isLoadingHosp ? <ListSkeleton /> : (
						<div className="space-y-4">
							{hospitals?.map((hosp: any) => (
								<div key={hosp._id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
											<HospitalIcon className="w-6 h-6" />
										</div>
										<div>
											<h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">{hosp.name}</h3>
											<p className="text-[11px] text-slate-400 mb-1">{hosp.address?.area || "Dhaka"}</p>
											<div className="flex items-center gap-1 text-[11px]">
												<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
												<span className="font-bold text-slate-700">{hosp.rating || 0}</span>
											</div>
										</div>
									</div>
									<a href={`tel:${hosp.contact?.phone?.[0]}`} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
										<Phone className="w-4 h-4" />
									</a>
								</div>
							))}
						</div>
					)}
				</div>

				<div>
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold text-slate-900">Best Restaurants</h2>
						<Link href="/restaurants" className="group flex items-center gap-1 text-blue-600 font-medium text-sm">
							See all <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>
					
					{isLoadingRest ? <ListSkeleton /> : (
						<div className="space-y-4">
							{restaurants?.map((rest: any) => (
								<div key={rest._id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group">
									<div className="flex items-center gap-4">
										<div className="relative w-12 h-12 overflow-hidden rounded-xl bg-slate-100">
											{rest.gallery?.[0] ? (
												<Image src={rest.gallery[0]} alt={rest.name} fill className="object-cover" />
											) : (
												<div className="w-full h-full flex items-center justify-center text-orange-500 bg-orange-50">
													<Utensils className="w-5 h-5" />
												</div>
											)}
										</div>
										<div>
											<h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">{rest.name}</h3>
											<p className="text-[11px] text-slate-400 mb-1">{rest.area?.name || rest.location}</p>
											<div className="flex items-center gap-1 text-[11px]">
												<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
												<span className="font-bold text-slate-700">{rest.rating || 0}</span>
												<span className="text-slate-400 uppercase tracking-tighter ml-1"> • {rest.category}</span>
											</div>
										</div>
									</div>
									<Link href={`/restaurants/${rest._id}`} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all uppercase">
										Menu
									</Link>
								</div>
							))}
						</div>
					)}
				</div>

			</div>
		</section>
	);
};

export default HospitalsAndRestaurants;
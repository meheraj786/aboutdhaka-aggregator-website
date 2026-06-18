"use client";

import { ArrowRight, MapPin, Navigation, Search, Bus, Info, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFetchAreas } from "@/hooks/useAreas";
import Image from "next/image";

export function CityNavigationSection() {
	const router = useRouter();
	const { data: areas = [] } = useFetchAreas();

	const [depArea, setDepArea] = useState("");
	const [depStop, setDepStop] = useState("");
	const [destArea, setDestArea] = useState("");
	const [destStop, setDestStop] = useState("");

	const selectedDepArea = useMemo(
		() => areas?.find((a: any) => a?._id === depArea),
		[areas, depArea],
	);
	const selectedDestArea = useMemo(
		() => areas?.find((a: any) => a?._id === destArea),
		[areas, destArea],
	);

	const navigateToRoute = () => {
		if (depArea && depStop && destArea && destStop) {
			router.push(`/bus?depA=${depArea}&depS=${depStop}&destA=${destArea}&destS=${destStop}`);
		}
	};

	return (
		<section className="px-4 py-16 md:py-24 bg-[#f8fafc] overflow-hidden">
			<div className="max-w-[1400px] mx-auto">
				<div className="relative bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden">
					
					<div className="grid grid-cols-1 xl:grid-cols-12 items-stretch">
						
						{/* Left Content: Search Panel */}
						<div className="xl:col-span-7 p-8 md:p-16 lg:p-20">
							<div className="max-w-xl">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-6">
									<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
									<span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Intelligent Route Finder</span>
								</div>
								
								<h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
									Navigate the city <br />
									<span className="text-blue-600">like a local.</span>
								</h2>
								
								<p className="text-slate-500 text-lg mb-12 leading-relaxed">
									Find the fastest bus routes, live timings, and ticket prices in just a few clicks.
								</p>

								<div className="space-y-8 relative">
									{/* Form Group */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
										
										{/* Source */}
										<div className="space-y-3">
											<label htmlFor="depArea" className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter ml-1">
												<MapPin className="w-3 h-3 text-blue-500" /> Start Point
											</label>
											<select
												value={depArea}
												onChange={(e) => { setDepArea(e.target.value); setDepStop(""); }}
												className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
											>
												<option value="">Select Area</option>
												{areas?.map((a: any) => (
													<option key={a?._id} value={a?._id}>{a?.name}</option>
												))}
											</select>
											<select
												disabled={!depArea}
												value={depStop}
												onChange={(e) => setDepStop(e.target.value)}
												className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all appearance-none disabled:opacity-40 cursor-pointer"
											>
												<option value="">Select Stop</option>
												{selectedDepArea?.stops?.map((s: any) => (
													<option key={s?.stop?._id} value={s?.stop?._id}>{s?.stop?.stopName}</option>
												))}
											</select>
										</div>

										{/* Destination */}
										<div className="space-y-3">
											<label htmlFor="end" className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter ml-1">
												<Navigation className="w-3 h-3 text-indigo-500" /> Endpoint
											</label>
											<select
												value={destArea}
												onChange={(e) => { setDestArea(e.target.value); setDestStop(""); }}
												className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
											>
												<option value="">Select Area</option>
												{areas?.map((a: any) => (
													<option key={a?._id} value={a?._id}>{a?.name}</option>
												))}
											</select>
											<select
												disabled={!destArea}
												value={destStop}
												onChange={(e) => setDestStop(e.target.value)}
												className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all appearance-none disabled:opacity-40 cursor-pointer"
											>
												<option value="">Select Stop</option>
												{selectedDestArea?.stops?.map((s: any) => (
													<option key={s?.stop?._id} value={s?.stop?._id}>{s?.stop?.stopName}</option>
												))}
											</select>
										</div>
									</div>

									{/* CTA Button */}
									<button
										type="button"
										onClick={navigateToRoute}
										disabled={!depStop || !destStop}
										className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:grayscale disabled:opacity-50 group"
									>
										<Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
										FIND BEST ROUTES
										<ChevronRight className="w-5 h-5" />
									</button>
								</div>
							</div>
						</div>

						{/* Right Content: Modern Visuals */}
						<div className="xl:col-span-5 bg-blue-600 relative overflow-hidden hidden xl:block">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
							
							{/* Pattern / Map Background Overlay */}
							<div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.62 10.11L51 13.73l-3.62-3.62 1.41-1.41 2.21 2.21 2.21-2.21 1.41 1.41zM10.11 54.62L13.73 51l-3.62-3.62 1.41-1.41 2.21 2.21 2.21-2.21 1.41 1.41zM54.62 50.11L51 53.73l-3.62-3.62 1.41-1.41 2.21 2.21 2.21-2.21 1.41 1.41zM10.11 10.11L13.73 13.73l-3.62-3.62 1.41-1.41 2.21 2.21 2.21-2.21 1.41 1.41z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

							<div className="relative h-full flex flex-col justify-center p-16">
								<div className="relative w-full aspect-square max-w-[400px] mx-auto group">
									{/* Bus Image */}
									<div className="absolute inset-0 bg-white/10 rounded-[3rem] backdrop-blur-sm border border-white/20 transform rotate-6 transition-transform group-hover:rotate-3" />
									<div className="absolute inset-0 bg-white/10 rounded-[3rem] backdrop-blur-sm border border-white/20 transform -rotate-3 transition-transform group-hover:rotate-0" />
									<Image 
										src="https://asianews.network/wp-content/uploads/bfi_thumb/unnamed-file-7dbidgf1weu5y40yvoryjsn7a13r26gmvdcb4cl38lc.jpg"
										alt="City Bus"
										fill
										className="object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-105"
									/>
									
									{/* Floating Badge */}
									<div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl animate-bounce duration-[3000ms]">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
												<Bus className="w-6 h-6" />
											</div>
											<div>
												<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Buses</p>
												<p className="text-xl font-black text-slate-900">500+</p>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-20 space-y-6">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
											<Info className="w-5 h-5 text-white" />
										</div>
										<p className="text-white/80 text-sm leading-relaxed">
											We cover over 150+ routes across Dhaka city, providing you with real-time bus stand locations and fare updates.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
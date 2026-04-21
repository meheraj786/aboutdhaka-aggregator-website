"use client";

import {
	Bus as BusIcon,
	ChevronDown,
	Clock,
	Info,
	Map as MapIcon,
	MapPin,
	Minus,
	Navigation,
	Plus,
	Search,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { type IAreaPopulated, seedAreas } from "@/actions/area.action";
import type { IBusWithStops, IConnectingRoute } from "@/actions/bus.action";
import { useFetchAreas } from "@/hooks/useAreas";
import { useFindBusRoutes } from "@/hooks/useBus";

export default function BusRoutePage() {
	const [departureAreaId, setDepartureAreaId] = useState<string>("");
	const [destinationAreaId, setDestinationAreaId] = useState<string>("");
	const [departureStopId, setDepartureStopId] = useState<string>("");
	const [destinationStopId, setDestinationStopId] = useState<string>("");

	const [searchParams, setSearchParams] = useState<{
		dep: string;
		dest: string;
	} | null>(null);

	const { data: areaData = [] } = useFetchAreas();
	const areas: IAreaPopulated[] = areaData;

	console.log(areaData, "data");

	const { data: routeResults, isLoading: isSearching } = useFindBusRoutes(
		searchParams?.dep || "",
		searchParams?.dest || "",
	);

	const selectedDepartureArea = useMemo(
		() => areas.find((a) => a._id === departureAreaId),
		[areas, departureAreaId],
	);

	const selectedDestinationArea = useMemo(
		() => areas.find((a) => a._id === destinationAreaId),
		[areas, destinationAreaId],
	);

	const handleSearch = () => {
		if (!departureStopId || !destinationStopId) return;
		setSearchParams({ dep: departureStopId, dest: destinationStopId });
	};

	return (
		<div className="min-h-screen bg-slate-50/50 flex flex-col">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto">
					<div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
								Find Your Bus Route
							</h1>
							<p className="text-slate-500 text-lg">
								Discover direct and connecting bus services across Dhaka city.
							</p>
						</div>
						<button
							type="button"
							onClick={() => seedAreas()}
							className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
						>
							Seed Data
						</button>
					</div>

					<div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm mb-12">
						<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
							<div className="md:col-span-4 space-y-5">
								<div className="space-y-2">
									<label
										htmlFor="dep-area"
										className="block text-sm font-bold text-slate-900 ml-1"
									>
										Departure Area
									</label>
									<div className="relative">
										<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
										<select
											id="dep-area"
											value={departureAreaId}
											onChange={(e) => {
												setDepartureAreaId(e.target.value);
												setDepartureStopId("");
											}}
											className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
										>
											<option value="">Select Area</option>
											{areas.map((area) => (
												<option key={area._id} value={area._id}>
													{area.name}
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="dep-stop"
										className="block text-sm font-bold text-slate-900 ml-1"
									>
										Departure Bus-Stop
									</label>
									<div className="relative">
										<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
										<select
											id="dep-stop"
											disabled={!departureAreaId}
											value={departureStopId}
											onChange={(e) => setDepartureStopId(e.target.value)}
											className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 transition-all"
										>
											<option value="">Select Bus Stop</option>
											{selectedDepartureArea?.stops?.map((item) => (
												<option key={item.stop?._id} value={item.stop?._id}>
													{item.stop?.stopName}
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
									</div>
								</div>
							</div>

							<div className="md:col-span-4 space-y-5">
								<div className="space-y-2">
									<label
										htmlFor="dest-area"
										className="block text-sm font-bold text-slate-900 ml-1"
									>
										Destination Area
									</label>
									<div className="relative">
										<Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
										<select
											id="dest-area"
											value={destinationAreaId}
											onChange={(e) => {
												setDestinationAreaId(e.target.value);
												setDestinationStopId("");
											}}
											className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
										>
											<option value="">Select Area</option>
											{areas.map((area) => (
												<option key={area._id} value={area._id}>
													{area.name}
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="dest-stop"
										className="block text-sm font-bold text-slate-900 ml-1"
									>
										Destination Bus-Stop
									</label>
									<div className="relative">
										<Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
										<select
											id="dest-stop"
											disabled={!destinationAreaId}
											value={destinationStopId}
											onChange={(e) => setDestinationStopId(e.target.value)}
											className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 transition-all"
										>
											<option value="">Select Bus Stop</option>
											{selectedDestinationArea?.stops?.map((item) => (
												<option key={item.stop?._id} value={item.stop?._id}>
													{item.stop?.stopName}
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
									</div>
								</div>
							</div>

							<div className="md:col-span-4">
								<button
									type="button"
									onClick={handleSearch}
									disabled={
										!departureStopId || !destinationStopId || isSearching
									}
									className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 h-[60px] md:h-[148px]"
								>
									<Search className="w-6 h-6" />
									{isSearching ? "Finding..." : "Search Routes"}
								</button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
						<div className="lg:col-span-7">
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-2xl font-bold text-slate-900">
									{routeResults?.type === "direct"
										? "Direct Buses"
										: "Connecting Routes"}
									{routeResults?.data && ` (${routeResults.data.length})`}
								</h2>
							</div>

							<div className="space-y-6">
								{!routeResults && !isSearching && (
									<div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-[2rem]">
										<BusIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
										<p className="text-slate-500 font-medium">
											Select stops and search to see available buses.
										</p>
									</div>
								)}

								{routeResults?.type === "direct" &&
									(routeResults.data as IBusWithStops[]).map((bus) => (
										<div
											key={bus._id}
											className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all"
										>
											<div className="flex justify-between items-start mb-6">
												<div className="flex gap-4">
													<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
														<BusIcon className="w-6 h-6" />
													</div>
													<div>
														<h3 className="text-xl font-bold text-slate-900">
															{bus.busName}
														</h3>
														<div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
															<Clock className="w-3.5 h-3.5" />
															Direct Service
														</div>
													</div>
												</div>
												<span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-600">
													DIRECT ROUTE
												</span>
											</div>
											<div className="flex flex-wrap items-center gap-3 mb-8">
												{bus.stops.map((s, i) => (
													<React.Fragment key={s._id}>
														<span
															className={`px-4 py-2 rounded-xl text-xs font-bold ${s._id === departureStopId || s._id === destinationStopId ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600"}`}
														>
															{s.stopName}
														</span>
														{i < bus.stops.length - 1 && (
															<div className="w-3 h-px bg-slate-200" />
														)}
													</React.Fragment>
												))}
											</div>
											<button
												type="button"
												className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
											>
												<MapIcon className="w-4 h-4" /> View Full Route
											</button>
										</div>
									))}

								{routeResults?.type === "connecting" &&
									(routeResults.data as IConnectingRoute[]).map(
										(route, idx) => (
											<div
												key={idx}
												className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all"
											>
												<div className="flex items-start justify-between mb-6">
													<div className="flex gap-4">
														<div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
															<Navigation className="w-6 h-6" />
														</div>
														<div>
															<h3 className="text-xl font-bold text-slate-900">
																Change at {route.transferAt.stopName}
															</h3>
															<p className="text-sm text-slate-500">
																Requires 1 transfer
															</p>
														</div>
													</div>
												</div>
												<div className="space-y-4 relative before:absolute before:left-[19px] before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-100">
													<div className="flex items-center gap-4 relative z-10">
														<div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
															1
														</div>
														<div className="flex-grow p-4 bg-slate-50 rounded-2xl">
															<p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
																First Leg
															</p>
															<p className="text-slate-900 font-bold">
																Take{" "}
																<span className="text-blue-600">
																	{route.bus1.name}
																</span>
															</p>
														</div>
													</div>
													<div className="flex items-center gap-4 relative z-10">
														<div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
															2
														</div>
														<div className="flex-grow p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
															<p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
																Transfer Point
															</p>
															<p className="text-slate-900 font-bold">
																Switch at{" "}
																<span className="text-orange-600">
																	{route.transferAt.stopName}
																</span>
															</p>
														</div>
													</div>
													<div className="flex items-center gap-4 relative z-10">
														<div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
															3
														</div>
														<div className="flex-grow p-4 bg-slate-50 rounded-2xl">
															<p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
																Final Leg
															</p>
															<p className="text-slate-900 font-bold">
																Board{" "}
																<span className="text-emerald-600">
																	{route.bus2.name}
																</span>{" "}
																to destination
															</p>
														</div>
													</div>
												</div>
											</div>
										),
									)}
							</div>
						</div>

						<div className="lg:col-span-5">
							<h2 className="text-2xl font-bold text-slate-900 mb-8">
								Route Preview
							</h2>
							<div className="relative bg-slate-100 rounded-[2.5rem] h-[550px] overflow-hidden border border-slate-200">
								<div className="absolute inset-0 bg-[#E5E7EB] opacity-30">
									<svg
										className="w-full h-full"
										viewBox="0 0 400 600"
										role="img"
										aria-label="Background grid pattern"
									>
										<title>Background grid pattern</title>
										<path
											d="M0 100 L400 150 M0 300 L400 350 M100 0 L150 600 M300 0 L350 600"
											stroke="white"
											strokeWidth="20"
											fill="none"
										/>
									</svg>
								</div>
								<svg
									className="absolute inset-0 w-full h-full"
									viewBox="0 0 400 600"
									role="img"
									aria-label="Route path visualization"
								>
									<title>Route path visualization</title>
									<path
										d="M150 100 Q250 250 200 350 T300 550"
										fill="none"
										stroke="#3B82F6"
										strokeWidth="4"
										strokeDasharray="8 8"
									/>
									<circle cx="150" cy="100" r="6" fill="#3B82F6" />
									<circle cx="300" cy="550" r="6" fill="#EF4444" />
								</svg>
								<div className="absolute top-[80px] left-[140px] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
									<span className="text-[10px] font-bold text-slate-900">
										{selectedDepartureArea?.name || "Departure"}
									</span>
								</div>
								<div className="absolute bottom-[40px] right-[80px] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
									<span className="text-[10px] font-bold text-slate-900">
										{selectedDestinationArea?.name || "Destination"}
									</span>
								</div>
								<div className="absolute bottom-8 right-8 flex flex-col gap-2">
									<button
										type="button"
										className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
									>
										<Plus className="w-5 h-5" />
									</button>
									<button
										type="button"
										className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
									>
										<Minus className="w-5 h-5" />
									</button>
								</div>
							</div>
							<div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex gap-4">
								<Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
								<p className="text-sm text-slate-600 leading-relaxed">
									Bus routes and timings may vary based on traffic conditions
									and service availability. Always verify with the conductor.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

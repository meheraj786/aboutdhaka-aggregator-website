"use client";

import {
	Bus,
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
import React, { useState } from "react";
import { useFetchAreas } from "@/hooks/useAreas";

const busData = [
	{
		id: "shikor",
		name: "Shikor Paribahan",
		time: "06:00 AM - 11:30 PM",
		status: "ACTIVE NOW",
		statusColor: "bg-emerald-50 text-emerald-600",
		stops: ["Uttara", "Airport", "Banani", "Motijheel"],
		activeStop: "Motijheel",
	},
	{
		id: "welcome",
		name: "Welcome Transport",
		time: "05:30 AM - 10:00 PM",
		status: "ACTIVE NOW",
		statusColor: "bg-emerald-50 text-emerald-600",
		stops: ["Uttara", "Mirpur", "Motijheel"],
		activeStop: "Motijheel",
	},
	{
		id: "al-makkah",
		name: "Al-Makkah",
		time: "06:30 AM - 11:00 PM",
		status: "STARTS IN 10M",
		statusColor: "bg-slate-50 text-slate-500",
		stops: ["Uttara", "Gulshan", "Motijheel"],
		activeStop: "Motijheel",
	},
];

export default function BusRoutePage() {
	const [departure, setDeparture] = useState("Uttara");
	const [destination, setDestination] = useState("Motijheel");
	const { data: area = [], isLoading } = useFetchAreas();

	console.log(area, "area");

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="mb-10">
						<h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
							Find Your Bus Route
						</h1>
						<p className="text-slate-500 text-lg">
							Quickly find the best bus services connecting your destination
							across Dhaka city.
						</p>
					</div>

					{/* Search Bar */}
					<div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm mb-12">
						<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
							<div className="md:col-span-4">
								<label
									htmlFor="area"
									className="block text-sm font-bold text-slate-900 mb-3"
								>
									Departure Area
								</label>
								<div className="relative">
									<div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
										<MapPin className="w-5 h-5" />
									</div>
									<select
										value={departure}
										onChange={(e) => setDeparture(e.target.value)}
										className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
									>
										{isLoading ? (
											<option>Loading...</option>
										) : (
											<>
												<option value="">Select Area</option>
												{area.map((area: { _id: string; name: string }) => (
													<option key={area._id} value={area.name}>
														{area.name}
													</option>
												))}
											</>
										)}
									</select>
									<div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
										<ChevronDown className="w-5 h-5" />
									</div>
								</div>
							</div>

							<div className="md:col-span-4">
								<label
									htmlFor="area"
									className="block text-sm font-bold text-slate-900 mb-3"
								>
									Destination Area
								</label>
								<div className="relative">
									<div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
										<Navigation className="w-5 h-5" />
									</div>
									<select
										value={destination}
										onChange={(e) => setDestination(e.target.value)}
										className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
									>
										{isLoading ? (
											<option>Loading...</option>
										) : (
											<>
												<option value="">Select Area</option>
												{area.map((area: { _id: string; name: string }) => (
													<option key={area._id} value={area.name}>
														{area.name}
													</option>
												))}
											</>
										)}
									</select>
									<div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
										<ChevronDown className="w-5 h-5" />
									</div>
								</div>
							</div>

							<div className="md:col-span-4">
								<button
									type="button"
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
								>
									<Search className="w-5 h-5" />
									Search Buses
								</button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
						{/* Left Column: Bus List */}
						<div className="lg:col-span-7">
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-2xl font-bold text-slate-900">
									Matching Buses (3)
								</h2>
								<div className="flex bg-slate-100 p-1 rounded-xl">
									<button
										type="button"
										className="px-4 py-1.5 text-xs font-bold rounded-lg bg-white text-blue-600 shadow-sm"
									>
										Fastest
									</button>
									<button
										type="button"
										className="px-4 py-1.5 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-700"
									>
										Most Frequent
									</button>
								</div>
							</div>

							<div className="space-y-6">
								{busData.map((bus) => (
									<div
										key={bus.id}
										className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all"
									>
										<div className="flex justify-between items-start mb-6">
											<div className="flex gap-4">
												<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
													<Bus className="w-6 h-6" />
												</div>
												<div>
													<h3 className="text-xl font-bold text-slate-900">
														{bus.name}
													</h3>
													<div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
														<Clock className="w-3.5 h-3.5" />
														{bus.time}
													</div>
												</div>
											</div>
											<span
												className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider ${bus.statusColor}`}
											>
												{bus.status}
											</span>
										</div>

										<div className="flex flex-wrap items-center gap-3 mb-8">
											{bus.stops.map((stop, i) => (
												<React.Fragment key={stop}>
													<span
														className={`px-4 py-2 rounded-xl text-sm font-semibold ${stop === bus.activeStop ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600"}`}
													>
														{stop}
													</span>
													{i < bus.stops.length - 1 && (
														<div className="w-4 h-px bg-slate-200" />
													)}
												</React.Fragment>
											))}
										</div>

										<div className="flex gap-3">
											<button
												type="button"
												className="flex-grow bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
											>
												<MapIcon className="w-4 h-4" />
												View Route Map
											</button>
											<button
												type="button"
												className="w-14 bg-white border border-slate-100 hover:bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center transition-all"
											>
												<Info className="w-5 h-5" />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Right Column: Route Preview */}
						<div className="lg:col-span-5">
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-2xl font-bold text-slate-900">
									Route Preview
								</h2>
								<button
									type="button"
									className="text-blue-600 text-sm font-bold hover:underline"
								>
									Expand Map
								</button>
							</div>

							<div className="relative bg-slate-100 rounded-[2.5rem] h-[600px] overflow-hidden border border-slate-200">
								{/* Mock Map Background */}
								<div className="absolute inset-0 bg-[#E5E7EB]">
									<svg
										className="w-full h-full opacity-20"
										viewBox="0 0 400 600"
									>
										<title>Map Background</title>
										<path
											d="M0 100 L400 150 M0 300 L400 350 M100 0 L150 600 M300 0 L350 600"
											stroke="white"
											strokeWidth="20"
											fill="none"
										/>
									</svg>
								</div>

								{/* Route Line */}
								<svg
									className="absolute inset-0 w-full h-full"
									viewBox="0 0 400 600"
								>
									<title>Route Line</title>{" "}
									<path
										d="M150 100 Q250 250 200 350 T300 550"
										fill="none"
										stroke="#3B82F6"
										strokeWidth="4"
										strokeDasharray="8 8"
										className="drop-shadow-sm"
									/>
									{/* Start Point */}
									<circle cx="150" cy="100" r="6" fill="#3B82F6" />
									<circle
										cx="150"
										cy="100"
										r="12"
										fill="#3B82F6"
										fillOpacity="0.2"
									/>
									{/* End Point */}
									<circle cx="300" cy="550" r="6" fill="#EF4444" />
									<circle
										cx="300"
										cy="550"
										r="12"
										fill="#EF4444"
										fillOpacity="0.2"
									/>
									{/* Intermediate Point */}
									<circle
										cx="225"
										cy="325"
										r="15"
										fill="#3B82F6"
										fillOpacity="0.3"
									/>
								</svg>

								{/* Labels */}
								<div className="absolute top-[80px] left-[140px] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
									<span className="text-[10px] font-bold text-slate-900">
										Uttara (Start)
									</span>
								</div>
								<div className="absolute bottom-[40px] right-[80px] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
									<span className="text-[10px] font-bold text-slate-900">
										Motijheel (End)
									</span>
								</div>

								{/* Zoom Controls */}
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

							{/* Travel Info Box */}
							<div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex gap-4">
								<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 flex-shrink-0 shadow-sm">
									<Info className="w-5 h-5" />
								</div>
								<p className="text-sm text-slate-600 leading-relaxed">
									Estimated travel time for this route is{" "}
									<span className="font-bold text-slate-900">
										65-80 minutes
									</span>{" "}
									depending on current traffic conditions in Mohakhali and
									Farmgate areas.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

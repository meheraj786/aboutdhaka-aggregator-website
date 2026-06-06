"use client";

import { ArrowRight, MapPin, Navigation, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { IAreaPopulated } from "@/actions/area.action";
import { useFetchAreas } from "@/hooks/useAreas";

const SUGGESTIONS = [
	{
		id: "s1",
		from: "Shankar",
		to: "Science Lab",
		fromId: "69e738015548584ada29d284",
		toId: "69e738015548584ada29d287",
		fromArea: "69e7541a5548584ada29d2d8",
		toArea: "69e7541a5548584ada29d2db",
		route: "VICTOR CLASSIC",
	},
	{
		id: "s2",
		from: "Jigatola",
		to: "City College",
		fromId: "69e738015548584ada29d285",
		toId: "69e738015548584ada29d286",
		fromArea: "69e7541a5548584ada29d2d8",
		toArea: "69e7541a5548584ada29d2db",
		route: "BALAKA",
	},
	{
		id: "s3",
		from: "Sukrabad",
		to: "Kalabagan",
		fromId: "69e738015548584ada29d28a",
		toId: "69e738015548584ada29d288",
		fromArea: "69e7541a5548584ada29d2d8",
		toArea: "69e7541a5548584ada29d2d8",
		route: "ATCL Paribahan",
	},
	{
		id: "s4",
		from: "Dhanmondi 15",
		to: "Shankar",
		fromId: "69e738015548584ada29d289",
		toId: "69e738015548584ada29d284",
		fromArea: "69e7541a5548584ada29d2d8",
		toArea: "69e7541a5548584ada29d2d8",
		route: "13 NUMBER",
	},
];

export function CityNavigationSection() {
	const router = useRouter();
	const { data: areas = [] } = useFetchAreas();

	const [depArea, setDepArea] = useState("");
	const [depStop, setDepStop] = useState("");
	const [destArea, setDestArea] = useState("");
	const [destStop, setDestStop] = useState("");

	const selectedDepArea = useMemo(
		() => areas.find((a: { _id: string }) => a._id === depArea),
		[areas, depArea],
	);
	const selectedDestArea = useMemo(
		() => areas.find((a: { _id: string }) => a._id === destArea),
		[areas, destArea],
	);

	const navigateToRoute = (
		dA: string,
		dS: string,
		desA: string,
		desS: string,
	) => {
		router.push(`/bus?depA=${dA}&depS=${dS}&destA=${desA}&destS=${desS}`);
	};

	return (
		<section className="px-4 py-12">
			<div className="max-w-7xl mx-auto bg-[#2563eb] rounded-[40px] p-12 md:p-20 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative shadow-2xl shadow-blue-200">
				<div className="flex-1 z-10 w-full">
					<h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
						City Navigation Made Easy
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div className="space-y-3">
							<div className="relative">
								<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
								<select
									value={depArea}
									onChange={(e) => {
										setDepArea(e.target.value);
										setDepStop("");
									}}
									className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none focus:ring-2 focus:ring-white/40 outline-none transition-all"
								>
									<option value="" className="text-slate-900">
										Select Departure Area
									</option>
									{areas.map((a: { name: string; _id: string }) => (
										<option
											key={a._id}
											value={a._id}
											className="text-slate-900"
										>
											{a.name}
										</option>
									))}
								</select>
							</div>
							<div className="relative">
								<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
								<select
									disabled={!depArea}
									value={depStop}
									onChange={(e) => setDepStop(e.target.value)}
									className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none disabled:opacity-50 focus:ring-2 focus:ring-white/40 outline-none transition-all"
								>
									<option value="" className="text-slate-900">
										Select Stop
									</option>
									{selectedDepArea?.stops?.map(
										(s: { stop: { stopName: string; _id: string } }) => (
											<option
												key={s.stop._id}
												value={s.stop._id}
												className="text-slate-900"
											>
												{s.stop.stopName}
											</option>
										),
									)}
								</select>
							</div>
						</div>

						<div className="space-y-3">
							<div className="relative">
								<Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
								<select
									value={destArea}
									onChange={(e) => {
										setDestArea(e.target.value);
										setDestStop("");
									}}
									className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none focus:ring-2 focus:ring-white/40 outline-none transition-all"
								>
									<option value="" className="text-slate-900">
										Select Destination Area
									</option>
									{areas.map((a: IAreaPopulated) => (
										<option
											key={a._id}
											value={a._id}
											className="text-slate-900"
										>
											{a.name}
										</option>
									))}
								</select>
							</div>
							<div className="relative">
								<Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
								<select
									disabled={!destArea}
									value={destStop}
									onChange={(e) => setDestStop(e.target.value)}
									className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none disabled:opacity-50 focus:ring-2 focus:ring-white/40 outline-none transition-all"
								>
									<option value="" className="text-slate-900">
										Select Stop
									</option>
									{selectedDestArea?.stops?.map(
										(s: { stop: { stopName: string; _id: string } }) => (
											<option
												key={s.stop._id}
												value={s.stop._id}
												className="text-slate-900"
											>
												{s.stop.stopName}
											</option>
										),
									)}
								</select>
							</div>
						</div>
					</div>

					<button
						type="button"
						onClick={() =>
							navigateToRoute(depArea, depStop, destArea, destStop)
						}
						className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg"
					>
						<Search className="w-5 h-5" /> Search Routes
					</button>
				</div>

				<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full z-10">
					{SUGGESTIONS.map((item) => (
						<button
							id={item.id}
							key={item.id}
							type="button"
							onClick={() =>
								navigateToRoute(
									item.fromArea,
									item.fromId,
									item.toArea,
									item.toId,
								)
							}
							className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 hover:bg-white/20 transition-all cursor-pointer text-left w-full"
						>
							<div className="flex justify-between items-start mb-4">
								<p className="text-blue-200 text-[10px] font-black tracking-widest uppercase">
									{item.route}
								</p>
								<ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
							</div>
							<div className="flex items-center gap-3 text-white mb-2">
								<span className="font-bold text-sm">{item.from}</span>
								<div className="h-px flex-grow bg-white/20" />
								<span className="font-bold text-sm">{item.to}</span>
							</div>
							<p className="text-blue-100/50 text-[10px]">
								Click to view direct routes
							</p>
						</button>
					))}
				</div>

				<div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -mr-48 -mt-48" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700/30 rounded-full blur-3xl -ml-32 -mb-32" />
			</div>
		</section>
	);
}

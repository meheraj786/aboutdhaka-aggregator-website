"use client";

import { Bus, ChevronDown, Loader2, MapPin, Navigation, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { IAreaPopulated } from "@/actions/area.action";
import { useFetchAreas } from "@/hooks/useAreas";

interface FindBusButtonProps {
	hospitalLat?: number;
	hospitalLng?: number;
}

type Step = "idle" | "locating" | "manual" | "manual-stop";

export default function FindBusButton({
	hospitalLat,
	hospitalLng,
}: FindBusButtonProps) {
	const router = useRouter();
	const [step, setStep] = useState<Step>("idle");
	const [locationError, setLocationError] = useState<string>("");
	const [selectedAreaId, setSelectedAreaId] = useState("");
	const [selectedStopId, setSelectedStopId] = useState("");

	const { data: areaData = [] } = useFetchAreas();
	const areas: IAreaPopulated[] = areaData;

	const selectedArea = areas.find((a) => a._id === selectedAreaId);

	const handleFindBus = async () => {
		setLocationError("");
		setStep("locating");

		if (!navigator.geolocation) {
			setLocationError("Geolocation is not supported by your browser.");
			setStep("manual");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				const params = new URLSearchParams();
				params.set("lat", String(latitude));
				params.set("lng", String(longitude));
				if (hospitalLat !== undefined && hospitalLng !== undefined) {
					params.set("destLat", String(hospitalLat));
					params.set("destLng", String(hospitalLng));
				}
				router.push(`/bus?${params.toString()}`);
			},
			(error) => {
				let msg = "Location access denied.";
				if (error.code === error.TIMEOUT) msg = "Location request timed out.";
				setLocationError(msg);
				setStep("manual");
			},
			{ timeout: 8000, maximumAge: 60000 },
		);
	};

	const handleManualSearch = () => {
		if (!selectedStopId) return;
		const params = new URLSearchParams();
		params.set("depS", selectedStopId);
		params.set("depA", selectedAreaId);
		if (hospitalLat !== undefined && hospitalLng !== undefined) {
			params.set("destLat", String(hospitalLat));
			params.set("destLng", String(hospitalLng));
		}
		router.push(`/bus?${params.toString()}`);
	};

	const isModalOpen = step === "locating" || step === "manual";

	return (
		<>
			<button
				type="button"
				onClick={handleFindBus}
				className="flex-grow md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
			>
				<Bus className="w-5 h-5" />
				Find Nearest Bus
			</button>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
					<div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in slide-in-from-bottom-4">
						<div className="flex justify-between items-start mb-6">
							<div>
								<h2 className="text-xl font-bold text-slate-900">
									{step === "locating"
										? "Getting your location..."
										: "Select Your Departure"}
								</h2>
								{locationError && (
									<p className="text-sm text-red-500 mt-1">{locationError}</p>
								)}
							</div>
							{step === "manual" && (
								<button
									type="button"
									onClick={() => setStep("idle")}
									className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
								>
									<X className="w-4 h-4 text-slate-600" />
								</button>
							)}
						</div>

						{step === "locating" && (
							<div className="flex flex-col items-center py-10 gap-4">
								<div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
									<Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
								</div>
								<p className="text-slate-500 text-sm text-center">
									Please allow location access in your browser popup.
								</p>
							</div>
						)}

						{step === "manual" && (
							<div className="space-y-5">
								<p className="text-slate-500 text-sm -mt-2 mb-4">
									Could not get your location automatically. Please select your
									departure area and bus stop manually.
								</p>

								<div className="space-y-2">
									<label
										htmlFor="area"
										className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
									>
										Your Area
									</label>
									<div className="relative">
										<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
										<select
											value={selectedAreaId}
											onChange={(e) => {
												setSelectedAreaId(e.target.value);
												setSelectedStopId("");
											}}
											className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-10 appearance-none font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
										>
											<option value="">Select Area</option>
											{areas.map((area) => (
												<option key={area._id} value={area._id}>
													{area.name}
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="bus"
										className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
									>
										Nearest Bus Stop
									</label>
									<div className="relative">
										<Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
										<select
											value={selectedStopId}
											onChange={(e) => setSelectedStopId(e.target.value)}
											disabled={!selectedAreaId}
											className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-10 appearance-none font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
										>
											<option value="">Select Bus Stop</option>
											{selectedArea?.stops?.map((item) => (
												<option key={item.stop?._id} value={item.stop?._id}>
													{item.stop?.stopName}
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
									</div>
								</div>

								<button
									type="button"
									onClick={handleManualSearch}
									disabled={!selectedStopId}
									className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2"
								>
									<Bus className="w-5 h-5" />
									Find Bus Routes
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}

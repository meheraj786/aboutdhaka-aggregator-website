"use client";

import {
	AlertTriangle,
	ArrowRight,
	Bus as BusIcon,
	ChevronDown,
	Clock,
	Info,
	Loader2,
	Map as MapIcon,
	MapPin,
	Navigation,
	Search,
	XCircle,
	Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { IAreaPopulated } from "@/actions/area.action";
import type { IBusWithStops, IConnectingRoute } from "@/actions/bus.action";
import { useFetchAreas } from "@/hooks/useAreas";
import { useFindBusRoutes } from "@/hooks/useBus";
import { useFindNearestStop } from "@/hooks/useNearestStop";

const BusMap = dynamic(() => import("@/components/appComponents/BusMap"), {
	ssr: false,
	loading: () => (
		<div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center rounded-[2rem]">
			<MapIcon className="w-8 h-8 text-slate-300" />
		</div>
	),
});

// ─── Shared select field ──────────────────────────────────────────────────────
function SelectField({
	id,
	label,
	icon: Icon,
	value,
	onChange,
	disabled,
	children,
}: {
	id: string;
	label: string;
	icon: React.FC<{ className?: string }>;
	value: string;
	onChange: (v: string) => void;
	disabled?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<label
				htmlFor={id}
				className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1"
			>
				{label}
			</label>
			<div className="relative">
				<Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
				<select
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 focus:border-blue-400 rounded-2xl py-3.5 pl-11 pr-10 appearance-none font-semibold text-sm text-slate-800 outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{children}
				</select>
				<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
			</div>
		</div>
	);
}

// ─── Banner strip ─────────────────────────────────────────────────────────────
function Banner({
	type,
	children,
}: {
	type: "info" | "success" | "warning";
	children: React.ReactNode;
}) {
	const styles = {
		info: "bg-blue-50 border-blue-100 text-blue-800",
		success: "bg-emerald-50 border-emerald-100 text-emerald-800",
		warning: "bg-amber-50 border-amber-200 text-amber-800",
	};
	const icons = {
		info: <Loader2 className="w-4 h-4 animate-spin shrink-0" />,
		success: <MapPin className="w-4 h-4 shrink-0" />,
		warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
	};
	return (
		<div
			className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold ${styles[type]}`}
		>
			{icons[type]}
			{children}
		</div>
	);
}

// ─── Direct bus card ──────────────────────────────────────────────────────────
function DirectBusCard({
	bus,
	departureStopId,
	destinationStopId,
}: {
	bus: IBusWithStops;
	departureStopId: string;
	destinationStopId: string;
}) {
	return (
		<div className="bg-white rounded-[1.75rem] border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300 group">
			{/* Card header */}
			<div className="flex items-center justify-between px-6 pt-6 pb-4">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
						<BusIcon className="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<h3 className="text-base font-black text-slate-900">
							{bus.busName}
						</h3>
						<div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5 font-medium">
							<Clock className="w-3 h-3" />
							Direct Service
						</div>
					</div>
				</div>
				<span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
					Direct
				</span>
			</div>

			{/* Stops trail */}
			<div className="px-6 pb-5">
				<div className="flex flex-wrap items-center gap-2">
					{bus.stops.map((s, i) => {
						const isKey =
							s._id === departureStopId || s._id === destinationStopId;
						const isDep = s._id === departureStopId;
						return (
							<React.Fragment key={s._id}>
								<span
									className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
										isDep
											? "bg-blue-600 text-white shadow-md shadow-blue-200"
											: isKey
												? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
												: "bg-slate-50 text-slate-500 border border-slate-100"
									}`}
								>
									{s.stopName}
								</span>
								{i < bus.stops.length - 1 && (
									<ArrowRight className="w-3 h-3 text-slate-200 shrink-0" />
								)}
							</React.Fragment>
						);
					})}
				</div>
			</div>

			{/* Footer */}
			<div className="border-t border-slate-50 px-6 py-4 flex items-center justify-between bg-slate-50/40">
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
						<div className="w-2 h-2 rounded-full bg-blue-500" />
						Departure
					</span>
					<span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
						<div className="w-2 h-2 rounded-full bg-emerald-500" />
						Destination
					</span>
				</div>
				<button
					type="button"
					className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
				>
					<MapIcon className="w-3.5 h-3.5" />
					View Route
				</button>
			</div>
		</div>
	);
}

// ─── Connecting route card ────────────────────────────────────────────────────
function ConnectingRouteCard({ route }: { route: IConnectingRoute }) {
	const steps = [
		{
			num: 1,
			label: "First Leg",
			text: route.bus1.name,
			color: "blue",
			bg: "bg-blue-600",
		},
		{
			num: 2,
			label: "Transfer Point",
			text: route.transferAt.stopName,
			color: "amber",
			bg: "bg-amber-500",
			transfer: true,
		},
		{
			num: 3,
			label: "Final Leg",
			text: route.bus2.name,
			color: "emerald",
			bg: "bg-emerald-600",
		},
	];
	return (
		<div className="bg-white rounded-[1.75rem] border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300">
			<div className="flex items-center justify-between px-6 pt-6 pb-5">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
						<Navigation className="w-5 h-5 text-amber-600" />
					</div>
					<div>
						<h3 className="text-base font-black text-slate-900">
							Change at {route.transferAt.stopName}
						</h3>
						<p className="text-xs text-slate-400 font-medium mt-0.5">
							1 transfer required
						</p>
					</div>
				</div>
				<span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
					1 Transfer
				</span>
			</div>

			<div className="px-6 pb-6 space-y-2 relative">
				{/* Vertical connector */}
				<div className="absolute left-[35px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-blue-200 via-amber-200 to-emerald-200" />
				{steps.map((step) => (
					<div key={step.num} className="flex items-center gap-4 relative z-10">
						<div
							className={`w-7 h-7 rounded-full ${step.bg} text-white flex items-center justify-center font-black text-[10px] shrink-0 ring-4 ring-white`}
						>
							{step.num}
						</div>
						<div
							className={`flex-1 flex items-center justify-between rounded-2xl px-4 py-3 ${step.transfer ? "bg-amber-50 border border-amber-100" : "bg-slate-50"}`}
						>
							<div>
								<p
									className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${step.transfer ? "text-amber-400" : "text-slate-400"}`}
								>
									{step.label}
								</p>
								<p className="text-sm font-bold text-slate-900">{step.text}</p>
							</div>
							{step.transfer && <Zap className="w-3.5 h-3.5 text-amber-400" />}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── Empty / loading states ───────────────────────────────────────────────────
function EmptyState({
	icon: Icon,
	title,
	subtitle,
}: {
	icon: React.FC<{ className?: string }>;
	title: string;
	subtitle: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-20 bg-white rounded-[1.75rem] border border-dashed border-slate-200 text-center px-8">
			<div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
				<Icon className="w-6 h-6 text-slate-300" />
			</div>
			<p className="font-black text-slate-800 mb-1">{title}</p>
			<p className="text-sm text-slate-400 max-w-xs leading-relaxed">
				{subtitle}
			</p>
		</div>
	);
}

// ─── Main content ─────────────────────────────────────────────────────────────
function BusRouteContent() {
	const query = useSearchParams();
	const [departureAreaId, setDepartureAreaId] = useState<string>("");
	const [destinationAreaId, setDestinationAreaId] = useState<string>("");
	const [departureStopId, setDepartureStopId] = useState<string>("");
	const [destinationStopId, setDestinationStopId] = useState<string>("");
	const [searchParams, setSearchParams] = useState<{
		dep: string;
		dest: string;
	} | null>(null);
	const [nearestStopResolved, setNearestStopResolved] = useState(false);
	const autoSearchedRef = useRef(false);

	const { data: areaData = [] } = useFetchAreas();
	const areas: IAreaPopulated[] = areaData;

	const urlLat = query.get("lat");
	const urlLng = query.get("lng");
	const hasLatLng = Boolean(urlLat && urlLng);

	const { data: nearestStop, isLoading: isResolvingNearest } =
		useFindNearestStop(
			hasLatLng ? Number(urlLat) : undefined,
			hasLatLng ? Number(urlLng) : undefined,
		);

	const destLat = query.get("destLat");
	const destLng = query.get("destLng");
	const hasDestLatLng = Boolean(destLat && destLng);

	const { data: nearestDestStop, isLoading: isResolvingDestNearest } =
		useFindNearestStop(
			hasDestLatLng ? Number(destLat) : undefined,
			hasDestLatLng ? Number(destLng) : undefined,
		);

	useEffect(() => {
		const depA = query.get("depA"),
			depS = query.get("depS");
		const destA = query.get("destA"),
			destS = query.get("destS");
		if (depA) setDepartureAreaId(depA);
		if (destA) setDestinationAreaId(destA);
		if (depS) setDepartureStopId(depS);
		if (destS) setDestinationStopId(destS);
		if (depS && destS) setSearchParams({ dep: depS, dest: destS });
	}, [query]);

	useEffect(() => {
		if (nearestStop && !nearestStopResolved && !query.get("depS")) {
			setDepartureAreaId(nearestStop.areaId);
			setDepartureStopId(nearestStop.stopId);
			setNearestStopResolved(true);
		}
	}, [nearestStop, nearestStopResolved, query]);

	useEffect(() => {
		if (nearestDestStop && !query.get("destS")) {
			setDestinationAreaId(nearestDestStop.areaId);
			setDestinationStopId(nearestDestStop.stopId);
		}
	}, [nearestDestStop, query]);

	useEffect(() => {
		if (autoSearchedRef.current || isResolvingNearest || isResolvingDestNearest)
			return;
		if (!hasLatLng && !hasDestLatLng) return;
		const depId = nearestStop?.stopId || query.get("depS");
		const destId = nearestDestStop?.stopId || query.get("destS");
		if (depId && destId && depId !== destId) {
			autoSearchedRef.current = true;
			setSearchParams({ dep: depId, dest: destId });
		}
	}, [
		nearestStop,
		nearestDestStop,
		isResolvingNearest,
		isResolvingDestNearest,
		hasLatLng,
		hasDestLatLng,
		query,
	]);

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

	const departureCoords = useMemo(() => {
		const s = selectedDepartureArea?.stops?.find(
			(s) => s?.stop?._id === departureStopId,
		);
		if (s?.stop?.location?.coordinates) {
			const [lng, lat] = s.stop.location.coordinates;
			return [lat, lng] as [number, number];
		}
		return undefined;
	}, [selectedDepartureArea, departureStopId]);

	const destinationCoords = useMemo(() => {
		const s = selectedDestinationArea?.stops.find(
			(s) => s.stop?._id === destinationStopId,
		);
		if (s?.stop?.location?.coordinates) {
			const [lng, lat] = s.stop.location.coordinates;
			return [lat, lng] as [number, number];
		}
		return undefined;
	}, [selectedDestinationArea, destinationStopId]);

	const handleSearch = () => {
		if (
			!departureStopId ||
			!destinationStopId ||
			departureStopId === destinationStopId
		)
			return;
		setSearchParams({ dep: departureStopId, dest: destinationStopId });
	};

	const isResolvingAny = isResolvingNearest || isResolvingDestNearest;
	const isSameStop =
		departureStopId &&
		destinationStopId &&
		departureStopId === destinationStopId;
	const hasSearched = searchParams !== null;
	const noResults = hasSearched && !isSearching && !routeResults?.data?.length;

	const routeCount = routeResults?.data?.length ?? 0;
	const routeTypeLabel =
		routeResults?.type === "direct"
			? "Direct Buses"
			: routeResults?.type === "connecting"
				? "Connecting Routes"
				: "Available Routes";

	return (
		<div
			className="min-h-screen bg-[#f8f9fb]"
			style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
		>
			{/* ─── HERO ──────────────────────────────────────────────────────────── */}
			<div className="relative h-[82vh] min-h-[540px] max-h-[720px] overflow-hidden">
				{/* Background photo */}
				<Image
					width={500}
					height={500}
					src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1600&q=85&auto=format&fit=crop"
					alt="City bus at night"
					className="absolute inset-0 w-full h-full object-cover object-center"
				/>
				{/* Layered overlays for drama */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(135deg, rgba(15,23,64,0.93) 0%, rgba(30,64,175,0.78) 45%, rgba(0,0,0,0.55) 100%)",
					}}
				/>
				{/* Subtle noise texture */}
				<div
					className="absolute inset-0 opacity-[0.06]"
					style={{
						backgroundImage:
							"radial-gradient(circle, white 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>
				{/* Warm accent glow bottom-right */}
				<div
					className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl"
					style={{
						background: "radial-gradient(circle, #3b82f6, transparent 70%)",
					}}
				/>
				{/* Bottom fade to page */}
				<div
					className="absolute bottom-0 left-0 right-0 h-36"
					style={{
						background: "linear-gradient(to bottom, transparent, #f8f9fb)",
					}}
				/>

				{/* Content */}
				<div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-12 max-w-7xl mx-auto">
					{/* Top badge */}
					<div
						className="inline-flex items-center gap-2 self-start mb-6 px-4 py-1.5 rounded-full border border-white/25 backdrop-blur-sm text-white text-[11px] font-black uppercase tracking-[0.15em]"
						style={{ background: "rgba(255,255,255,0.10)" }}
					>
						<BusIcon className="w-3.5 h-3.5 text-blue-300" />
						Dhaka Bus Network
					</div>

					{/* Main headline */}
					<h1
						className="text-5xl md:text-7xl font-black text-white leading-[1.02] tracking-tight mb-5 max-w-3xl"
						style={{ textShadow: "0 4px 48px rgba(0,0,0,0.5)" }}
					>
						Get There
						<br />
						<span className="text-blue-300">Smarter.</span>
					</h1>
					<p className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
						Find direct & connecting bus routes across Dhaka city — with GPS
						stop detection and live navigation.
					</p>

					{/* Stat chips */}
					<div className="flex flex-wrap gap-3">
						{[
							{ icon: BusIcon, value: "200+", label: "Bus routes" },
							{ icon: MapPin, value: "1,800+", label: "Stops mapped" },
							{ icon: Navigation, value: "GPS", label: "Auto-locate" },
							{ icon: Clock, value: "Live", label: "Route updates" },
						].map((s) => {
							const Icon = s.icon;
							return (
								<div
									key={s.label}
									className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-white/15 backdrop-blur-md"
									style={{ background: "rgba(255,255,255,0.08)" }}
								>
									<div
										className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
										style={{ background: "rgba(59,130,246,0.35)" }}
									>
										<Icon className="w-3.5 h-3.5 text-blue-200" />
									</div>
									<span className="text-white font-black text-sm leading-none">
										{s.value}
									</span>
									<span className="text-white/45 text-xs font-semibold">
										{s.label}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 md:px-8 pb-24 -mt-4 space-y-6">
				{/* ─── BANNERS ─────────────────────────────────────────────────────── */}
				{isResolvingAny && (
					<Banner type="info">
						Finding nearest bus stops from your GPS location…
					</Banner>
				)}
				{nearestStopResolved && !isResolvingAny && (
					<Banner type="success">
						Nearest bus stop auto-selected from your GPS. You can change it
						below.
					</Banner>
				)}
				{isSameStop && (
					<Banner type="warning">
						Your departure and destination are the same stop. Please select
						different stops.
					</Banner>
				)}

				{/* ─── SEARCH PANEL ────────────────────────────────────────────────── */}
				<div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
					{/* Panel header */}
					<div className="px-8 pt-7 pb-5 border-b border-slate-50 flex items-center gap-4">
						<div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
							<Search className="w-4 h-4 text-white" />
						</div>
						<div>
							<h2 className="text-base font-black text-slate-900">
								Route Search
							</h2>
							<p className="text-slate-400 text-sm">
								Select your departure and destination stops
							</p>
						</div>
					</div>

					<div className="p-7">
						<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
							{/* Departure group */}
							<div className="md:col-span-4 space-y-4">
								<SelectField
									id="dep-area"
									label="Departure Area"
									icon={MapPin}
									value={departureAreaId}
									onChange={(v) => {
										setDepartureAreaId(v);
										setDepartureStopId("");
									}}
								>
									<option value="">Select Area</option>
									{areas.map((a) => (
										<option key={a._id} value={a._id}>
											{a.name}
										</option>
									))}
								</SelectField>
								<SelectField
									id="dep-stop"
									label="Departure Stop"
									icon={MapPin}
									value={departureStopId}
									onChange={setDepartureStopId}
									disabled={!departureAreaId}
								>
									<option value="">Select Bus Stop</option>
									{selectedDepartureArea?.stops?.map((item) => (
										<option key={item.stop?._id} value={item.stop?._id}>
											{item.stop?.stopName}
										</option>
									))}
								</SelectField>
							</div>

							{/* Divider with arrow */}
							<div className="md:col-span-1 flex md:flex-col items-center justify-center gap-2 py-2 md:py-0">
								<div className="flex-1 md:flex-none h-px md:h-8 md:w-px bg-slate-100" />
								<div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
									<ArrowRight className="w-3.5 h-3.5 text-slate-400" />
								</div>
								<div className="flex-1 md:flex-none h-px md:h-8 md:w-px bg-slate-100" />
							</div>

							{/* Destination group */}
							<div className="md:col-span-4 space-y-4">
								<SelectField
									id="dest-area"
									label="Destination Area"
									icon={Navigation}
									value={destinationAreaId}
									onChange={(v) => {
										setDestinationAreaId(v);
										setDestinationStopId("");
									}}
								>
									<option value="">Select Area</option>
									{areas.map((a) => (
										<option key={a._id} value={a._id}>
											{a.name}
										</option>
									))}
								</SelectField>
								<SelectField
									id="dest-stop"
									label="Destination Stop"
									icon={Navigation}
									value={destinationStopId}
									onChange={setDestinationStopId}
									disabled={!destinationAreaId}
								>
									<option value="">Select Bus Stop</option>
									{selectedDestinationArea?.stops?.map((item) => (
										<option key={item.stop?._id} value={item.stop?._id}>
											{item.stop?.stopName}
										</option>
									))}
								</SelectField>
							</div>

							{/* Search CTA */}
							<div className="md:col-span-3">
								<button
									type="button"
									onClick={handleSearch}
									disabled={
										!departureStopId ||
										!destinationStopId ||
										isSearching ||
										!!isSameStop
									}
									className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 text-white transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
									style={{
										background: "linear-gradient(135deg, #2563eb, #0284c7)",
										boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
									}}
								>
									{isSearching ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin" />
											Searching…
										</>
									) : (
										<>
											<Search className="w-4 h-4" />
											Find Routes
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* ─── RESULTS + MAP ───────────────────────────────────────────────── */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Left: routes */}
					<div className="lg:col-span-7 space-y-4">
						{/* Results header */}
						{(hasSearched || isSearching) && (
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-black text-slate-900">
									{routeTypeLabel}
									{routeCount > 0 && (
										<span className="ml-2 text-sm font-bold text-slate-400">
											({routeCount})
										</span>
									)}
								</h2>
								{routeResults?.type && (
									<span
										className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
											routeResults.type === "direct"
												? "bg-emerald-50 text-emerald-700 border-emerald-100"
												: "bg-amber-50 text-amber-700 border-amber-100"
										}`}
									>
										{routeResults.type === "direct"
											? "Direct"
											: "With Transfer"}
									</span>
								)}
							</div>
						)}

						{/* Initial state */}
						{!hasSearched && !isSearching && !isResolvingAny && (
							<EmptyState
								icon={BusIcon}
								title={
									departureStopId && destinationStopId
										? "Ready to search"
										: "Select your stops"
								}
								subtitle={
									departureStopId && destinationStopId
										? "Press Find Routes to see available buses."
										: "Choose a departure and destination stop, then search."
								}
							/>
						)}

						{/* Loading */}
						{(isSearching || isResolvingAny) && (
							<EmptyState
								icon={Loader2}
								title={
									isResolvingAny
										? "Locating nearest stops…"
										: "Searching routes…"
								}
								subtitle="This usually takes just a moment."
							/>
						)}

						{/* No results */}
						{noResults && !isSameStop && (
							<EmptyState
								icon={XCircle}
								title="No buses found"
								subtitle="No direct or connecting routes between these stops. Try selecting nearby stops."
							/>
						)}

						{/* Direct routes */}
						{!isSearching &&
							routeResults?.type === "direct" &&
							(routeResults.data as IBusWithStops[]).map((bus) => (
								<DirectBusCard
									key={bus._id}
									bus={bus}
									departureStopId={departureStopId}
									destinationStopId={destinationStopId}
								/>
							))}

						{/* Connecting routes */}
						{!isSearching &&
							routeResults?.type === "connecting" &&
							(routeResults.data as IConnectingRoute[]).map((route, idx) => (
								<ConnectingRouteCard key={idx} route={route} />
							))}
					</div>

					{/* Right: map */}
					<div className="lg:col-span-5 space-y-4">
						<h2 className="text-lg font-black text-slate-900">Route Preview</h2>

						<div
							className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm"
							style={{ height: 500 }}
						>
							<BusMap
								departure={departureCoords}
								destination={destinationCoords}
								transferStop={
									routeResults?.type === "connecting" &&
									routeResults?.data?.length > 0
										? (() => {
												const first = routeResults.data[0] as IConnectingRoute;
												if (
													first.transferAt?.location?.coordinates?.length === 2
												) {
													const [lng, lat] =
														first.transferAt.location.coordinates;
													return [lat, lng] as [number, number];
												}
												return undefined;
											})()
										: undefined
								}
								routeType={routeResults?.type || "direct"}
							/>
						</div>

						{/* Map disclaimer */}
						<div className="flex items-start gap-3 bg-white border border-slate-100 rounded-2xl px-5 py-4">
							<div className="w-7 h-7 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
								<Info className="w-3.5 h-3.5 text-red-400" />
							</div>
							<p className="text-xs text-slate-500 leading-relaxed font-medium">
								Map preview is approximate. Actual bus stops and routes may vary
								slightly.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default function BusRoutePage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="w-12 h-12 rounded-2xl bg-blue-100 animate-pulse" />
						<p className="text-sm text-slate-400 animate-pulse font-medium">
							Loading route finder…
						</p>
					</div>
				</div>
			}
		>
			<BusRouteContent />
		</Suspense>
	);
}

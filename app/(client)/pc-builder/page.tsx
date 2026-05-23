"use client";

import { type ClassValue, clsx } from "clsx";
import {
	Briefcase,
	Clapperboard,
	Code2,
	Cpu,
	ExternalLink,
	Gamepad2,
	HardDrive,
	LayoutGrid,
	Loader2,
	MemoryStick,
	Minus,
	Monitor,
	Plus,
	Rocket,
	RotateCcw,
	Search,
	ShoppingCart,
	Store,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type {
	IPCComponentPopulated,
	SuggestedBuild,
	SuggestionQuery,
} from "@/actions/pcComponent.action";
import { useSuggestedBuild } from "@/hooks/usePCComponents";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function formatPrice(price: number) {
	return new Intl.NumberFormat("bn-BD", {
		style: "currency",
		currency: "BDT",
		maximumFractionDigits: 0,
	}).format(price);
}

// ─── constants ────────────────────────────────────────────────────────────────

const USAGE_OPTIONS = [
	{
		id: "Gaming" as const,
		icon: Gamepad2,
		description: "Triple-A titles and competitive play.",
	},
	{
		id: "Content Creation" as const,
		icon: Clapperboard,
		description: "Video editing, 3D rendering, design.",
	},
	{
		id: "Development" as const,
		icon: Code2,
		description: "Coding, VMs, and data processing.",
	},
	{
		id: "Office & Web" as const,
		icon: Briefcase,
		description: "Browsing, Excel, and streaming.",
	},
];

const SOFTWARE_OPTIONS = [
	"Chrome / Edge",
	"Adobe Premiere",
	"Visual Studio Code",
	"Discord",
	"AutoCAD",
	"Microsoft Excel",
	"Blender",
	"DaVinci Resolve",
];

const STORAGE_OPTIONS = [
	{ id: "Light" as const, description: "Mostly cloud docs", gb: "256GB" },
	{ id: "Medium" as const, description: "Few big games", gb: "1TB" },
	{ id: "Heavy" as const, description: "Raw 4K video", gb: "4TB+" },
];

const BUDGET_OPTIONS = [
	{ id: "budget" as const, label: "Budget", sub: "Best value" },
	{ id: "mid" as const, label: "Mid-range", sub: "Balanced" },
	{ id: "high-end" as const, label: "High-end", sub: "No limits" },
];

const CATEGORY_META: Record<
	string,
	{
		icon: React.FC<{ className?: string }>;
		label: string;
		accent: string;
		iconBg: string;
	}
> = {
	CPU: {
		icon: Cpu,
		label: "Processor",
		accent: "border-blue-200 bg-blue-50/40",
		iconBg: "bg-blue-100 text-blue-600",
	},
	GPU: {
		icon: Monitor,
		label: "Graphics Card",
		accent: "border-violet-200 bg-violet-50/40",
		iconBg: "bg-violet-100 text-violet-600",
	},
	RAM: {
		icon: MemoryStick,
		label: "Memory",
		accent: "border-emerald-200 bg-emerald-50/40",
		iconBg: "bg-emerald-100 text-emerald-600",
	},
	Motherboard: {
		icon: HardDrive,
		label: "Motherboard",
		accent: "border-orange-200 bg-orange-50/40",
		iconBg: "bg-orange-100 text-orange-600",
	},
	Storage: {
		icon: HardDrive,
		label: "Storage",
		accent: "border-rose-200 bg-rose-50/40",
		iconBg: "bg-rose-100 text-rose-600",
	},
	PSU: {
		icon: Zap,
		label: "Power Supply",
		accent: "border-yellow-200 bg-yellow-50/40",
		iconBg: "bg-yellow-100 text-yellow-600",
	},
	Case: {
		icon: Monitor,
		label: "Case",
		accent: "border-slate-200 bg-slate-50/40",
		iconBg: "bg-slate-100 text-slate-600",
	},
	Cooler: {
		icon: Zap,
		label: "CPU Cooler",
		accent: "border-cyan-200 bg-cyan-50/40",
		iconBg: "bg-cyan-100 text-cyan-600",
	},
};

// ─── sub-components ───────────────────────────────────────────────────────────

function StockPill({ stock }: { stock: string }) {
	if (stock === "in_stock")
		return (
			<span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
				<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
				In Stock
			</span>
		);
	if (stock === "limited")
		return (
			<span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
				<span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
				Limited
			</span>
		);
	return (
		<span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
			<span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
			Out of Stock
		</span>
	);
}

function ComponentCard({
	component,
	rank,
}: {
	component: IPCComponentPopulated;
	rank: number;
}) {
	const meta = CATEGORY_META[component.category];
	const CategoryIcon = meta?.icon ?? Cpu;
	const sortedListings = [...(component.shopListings || [])].sort(
		(a, b) => a.price - b.price,
	);
	const lowestPrice = sortedListings[0]?.price;

	const rankLabel =
		rank === 0 ? "Best Value" : rank === 1 ? "Recommended" : "Premium";
	const rankStyle =
		rank === 0
			? "bg-emerald-50 text-emerald-700 border-emerald-200"
			: rank === 1
				? "bg-blue-50 text-blue-700 border-blue-200"
				: "bg-violet-50 text-violet-700 border-violet-200";

	// Safe specs handling
	const specs =
		component.specs && typeof component.specs === "object"
			? component.specs
			: {};

	return (
		<div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden">
			{/* top bar */}
			<div className="px-4 pt-4 pb-3 flex items-start gap-3">
				<div
					className={cn(
						"p-2 rounded-xl shrink-0",
						meta?.iconBg ?? "bg-slate-100 text-slate-600",
					)}
				>
					<CategoryIcon className="w-4 h-4" />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-0.5">
						<span
							className={cn(
								"text-[10px] font-bold border px-2 py-0.5 rounded-full",
								rankStyle,
							)}
						>
							{rankLabel}
						</span>
					</div>
					<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
						{component.brand}
					</p>
					<h4 className="text-sm font-bold text-slate-900 leading-snug truncate">
						{component.name}
					</h4>
				</div>
				{lowestPrice !== undefined && (
					<div className="text-right shrink-0">
						<p className="text-[10px] text-slate-400">from</p>
						<p className="text-base font-black text-slate-900">
							{formatPrice(lowestPrice)}
						</p>
					</div>
				)}
			</div>

			{/* specs chips - SAFE VERSION */}
			{Object.keys(specs).length > 0 && (
				<div className="px-4 pb-3 flex flex-wrap gap-1.5">
					{Object.entries(specs)
						.slice(0, 4)
						.map(([k, v]) => (
							<span
								key={k}
								className="text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded-full"
							>
								{k}: {String(v)}
							</span>
						))}
				</div>
			)}

			{/* divider */}
			<div className="border-t border-slate-100 mx-3" />

			{/* shop listings */}
			<div className="p-3 space-y-1">
				{sortedListings.length === 0 ? (
					<p className="text-xs text-slate-400 text-center py-3">
						No shop listings yet
					</p>
				) : (
					sortedListings.map((listing, i) => (
						<div
							key={listing._id}
							className={cn(
								"flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-colors",
								i === 0 ? "bg-slate-50" : "hover:bg-slate-50",
							)}
						>
							<div className="flex items-center gap-2 min-w-0">
								<Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
								<div className="min-w-0">
									<p className="text-xs font-semibold text-slate-800 truncate">
										{listing.shop.name}
									</p>
									<p className="text-[10px] text-slate-400 truncate">
										{listing.shop.location}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2 shrink-0">
								<StockPill stock={listing.stock} />
								<span
									className={cn(
										"text-sm font-bold",
										i === 0 ? "text-blue-600" : "text-slate-800",
									)}
								>
									{formatPrice(listing.price)}
								</span>
								{listing.url && (
									<a
										href={listing.url}
										target="_blank"
										rel="noopener noreferrer"
										className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
									>
										<ExternalLink className="w-3.5 h-3.5" />
									</a>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

function CategoryBlock({ build }: { build: SuggestedBuild }) {
	const meta = CATEGORY_META[build.category];
	const CategoryIcon = meta?.icon ?? Cpu;
	const [selected, setSelected] = useState(0);

	return (
		<div
			className={cn(
				"rounded-2xl border p-5",
				meta?.accent ?? "border-slate-100 bg-white",
			)}
		>
			{/* category header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2.5">
					<div
						className={cn(
							"p-2 rounded-xl",
							meta?.iconBg ?? "bg-slate-100 text-slate-600",
						)}
					>
						<CategoryIcon className="w-4 h-4" />
					</div>
					<div>
						<h3 className="text-sm font-bold text-slate-900">
							{meta?.label ?? build.category}
						</h3>
						<p className="text-[10px] text-slate-500">
							{build.components.length} option
							{build.components.length > 1 ? "s" : ""}
							{build.minSpecs?.minCores &&
								` • Min: ${build.minSpecs.minCores} cores`}
							{build.minSpecs?.minRAM &&
								` • Min: ${build.minSpecs.minRAM}GB RAM`}
						</p>
					</div>
				</div>

				{/* option switcher */}
				{build.components.length > 1 && (
					<div className="flex items-center gap-1 bg-white rounded-xl border border-slate-100 p-1">
						{build.components.map((_, i) => (
							<button
								key={i}
								type="button"
								onClick={() => setSelected(i)}
								className={cn(
									"text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all",
									selected === i
										? "bg-slate-900 text-white"
										: "text-slate-500 hover:text-slate-800",
								)}
							>
								{i === 0 ? "Value" : i === 1 ? "Recommended" : "Premium"}
							</button>
						))}
					</div>
				)}
			</div>

			{build.components[selected] && (
				<ComponentCard component={build.components[selected]} rank={selected} />
			)}
		</div>
	);
}

function ResultsSkeleton() {
	return (
		<div className="space-y-4">
			{[1, 2, 3, 4].map((i) => (
				<div
					key={i}
					className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4 animate-pulse"
				>
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-xl bg-slate-100" />
						<div className="space-y-1.5">
							<div className="h-3.5 w-20 bg-slate-100 rounded" />
							<div className="h-3 w-12 bg-slate-100 rounded" />
						</div>
					</div>
					<div className="h-32 bg-slate-50 rounded-xl" />
				</div>
			))}
		</div>
	);
}

// ─── main ─────────────────────────────────────────────────────────────────────

interface AppState {
	mainUsage: SuggestionQuery["mainUsage"];
	browserTabs: number;
	software: string[];
	storageNeeds: "Light" | "Medium" | "Heavy";
	budgetTier: "budget" | "mid" | "high-end";
}

export default function SmartPCSuggester() {
	const [state, setState] = useState<AppState>({
		mainUsage: "Gaming",
		browserTabs: 20,
		software: ["Chrome / Edge"],
		storageNeeds: "Medium",
		budgetTier: "mid",
	});

	const [submittedQuery, setSubmittedQuery] = useState<SuggestionQuery | null>(
		null,
	);

	const {
		data: builds,
		isLoading,
		isError,
	} = useSuggestedBuild(submittedQuery);

	const handleSearch = () => {
		setSubmittedQuery({ ...state });
	};

	const handleReset = () => {
		setSubmittedQuery(null);
	};

	const toggleSoftware = (item: string) => {
		setState((prev) => ({
			...prev,
			software: prev.software.includes(item)
				? prev.software.filter((s) => s !== item)
				: [...prev.software, item],
		}));
	};

	// estimated min build cost
	const estimatedMin =
		builds && builds.length > 0
			? builds.reduce((sum, b) => {
					const cheapest =
						[...(b.components[0]?.shopListings ?? [])].sort(
							(a, b) => a.price - b.price,
						)[0]?.price ?? 0;
					return sum + cheapest;
				}, 0)
			: null;

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			{/* ── header ── */}
			<header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
				<nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
					<Link href="/" className="hover:text-blue-600 transition-colors">
						Home
					</Link>
					<span className="text-slate-300">/</span>
					<span className="text-slate-900 font-medium">Smart PC Suggester</span>
				</nav>
				<h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
					Smart PC Suggester
				</h1>
				<p className="text-lg text-slate-600">
					Enter your workflow — we'll match real components from local shops.
				</p>
			</header>

			<main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-start">
				{/* ── LEFT: configurator ── */}
				<div className="space-y-6">
					{/* primary usage */}
					<section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-blue-50 rounded-lg">
								<Rocket className="w-5 h-5 text-blue-600" />
							</div>
							<h2 className="text-xl font-bold text-slate-900">
								What is your primary usage?
							</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{USAGE_OPTIONS.map((option) => {
								const Icon = option.icon;
								const active = state.mainUsage === option.id;
								return (
									<button
										type="button"
										key={option.id}
										onClick={() => {
											setState((p) => ({ ...p, mainUsage: option.id }));
											handleReset();
										}}
										className={cn(
											"flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all",
											active
												? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50"
												: "border-slate-100 hover:border-slate-200",
										)}
									>
										<div
											className={cn(
												"p-3 rounded-xl",
												active
													? "bg-blue-500 text-white"
													: "bg-slate-100 text-slate-500",
											)}
										>
											<Icon className="w-6 h-6" />
										</div>
										<div className="flex-1">
											<span className="block font-bold text-slate-900 mb-1">
												{option.id}
											</span>
											<p className="text-sm text-slate-500">
												{option.description}
											</p>
										</div>
									</button>
								);
							})}
						</div>
					</section>

					{/* workflow details */}
					<section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-blue-50 rounded-lg">
								<LayoutGrid className="w-5 h-5 text-blue-600" />
							</div>
							<h2 className="text-xl font-bold text-slate-900">
								Workflow Details
							</h2>
						</div>

						<div className="space-y-8">
							{/* browser tabs */}
							<div>
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm font-semibold text-slate-700">
										Browser Tabs
									</span>
									<span className="text-xl font-black text-blue-600">
										{state.browserTabs}+
									</span>
								</div>
								<div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 border border-slate-100">
									<button
										type="button"
										onClick={() =>
											setState((p) => ({
												...p,
												browserTabs: Math.max(0, p.browserTabs - 5),
											}))
										}
										className="p-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
									>
										<Minus className="w-4 h-4 text-slate-600" />
									</button>
									<input
										type="range"
										min={0}
										max={100}
										step={5}
										value={state.browserTabs}
										onChange={(e) =>
											setState((p) => ({
												...p,
												browserTabs: Number(e.target.value),
											}))
										}
										className="flex-1 accent-blue-600 h-1.5 cursor-pointer"
									/>
									<button
										type="button"
										onClick={() =>
											setState((p) => ({
												...p,
												browserTabs: Math.min(100, p.browserTabs + 5),
											}))
										}
										className="p-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
									>
										<Plus className="w-4 h-4 text-slate-600" />
									</button>
								</div>
							</div>

							{/* software */}
							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-3">
									Software Usage
								</span>
								<div className="flex flex-wrap gap-2">
									{SOFTWARE_OPTIONS.map((item) => (
										<button
											key={item}
											type="button"
											onClick={() => toggleSoftware(item)}
											className={cn(
												"px-4 py-2 rounded-full text-sm font-medium transition-all border",
												state.software.includes(item)
													? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
													: "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
											)}
										>
											{item}
										</button>
									))}
								</div>
							</div>

							{/* storage */}
							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-3">
									Storage Requirement
								</span>
								<div className="grid grid-cols-3 gap-3">
									{STORAGE_OPTIONS.map((opt) => (
										<button
											key={opt.id}
											type="button"
											onClick={() =>
												setState((p) => ({ ...p, storageNeeds: opt.id }))
											}
											className={cn(
												"p-4 rounded-xl border-2 text-center transition-all",
												state.storageNeeds === opt.id
													? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50"
													: "border-slate-100 hover:border-slate-200",
											)}
										>
											<span className="block font-bold text-slate-900">
												{opt.id}
											</span>
											<span className="block text-xs font-semibold text-blue-600 mt-0.5">
												{opt.gb}
											</span>
											<span className="text-[10px] text-slate-500 uppercase font-medium">
												{opt.description}
											</span>
										</button>
									))}
								</div>
							</div>

							{/* budget */}
							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-3">
									Budget Tier
								</span>
								<div className="grid grid-cols-3 gap-3">
									{BUDGET_OPTIONS.map((opt) => (
										<button
											key={opt.id}
											type="button"
											onClick={() =>
												setState((p) => ({ ...p, budgetTier: opt.id }))
											}
											className={cn(
												"p-4 rounded-xl border-2 text-center transition-all",
												state.budgetTier === opt.id
													? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50"
													: "border-slate-100 hover:border-slate-200",
											)}
										>
											<span className="block font-bold text-slate-900">
												{opt.label}
											</span>
											<span className="text-[10px] text-slate-500 uppercase font-medium">
												{opt.sub}
											</span>
										</button>
									))}
								</div>
							</div>
						</div>
					</section>
				</div>

				{/* ── RIGHT: results ── */}
				<aside className="space-y-5 lg:sticky lg:top-8">
					{/* summary + search card */}
					<div className="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
						<div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-slate-50 blur-3xl" />
						<div className="relative z-10">
							{/* label */}
							<span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 bg-blue-50 text-blue-600">
								Your Build Summary
							</span>

							{/* usage + budget */}
							<h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
								{state.mainUsage}
							</h3>
							<p className="text-sm text-slate-500 mb-5 capitalize">
								{state.budgetTier} tier · {state.storageNeeds} storage ·{" "}
								{state.browserTabs}+ tabs
							</p>

							{/* quick stat row */}
							<div className="grid grid-cols-3 gap-2 mb-6">
								{[
									{
										label: "Storage",
										value:
											STORAGE_OPTIONS.find((s) => s.id === state.storageNeeds)
												?.gb ?? "",
									},
									{ label: "Tabs", value: `${state.browserTabs}+` },
									{ label: "Software", value: `${state.software.length} apps` },
								].map((s) => (
									<div
										key={s.label}
										className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100"
									>
										<p className="text-sm font-black text-slate-900">
											{s.value}
										</p>
										<p className="text-[10px] text-slate-400 mt-0.5">
											{s.label}
										</p>
									</div>
								))}
							</div>

							{/* minimum specs info */}
							<div className="mb-5 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
								<p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">
									Recommended Specs
								</p>
								<div className="space-y-1.5 text-xs">
									<p className="text-slate-700">
										<span className="font-semibold">CPU Cores:</span>{" "}
										<span className="text-emerald-700 font-bold">
											{state.mainUsage === "Gaming"
												? "6+"
												: state.mainUsage === "Content Creation"
													? "12+"
													: state.mainUsage === "Development"
														? "4+"
														: "2+"}
										</span>
									</p>
									<p className="text-slate-700">
										<span className="font-semibold">RAM:</span>{" "}
										<span className="text-emerald-700 font-bold">
											{state.browserTabs > 50
												? "32GB+"
												: state.browserTabs > 30
													? "16GB+"
													: "8GB+"}
										</span>
									</p>
								</div>
							</div>

							{/* estimated price if results exist */}
							{estimatedMin !== null && estimatedMin > 0 && (
								<div className="mb-5 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
									<p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
										Estimated Build Cost
									</p>
									<p className="text-2xl font-black text-slate-900">
										{formatPrice(estimatedMin)}
										<span className="text-sm font-medium text-slate-500 ml-1">
											minimum
										</span>
									</p>
								</div>
							)}

							{/* CTA */}
							<button
								type="button"
								onClick={submittedQuery ? handleReset : handleSearch}
								disabled={isLoading}
								className={cn(
									"w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
									submittedQuery
										? "bg-slate-100 text-slate-700 hover:bg-slate-200"
										: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
								)}
							>
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Searching components...
									</>
								) : submittedQuery ? (
									<>
										<RotateCcw className="w-4 h-4" />
										Reset & Search Again
									</>
								) : (
									<>
										<Search className="w-4 h-4" />
										Find My Build
									</>
								)}
							</button>

							{!submittedQuery && (
								<p className="text-center text-[11px] text-slate-400 mt-3">
									Matches real components from local BD shops
								</p>
							)}
						</div>
					</div>

					{/* ── results area ── */}
					{isLoading && <ResultsSkeleton />}

					{isError && (
						<div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
							<p className="text-sm font-semibold text-red-600">
								Something went wrong. Please try again.
							</p>
						</div>
					)}

					{builds && builds.length === 0 && (
						<div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
							<ShoppingCart className="w-10 h-10 text-slate-200 mx-auto mb-3" />
							<p className="text-sm font-bold text-slate-700">
								No components found
							</p>
							<p className="text-xs text-slate-400 mt-1">
								Ask the admin to add components for this usage profile.
							</p>
						</div>
					)}

					{builds && builds.length > 0 && (
						<div className="space-y-4">
							<div className="flex items-center justify-between px-1">
								<p className="text-sm font-bold text-slate-900">
									Suggested Components
								</p>
								<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
									{builds.length} categories
								</span>
							</div>
							{builds.map((build) => (
								<CategoryBlock key={build.category} build={build} />
							))}
						</div>
					)}
				</aside>
			</main>
		</div>
	);
}

"use client";

import { type ClassValue, clsx } from "clsx";
import {
	AlertTriangle,
	ArrowLeft,
	Bus,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Cpu,
	ExternalLink,
	HardDrive,
	Loader2,
	type LucideIcon,
	MapPin,
	MemoryStick,
	Monitor,
	Package,
	ShieldCheck,
	ShoppingCart,
	Sparkles,
	Store,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
	type CompatibilityResult,
	checkBuildCompatibility,
} from "@/actions/ai.action";
import type {
	IPCComponentPopulated,
	IShopListingPopulated,
	SuggestedBuild,
	SuggestionQuery,
} from "@/actions/pcComponent.action";
import { useSuggestedBuild } from "@/hooks/usePCComponents";
import FindBusButton from "./FindBusButton";

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

// ─── Theme system matching SmartPCSuggester ───────────────────────────────────
const THEME: Record<
	string,
	{ from: string; to: string; accent: string; pill: string; pillText: string }
> = {
	Gaming: {
		from: "#6d28d9",
		to: "#4f46e5",
		accent: "#7c3aed",
		pill: "#ede9fe",
		pillText: "#5b21b6",
	},
	"Content Creation": {
		from: "#e11d48",
		to: "#be185d",
		accent: "#f43f5e",
		pill: "#ffe4e6",
		pillText: "#9f1239",
	},
	Development: {
		from: "#1d4ed8",
		to: "#0284c7",
		accent: "#2563eb",
		pill: "#dbeafe",
		pillText: "#1e40af",
	},
	"Office & Web": {
		from: "#059669",
		to: "#0d9488",
		accent: "#10b981",
		pill: "#d1fae5",
		pillText: "#065f46",
	},
};
const DEFAULT_THEME = THEME.Gaming;
function getTheme(usage: string) {
	return THEME[usage] ?? DEFAULT_THEME;
}

const HERO_IMAGES: Record<string, string> = {
	Gaming:
		"https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=1400&q=80&auto=format&fit=crop",
	"Content Creation":
		"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1400&q=80&auto=format&fit=crop",
	Development:
		"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=80&auto=format&fit=crop",
	"Office & Web":
		"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&auto=format&fit=crop",
};

// ─── Category meta ────────────────────────────────────────────────────────────
const CATEGORY_META: Record<
	string,
	{ icon: LucideIcon; label: string; color: string; bg: string }
> = {
	CPU: { icon: Cpu, label: "Processor", color: "#2563eb", bg: "#dbeafe" },
	GPU: {
		icon: Monitor,
		label: "Graphics Card",
		color: "#7c3aed",
		bg: "#ede9fe",
	},
	RAM: { icon: MemoryStick, label: "Memory", color: "#059669", bg: "#d1fae5" },
	Motherboard: {
		icon: HardDrive,
		label: "Motherboard",
		color: "#d97706",
		bg: "#fef3c7",
	},
	Storage: {
		icon: HardDrive,
		label: "Storage",
		color: "#e11d48",
		bg: "#ffe4e6",
	},
	PSU: { icon: Zap, label: "Power Supply", color: "#ca8a04", bg: "#fef9c3" },
	Case: { icon: Package, label: "Case", color: "#475569", bg: "#f1f5f9" },
	Cooler: { icon: Zap, label: "CPU Cooler", color: "#0891b2", bg: "#cffafe" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMinPrice(component: IPCComponentPopulated): number {
	if (!component.shopListings || component.shopListings.length === 0) return 0;
	return Math.min(...component.shopListings.map((l) => l.price));
}
function pickMinBuild(builds: SuggestedBuild[]): IPCComponentPopulated[] {
	return builds
		.map((b) => {
			const valid = b.components.filter(
				(c) => c.shopListings && c.shopListings.length > 0,
			);
			if (!valid.length) return null;
			return valid.sort((a, b) => getMinPrice(a) - getMinPrice(b))[0];
		})
		.filter(Boolean) as IPCComponentPopulated[];
}
function pickRecommendedBuild(
	builds: SuggestedBuild[],
): IPCComponentPopulated[] {
	return builds
		.map((b) => {
			const valid = b.components.filter(
				(c) => c.shopListings && c.shopListings.length > 0,
			);
			if (!valid.length) return null;
			const sorted = valid.sort((a, b) => getMinPrice(a) - getMinPrice(b));
			return sorted[sorted.length >= 2 ? 1 : 0];
		})
		.filter(Boolean) as IPCComponentPopulated[];
}
function totalCost(components: IPCComponentPopulated[]): number {
	return components.reduce((sum, c) => sum + getMinPrice(c), 0);
}

// ─── Stock pill ───────────────────────────────────────────────────────────────
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

// ─── Compatibility card ───────────────────────────────────────────────────────
function CompatibilityCard({
	result,
	onClose,
}: {
	result: CompatibilityResult;
	onClose: () => void;
}) {
	const hasErrors = result.issues.some((i) => i.severity === "error");
	const hasWarnings = result.issues.some((i) => i.severity === "warning");
	const isGood = result.compatible && !hasWarnings;

	return (
		<div
			className={cn(
				"rounded-3xl border p-6 space-y-4",
				isGood
					? "border-emerald-200 bg-emerald-50/60"
					: hasErrors
						? "border-red-200 bg-red-50/60"
						: "border-amber-200 bg-amber-50/60",
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"w-9 h-9 rounded-2xl flex items-center justify-center",
							isGood
								? "bg-emerald-100"
								: hasErrors
									? "bg-red-100"
									: "bg-amber-100",
						)}
					>
						{isGood ? (
							<ShieldCheck className="w-4 h-4 text-emerald-600" />
						) : (
							<AlertTriangle
								className={cn(
									"w-4 h-4",
									hasErrors ? "text-red-600" : "text-amber-600",
								)}
							/>
						)}
					</div>
					<div>
						<p className="text-sm font-black text-slate-900">
							Compatibility Report
						</p>
						<p
							className={cn(
								"text-[11px] font-medium",
								isGood
									? "text-emerald-600"
									: hasErrors
										? "text-red-600"
										: "text-amber-600",
							)}
						>
							{isGood
								? "All clear — components are compatible"
								: hasErrors
									? "Issues found"
									: "Warnings detected"}
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="text-xs text-slate-400 hover:text-slate-700 font-semibold px-3 py-1.5 rounded-xl hover:bg-white/60 transition-colors"
				>
					Dismiss
				</button>
			</div>

			<p className="text-xs text-slate-700 leading-relaxed bg-white/60 rounded-2xl p-4">
				{result.summary}
			</p>

			{result.issues.length > 0 && (
				<div className="space-y-2">
					{result.issues.map((issue, i) => (
						<div
							key={i}
							className={cn(
								"rounded-2xl p-4 border text-xs space-y-1.5",
								issue.severity === "error"
									? "bg-red-50 border-red-100"
									: "bg-amber-50 border-amber-100",
							)}
						>
							<div className="flex items-center gap-2">
								<span
									className={cn(
										"text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
										issue.severity === "error"
											? "bg-red-200 text-red-700"
											: "bg-amber-200 text-amber-700",
									)}
								>
									{issue.severity}
								</span>
								<span className="font-bold text-slate-800">
									{issue.component}
								</span>
							</div>
							<p className="text-slate-600">{issue.issue}</p>
							<p className="text-slate-500">
								<span className="font-semibold">Fix:</span> {issue.fix}
							</p>
						</div>
					))}
				</div>
			)}

			<div className="grid grid-cols-2 gap-3">
				{result.totalEstimatedWattage > 0 && (
					<div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 border border-slate-100">
						<span className="text-[11px] text-slate-500 font-medium">
							System draw
						</span>
						<span className="font-black text-slate-900 text-sm">
							~{result.totalEstimatedWattage}W
						</span>
					</div>
				)}
				{result.psuRecommendedWattage > 0 && (
					<div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 border border-slate-100">
						<span className="text-[11px] text-slate-500 font-medium">
							Suggested PSU
						</span>
						<span className="font-black text-blue-600 text-sm">
							{result.psuRecommendedWattage}W+
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

// ─── Shop listing row ─────────────────────────────────────────────────────────
function ShopListingRow({
	listing,
	isCheapest,
}: {
	listing: IShopListingPopulated;
	isCheapest: boolean;
	accent: string;
}) {
	const [showBus, setShowBus] = useState(false);
	const shop = listing.shop;

	return (
		<div
			className={cn(
				"rounded-2xl border transition-all overflow-hidden",
				isCheapest
					? "border-blue-200 bg-blue-50/50"
					: "border-slate-100 bg-white hover:border-slate-200",
			)}
		>
			<div className="flex items-center justify-between gap-3 px-4 py-3">
				<div className="flex items-center gap-3 min-w-0">
					<div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
						<Store className="w-4 h-4 text-slate-400" />
					</div>
					<div className="min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<p className="text-sm font-bold text-slate-900 truncate">
								{shop.name}
							</p>
							{isCheapest && (
								<span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full shrink-0">
									LOWEST
								</span>
							)}
						</div>
						<p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
							<MapPin className="w-2.5 h-2.5 shrink-0" />
							{shop.location}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3 shrink-0">
					<div className="text-right">
						<StockPill stock={listing.stock} />
						<p
							className={cn(
								"text-base font-black mt-0.5",
								isCheapest ? "text-blue-600" : "text-slate-900",
							)}
						>
							{formatPrice(listing.price)}
						</p>
					</div>
					<div className="flex flex-col gap-1">
						{listing.url && (
							<a
								href={listing.url}
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
								title="View in store"
							>
								<ExternalLink className="w-3.5 h-3.5" />
							</a>
						)}
						<button
							type="button"
							onClick={() => setShowBus((v) => !v)}
							className={cn(
								"w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
								showBus
									? "bg-emerald-600 text-white"
									: "hover:bg-emerald-50 text-emerald-600",
							)}
							title="Find bus route"
						>
							<Bus className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			</div>
			{showBus && (
				<div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
					<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
						Bus route to {shop.name}
					</p>
					<FindBusButton hospitalLat={shop.lat} hospitalLng={shop.long} />
				</div>
			)}
		</div>
	);
}

// ─── Component row ────────────────────────────────────────────────────────────
function BuildComponentRow({
	component,
	accent,
}: {
	component: IPCComponentPopulated;
	accent: string;
	pill: string;
}) {
	const meta = CATEGORY_META[component.category];
	const CategoryIcon = meta?.icon ?? Cpu;
	const [expanded, setExpanded] = useState(false);

	const sortedListings = [...(component.shopListings ?? [])].sort(
		(a, b) => a.price - b.price,
	);
	const lowestPrice = sortedListings[0]?.price;
	const specs =
		component.specs && typeof component.specs === "object"
			? component.specs
			: {};

	return (
		<div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-all">
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/60 transition-colors"
			>
				{/* Category icon */}
				<div
					className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
					style={{ background: meta?.bg ?? "#f1f5f9" }}
				>
					<CategoryIcon
						className="w-4 h-4"
						style={{ color: meta?.color ?? "#64748b" }}
					/>
				</div>
				{/* Info */}
				<div className="flex-1 min-w-0">
					<p
						className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
						style={{ color: meta?.color ?? "#94a3b8" }}
					>
						{meta?.label ?? component.category} · {component.brand}
					</p>
					<p className="text-sm font-bold text-slate-900 truncate">
						{component.name}
					</p>
					{Object.keys(specs).length > 0 && (
						<div className="flex flex-wrap gap-1 mt-1.5">
							{Object.entries(specs)
								.slice(0, 3)
								.map(([k, v]) => (
									<span
										key={k}
										className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full"
									>
										{k}: {String(v)}
									</span>
								))}
						</div>
					)}
				</div>
				{/* Price + toggle */}
				<div className="text-right shrink-0 flex flex-col items-end gap-1">
					{lowestPrice !== undefined ? (
						<>
							<p className="text-[10px] text-slate-400">from</p>
							<p className="text-base font-black text-slate-900">
								{formatPrice(lowestPrice)}
							</p>
						</>
					) : (
						<p className="text-xs text-slate-400">No listings</p>
					)}
					<div
						className="flex items-center gap-1 text-[10px] font-bold"
						style={{ color: accent }}
					>
						{expanded ? (
							<ChevronUp className="w-3 h-3" />
						) : (
							<ChevronDown className="w-3 h-3" />
						)}
						{expanded
							? "Hide"
							: `${sortedListings.length} shop${sortedListings.length !== 1 ? "s" : ""}`}
					</div>
				</div>
			</button>

			{expanded && (
				<div className="px-4 pb-4 border-t border-slate-50 bg-slate-50/30">
					{sortedListings.length > 0 ? (
						<>
							<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3">
								Available at
							</p>
							<div className="space-y-2">
								{sortedListings.map((listing, i) => (
									<ShopListingRow
										key={listing._id}
										listing={listing}
										isCheapest={i === 0}
										accent={accent}
									/>
								))}
							</div>
						</>
					) : (
						<p className="text-xs text-slate-400 text-center py-4">
							No shop listings yet
						</p>
					)}
				</div>
			)}
		</div>
	);
}

// ─── Build column ─────────────────────────────────────────────────────────────
function BuildColumn({
	title,
	subtitle,
	badge,
	components,
	totalCost: cost,
	highlight,
	theme,
}: {
	title: string;
	subtitle: string;
	badge: string;
	components: IPCComponentPopulated[];
	totalCost: number;
	highlight?: boolean;
	theme: typeof DEFAULT_THEME;
}) {
	return (
		<div
			className={cn(
				"rounded-[2rem] border overflow-hidden flex flex-col",
				highlight
					? "border-blue-100 shadow-xl shadow-blue-100/40"
					: "border-slate-100 shadow-sm",
			)}
		>
			{/* Column header */}
			<div
				className="p-6"
				style={
					highlight
						? {
								background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
							}
						: { background: "#f8fafc" }
				}
			>
				<span
					className={cn(
						"text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block mb-3",
						highlight
							? "bg-white/20 text-white border-white/30"
							: "bg-white text-slate-600 border-slate-200",
					)}
				>
					{badge}
				</span>
				<h2
					className={cn(
						"text-xl font-black leading-tight mb-0.5",
						highlight ? "text-white" : "text-slate-900",
					)}
				>
					{title}
				</h2>
				<p
					className={cn(
						"text-xs",
						highlight ? "text-white/70" : "text-slate-500",
					)}
				>
					{subtitle}
				</p>

				{/* Total price */}
				<div
					className={cn(
						"mt-4 rounded-2xl p-4",
						highlight
							? "bg-white/15 border border-white/20"
							: "bg-white border border-slate-100",
					)}
				>
					<p
						className={cn(
							"text-[10px] font-bold uppercase tracking-widest mb-0.5",
							highlight ? "text-white/60" : "text-slate-400",
						)}
					>
						Estimated Total
					</p>
					<p
						className={cn(
							"text-3xl font-black tabular-nums",
							highlight ? "text-white" : "text-slate-900",
						)}
					>
						{formatPrice(cost)}
					</p>
					<p
						className={cn(
							"text-[10px] mt-0.5",
							highlight ? "text-white/50" : "text-slate-400",
						)}
					>
						minimum from cheapest shops
					</p>
				</div>
			</div>

			{/* Component list */}
			<div className="flex-1 bg-white p-4 space-y-2">
				{components.map((component) => (
					<BuildComponentRow
						key={component._id}
						component={component}
						accent={theme.accent}
						pill={theme.pill}
					/>
				))}
			</div>
		</div>
	);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PageSkeleton() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{[0, 1].map((i) => (
				<div
					key={i}
					className="rounded-[2rem] border border-slate-100 overflow-hidden animate-pulse"
				>
					<div className="h-52 bg-slate-100" />
					<div className="p-4 space-y-3 bg-white">
						{[1, 2, 3, 4, 5].map((j) => (
							<div key={j} className="h-16 bg-slate-50 rounded-2xl" />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BuildResultClient() {
	const params = useSearchParams();

	const query: SuggestionQuery = useMemo(
		() => ({
			mainUsage: (params.get("usage") ??
				"Gaming") as SuggestionQuery["mainUsage"],
			budgetTier: (params.get("budget") ??
				"mid") as SuggestionQuery["budgetTier"],
			storageNeeds: (params.get("storage") ??
				"Medium") as SuggestionQuery["storageNeeds"],
			browserTabs: Number(params.get("tabs") ?? 20),
			software: params.get("software")?.split(",").filter(Boolean) ?? [],
		}),
		[params],
	);

	const theme = getTheme(query.mainUsage);
	const heroImg = HERO_IMAGES[query.mainUsage] ?? HERO_IMAGES.Gaming;

	const { data: builds, isLoading, isError } = useSuggestedBuild(query);

	const [compatibilityResult, setCompatibilityResult] =
		useState<CompatibilityResult | null>(null);
	const [compatibilityLoading, setCompatibilityLoading] = useState(false);

	useEffect(() => {
		if (!builds || builds.length === 0) return;
		const pickedComponents = builds
			.map((b) => b.components[0])
			.filter((c): c is IPCComponentPopulated => c !== undefined);
		if (!pickedComponents.length) return;
		setCompatibilityLoading(true);
		setCompatibilityResult(null);
		checkBuildCompatibility(pickedComponents)
			.then(setCompatibilityResult)
			.finally(() => setCompatibilityLoading(false));
	}, [builds]);

	const minBuild = useMemo(
		() => (builds ? pickMinBuild(builds) : []),
		[builds],
	);
	const recBuild = useMemo(
		() => (builds ? pickRecommendedBuild(builds) : []),
		[builds],
	);
	const minCost = useMemo(() => totalCost(minBuild), [minBuild]);
	const recCost = useMemo(() => totalCost(recBuild), [recBuild]);

	return (
		<div
			className="min-h-screen bg-[#f8f9fb]"
			style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
		>
			{/* ─── HERO BANNER ─────────────────────────────────────────────────────── */}
			<div className="relative h-72 overflow-hidden">
				<Image
					width={500}
					height={500}
					src={heroImg}
					alt={query.mainUsage}
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div
					className="absolute inset-0"
					style={{
						background: `linear-gradient(135deg, ${theme.from}f0 0%, ${theme.to}cc 55%, #00000099 100%)`,
					}}
				/>
				{/* Dot texture */}
				<div
					className="absolute inset-0 opacity-[0.07]"
					style={{
						backgroundImage:
							"radial-gradient(circle, white 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				{/* Bottom fade */}
				<div
					className="absolute bottom-0 left-0 right-0 h-24"
					style={{
						background: "linear-gradient(to bottom, transparent, #f8f9fb)",
					}}
				/>

				{/* Back link + content */}
				<div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-10 max-w-7xl mx-auto py-6">
					<Link
						href="/pc-builder"
						className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors self-start bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 rounded-full"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						Back to Suggester
					</Link>

					<div className="flex items-end justify-between flex-wrap gap-5 pb-4">
						<div>
							<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest mb-3">
								<CheckCircle2 className="w-3 h-3" />
								Your PC Build Plan
							</div>
							<h1
								className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-1"
								style={{ textShadow: "0 2px 24px rgba(0,0,0,0.3)" }}
							>
								{query.mainUsage}
							</h1>
							<p className="text-white/65 text-sm capitalize">
								{query.budgetTier} tier · {query.storageNeeds} storage ·{" "}
								{query.browserTabs}+ tabs
							</p>
						</div>

						{/* Price chips — only show once data loaded */}
						{!isLoading && builds && builds.length > 0 && (
							<div className="flex gap-3">
								<div className="backdrop-blur bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-center">
									<p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">
										Min Build
									</p>
									<p className="text-xl font-black text-white tabular-nums">
										{formatPrice(minCost)}
									</p>
								</div>
								<div
									className="rounded-2xl px-5 py-3 text-center"
									style={{
										background: `linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.10))`,
										border: "1px solid rgba(255,255,255,0.35)",
									}}
								>
									<p className="text-[10px] text-white/70 uppercase tracking-wider font-bold">
										Recommended
									</p>
									<p className="text-xl font-black text-white tabular-nums">
										{formatPrice(recCost)}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ─── MAIN CONTENT ────────────────────────────────────────────────────── */}
			<main className="max-w-7xl mx-auto px-4 md:px-8 pb-24 -mt-2 space-y-5">
				{/* Loading */}
				{isLoading && <PageSkeleton />}

				{/* Error */}
				{isError && (
					<div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center">
						<div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
							<AlertTriangle className="w-5 h-5 text-red-500" />
						</div>
						<p className="text-sm font-bold text-red-700 mb-1">
							Could not load components
						</p>
						<p className="text-xs text-red-500">
							Please go back and try again.
						</p>
					</div>
				)}

				{/* Empty state */}
				{builds && builds.length === 0 && (
					<div className="bg-white border border-slate-100 rounded-3xl p-14 text-center shadow-sm">
						<div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-5 border border-slate-100">
							<ShoppingCart className="w-7 h-7 text-slate-300" />
						</div>
						<p className="text-base font-black text-slate-800 mb-1">
							No components found
						</p>
						<p className="text-sm text-slate-400 mb-6">
							Ask the admin to add components for this usage profile.
						</p>
						<Link
							href="/pc-suggester"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all"
							style={{
								background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
							}}
						>
							<ArrowLeft className="w-4 h-4" />
							Go Back
						</Link>
					</div>
				)}

				{/* Results */}
				{builds && builds.length > 0 && (
					<>
						{/* Tip banner */}
						<div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-100 bg-amber-50">
							<Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
							<p className="text-xs text-amber-800 leading-relaxed">
								Click any component row to expand and see all shops with live
								prices. Use the{" "}
								<span className="inline-flex items-center gap-0.5 font-bold">
									<Bus className="w-3 h-3" /> bus icon
								</span>{" "}
								to find a route to that shop.
							</p>
						</div>

						{/* Compatibility loading */}
						{compatibilityLoading && (
							<div className="flex items-center gap-3 p-4 rounded-2xl border border-violet-100 bg-violet-50/60">
								<Loader2 className="w-4 h-4 text-violet-500 animate-spin shrink-0" />
								<p className="text-xs text-violet-700 font-semibold">
									Running compatibility check across all components…
								</p>
							</div>
						)}

						{/* Compatibility result */}
						{compatibilityResult && (
							<CompatibilityCard
								result={compatibilityResult}
								onClose={() => setCompatibilityResult(null)}
							/>
						)}

						{/* Build columns */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
							<BuildColumn
								title="Minimum Build"
								subtitle="Lowest cost that still gets the job done"
								badge="Budget Pick"
								components={minBuild}
								totalCost={minCost}
								theme={theme}
							/>
							<BuildColumn
								title="Recommended Build"
								subtitle="Best balance of performance and value"
								badge="⭐ Recommended"
								components={recBuild}
								totalCost={recCost}
								highlight
								theme={theme}
							/>
						</div>
					</>
				)}
			</main>
		</div>
	);
}

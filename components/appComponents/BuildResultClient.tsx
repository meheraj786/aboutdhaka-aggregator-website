"use client";

import { type ClassValue, clsx } from "clsx";
import {
	AlertTriangle,
	ArrowLeft,
	Bus,
	CheckCircle2,
	Cpu,
	ExternalLink,
	HardDrive,
	Loader2,
	MapPin,
	MemoryStick,
	Monitor,
	ShieldCheck,
	ShoppingCart,
	Sparkles,
	Store,
	Zap,
} from "lucide-react";
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

const CATEGORY_META: Record<
	string,
	{ icon: React.FC<{ className?: string }>; label: string; iconBg: string }
> = {
	CPU: { icon: Cpu, label: "Processor", iconBg: "bg-blue-100 text-blue-600" },
	GPU: {
		icon: Monitor,
		label: "Graphics Card",
		iconBg: "bg-violet-100 text-violet-600",
	},
	RAM: {
		icon: MemoryStick,
		label: "Memory",
		iconBg: "bg-emerald-100 text-emerald-600",
	},
	Motherboard: {
		icon: HardDrive,
		label: "Motherboard",
		iconBg: "bg-orange-100 text-orange-600",
	},
	Storage: {
		icon: HardDrive,
		label: "Storage",
		iconBg: "bg-rose-100 text-rose-600",
	},
	PSU: {
		icon: Zap,
		label: "Power Supply",
		iconBg: "bg-yellow-100 text-yellow-600",
	},
	Case: { icon: Monitor, label: "Case", iconBg: "bg-slate-100 text-slate-600" },
	Cooler: {
		icon: Zap,
		label: "CPU Cooler",
		iconBg: "bg-cyan-100 text-cyan-600",
	},
};

function getMinPrice(component: IPCComponentPopulated): number {
	if (!component.shopListings || component.shopListings.length === 0) return 0;
	return Math.min(...component.shopListings.map((l) => l.price));
}

function pickMinBuild(builds: SuggestedBuild[]): IPCComponentPopulated[] {
	return builds
		.map((b) => {
			const validComponents = b.components.filter(
				(c) => c.shopListings && c.shopListings.length > 0,
			);
			if (validComponents.length === 0) return null;
			return validComponents.sort((a, b) => getMinPrice(a) - getMinPrice(b))[0];
		})
		.filter(Boolean) as IPCComponentPopulated[];
}

function pickRecommendedBuild(
	builds: SuggestedBuild[],
): IPCComponentPopulated[] {
	return builds
		.map((b) => {
			const validComponents = b.components.filter(
				(c) => c.shopListings && c.shopListings.length > 0,
			);
			if (validComponents.length === 0) return null;
			const sorted = validComponents.sort(
				(a, b) => getMinPrice(a) - getMinPrice(b),
			);
			const idx = sorted.length >= 3 ? 1 : sorted.length === 2 ? 1 : 0;
			return sorted[idx];
		})
		.filter(Boolean) as IPCComponentPopulated[];
}

function totalCost(components: IPCComponentPopulated[]): number {
	return components.reduce((sum, c) => sum + getMinPrice(c), 0);
}

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

function CompatibilityCard({
	result,
	onClose,
}: {
	result: CompatibilityResult;
	onClose: () => void;
}) {
	const hasErrors = result.issues.some((i) => i.severity === "error");
	const hasWarnings = result.issues.some((i) => i.severity === "warning");

	return (
		<div
			className={cn(
				"rounded-2xl border p-5 space-y-4",
				result.compatible && !hasWarnings
					? "border-emerald-200 bg-emerald-50/40"
					: hasErrors
						? "border-red-200 bg-red-50/40"
						: "border-amber-200 bg-amber-50/40",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					{result.compatible && !hasErrors ? (
						<ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
					) : hasErrors ? (
						<AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
					) : (
						<AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
					)}
					<p className="text-sm font-bold text-slate-900">
						Compatibility Report
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="text-[10px] text-slate-400 hover:text-slate-600 font-medium"
				>
					Dismiss
				</button>
			</div>

			<p className="text-xs text-slate-700 leading-relaxed">{result.summary}</p>

			{result.issues.length > 0 && (
				<div className="space-y-2">
					{result.issues.map((issue, i) => (
						<div
							key={i}
							className={cn(
								"rounded-xl p-3 border text-xs space-y-1",
								issue.severity === "error"
									? "bg-red-50 border-red-100"
									: "bg-amber-50 border-amber-100",
							)}
						>
							<div className="flex items-center gap-1.5">
								<span
									className={cn(
										"text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full",
										issue.severity === "error"
											? "bg-red-200 text-red-700"
											: "bg-amber-200 text-amber-700",
									)}
								>
									{issue.severity}
								</span>
								<span className="font-bold text-slate-700">
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

			{result.totalEstimatedWattage > 0 && (
				<div className="flex items-center justify-between text-xs bg-white rounded-xl px-3 py-2 border border-slate-100">
					<span className="text-slate-500">Estimated system power draw</span>
					<span className="font-bold text-slate-900">
						~{result.totalEstimatedWattage}W
					</span>
				</div>
			)}

			{result.psuRecommendedWattage > 0 && (
				<div className="flex items-center justify-between text-xs bg-white rounded-xl px-3 py-2 border border-slate-100">
					<span className="text-slate-500">Recommended PSU wattage</span>
					<span className="font-bold text-blue-600">
						{result.psuRecommendedWattage}W+
					</span>
				</div>
			)}
		</div>
	);
}

function ShopListingRow({
	listing,
	isCheapest,
}: {
	listing: IShopListingPopulated;
	isCheapest: boolean;
}) {
	const [showBus, setShowBus] = useState(false);
	const shop = listing.shop;

	return (
		<div
			className={cn(
				"rounded-xl border transition-all",
				isCheapest
					? "border-blue-200 bg-blue-50/40"
					: "border-slate-100 bg-white hover:border-slate-200",
			)}
		>
			<div className="flex items-center justify-between gap-3 px-4 py-3">
				<div className="flex items-center gap-3 min-w-0">
					<div className="p-2 bg-white rounded-xl border border-slate-100 shrink-0">
						<Store className="w-4 h-4 text-slate-500" />
					</div>
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<p className="text-sm font-bold text-slate-900 truncate">
								{shop.name}
							</p>
							{isCheapest && (
								<span className="text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-full shrink-0">
									LOWEST
								</span>
							)}
						</div>
						<p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
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

					<div className="flex flex-col gap-1.5">
						{listing.url && (
							<a
								href={listing.url}
								target="_blank"
								rel="noopener noreferrer"
								className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
								title="View in store"
							>
								<ExternalLink className="w-4 h-4" />
							</a>
						)}
						<button
							type="button"
							onClick={() => setShowBus((v) => !v)}
							className={cn(
								"p-1.5 rounded-lg transition-colors",
								showBus
									? "bg-emerald-600 text-white"
									: "hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700",
							)}
							title="Find bus route to this shop"
						>
							<Bus className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			{showBus && (
				<div className="px-4 pb-4 pt-1 border-t border-slate-100">
					<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
						Bus route to {shop.name}
					</p>
					<FindBusButton hospitalLat={shop.lat} hospitalLng={shop.long} />
				</div>
			)}
		</div>
	);
}

function BuildComponentRow({
	component,
}: {
	component: IPCComponentPopulated;
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
		<div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
			>
				<div
					className={cn(
						"p-2 rounded-xl shrink-0",
						meta?.iconBg ?? "bg-slate-100 text-slate-600",
					)}
				>
					<CategoryIcon className="w-4 h-4" />
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
						{meta?.label ?? component.category} · {component.brand}
					</p>
					<p className="text-sm font-bold text-slate-900 truncate">
						{component.name}
					</p>
					{Object.keys(specs).length > 0 && (
						<div className="flex flex-wrap gap-1 mt-1">
							{Object.entries(specs)
								.slice(0, 3)
								.map(([k, v]) => (
									<span
										key={k}
										className="text-[9px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full"
									>
										{k}: {String(v)}
									</span>
								))}
						</div>
					)}
				</div>
				<div className="text-right shrink-0">
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
					<p className="text-[10px] text-blue-600 font-bold mt-0.5">
						{expanded
							? "▲ Hide shops"
							: `▼ ${sortedListings.length} shop${sortedListings.length !== 1 ? "s" : ""}`}
					</p>
				</div>
			</button>

			{expanded && sortedListings.length > 0 && (
				<div className="px-3 pb-3 space-y-2 border-t border-slate-50">
					<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-3 pb-1">
						Available at
					</p>
					{sortedListings.map((listing, i) => (
						<ShopListingRow
							key={listing._id}
							listing={listing}
							isCheapest={i === 0}
						/>
					))}
				</div>
			)}

			{expanded && sortedListings.length === 0 && (
				<p className="text-xs text-slate-400 text-center py-4 border-t border-slate-50">
					No shop listings yet
				</p>
			)}
		</div>
	);
}

function BuildColumn({
	title,
	subtitle,
	badge,
	badgeStyle,
	components,
	totalCost: cost,
	highlight,
}: {
	title: string;
	subtitle: string;
	badge: string;
	badgeStyle: string;
	components: IPCComponentPopulated[];
	totalCost: number;
	highlight?: boolean;
}) {
	return (
		<div
			className={cn(
				"rounded-3xl border p-6 flex flex-col gap-4",
				highlight
					? "border-blue-200 bg-gradient-to-b from-blue-50/60 to-white shadow-xl shadow-blue-100/50"
					: "border-slate-100 bg-white shadow-sm",
			)}
		>
			<div>
				<span
					className={cn(
						"text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
						badgeStyle,
					)}
				>
					{badge}
				</span>
				<h2 className="text-xl font-black text-slate-900 mt-2">{title}</h2>
				<p className="text-xs text-slate-500">{subtitle}</p>
				<div
					className={cn(
						"mt-3 p-3 rounded-2xl",
						highlight ? "bg-blue-600" : "bg-slate-900",
					)}
				>
					<p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
						Estimated Total
					</p>
					<p className="text-2xl font-black text-white">{formatPrice(cost)}</p>
					<p className="text-[10px] text-white/60">
						minimum from cheapest shops
					</p>
				</div>
			</div>

			<div className="space-y-2">
				{components.map((component) => (
					<BuildComponentRow key={component._id} component={component} />
				))}
			</div>
		</div>
	);
}

function PageSkeleton() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{[0, 1].map((i) => (
				<div
					key={i}
					className="rounded-3xl border border-slate-100 bg-white p-6 space-y-4 animate-pulse"
				>
					<div className="h-5 w-24 bg-slate-100 rounded-full" />
					<div className="h-8 w-40 bg-slate-100 rounded" />
					<div className="h-20 bg-slate-100 rounded-2xl" />
					{[1, 2, 3, 4, 5].map((j) => (
						<div
							key={j}
							className="h-16 bg-slate-50 rounded-2xl border border-slate-100"
						/>
					))}
				</div>
			))}
		</div>
	);
}

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

	const { data: builds, isLoading, isError } = useSuggestedBuild(query);

	const [compatibilityResult, setCompatibilityResult] =
		useState<CompatibilityResult | null>(null);
	const [compatibilityLoading, setCompatibilityLoading] = useState(false);

	useEffect(() => {
		if (!builds || builds.length === 0) return;

		const pickedComponents: IPCComponentPopulated[] = builds
			.map((b) => b.components[0])
			.filter((c): c is IPCComponentPopulated => c !== undefined);

		if (pickedComponents.length === 0) return;

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
		<div className="min-h-screen bg-[#F8FAFC] font-sans">
			<header className="max-w-7xl mx-auto px-6 pt-8 pb-6">
				<Link
					href="/pc-suggester"
					className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Suggester
				</Link>

				<div className="flex items-start justify-between flex-wrap gap-4">
					<div>
						<div className="flex items-center gap-2 mb-1">
							<CheckCircle2 className="w-5 h-5 text-blue-600" />
							<span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
								Your PC Build Plan
							</span>
						</div>
						<h1 className="text-3xl font-black text-slate-900 tracking-tight">
							{query.mainUsage} Build
						</h1>
						<p className="text-sm text-slate-500 mt-1 capitalize">
							{query.budgetTier} tier · {query.storageNeeds} storage ·{" "}
							{query.browserTabs}+ tabs
						</p>
					</div>

					<div className="flex gap-3">
						<div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 text-center shadow-sm">
							<p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
								Min Build
							</p>
							<p className="text-lg font-black text-slate-900">
								{formatPrice(minCost)}
							</p>
						</div>
						<div className="bg-blue-600 rounded-2xl px-4 py-3 text-center shadow-md shadow-blue-200">
							<p className="text-[10px] text-blue-200 uppercase tracking-wider font-bold">
								Recommended
							</p>
							<p className="text-lg font-black text-white">
								{formatPrice(recCost)}
							</p>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-6 pb-20">
				{isLoading && <PageSkeleton />}

				{isError && (
					<div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
						<p className="text-sm font-semibold text-red-600">
							Could not load components. Please go back and try again.
						</p>
					</div>
				)}

				{builds && builds.length === 0 && (
					<div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
						<ShoppingCart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
						<p className="text-base font-bold text-slate-700">
							No components found
						</p>
						<p className="text-sm text-slate-400 mt-1">
							Ask the admin to add components for this usage profile.
						</p>
						<Link
							href="/pc-suggester"
							className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
						>
							<ArrowLeft className="w-4 h-4" /> Go Back
						</Link>
					</div>
				)}

				{builds && builds.length > 0 && (
					<>
						<div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
							<Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
							<p className="text-xs text-amber-800">
								Click any component to expand and see all shops. Click the{" "}
								<span className="inline-flex items-center gap-1 font-bold">
									<Bus className="w-3 h-3" /> bus icon
								</span>{" "}
								to find bus route.
							</p>
						</div>

						{compatibilityLoading && (
							<div className="mb-6 p-4 bg-violet-50 border border-violet-100 rounded-2xl flex items-center gap-3">
								<Loader2 className="w-4 h-4 text-violet-500 animate-spin shrink-0" />
								<p className="text-xs text-violet-700 font-medium">
									Checking component compatibility...
								</p>
							</div>
						)}

						{compatibilityResult && (
							<div className="mb-6">
								<CompatibilityCard
									result={compatibilityResult}
									onClose={() => setCompatibilityResult(null)}
								/>
							</div>
						)}

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<BuildColumn
								title="Minimum Build"
								subtitle="Gets the job done — lowest possible cost"
								badge="Budget Pick"
								badgeStyle="bg-slate-50 text-slate-600 border-slate-200"
								components={minBuild}
								totalCost={minCost}
							/>

							<BuildColumn
								title="Recommended Build"
								subtitle="Best balance of performance and value"
								badge="⭐ Recommended"
								badgeStyle="bg-blue-50 text-blue-700 border-blue-200"
								components={recBuild}
								totalCost={recCost}
								highlight
							/>
						</div>
					</>
				)}
			</main>
		</div>
	);
}

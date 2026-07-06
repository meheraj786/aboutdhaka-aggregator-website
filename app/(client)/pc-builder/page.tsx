"use client";

import {
	ArrowRight,
	Briefcase,
	CheckCircle2,
	ChevronRight,
	Clapperboard,
	Code2,
	Cpu,
	Gamepad2,
	HardDrive,
	MemoryStick,
	Minus,
	Monitor,
	Plus,
	Shield,
	Sparkles,
	Star,
	Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}

type UsageCategory =
	| "Gaming"
	| "Content Creation"
	| "Development"
	| "Office & Web";

const USAGE_OPTIONS: {
	id: UsageCategory;
	icon: typeof Gamepad2;
	description: string;
	emoji: string;
}[] = [
	{
		id: "Gaming",
		icon: Gamepad2,
		description: "Triple-A titles and competitive play.",
		emoji: "🎮",
	},
	{
		id: "Content Creation",
		icon: Clapperboard,
		description: "Video editing, 3D rendering, design.",
		emoji: "🎬",
	},
	{
		id: "Development",
		icon: Code2,
		description: "Coding, VMs, and data processing.",
		emoji: "💻",
	},
	{
		id: "Office & Web",
		icon: Briefcase,
		description: "Browsing, Excel, and streaming.",
		emoji: "📊",
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

const HEAVY_SOFTWARE = [
	"Adobe Premiere",
	"DaVinci Resolve",
	"Blender",
	"AutoCAD",
];

const STORAGE_OPTIONS = [
	{ id: "Light", description: "Cloud-first workflow", gb: "256GB" },
	{ id: "Medium", description: "Games & projects", gb: "1TB" },
	{ id: "Heavy", description: "Raw 4K footage", gb: "4TB+" },
];

const BUDGET_OPTIONS = [
	{ id: "budget", label: "Budget", sub: "Best value", range: "৳30k–60k" },
	{ id: "mid", label: "Mid-range", sub: "Balanced", range: "৳60k–120k" },
	{ id: "high-end", label: "High-end", sub: "No limits", range: "৳120k+" },
];

const THEME: Record<
	UsageCategory,
	{
		from: string;
		to: string;
		accent: string;
		pill: string;
		pillText: string;
		tab: string;
	}
> = {
	Gaming: {
		from: "#6d28d9",
		to: "#4f46e5",
		accent: "#7c3aed",
		pill: "#ede9fe",
		pillText: "#5b21b6",
		tab: "violet",
	},
	"Content Creation": {
		from: "#e11d48",
		to: "#be185d",
		accent: "#f43f5e",
		pill: "#ffe4e6",
		pillText: "#9f1239",
		tab: "rose",
	},
	Development: {
		from: "#1d4ed8",
		to: "#0284c7",
		accent: "#2563eb",
		pill: "#dbeafe",
		pillText: "#1e40af",
		tab: "blue",
	},
	"Office & Web": {
		from: "#059669",
		to: "#0d9488",
		accent: "#10b981",
		pill: "#d1fae5",
		pillText: "#065f46",
		tab: "emerald",
	},
};

// Unsplash hero images per category (stable, license-free)
const HERO_IMAGES: Record<UsageCategory, string> = {
	Gaming:
		"https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=1400&q=80&auto=format&fit=crop",
	"Content Creation":
		"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1400&q=80&auto=format&fit=crop",
	Development:
		"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=80&auto=format&fit=crop",
	"Office & Web":
		"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&auto=format&fit=crop",
};

const STATS = [
	{ value: "2,400+", label: "Components", icon: Cpu },
	{ value: "180+", label: "BD Shops", icon: HardDrive },
	{ value: "98%", label: "Compatible", icon: Shield },
	{ value: "4.9", label: "Rating", icon: Star },
];

export default function SmartPCSuggester() {
	const [state, setState] = useState<{
		mainUsage: UsageCategory;
		browserTabs: number;
		software: string[];
		storageNeeds: string;
		budgetTier: string;
	}>({
		mainUsage: "Gaming",
		browserTabs: 20,
		software: ["Chrome / Edge"],
		storageNeeds: "Light",
		budgetTier: "budget",
	});
	const router = useRouter();

	const theme = THEME[state.mainUsage];
	const heroImg = HERO_IMAGES[state.mainUsage];

	const handleSearch = () => {
		const params = new URLSearchParams({
			usage: state.mainUsage,
			budget: state.budgetTier,
			storage: state.storageNeeds,
			tabs: String(state.browserTabs),
			software: state.software.join(","),
		});
		router.push(`/pc-builder/build-result?${params.toString()}`);
	};

	const toggleSoftware = (item: string) => {
		setState((prev) => ({
			...prev,
			software: prev.software.includes(item)
				? prev.software.filter((s) => s !== item)
				: [...prev.software, item],
		}));
	};

	const heavySelected = state.software.filter((s) =>
		HEAVY_SOFTWARE.includes(s),
	);

	const recommendedCores = (() => {
		const baseMap: Record<UsageCategory, number> = {
			Gaming: 6,
			"Content Creation": 12,
			Development: 4,
			"Office & Web": 2,
		};
		let base = baseMap[state.mainUsage] ?? 4;
		if (
			state.software.includes("Blender") ||
			state.software.includes("DaVinci Resolve")
		)
			base = Math.max(base, 12);
		else if (
			state.software.includes("Adobe Premiere") ||
			state.software.includes("AutoCAD")
		)
			base = Math.max(base, 8);
		else if (state.software.includes("Visual Studio Code"))
			base = Math.max(base, 4);
		return `${base}+`;
	})();

	const recommendedRAM = (() => {
		let base = 8;
		if (state.browserTabs > 50) base = 64;
		else if (state.browserTabs > 30) base = 32;
		else if (state.browserTabs > 10) base = 16;
		if (
			state.software.some((s) =>
				["Adobe Premiere", "DaVinci Resolve", "Blender", "AutoCAD"].includes(s),
			)
		)
			base = Math.max(base, 32);
		return `${base}GB+`;
	})();

	return (
		<div
			className="min-h-screen bg-[#f8f9fb]"
			style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
		>
			{/* ─── HERO ─── */}
			<div className="relative h-[88vh] min-h-[580px] max-h-[780px] overflow-hidden">
				{/* Background photo with crossfade */}
				<Image
					width={500}
					height={500}
					key={heroImg}
					src={heroImg}
					alt={state.mainUsage}
					className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
					style={{ opacity: 1 }}
				/>
				{/* Multi-layer overlay for readability */}
				<div
					className="absolute inset-0"
					style={{
						background: `linear-gradient(135deg, ${theme.from}ee 0%, ${theme.to}bb 50%, #00000088 100%)`,
					}}
				/>
				{/* Bottom fade to page bg */}
				<div
					className="absolute bottom-0 left-0 right-0 h-40"
					style={{
						background: "linear-gradient(to bottom, transparent, #f8f9fb)",
					}}
				/>

				{/* Dot grid texture */}
				<div
					className="absolute inset-0 opacity-[0.07]"
					style={{
						backgroundImage:
							"radial-gradient(circle, white 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>

				{/* Content */}
				<div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 md:px-12 max-w-7xl mx-auto">
					{/* Pill badge */}
					<div
						className="inline-flex items-center gap-2 self-start mb-5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30 backdrop-blur-md text-white"
						style={{ background: "rgba(255,255,255,0.12)" }}
					>
						<Sparkles className="w-3 h-3" />
						AI-Powered · Bangladesh&apos;s #1 PC Builder
					</div>

					{/* Headline */}
					<h1
						className="text-5xl md:text-7xl font-black text-white leading-[1.02] tracking-tight mb-5 max-w-4xl"
						style={{ textShadow: "0 2px 40px rgba(0,0,0,0.3)" }}
					>
						Build smarter.
						<br />
						<span style={{ color: "rgba(255,255,255,0.65)" }}>Buy local.</span>
					</h1>
					<p className="text-white/70 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
						Tell us your workflow — we match you with real components from BD
						shops with live prices.
					</p>

					{/* Stat chips */}
					<div className="flex flex-wrap gap-3">
						{STATS.map((s) => {
							const Icon = s.icon;
							return (
								<div
									key={s.label}
									className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md"
									style={{ background: "rgba(255,255,255,0.10)" }}
								>
									<Icon className="w-3.5 h-3.5 text-white/70" />
									<span className="text-white font-black text-sm">
										{s.value}
									</span>
									<span className="text-white/50 text-xs font-medium">
										{s.label}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* ─── MAIN FORM ─── */}
			<main className="max-w-7xl mx-auto px-4 md:px-8 pb-28 -mt-2">
				<div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
					{/* LEFT */}
					<div className="space-y-5">
						{/* ── Usage selector ── */}
						<section className="bg-white rounded-[2rem] overflow-hidden border border-slate-100/80 shadow-sm">
							<div className="px-7 pt-7 pb-5 flex items-center gap-4">
								<div
									className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0"
									style={{
										background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
									}}
								>
									1
								</div>
								<div>
									<h2 className="text-base font-black text-slate-900 tracking-tight">
										Primary Usage
									</h2>
									<p className="text-slate-400 text-sm">
										What will you mainly use this PC for?
									</p>
								</div>
							</div>
							<div className="px-5 pb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
								{USAGE_OPTIONS.map((option) => {
									const Icon = option.icon;
									const active = state.mainUsage === option.id;
									const t = THEME[option.id];
									return (
										<button
											key={option.id}
											type="button"
											onClick={() =>
												setState((p) => ({ ...p, mainUsage: option.id }))
											}
											className="relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden group"
											style={{
												borderColor: active ? t.accent : "#f1f5f9",
												background: active ? `${t.pill}` : "white",
												boxShadow: active ? `0 0 0 4px ${t.pill}` : undefined,
											}}
										>
											{active && (
												<div
													className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
													style={{ background: t.accent }}
												>
													<CheckCircle2 className="w-3 h-3 text-white" />
												</div>
											)}
											<div
												className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shrink-0"
												style={{ background: active ? t.accent : "#f1f5f9" }}
											>
												<Icon
													className={cn(
														"w-5 h-5 transition-colors",
														active ? "text-white" : "text-slate-400",
													)}
												/>
											</div>
											<div>
												<p className="font-black text-slate-900 text-sm leading-tight">
													{option.id}
												</p>
												<p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
													{option.description}
												</p>
											</div>
										</button>
									);
								})}
							</div>
						</section>

						{/* ── Workflow details ── */}
						<section className="bg-white rounded-[2rem] overflow-hidden border border-slate-100/80 shadow-sm">
							<div className="px-7 pt-7 pb-5 flex items-center gap-4">
								<div
									className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0"
									style={{
										background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
									}}
								>
									2
								</div>
								<div>
									<h2 className="text-base font-black text-slate-900 tracking-tight">
										Workflow Details
									</h2>
									<p className="text-slate-400 text-sm">
										Fine-tune recommendations to your habits
									</p>
								</div>
							</div>

							<div className="px-7 pb-8 space-y-10">
								{/* Browser tabs */}
								<div>
									<div className="flex items-end justify-between mb-4">
										<div>
											<p className="text-sm font-bold text-slate-800">
												Browser Tabs
											</p>
											<p className="text-xs text-slate-400 mt-0.5">
												More tabs = more RAM pressure
											</p>
										</div>
										<span
											className="text-4xl font-black tabular-nums"
											style={{ color: theme.accent }}
										>
											{state.browserTabs}
											<span className="text-slate-200 text-2xl">+</span>
										</span>
									</div>
									<div className="flex items-center gap-3">
										<button
											type="button"
											onClick={() =>
												setState((p) => ({
													...p,
													browserTabs: Math.max(0, p.browserTabs - 5),
												}))
											}
											className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-colors"
										>
											<Minus className="w-3.5 h-3.5 text-slate-600" />
										</button>
										<div className="flex-1">
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
												className="w-full h-2 rounded-full appearance-none cursor-pointer"
												style={{
													background: `linear-gradient(to right, ${theme.accent} ${state.browserTabs}%, #e2e8f0 ${state.browserTabs}%)`,
												}}
											/>
											<div className="flex justify-between text-[10px] text-slate-300 mt-2 font-semibold px-0.5">
												{[0, 25, 50, 75, 100].map((v) => (
													<span key={v}>{v}</span>
												))}
											</div>
										</div>
										<button
											type="button"
											onClick={() =>
												setState((p) => ({
													...p,
													browserTabs: Math.min(100, p.browserTabs + 5),
												}))
											}
											className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-colors"
										>
											<Plus className="w-3.5 h-3.5 text-slate-600" />
										</button>
									</div>
								</div>

								{/* Software */}
								<div>
									<p className="text-sm font-bold text-slate-800 mb-1">
										Software You Use
									</p>
									<p className="text-xs text-slate-400 mb-4">
										Select all that apply — affects CPU, RAM & GPU picks
									</p>
									<div className="flex flex-wrap gap-2">
										{SOFTWARE_OPTIONS.map((item) => {
											const isHeavy = HEAVY_SOFTWARE.includes(item);
											const isSelected = state.software.includes(item);
											return (
												<button
													key={item}
													type="button"
													onClick={() => toggleSoftware(item)}
													className="px-4 py-2 rounded-full text-sm font-bold transition-all border-2"
													style={
														isSelected
															? {
																	background: isHeavy
																		? "#7c3aed"
																		: theme.accent,
																	borderColor: isHeavy
																		? "#7c3aed"
																		: theme.accent,
																	color: "white",
																}
															: {
																	background: "white",
																	borderColor: "#e2e8f0",
																	color: "#64748b",
																}
													}
												>
													{item}
													{isHeavy && isSelected && (
														<span className="ml-2 text-[9px] font-black bg-violet-800 text-violet-200 px-1.5 py-0.5 rounded-full">
															VRAM+
														</span>
													)}
												</button>
											);
										})}
									</div>
									{heavySelected.length > 0 && (
										<div
											className="mt-4 flex items-start gap-3 p-4 rounded-2xl border"
											style={{ background: "#f5f3ff", borderColor: "#ede9fe" }}
										>
											<Zap className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
											<p className="text-xs text-violet-800 leading-relaxed">
												<strong>{heavySelected.join(", ")}</strong> detected —
												RAM boosted to 32GB+ and GPU VRAM to 8GB minimum.
											</p>
										</div>
									)}
								</div>

								{/* Storage */}
								<div>
									<p className="text-sm font-bold text-slate-800 mb-1">
										Storage Requirement
									</p>
									<p className="text-xs text-slate-400 mb-4">
										How much local storage do you need?
									</p>
									<div className="grid grid-cols-3 gap-3">
										{STORAGE_OPTIONS.map((opt) => {
											const active = state.storageNeeds === opt.id;
											return (
												<button
													key={opt.id}
													type="button"
													onClick={() =>
														setState((p) => ({ ...p, storageNeeds: opt.id }))
													}
													className="p-5 rounded-2xl border-2 text-left transition-all duration-200"
													style={{
														borderColor: active ? theme.accent : "#f1f5f9",
														background: active ? theme.pill : "white",
														boxShadow: active
															? `0 0 0 3px ${theme.pill}`
															: undefined,
													}}
												>
													<p
														className="text-2xl font-black mb-1"
														style={{ color: active ? theme.accent : "#94a3b8" }}
													>
														{opt.gb}
													</p>
													<p className="font-bold text-slate-900 text-sm">
														{opt.id}
													</p>
													<p className="text-[11px] text-slate-400 mt-0.5">
														{opt.description}
													</p>
												</button>
											);
										})}
									</div>
								</div>

								{/* Budget */}
								<div>
									<p className="text-sm font-bold text-slate-800 mb-1">
										Budget Tier
									</p>
									<p className="text-xs text-slate-400 mb-4">
										We'll find the best builds within your range
									</p>
									<div className="grid grid-cols-3 gap-3">
										{BUDGET_OPTIONS.map((opt) => {
											const active = state.budgetTier === opt.id;
											return (
												<button
													key={opt.id}
													type="button"
													onClick={() =>
														setState((p) => ({ ...p, budgetTier: opt.id }))
													}
													className="p-5 rounded-2xl border-2 text-left transition-all duration-200"
													style={{
														borderColor: active ? theme.accent : "#f1f5f9",
														background: active ? theme.pill : "white",
														boxShadow: active
															? `0 0 0 3px ${theme.pill}`
															: undefined,
													}}
												>
													<p className="font-black text-slate-900 text-sm mb-0.5">
														{opt.label}
													</p>
													<p
														className="font-black text-xs tabular-nums"
														style={{ color: active ? theme.accent : "#94a3b8" }}
													>
														{opt.range}
													</p>
													<p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wide font-semibold">
														{opt.sub}
													</p>
												</button>
											);
										})}
									</div>
								</div>
							</div>
						</section>
					</div>

					{/* ── RIGHT: Sticky summary ── */}
					<aside className="xl:sticky xl:top-6 space-y-4">
						<div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100/80 shadow-xl shadow-slate-200/40">
							{/* Gradient header */}
							<div
								className="relative overflow-hidden px-7 py-7"
								style={{
									background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
								}}
							>
								<div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
								<div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
								<div className="relative z-10">
									<p className="text-white/60 text-[10px] font-black uppercase tracking-[0.15em] mb-2">
										Your Build Summary
									</p>
									<h3 className="text-3xl font-black text-white leading-none mb-1">
										{state.mainUsage}
									</h3>
									<p className="text-white/60 text-sm capitalize">
										{state.budgetTier} · {state.storageNeeds} ·{" "}
										{state.browserTabs}+ tabs
									</p>
								</div>
							</div>

							<div className="p-6 space-y-5">
								{/* Snap stats */}
								<div className="grid grid-cols-3 gap-2">
									{[
										{
											label: "Storage",
											value:
												STORAGE_OPTIONS.find((s) => s.id === state.storageNeeds)
													?.gb ?? "",
										},
										{ label: "Tabs", value: `${state.browserTabs}+` },
										{ label: "Apps", value: `${state.software.length}` },
									].map((s) => (
										<div
											key={s.label}
											className="rounded-2xl p-3 text-center"
											style={{ background: "#f8fafc" }}
										>
											<p className="text-lg font-black text-slate-900">
												{s.value}
											</p>
											<p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
												{s.label}
											</p>
										</div>
									))}
								</div>

								{/* Spec breakdown */}
								<div className="rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
									{[
										{ icon: Cpu, label: "CPU Cores", value: recommendedCores },
										{ icon: MemoryStick, label: "RAM", value: recommendedRAM },
										...(heavySelected.length > 0
											? [{ icon: Monitor, label: "GPU VRAM", value: "8GB+" }]
											: []),
									].map((row) => {
										const Icon = row.icon;
										return (
											<div
												key={row.label}
												className="flex items-center justify-between px-4 py-3 bg-white"
											>
												<div className="flex items-center gap-2.5">
													<div
														className="w-7 h-7 rounded-lg flex items-center justify-center"
														style={{ background: theme.pill }}
													>
														<Icon
															className="w-3.5 h-3.5"
															style={{ color: theme.accent }}
														/>
													</div>
													<span className="text-sm text-slate-600 font-medium">
														{row.label}
													</span>
												</div>
												<span
													className="text-sm font-black"
													style={{ color: theme.accent }}
												>
													{row.value}
												</span>
											</div>
										);
									})}
								</div>

								{/* CTA */}
								<button
									type="button"
									onClick={handleSearch}
									className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
									style={{
										background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
										boxShadow: `0 10px 30px ${theme.accent}40`,
									}}
								>
									<CheckCircle2 className="w-4 h-4" />
									Find My Build
									<ArrowRight className="w-4 h-4" />
								</button>

								<p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
									<Shield className="w-3 h-3 text-slate-300" />
									Real parts · Local shops · Live prices
								</p>
							</div>
						</div>

						{/* Trust cards */}
						<div className="grid grid-cols-2 gap-3">
							{[
								{
									icon: Shield,
									title: "Compatibility verified",
									sub: "Every build checked",
								},
								{
									icon: Zap,
									title: "Daily price sync",
									sub: "Always up to date",
								},
							].map((b) => {
								const Icon = b.icon;
								return (
									<div
										key={b.title}
										className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3"
									>
										<div
											className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
											style={{ background: theme.pill }}
										>
											<Icon
												className="w-3.5 h-3.5"
												style={{ color: theme.accent }}
											/>
										</div>
										<div>
											<p className="text-xs font-bold text-slate-800 leading-tight">
												{b.title}
											</p>
											<p className="text-[10px] text-slate-400">{b.sub}</p>
										</div>
									</div>
								);
							})}
						</div>

						<div className="flex items-center justify-center gap-2 py-2">
							<ChevronRight className="w-3 h-3 text-slate-300" />
							<span className="text-xs text-slate-400">
								Explore 2,400+ components in our database
							</span>
						</div>
					</aside>
				</div>
			</main>
		</div>
	);
}

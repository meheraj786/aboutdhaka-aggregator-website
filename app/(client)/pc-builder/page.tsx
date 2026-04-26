"use client";

import { type ClassValue, clsx } from "clsx";
import {
	Briefcase,
	CheckCircle2,
	Clapperboard,
	Code2,
	Cpu,
	Database,
	Gamepad2,
	HardDrive,
	Info,
	LayoutGrid,
	MemoryStick,
	Minus,
	Monitor,
	Plus,
	Rocket,
} from "lucide-react";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const USAGE_OPTIONS = [
	{
		id: "Gaming",
		icon: Gamepad2,
		description: "Triple-A titles and competitive play.",
	},
	{
		id: "Content Creation",
		icon: Clapperboard,
		description: "Video editing, 3D rendering, design.",
	},
	{
		id: "Development",
		icon: Code2,
		description: "Coding, VMs, and data processing.",
	},
	{
		id: "Office & Web",
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
];

const STORAGE_OPTIONS = [
	{ id: "Light", description: "Mostly cloud docs" },
	{ id: "Medium", description: "Few big games" },
	{ id: "Heavy", description: "Raw 4K video" },
];

interface TechSpec {
	cores: number;
	threads: number;
	ram: number;
	vram: number;
	ssd: number;
}

interface BuildSuggestion {
	title: string;
	reason: string;
	minimum: TechSpec;
	recommended: TechSpec;
}

interface AppState {
	view: "suggester" | "comparison";
	mainUsage: string;
	browserTabs: number;
	software: string[];
	storageNeeds: string;
}

export default function SmartPCSuggester() {
	const [state, setState] = useState<AppState>({
		view: "suggester",
		mainUsage: "Gaming",
		browserTabs: 20,
		software: ["Chrome / Edge"],
		storageNeeds: "Medium",
	});

	const buildSpecs = useMemo((): BuildSuggestion => {
		const { mainUsage, browserTabs, software, storageNeeds } = state;

		let min: TechSpec = { cores: 4, threads: 8, ram: 8, vram: 0, ssd: 256 };
		let rec: TechSpec = { cores: 6, threads: 12, ram: 16, vram: 2, ssd: 512 };

		if (mainUsage === "Gaming") {
			min = { cores: 6, threads: 12, ram: 16, vram: 4, ssd: 512 };
			rec = { cores: 8, threads: 16, ram: 32, vram: 12, ssd: 1024 };
		} else if (mainUsage === "Content Creation") {
			min = { cores: 8, threads: 16, ram: 32, vram: 6, ssd: 1024 };
			rec = { cores: 16, threads: 32, ram: 64, vram: 16, ssd: 2048 };
		} else if (mainUsage === "Development") {
			min = { cores: 6, threads: 12, ram: 16, vram: 0, ssd: 512 };
			rec = { cores: 12, threads: 20, ram: 64, vram: 8, ssd: 1024 };
		}

		if (browserTabs > 30) {
			min.ram = Math.max(min.ram, 16);
			rec.ram = Math.max(rec.ram, 32);
		}
		if (browserTabs > 60) {
			min.ram = Math.max(min.ram, 32);
			rec.ram = Math.max(rec.ram, 64);
		}

		if (software.includes("Adobe Premiere") || software.includes("AutoCAD")) {
			min.vram = Math.max(min.vram, 6);
			rec.vram = Math.max(rec.vram, 12);
			min.cores = Math.max(min.cores, 8);
			rec.cores = Math.max(rec.cores, 12);
		}

		if (storageNeeds === "Medium") {
			min.ssd = Math.max(min.ssd, 512);
			rec.ssd = Math.max(rec.ssd, 1024);
		} else if (storageNeeds === "Heavy") {
			min.ssd = Math.max(min.ssd, 1024);
			rec.ssd = Math.max(rec.ssd, 4096);
		}

		return {
			title: `${mainUsage} Configuration`,
			reason: `Optimized for ${mainUsage} with ${browserTabs}+ tabs and ${software.length} active software applications.`,
			minimum: min,
			recommended: rec,
		};
	}, [state]);

	const toggleSoftware = (item: string) => {
		setState((prev) => ({
			...prev,
			software: prev.software.includes(item)
				? prev.software.filter((s) => s !== item)
				: [...prev.software, item],
		}));
	};

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			<header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
				<nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
					<span className="hover:text-blue-600 cursor-pointer transition-colors">
						Home
					</span>
					<span className="text-slate-300">/</span>
					<span className="text-slate-900 font-medium">Smart PC Suggester</span>
				</nav>
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div>
						<h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
							Smart PC Suggester
						</h1>
						<p className="text-lg text-slate-600">
							Define your needs and we'll calculate the precise hardware
							specifications for you.
						</p>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
				<div className="space-y-8">
					<section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-8">
							<div className="p-2 bg-blue-50 rounded-lg">
								<Rocket className="w-5 h-5 text-blue-600" />
							</div>
							<h2 className="text-xl font-bold text-slate-900">
								What is your primary usage?
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{USAGE_OPTIONS.map((option) => (
								<button
									type="button"
									key={option.id}
									onClick={() =>
										setState((prev) => ({ ...prev, mainUsage: option.id }))
									}
									className={cn(
										"flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200",
										state.mainUsage === option.id
											? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50"
											: "border-slate-100 hover:border-slate-200 hover:bg-slate-50",
									)}
								>
									<div
										className={cn(
											"p-3 rounded-xl transition-colors",
											state.mainUsage === option.id
												? "bg-blue-500 text-white"
												: "bg-slate-100 text-slate-500",
										)}
									>
										<option.icon className="w-6 h-6" />
									</div>
									<div className="flex-1">
										<span className="block font-bold text-slate-900 mb-1">
											{option.id}
										</span>
										<p className="text-sm text-slate-500 leading-relaxed">
											{option.description}
										</p>
									</div>
								</button>
							))}
						</div>
					</section>

					<section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-8">
							<div className="p-2 bg-blue-50 rounded-lg">
								<LayoutGrid className="w-5 h-5 text-blue-600" />
							</div>
							<h2 className="text-xl font-bold text-slate-900">
								Analyze Workload
							</h2>
						</div>

						<div className="space-y-10">
							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">
									Average Browser Tabs
								</span>
								<div className="bg-slate-50/50 rounded-xl p-4 flex items-center justify-between border border-slate-100 max-w-xs">
									<button
										type="button"
										onClick={() =>
											setState((prev) => ({
												...prev,
												browserTabs: Math.max(0, prev.browserTabs - 5),
											}))
										}
										className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
									>
										<Minus className="w-5 h-5 text-slate-600" />
									</button>
									<div className="text-center">
										<span className="text-2xl font-black text-blue-600">
											{state.browserTabs}+
										</span>
									</div>
									<button
										type="button"
										onClick={() =>
											setState((prev) => ({
												...prev,
												browserTabs: prev.browserTabs + 5,
											}))
										}
										className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
									>
										<Plus className="w-5 h-5 text-slate-600" />
									</button>
								</div>
							</div>

							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">
									Active Software Profile
								</span>
								<div className="flex flex-wrap gap-3">
									{SOFTWARE_OPTIONS.map((item) => (
										<button
											type="button"
											key={item}
											onClick={() => toggleSoftware(item)}
											className={cn(
												"px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
												state.software.includes(item)
													? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200"
													: "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
											)}
										>
											{item}
										</button>
									))}
								</div>
							</div>

							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">
									Storage Requirement
								</span>
								<div className="grid grid-cols-3 gap-4">
									{STORAGE_OPTIONS.map((option) => (
										<button
											type="button"
											key={option.id}
											onClick={() =>
												setState((prev) => ({
													...prev,
													storageNeeds: option.id,
												}))
											}
											className={cn(
												"p-4 rounded-xl border-2 text-center transition-all duration-200",
												state.storageNeeds === option.id
													? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50"
													: "border-slate-100 hover:border-slate-200 hover:bg-slate-50",
											)}
										>
											<span className="block font-bold text-slate-900 mb-1">
												{option.id}
											</span>
											<span className="text-[10px] text-slate-500 uppercase tracking-wide">
												{option.description}
											</span>
										</button>
									))}
								</div>
							</div>
						</div>
					</section>
				</div>

				<aside className="space-y-6 lg:sticky lg:top-8">
					<div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(59,130,246,0.12)] relative overflow-hidden group">
						<div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors duration-500" />

						<div className="relative z-10">
							<div className="flex items-center justify-between mb-8">
								<div>
									<span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">
										Hardware Requirements
									</span>
									<h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
										{buildSpecs.title}
									</h3>
								</div>
								<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
									<Rocket className="w-6 h-6 text-white" />
								</div>
							</div>

							<div className="space-y-6">
								<div className="relative p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100">
									<div className="absolute top-4 right-6">
										<span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold">
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
											RECOMMENDED
										</span>
									</div>

									<div className="grid grid-cols-2 gap-6">
										<div className="flex items-start gap-4">
											<div className="mt-1 p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
												<Cpu className="w-4 h-4 text-blue-500" />
											</div>
											<div>
												<p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
													Processor
												</p>
												<p className="text-sm font-black text-slate-900">
													{buildSpecs.recommended.cores}C /{" "}
													{buildSpecs.recommended.threads}T
												</p>
											</div>
										</div>

										<div className="flex items-start gap-4">
											<div className="mt-1 p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
												<MemoryStick className="w-4 h-4 text-blue-500" />
											</div>
											<div>
												<p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
													Memory
												</p>
												<p className="text-sm font-black text-slate-900">
													{buildSpecs.recommended.ram}GB RAM
												</p>
											</div>
										</div>

										<div className="flex items-start gap-4">
											<div className="mt-1 p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
												<Monitor className="w-4 h-4 text-blue-500" />
											</div>
											<div>
												<p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
													Graphics
												</p>
												<p className="text-sm font-black text-slate-900">
													{buildSpecs.recommended.vram}GB VRAM
												</p>
											</div>
										</div>

										<div className="flex items-start gap-4">
											<div className="mt-1 p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
												<HardDrive className="w-4 h-4 text-blue-500" />
											</div>
											<div>
												<p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
													Storage
												</p>
												<p className="text-sm font-black text-slate-900">
													{buildSpecs.recommended.ssd >= 1024
														? `${buildSpecs.recommended.ssd / 1024}TB`
														: `${buildSpecs.recommended.ssd}GB`}{" "}
													SSD
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="group/min p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 transition-all">
									<div className="flex items-center justify-between mb-2">
										<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
											Entry Level Minimum
										</span>
										<span className="text-[10px] font-black text-blue-500 opacity-0 group-hover/min:opacity-100 transition-opacity">
											BASIC WORKLOAD
										</span>
									</div>
									<div className="flex items-center gap-3 text-xs font-bold text-slate-600">
										<span>
											{buildSpecs.minimum.cores}C/{buildSpecs.minimum.threads}T
										</span>
										<span className="w-1 h-1 rounded-full bg-slate-300" />
										<span>{buildSpecs.minimum.ram}GB RAM</span>
										<span className="w-1 h-1 rounded-full bg-slate-300" />
										<span>{buildSpecs.minimum.vram}GB VRAM</span>
									</div>
								</div>
							</div>

							<div className="mt-8 flex gap-4 p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50">
								<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
									<Info className="w-4 h-4 text-blue-500" />
								</div>
								<p className="text-xs font-medium text-blue-900/70 leading-relaxed italic">
									"{buildSpecs.reason}"
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
						<h3 className="font-bold text-slate-900 mb-4">
							Configuration Summary
						</h3>
						<div className="space-y-3 mb-6">
							<div className="flex justify-between text-xs">
								<span className="text-slate-500">Usage</span>
								<span className="font-bold">{state.mainUsage}</span>
							</div>
							<div className="flex justify-between text-xs">
								<span className="text-slate-500">Multitasking</span>
								<span className="font-bold">{state.browserTabs} Tabs</span>
							</div>
						</div>
						<button
							type="button"
							className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
						>
							<CheckCircle2 className="w-4 h-4" />
							Finalize Build
						</button>
					</div>
				</aside>
			</main>

			<section className="bg-white border-t border-slate-200 py-20 mt-10">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-16">
						<div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
							Deep Dive Specifications
						</div>
						<h2 className="text-4xl font-black text-slate-900 mb-4">
							Recommended Hardware Logic
						</h2>
						<p className="max-w-2xl mx-auto text-slate-500 text-lg">
							Our engine calculates these specs to ensure zero bottlenecks in
							your {state.mainUsage.toLowerCase()} workflow.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
							<div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
								<Cpu className="w-6 h-6 text-blue-600" />
							</div>
							<p className="text-[10px] font-black uppercase text-slate-400 mb-1">
								Processor
							</p>
							<h4 className="text-xl font-bold text-slate-900 mb-2">
								{buildSpecs.recommended.cores} Cores
							</h4>
							<p className="text-sm text-slate-500">
								Essential for handling {state.software.length} concurrent
								applications.
							</p>
						</div>

						<div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
							<div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
								<MemoryStick className="w-6 h-6 text-blue-600" />
							</div>
							<p className="text-[10px] font-black uppercase text-slate-400 mb-1">
								Memory
							</p>
							<h4 className="text-xl font-bold text-slate-900 mb-2">
								{buildSpecs.recommended.ram} GB
							</h4>
							<p className="text-sm text-slate-500">
								Sufficient buffer for {state.browserTabs} tabs and background
								processes.
							</p>
						</div>

						<div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
							<div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
								<Monitor className="w-6 h-6 text-blue-600" />
							</div>
							<p className="text-[10px] font-black uppercase text-slate-400 mb-1">
								Video RAM
							</p>
							<h4 className="text-xl font-bold text-slate-900 mb-2">
								{buildSpecs.recommended.vram} GB
							</h4>
							<p className="text-sm text-slate-500">
								Allocated for visual rendering and smooth UI transitions.
							</p>
						</div>

						<div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
							<div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
								<Database className="w-6 h-6 text-blue-600" />
							</div>
							<p className="text-[10px] font-black uppercase text-slate-400 mb-1">
								NVMe Storage
							</p>
							<h4 className="text-xl font-bold text-slate-900 mb-2">
								{buildSpecs.recommended.ssd >= 1024
									? `${buildSpecs.recommended.ssd / 1024} TB`
									: `${buildSpecs.recommended.ssd} GB`}
							</h4>
							<p className="text-sm text-slate-500">
								Based on your {state.storageNeeds.toLowerCase()} storage profile
								selection.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

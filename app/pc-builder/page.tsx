"use client";

import { type ClassValue, clsx } from "clsx";
import {
	Briefcase,
	CheckCircle2,
	ChevronRight,
	Clapperboard,
	Code2,
	Cpu,
	Database,
	Gamepad2,
	HardDrive,
	LayoutGrid,
	MemoryStick,
	Minus,
	Monitor,
	Plus,
	Rocket,
	Star,
	Store as StoreIcon,
} from "lucide-react";
import {  motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
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

interface StorePrices {
	cpu: string;
	gpu: string;
	ram: string;
	ssd: string;
}

interface Store {
	id: string;
	name: string;
	prices: StorePrices;
	availability: string;
	rating: number;
}

interface Spec {
	id: string;
	label: string;
	title: string;
	desc: string;
	icon: React.ElementType;
}

interface ComponentDetail {
	brand: string;
	model: string;
}

interface Suggestion {
	title: string;
	cpu: ComponentDetail;
	gpu: ComponentDetail;
	ram: ComponentDetail;
	ssd: ComponentDetail;
	cores: number;
	threads: number;
	vram: string;
	reason: string;
	specs: Spec[];
	stores: Store[];
}

interface AppState {
	view: "suggester" | "comparison";
	mainUsage: string;
	browserTabs: number;
	software: string[];
	storageNeeds: string;
	selectedBuild: string | null;
}

export default function SmartPCSuggester() {
	const [state, setState] = useState<AppState>({
		view: "suggester",
		mainUsage: "Gaming",
		browserTabs: 20,
		software: ["Chrome / Edge", "Visual Studio Code"],
		storageNeeds: "Medium",
		selectedBuild: null,
	});

	const toggleSoftware = (item: string) => {
		setState((prev) => ({
			...prev,
			software: prev.software.includes(item)
				? prev.software.filter((s) => s !== item)
				: [...prev.software, item],
		}));
	};

	const getSuggestion = (): Suggestion => {
		const { mainUsage, browserTabs, software } = state;

		if (mainUsage === "Gaming") {
			if (browserTabs > 50 || software.includes("Adobe Premiere")) {
				return {
					title: "Elite Streamer",
					cpu: { brand: "Intel", model: "Core i9-14900K" },
					gpu: { brand: "NVIDIA", model: "RTX 4080 Super" },
					ram: { brand: "G.Skill", model: "64GB DDR5 6400MHz" },
					ssd: { brand: "Samsung", model: "2TB 990 Pro Gen4" },
					cores: 24,
					threads: 32,
					vram: "16GB GDDR6X",
					reason: `With ${browserTabs}+ tabs and high-end software, you need maximum multitasking power.`,
					specs: [
						{
							id: "cpu",
							label: "Processor",
							title: "Core i9-14900K",
							desc: "24 Cores / 32 Threads for ultimate power.",
							icon: Cpu,
						},
						{
							id: "gpu",
							label: "Graphics",
							title: "RTX 4080 Super",
							desc: "16GB VRAM for 4K gaming and encoding.",
							icon: Monitor,
						},
						{
							id: "ram",
							label: "Memory",
							title: "64GB DDR5 6400MHz",
							desc: "Massive capacity for heavy multitasking.",
							icon: MemoryStick,
						},
						{
							id: "ssd",
							label: "Storage",
							title: "2TB Gen4 NVMe SSD",
							desc: "Fastest load times for your library.",
							icon: HardDrive,
						},
					],
					stores: [
						{
							id: "startech",
							name: "Star Tech",
							prices: { cpu: "$650", gpu: "$1,250", ram: "$280", ssd: "$190" },
							availability: "In Stock",
							rating: 4.8,
						},
						{
							id: "ryans",
							name: "Ryans Computers",
							prices: { cpu: "$660", gpu: "$1,270", ram: "$290", ssd: "$200" },
							availability: "Limited Stock",
							rating: 4.7,
						},
						{
							id: "techland",
							name: "TechLand",
							prices: { cpu: "$645", gpu: "$1,240", ram: "$275", ssd: "$185" },
							availability: "In Stock",
							rating: 4.6,
						},
						{
							id: "pccafe",
							name: "PC Cafe",
							prices: { cpu: "$655", gpu: "$1,260", ram: "$285", ssd: "$195" },
							availability: "In Stock",
							rating: 4.5,
						},
						{
							id: "compvillage",
							name: "Computer Village",
							prices: { cpu: "$648", gpu: "$1,245", ram: "$278", ssd: "$188" },
							availability: "In Stock",
							rating: 4.4,
						},
						{
							id: "binarylogic",
							name: "Binary Logic",
							prices: { cpu: "$652", gpu: "$1,255", ram: "$282", ssd: "$192" },
							availability: "In Stock",
							rating: 4.7,
						},
					],
				};
			}
			return {
				title: "Hardcore Gamer",
				cpu: { brand: "Intel", model: "Core i7-13700K" },
				gpu: { brand: "NVIDIA", model: "RTX 4070 Ti" },
				ram: { brand: "Corsair", model: "32GB DDR5 6000MHz" },
				ssd: { brand: "WD Black", model: "1TB SN850X Gen4" },
				cores: 16,
				threads: 24,
				vram: "12GB GDDR6X",
				reason: `Based on your ${browserTabs}+ tabs and gaming focus, we've prioritized high-speed RAM and a powerful graphics card.`,
				specs: [
					{
						id: "cpu",
						label: "Processor",
						title: "Core i7-13700K",
						desc: "16 Cores / 24 Threads for smooth gaming.",
						icon: Cpu,
					},
					{
						id: "gpu",
						label: "Graphics",
						title: "RTX 4070 Ti",
						desc: "12GB VRAM for high-refresh 1440p.",
						icon: Monitor,
					},
					{
						id: "ram",
						label: "Memory",
						title: "32GB DDR5 6000MHz",
						desc: "Future-proof capacity for multitasking.",
						icon: MemoryStick,
					},
					{
						id: "ssd",
						label: "Storage",
						title: "1TB Gen4 NVMe SSD",
						desc: "Blazing fast load times for games.",
						icon: HardDrive,
					},
				],
				stores: [
					{
						id: "startech",
						name: "Star Tech",
						prices: { cpu: "$420", gpu: "$850", ram: "$140", ssd: "$110" },
						availability: "In Stock",
						rating: 4.8,
					},
					{
						id: "ryans",
						name: "Ryans Computers",
						prices: { cpu: "$430", gpu: "$870", ram: "$150", ssd: "$120" },
						availability: "In Stock",
						rating: 4.7,
					},
					{
						id: "techland",
						name: "TechLand",
						prices: { cpu: "$415", gpu: "$840", ram: "$135", ssd: "$105" },
						availability: "In Stock",
						rating: 4.6,
					},
					{
						id: "pccafe",
						name: "PC Cafe",
						prices: { cpu: "$425", gpu: "$860", ram: "$145", ssd: "$115" },
						availability: "In Stock",
						rating: 4.5,
					},
					{
						id: "compvillage",
						name: "Computer Village",
						prices: { cpu: "$418", gpu: "$845", ram: "$138", ssd: "$108" },
						availability: "In Stock",
						rating: 4.4,
					},
				],
			};
		}

		if (mainUsage === "Content Creation") {
			return {
				title: "Pro Creator",
				cpu: { brand: "AMD", model: "Ryzen 9 7950X" },
				gpu: { brand: "NVIDIA", model: "RTX 4090" },
				ram: { brand: "Kingston", model: "128GB DDR5 5600MHz" },
				ssd: { brand: "Samsung", model: "4TB 990 Pro Gen4" },
				cores: 16,
				threads: 32,
				vram: "24GB GDDR6X",
				reason: `For professional content creation with ${browserTabs}+ tabs, we recommend maximum RAM and the most powerful GPU available.`,
				specs: [
					{
						id: "cpu",
						label: "Processor",
						title: "Ryzen 9 7950X",
						desc: "16 Cores / 32 Threads for rendering.",
						icon: Cpu,
					},
					{
						id: "gpu",
						label: "Graphics",
						title: "RTX 4090",
						desc: "24GB VRAM for 8K video and 3D work.",
						icon: Monitor,
					},
					{
						id: "ram",
						label: "Memory",
						title: "128GB DDR5 5600MHz",
						desc: "Maximum capacity for massive projects.",
						icon: MemoryStick,
					},
					{
						id: "ssd",
						label: "Storage",
						title: "4TB Gen4 NVMe SSD",
						desc: "Huge capacity for high-res assets.",
						icon: HardDrive,
					},
				],
				stores: [
					{
						id: "startech",
						name: "Star Tech",
						prices: { cpu: "$580", gpu: "$1,850", ram: "$450", ssd: "$350" },
						availability: "In Stock",
						rating: 4.8,
					},
					{
						id: "ryans",
						name: "Ryans Computers",
						prices: { cpu: "$595", gpu: "$1,880", ram: "$470", ssd: "$370" },
						availability: "In Stock",
						rating: 4.7,
					},
					{
						id: "techland",
						name: "TechLand",
						prices: { cpu: "$575", gpu: "$1,820", ram: "$440", ssd: "$340" },
						availability: "In Stock",
						rating: 4.6,
					},
					{
						id: "binarylogic",
						name: "Binary Logic",
						prices: { cpu: "$585", gpu: "$1,860", ram: "$460", ssd: "$360" },
						availability: "In Stock",
						rating: 4.7,
					},
					{
						id: "globalbrand",
						name: "Global Brand",
						prices: { cpu: "$590", gpu: "$1,870", ram: "$465", ssd: "$365" },
						availability: "In Stock",
						rating: 4.5,
					},
				],
			};
		}

		if (mainUsage === "Development") {
			return {
				title: "Code Architect",
				cpu: { brand: "Intel", model: "Core i7-14700K" },
				gpu: { brand: "NVIDIA", model: "RTX 4060 Ti" },
				ram: { brand: "TeamGroup", model: "64GB DDR5 6000MHz" },
				ssd: { brand: "Crucial", model: "2TB T700 Gen5" },
				cores: 20,
				threads: 28,
				vram: "16GB GDDR6",
				reason: `Developers need high core counts for compilation and plenty of RAM for Docker/VMs.`,
				specs: [
					{
						id: "cpu",
						label: "Processor",
						title: "Core i7-14700K",
						desc: "20 Cores / 28 Threads for fast builds.",
						icon: Cpu,
					},
					{
						id: "gpu",
						label: "Graphics",
						title: "RTX 4060 Ti",
						desc: "16GB VRAM for AI and multiple displays.",
						icon: Monitor,
					},
					{
						id: "ram",
						label: "Memory",
						title: "64GB DDR5 6000MHz",
						desc: "Plenty of space for containers and IDEs.",
						icon: MemoryStick,
					},
					{
						id: "ssd",
						label: "Storage",
						title: "2TB Gen4 NVMe SSD",
						desc: "Fast I/O for large codebases.",
						icon: HardDrive,
					},
				],
				stores: [
					{
						id: "startech",
						name: "Star Tech",
						prices: { cpu: "$410", gpu: "$450", ram: "$220", ssd: "$160" },
						availability: "In Stock",
						rating: 4.8,
					},
					{
						id: "ryans",
						name: "Ryans Computers",
						prices: { cpu: "$420", gpu: "$470", ram: "$230", ssd: "$170" },
						availability: "In Stock",
						rating: 4.7,
					},
					{
						id: "techland",
						name: "TechLand",
						prices: { cpu: "$405", gpu: "$440", ram: "$215", ssd: "$155" },
						availability: "In Stock",
						rating: 4.6,
					},
					{
						id: "nexus",
						name: "Nexus",
						prices: { cpu: "$415", gpu: "$460", ram: "$225", ssd: "$165" },
						availability: "In Stock",
						rating: 4.4,
					},
				],
			};
		}

		return {
			title: "Daily Driver",
			cpu: { brand: "Intel", model: "Core i5-13400" },
			gpu: { brand: "NVIDIA", model: "RTX 3060" },
			ram: { brand: "Corsair", model: "16GB DDR4 3200MHz" },
			ssd: { brand: "TeamGroup", model: "512GB MP33 NVMe" },
			cores: 10,
			threads: 16,
			vram: "12GB GDDR6",
			reason:
				"Perfect balance for general productivity and light creative work.",
			specs: [
				{
					id: "cpu",
					label: "Processor",
					title: "Core i5-13400",
					desc: "10 Cores / 16 Threads for daily tasks.",
					icon: Cpu,
				},
				{
					id: "gpu",
					label: "Graphics",
					title: "RTX 3060",
					desc: "12GB VRAM for smooth visuals.",
					icon: Monitor,
				},
				{
					id: "ram",
					label: "Memory",
					title: "16GB DDR4 3200MHz",
					desc: "Standard capacity for multitasking.",
					icon: MemoryStick,
				},
				{
					id: "ssd",
					label: "Storage",
					title: "512GB NVMe SSD",
					desc: "Fast boot and app loading.",
					icon: HardDrive,
				},
			],
			stores: [
				{
					id: "startech",
					name: "Star Tech",
					prices: { cpu: "$230", gpu: "$310", ram: "$60", ssd: "$45" },
					availability: "In Stock",
					rating: 4.8,
				},
				{
					id: "ryans",
					name: "Ryans Computers",
					prices: { cpu: "$240", gpu: "$320", ram: "$65", ssd: "$50" },
					availability: "In Stock",
					rating: 4.7,
				},
				{
					id: "techland",
					name: "TechLand",
					prices: { cpu: "$225", gpu: "$305", ram: "$58", ssd: "$42" },
					availability: "In Stock",
					rating: 4.6,
				},
				{
					id: "pccafe",
					name: "PC Cafe",
					prices: { cpu: "$235", gpu: "$315", ram: "$62", ssd: "$48" },
					availability: "In Stock",
					rating: 4.5,
				},
			],
		};
	};

	const suggestion = getSuggestion();

	const getComponentDetail = (key: keyof StorePrices): ComponentDetail => {
		return suggestion[key];
	};

	if (state.view === "comparison") {
		return (
			<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
				{/* Header */}
				<header className="max-w-7xl mx-auto px-6 py-8 border-b border-slate-200 bg-white shadow-sm mb-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								type="button"
								onClick={() =>
									setState((prev) => ({ ...prev, view: "suggester" }))
								}
								className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
							>
								<ChevronRight className="w-6 h-6 rotate-180" />
							</button>
							<div>
								<h1 className="text-2xl font-bold text-slate-900">
									Component Comparison
								</h1>
								<p className="text-slate-500">
									Detailed store-wise pricing for {suggestion.title}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
							>
								Print Specs
							</button>
							<button
								type="button"
								className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
							>
								Order Components
							</button>
						</div>
					</div>
				</header>

				<main className="max-w-7xl mx-auto px-6 pb-20">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left Column: Component-wise Store Comparison */}
						<div className="lg:col-span-2 space-y-8">
							{(["cpu", "gpu", "ram", "ssd"] as const).map((compKey) => {
								const detail = getComponentDetail(compKey);
								const icon =
									suggestion.specs.find((s) => s.id === compKey)?.icon || Cpu;

								return (
									<section
										key={compKey}
										className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
									>
										<div className="p-6 border-b border-slate-100 bg-slate-50/30">
											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center gap-3">
													<div className="p-2 bg-white rounded-lg shadow-sm">
														{React.createElement(icon, {
															className: "w-5 h-5 text-blue-600",
														})}
													</div>
													<div>
														<span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
															{compKey}
														</span>
														<h2 className="text-lg font-bold text-slate-900 leading-tight">
															{detail.brand} {detail.model}
														</h2>
													</div>
												</div>
												<div className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
													{suggestion.stores.length} Stores Available
												</div>
											</div>
										</div>

										<div className="p-6">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{suggestion.stores.map((store) => (
													<div
														key={store.id}
														className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
													>
														<div className="flex items-center gap-3">
															<div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
																<StoreIcon className="w-5 h-5" />
															</div>
															<div>
																<p className="font-bold text-slate-900 text-sm">
																	{store.name}
																</p>
																<div className="flex items-center gap-1">
																	<div className="flex items-center text-amber-500">
																		<Star className="w-3 h-3 fill-current" />
																		<span className="text-[10px] font-bold ml-0.5">
																			{store.rating}
																		</span>
																	</div>
																	<span className="text-[10px] text-slate-400">
																		•
																	</span>
																	<span
																		className={cn(
																			"text-[10px] font-bold",
																			store.availability === "In Stock"
																				? "text-emerald-600"
																				: "text-amber-600",
																		)}
																	>
																		{store.availability}
																	</span>
																</div>
															</div>
														</div>
														<div className="text-right">
															<p className="text-lg font-black text-blue-600">
																{store.prices[compKey]}
															</p>
															<button
																type="button"
																className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-wider transition-colors"
															>
																View Store
															</button>
														</div>
													</div>
												))}
											</div>
										</div>
									</section>
								);
							})}
						</div>

						{/* Right Column: Build Summary */}
						<div className="space-y-6">
							<div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
								<h3 className="text-lg font-bold mb-6 flex items-center gap-2">
									<CheckCircle2 className="w-5 h-5 text-blue-400" />
									Build Summary
								</h3>
								<div className="space-y-4 mb-8">
									<div className="flex justify-between text-sm">
										<span className="text-slate-400">Target Usage</span>
										<span className="font-medium">{state.mainUsage}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-slate-400">Multitasking Level</span>
										<span className="font-medium">
											{state.browserTabs} Tabs
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-slate-400">Storage Profile</span>
										<span className="font-medium">{state.storageNeeds}</span>
									</div>
								</div>
								<button
									type="button"
									className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
								>
									Proceed to Checkout
								</button>
							</div>

							<div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
								<h3 className="font-bold text-slate-900 mb-4">
									Need Expert Advice?
								</h3>
								<p className="text-sm text-slate-500 mb-6 leading-relaxed">
									Our PC building experts are available 24/7 to help you refine
									your component selection.
								</p>
								<button
									type="button"
									className="w-full py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
								>
									Chat with Expert
								</button>
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			{/* Header */}
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
							Answer a few simple questions and we&apos;ll design your perfect
							build.
						</p>
					</div>
					<button
						type="button"
						onClick={() =>
							setState((prev) => ({ ...prev, view: "comparison" }))
						}
						className="px-6 py-3 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
					>
						<LayoutGrid className="w-4 h-4 text-blue-600" />
						Compare Builds
					</button>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
				<div className="space-y-8">
					{/* Progress Bar Section */}
					<section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
						<div className="flex justify-between items-center mb-4">
							<h2 className="font-semibold text-slate-900">
								Building your profile...
							</h2>
							<span className="text-sm font-medium text-blue-600">
								Step 2 of 4
							</span>
						</div>
						<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: "40%" }}
								className="h-full bg-blue-500 rounded-full"
							/>
						</div>
					</section>

					{/* Main Usage Section */}
					<section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-8">
							<div className="p-2 bg-blue-50 rounded-lg">
								<Rocket className="w-5 h-5 text-blue-600" />
							</div>
							<h2 className="text-xl font-bold text-slate-900">
								What is the main thing you&apos;ll do on this PC?
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
										<div className="flex items-center justify-between mb-1">
											<span className="font-bold text-slate-900">
												{option.id}
											</span>
											<div
												className={cn(
													"w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
													state.mainUsage === option.id
														? "border-blue-500 bg-blue-500"
														: "border-slate-200",
												)}
											>
												{state.mainUsage === option.id && (
													<div className="w-2 h-2 rounded-full bg-white" />
												)}
											</div>
										</div>
										<p className="text-sm text-slate-500 leading-relaxed">
											{option.description}
										</p>
									</div>
								</button>
							))}
						</div>
					</section>

					{/* Workload Section */}
					<section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-8">
							<div className="p-2 bg-blue-50 rounded-lg">
								<LayoutGrid className="w-5 h-5 text-blue-600" />
							</div>
							<h2 className="text-xl font-bold text-slate-900">
								Help us understand your workload
							</h2>
						</div>

						<div className="space-y-10">
							{/* Browser Tabs */}
							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">
									How many browser tabs do you usually have open?
								</span>
								<div className="bg-slate-50/50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
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
										<p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">
											Tabs
										</p>
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

							{/* Software Selection */}
							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">
									Which software will you use most? (Select all that apply)
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

							{/* Storage Needs */}
							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">
									Storage Needs (Photos, Videos, Games)
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
											<span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
												{option.description}
											</span>
										</button>
									))}
								</div>
							</div>
						</div>
					</section>

					{/* Navigation */}
					<div className="flex items-center justify-between pt-4">
						<button
							type="button"
							className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
						>
							Back
						</button>
						<button
							type="button"
							className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 group"
						>
							Next Step
							<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>
				</div>

				{/* Sidebar */}
				<aside className="space-y-6 lg:sticky lg:top-8">
					{/* Current Suggestion Card */}
					<div className="bg-[#0F172A] rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
						<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
						<div className="relative z-10">
							<p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">
								Current Suggestion
							</p>
							<h3 className="text-2xl font-black mb-6">{suggestion.title}</h3>

							<div className="space-y-5">
								<div className="flex items-center gap-4">
									<div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
										<Cpu className="w-5 h-5 text-blue-400" />
									</div>
									<div>
										<p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
											CPU ({suggestion.cores}C / {suggestion.threads}T)
										</p>
										<p className="text-sm font-bold">
											{suggestion.cpu.brand} {suggestion.cpu.model}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
										<Monitor className="w-5 h-5 text-blue-400" />
									</div>
									<div>
										<p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
											GPU ({suggestion.vram} VRAM)
										</p>
										<p className="text-sm font-bold">
											{suggestion.gpu.brand} {suggestion.gpu.model}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
										<Database className="w-5 h-5 text-blue-400" />
									</div>
									<div>
										<p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
											RAM / SSD
										</p>
										<p className="text-sm font-bold">
											{suggestion.ram.model} / {suggestion.ssd.model}
										</p>
									</div>
								</div>
							</div>

							<div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-[11px] leading-relaxed text-white/60 italic">
								&quot;{suggestion.reason}&quot;
							</div>
						</div>
					</div>

					{/* Budget Card */}
					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
						<div className="aspect-[4/3] relative bg-slate-100">
							<Image
								src="https://picsum.photos/seed/pc-setup/400/300"
								alt="PC Setup"
								fill
								className="object-cover"
								referrerPolicy="no-referrer"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
						</div>
						<div className="p-6 pt-0 text-center relative z-10 -mt-8">
							<button
								type="button"
								onClick={() =>
									setState((prev) => ({ ...prev, view: "comparison" }))
								}
								className="w-full py-3 bg-slate-50 text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
							>
								<StoreIcon className="w-4 h-4 text-blue-600" />
								View Store Prices
							</button>
						</div>
					</div>
				</aside>
			</main>

			{/* Final Recommendation Section */}
			<section className="bg-white border-t border-slate-200 py-20 mt-10">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
						Final Recommendation
					</div>
					<h2 className="text-4xl font-black text-slate-900 mb-4">
						The &quot;{suggestion.title}&quot; Build
					</h2>
					<p className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed mb-8">
						{suggestion.reason}
					</p>

					{/* Technical Summary Row */}
					<div className="flex flex-wrap justify-center gap-8 mb-12 py-6 border-y border-slate-100">
						<div className="text-center">
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
								CPU Power
							</p>
							<p className="text-xl font-black text-slate-900">
								{suggestion.cores} Cores / {suggestion.threads} Threads
							</p>
						</div>
						<div className="w-px h-12 bg-slate-200 hidden md:block" />
						<div className="text-center">
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
								Graphics
							</p>
							<p className="text-xl font-black text-slate-900">
								{suggestion.vram} VRAM
							</p>
						</div>
						<div className="w-px h-12 bg-slate-200 hidden md:block" />
						<div className="text-center">
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
								Storage
							</p>
							<p className="text-xl font-black text-slate-900">
								{suggestion.ssd.brand} {suggestion.ssd.model}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
						{suggestion.specs.map((spec) => (
							<div
								key={spec.id}
								className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group"
							>
								<div className="p-3 bg-white rounded-xl border border-slate-200 w-fit mb-4 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
									<spec.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
								</div>
								<p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
									{spec.label}
								</p>
								<h4 className="text-lg font-bold text-slate-900 mb-2">
									{spec.title}
								</h4>
								<p className="text-sm text-slate-500 leading-relaxed">
									{spec.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

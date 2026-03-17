"use client";

import {
	Check,
	ChevronLeft,
	ChevronRight,
	CircuitBoard,
	Cpu,
	HardDrive,
	Layers,
	Monitor,
	Package,
	Plus,
	ShoppingCart,
	Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { PC_COMPONENTS, type PCComponent } from "@/lib/components";

const CATEGORIES = [
	{ id: "CPU", icon: Cpu, label: "Processor" },
	{ id: "Motherboard", icon: CircuitBoard, label: "Motherboard" },
	{ id: "RAM", icon: Layers, label: "Memory" },
	{ id: "GPU", icon: Monitor, label: "Graphics" },
	{ id: "Storage", icon: HardDrive, label: "Storage" },
	{ id: "PSU", icon: Zap, label: "Power Supply" },
	{ id: "Case", icon: Package, label: "Chassis" },
] as const;

export default function PCBuilder() {
	const [activeCategory, setActiveCategory] =
		useState<(typeof CATEGORIES)[number]["id"]>("CPU");
	const [selectedParts, setSelectedParts] = useState<
		Partial<Record<(typeof CATEGORIES)[number]["id"], PCComponent>>
	>({});
	const [isSummaryOpen, setIsSummaryOpen] = useState(false);

	const currentCategoryIndex = CATEGORIES.findIndex(
		(c) => c.id === activeCategory,
	);

	const filteredComponents = useMemo(
		() => PC_COMPONENTS.filter((c) => c.category === activeCategory),
		[activeCategory],
	);

	const totalPrice = useMemo(
		() =>
			Object.values(selectedParts).reduce(
				(sum, part) => sum + (part?.price || 0),
				0,
			),
		[selectedParts],
	);

	const handleSelect = (component: PCComponent) => {
		setSelectedParts((prev) => ({ ...prev, [activeCategory]: component }));
		if (currentCategoryIndex < CATEGORIES.length - 1) {
			setTimeout(() => {
				setActiveCategory(CATEGORIES[currentCategoryIndex + 1].id);
			}, 300);
		}
	};

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
			{/* Header */}
			<header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
							<Cpu className="text-black w-6 h-6" />
						</div>
						<div>
							<h1 className="text-xl font-bold tracking-tight uppercase italic">
								Forge<span className="text-orange-500">PC</span>
							</h1>
							<p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">
								Custom Rig Configurator v2.4
							</p>
						</div>
					</div>

					<div className="hidden md:flex items-center gap-8">
						<div className="flex flex-col items-end">
							<span className="text-[10px] text-white/40 uppercase font-mono">
								Estimated Total
							</span>
							<span className="text-2xl font-bold text-orange-500 font-mono">
								${totalPrice.toLocaleString()}
							</span>
						</div>
						<button
							type="button"
							onClick={() => setIsSummaryOpen(true)}
							className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-500 transition-colors flex items-center gap-2 group"
						>
							<ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
							Review Build
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
				{/* Sidebar Navigation */}
				<aside className="space-y-2">
					<div className="mb-8">
						<h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">
							Build Progress
						</h2>
						<div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-orange-500"
								initial={{ width: 0 }}
								animate={{
									width: `${((currentCategoryIndex + 1) / CATEGORIES.length) * 100}%`,
								}}
							/>
						</div>
					</div>

					{CATEGORIES.map((cat, idx) => {
						const Icon = cat.icon;
						const isSelected = selectedParts[cat.id];
						const isActive = activeCategory === cat.id;

						return (
							<button
								key={cat.id}
								type="button"
								onClick={() => setActiveCategory(cat.id)}
								className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
									isActive
										? "bg-orange-500/10 border-orange-500/50 text-orange-500"
										: "bg-white/5 border-transparent text-white/60 hover:bg-white/10"
								}`}
							>
								<div
									className={`w-10 h-10 rounded-lg flex items-center justify-center ${
										isActive ? "bg-orange-500 text-black" : "bg-white/5"
									}`}
								>
									<Icon className="w-5 h-5" />
								</div>
								<div className="text-left flex-1">
									<p className="text-[10px] font-mono uppercase opacity-50">
										Step 0{idx + 1}
									</p>
									<p className="font-bold text-sm">{cat.label}</p>
								</div>
								{isSelected && (
									<div className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
										<Check className="w-3 h-3" />
									</div>
								)}
							</button>
						);
					})}
				</aside>

				{/* Component Selection Area */}
				<section>
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-4xl font-bold tracking-tight mb-2">
								{activeCategory}
							</h2>
							<p className="text-white/40 font-mono text-sm uppercase">
								Select your preferred high-performance{" "}
								{activeCategory.toLowerCase()}
							</p>
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								disabled={currentCategoryIndex === 0}
								onClick={() =>
									setActiveCategory(CATEGORIES[currentCategoryIndex - 1].id)
								}
								className="p-3 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-20 transition-all"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button
								type="button"
								disabled={currentCategoryIndex === CATEGORIES.length - 1}
								onClick={() =>
									setActiveCategory(CATEGORIES[currentCategoryIndex + 1].id)
								}
								className="p-3 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-20 transition-all"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<AnimatePresence mode="wait">
							{filteredComponents.map((item) => (
								<motion.div
									key={item.id}
									layout
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95 }}
									className={`group relative bg-[#151619] border rounded-2xl overflow-hidden transition-all duration-500 ${
										selectedParts[activeCategory]?.id === item.id
											? "border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.1)]"
											: "border-white/5 hover:border-white/20"
									}`}
								>
									<div className="aspect-[16/10] relative overflow-hidden bg-black/40">
										<Image
											src={item.image}
											alt={item.name}
											fill
											className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
											referrerPolicy="no-referrer"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-[#151619] via-transparent to-transparent" />

										<div className="absolute top-4 left-4">
											<span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono uppercase tracking-wider border border-white/10">
												{item.brand}
											</span>
										</div>
									</div>

									<div className="p-6">
										<div className="flex justify-between items-start mb-4">
											<h3 className="text-xl font-bold leading-tight">
												{item.name}
											</h3>
											<span className="text-xl font-mono font-bold text-orange-500">
												${item.price}
											</span>
										</div>

										<div className="space-y-3 mb-8">
											{Object.entries(item.specs).map(([key, value]) => (
												<div
													key={key}
													className="flex justify-between items-center text-xs border-b border-white/5 pb-2"
												>
													<span className="text-white/40 font-mono uppercase">
														{key}
													</span>
													<span className="font-medium">{value}</span>
												</div>
											))}
										</div>

										<button
											type="button"
											onClick={() => handleSelect(item)}
											className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
												selectedParts[activeCategory]?.id === item.id
													? "bg-emerald-500 text-black"
													: "bg-white/5 hover:bg-white text-white hover:text-black"
											}`}
										>
											{selectedParts[activeCategory]?.id === item.id ? (
												<>
													<Check className="w-5 h-5" />
													Selected
												</>
											) : (
												<>
													<Plus className="w-5 h-5" />
													Add to Build
												</>
											)}
										</button>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</section>
			</main>

			{/* Summary Overlay */}
			<AnimatePresence>
				{isSummaryOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsSummaryOpen(false)}
							className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
						/>
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0f0f0f] border-l border-white/10 z-[70] shadow-2xl p-8 overflow-y-auto"
						>
							<div className="flex items-center justify-between mb-12">
								<h2 className="text-2xl font-bold italic uppercase tracking-tight">
									Build <span className="text-orange-500">Manifest</span>
								</h2>
								<button
									type="button"
									onClick={() => setIsSummaryOpen(false)}
									className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5"
								>
									<ChevronRight className="w-5 h-5" />
								</button>
							</div>

							<div className="space-y-6 mb-12">
								{CATEGORIES.map((cat) => {
									const part = selectedParts[cat.id];
									return (
										<div key={cat.id} className="group">
											<div className="flex justify-between items-center mb-2">
												<span className="text-[10px] font-mono uppercase text-white/30 tracking-widest">
													{cat.label}
												</span>
												{part && (
													<span className="text-xs font-mono text-orange-500">
														${part.price}
													</span>
												)}
											</div>
											<div
												className={`p-4 rounded-xl border transition-all ${
													part
														? "bg-white/5 border-white/10"
														: "bg-transparent border-dashed border-white/10 opacity-30"
												}`}
											>
												{part ? (
													<div className="flex items-center gap-4">
														<div className="w-12 h-12 rounded-lg bg-black relative overflow-hidden">
															<Image
																src={part.image}
																alt=""
																fill
																className="object-cover opacity-60"
																referrerPolicy="no-referrer"
															/>
														</div>
														<div>
															<p className="text-sm font-bold">{part.name}</p>
															<p className="text-[10px] text-white/40 uppercase font-mono">
																{part.brand}
															</p>
														</div>
													</div>
												) : (
													<p className="text-xs italic text-white/40">
														Not selected
													</p>
												)}
											</div>
										</div>
									);
								})}
							</div>

							<div className="border-t border-white/10 pt-8 space-y-4">
								<div className="flex justify-between items-end">
									<span className="text-white/40 font-mono uppercase text-sm">
										Grand Total
									</span>
									<span className="text-4xl font-bold text-orange-500 font-mono">
										${totalPrice.toLocaleString()}
									</span>
								</div>
								<button
									type="button"
									className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-400 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] active:scale-[0.98]"
								>
									Finalize Configuration
								</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* Mobile Price Bar */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between z-40">
				<div>
					<p className="text-[10px] text-white/40 uppercase font-mono">
						Build Total
					</p>
					<p className="text-xl font-bold text-orange-500 font-mono">
						${totalPrice.toLocaleString()}
					</p>
				</div>
				<button
					type="button"
					onClick={() => setIsSummaryOpen(true)}
					className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm"
				>
					Review
				</button>
			</div>
		</div>
	);
}

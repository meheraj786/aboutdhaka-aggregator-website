"use client";

import { type ClassValue, clsx } from "clsx";
import {
	Briefcase,
	CheckCircle2,
	Clapperboard,
	Code2,
	Cpu,
	Gamepad2,
	HardDrive,
	Info,
	LayoutGrid,
	MemoryStick,
	Minus,
	Monitor,
	Plus,
	Rocket,
	Sparkles,
	Loader2,
	X
} from "lucide-react";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { askAI } from "@/actions/ai.action";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const USAGE_OPTIONS = [
	{ id: "Gaming", icon: Gamepad2, description: "Triple-A titles and competitive play." },
	{ id: "Content Creation", icon: Clapperboard, description: "Video editing, 3D rendering, design." },
	{ id: "Development", icon: Code2, description: "Coding, VMs, and data processing." },
	{ id: "Office & Web", icon: Briefcase, description: "Browsing, Excel, and streaming." },
];

const SOFTWARE_OPTIONS = [
	"Chrome / Edge", "Adobe Premiere", "Visual Studio Code", "Discord", "AutoCAD", "Microsoft Excel",
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

interface PCBuildAIResponse {
	title: string;
	cpu_cores: number;
	cpu_threads: number;
	ram_gb: number;
	vram_gb: number;
	ssd_gb: number;
	explanation: string;
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

	const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
	const [aiResult, setAiResult] = useState<PCBuildAIResponse | null>(null);

	const manualBuild = useMemo(() => {
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

		if (browserTabs > 30) rec.ram = Math.max(rec.ram, 32);
		if (software.includes("Adobe Premiere")) rec.vram = Math.max(rec.vram, 12);
		if (storageNeeds === "Heavy") rec.ssd = 4096;

		return { minimum: min, recommended: rec };
	}, [state]);

	const handleAIAnalysis = async () => {
		setIsAnalyzing(true);
		try {
			const prompt = `Usage: ${state.mainUsage}, Tabs: ${state.browserTabs}, Software: ${state.software.join(", ")}, Storage: ${state.storageNeeds}`;
			const result = await askAI("pc-build", prompt);
			setAiResult(result as PCBuildAIResponse);
		} catch (error) {
			console.error(error);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const displaySpecs = useMemo(() => {
		if (aiResult) {
			return {
				title: aiResult.title,
				reason: aiResult.explanation,
				cores: aiResult.cpu_cores,
				threads: aiResult.cpu_threads,
				ram: aiResult.ram_gb,
				vram: aiResult.vram_gb,
				ssd: aiResult.ssd_gb
			};
		}
		return {
			title: `${state.mainUsage} Config`,
			reason: `Optimized for ${state.mainUsage} with ${state.browserTabs}+ tabs.`,
			cores: manualBuild.recommended.cores,
			threads: manualBuild.recommended.threads,
			ram: manualBuild.recommended.ram,
			vram: manualBuild.recommended.vram,
			ssd: manualBuild.recommended.ssd
		};
	}, [aiResult, state.mainUsage, state.browserTabs, manualBuild]);

	const toggleSoftware = (item: string) => {
		setState((prev) => ({
			...prev,
			software: prev.software.includes(item) ? prev.software.filter((s) => s !== item) : [...prev.software, item],
		}));
	};

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			<header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
				<nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
					<Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
					<span className="text-slate-300">/</span>
					<span className="text-slate-900 font-medium">Smart PC Suggester</span>
				</nav>
				<h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Smart PC Suggester</h1>
				<p className="text-lg text-slate-600">Enter your workflow and get a precise hardware plan.</p>
			</header>

			<main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
				<div className="space-y-8">
					<section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-8">
							<div className="p-2 bg-blue-50 rounded-lg"><Rocket className="w-5 h-5 text-blue-600" /></div>
							<h2 className="text-xl font-bold text-slate-900">What is your primary usage?</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{USAGE_OPTIONS.map((option) => (
								<button
									type="button"
									key={option.id}
									onClick={() => { setState(p => ({ ...p, mainUsage: option.id })); setAiResult(null); }}
									className={cn("flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all", state.mainUsage === option.id ? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50" : "border-slate-100 hover:border-slate-200")}
								>
									<div className={cn("p-3 rounded-xl", state.mainUsage === option.id ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500")}><option.icon className="w-6 h-6" /></div>
									<div className="flex-1">
										<span className="block font-bold text-slate-900 mb-1">{option.id}</span>
										<p className="text-sm text-slate-500">{option.description}</p>
									</div>
								</button>
							))}
						</div>
					</section>

					<section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-8">
							<div className="p-2 bg-blue-50 rounded-lg"><LayoutGrid className="w-5 h-5 text-blue-600" /></div>
							<h2 className="text-xl font-bold text-slate-900">Workflow Details</h2>
						</div>
						<div className="space-y-10">
							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">Browser Tabs</span>
								<div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between max-w-xs border border-slate-100">
									<button type="button" onClick={() => setState(p => ({ ...p, browserTabs: Math.max(0, p.browserTabs - 5) }))} className="p-2 bg-white rounded-lg border border-slate-200"><Minus className="w-5 h-5 text-slate-600" /></button>
									<span className="text-2xl font-black text-blue-600">{state.browserTabs}+</span>
									<button type="button" onClick={() => setState(p => ({ ...p, browserTabs: p.browserTabs + 5 }))} className="p-2 bg-white rounded-lg border border-slate-200"><Plus className="w-5 h-5 text-slate-600" /></button>
								</div>
							</div>

							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">Software Usage</span>
								<div className="flex flex-wrap gap-3">
									{SOFTWARE_OPTIONS.map((item) => (
										<button key={item} type="button" onClick={() => { toggleSoftware(item); setAiResult(null); }} className={cn("px-5 py-2.5 rounded-full text-sm font-medium transition-all border", state.software.includes(item) ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>{item}</button>
									))}
								</div>
							</div>

							<div>
								<span className="block text-sm font-semibold text-slate-700 mb-4">Storage Requirement</span>
								<div className="grid grid-cols-3 gap-4">
									{STORAGE_OPTIONS.map((opt) => (
										<button key={opt.id} type="button" onClick={() => setState(p => ({ ...p, storageNeeds: opt.id }))} className={cn("p-4 rounded-xl border-2 text-center transition-all", state.storageNeeds === opt.id ? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50" : "border-slate-100 hover:border-slate-200")}>
											<span className="block font-bold text-slate-900">{opt.id}</span>
											<span className="text-[10px] text-slate-500 uppercase font-medium">{opt.description}</span>
										</button>
									))}
								</div>
							</div>
						</div>
					</section>
				</div>

				<aside className="space-y-6 lg:sticky lg:top-8">
					<div className={cn("bg-white rounded-[2.5rem] p-8 border relative overflow-hidden transition-all duration-500", aiResult ? "border-blue-200 shadow-[0_20px_50px_rgba(59,130,246,0.15)]" : "border-slate-100 shadow-xl shadow-slate-200/50")}>
						<div className={cn("absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl transition-colors", aiResult ? "bg-blue-100" : "bg-slate-50")} />
						<div className="relative z-10">
							<div className="flex items-center justify-between mb-8">
								<div>
									<span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2", aiResult ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600")}>
										{aiResult ? <Sparkles className="w-3 h-3 mr-1" /> : null}
										{aiResult ? "AI Recommended" : "Manual Estimate"}
									</span>
									<h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{displaySpecs.title}</h3>
								</div>
								<div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", aiResult ? "bg-blue-600 text-white" : "bg-white text-blue-600 border")}>
									{aiResult ? <Sparkles className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
								</div>
							</div>

							<div className="space-y-6">
								<div className="relative p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100">
									<div className="grid grid-cols-2 gap-6">
										<div className="flex items-start gap-3">
											<div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><Cpu className="w-4 h-4 text-blue-500" /></div>
											<div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">CPU</p><p className="text-xs font-black text-slate-900">{displaySpecs.cores}C/{displaySpecs.threads}T</p></div>
										</div>
										<div className="flex items-start gap-3">
											<div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><MemoryStick className="w-4 h-4 text-blue-500" /></div>
											<div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">RAM</p><p className="text-xs font-black text-slate-900">{displaySpecs.ram}GB</p></div>
										</div>
										<div className="flex items-start gap-3">
											<div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><Monitor className="w-4 h-4 text-blue-500" /></div>
											<div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">GPU</p><p className="text-xs font-black text-slate-900">{displaySpecs.vram}GB</p></div>
										</div>
										<div className="flex items-start gap-3">
											<div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><HardDrive className="w-4 h-4 text-blue-500" /></div>
											<div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Disk</p><p className="text-xs font-black text-slate-900">{displaySpecs.ssd >= 1024 ? `${displaySpecs.ssd / 1024}TB` : `${displaySpecs.ssd}GB`}</p></div>
										</div>
									</div>
								</div>
								
								{!aiResult ? (
									<div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
										<p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Want more accuracy?</p>
										<button type="button" onClick={handleAIAnalysis} disabled={isAnalyzing} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:bg-slate-300">
											{isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
											Generate with Groq AI
										</button>
									</div>
								) : (
									<button type="button" onClick={() => setAiResult(null)} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase flex items-center gap-1 mx-auto transition-colors">
										<X className="w-3 h-3" /> Clear AI Results
									</button>
								)}
							</div>

							<div className="mt-6 flex gap-4 p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50">
								<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm"><Info className="w-4 h-4 text-blue-500" /></div>
								<p className="text-[11px] font-medium text-blue-900/70 leading-relaxed italic">"{displaySpecs.reason}"</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
						<h3 className="font-bold text-slate-900 mb-4">Final Summary</h3>
						<div className="space-y-2 mb-6">
							<div className="flex justify-between text-xs"><span className="text-slate-500">Usage Case</span><span className="font-bold text-slate-900">{state.mainUsage}</span></div>
							<div className="flex justify-between text-xs"><span className="text-slate-500">Multitasking</span><span className="font-bold text-slate-900">{state.browserTabs} Tabs</span></div>
							<div className="flex justify-between text-xs"><span className="text-slate-500">Storage Profile</span><span className="font-bold text-slate-900">{state.storageNeeds}</span></div>
						</div>
						<button type="button" className="w-full py-3 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
							<CheckCircle2 className="w-4 h-4" /> Finalize Build
						</button>
					</div>
				</aside>
			</main>
		</div>
	);
}
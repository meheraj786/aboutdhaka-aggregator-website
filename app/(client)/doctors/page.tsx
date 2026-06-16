"use client";

import { type ClassValue, clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
	Loader2,
	MapPin,
	Search,
	Sparkles,
	Star,
	Stethoscope,
	X,
	ShieldCheck,
	Filter,
	Activity,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { askAI, type DoctorSuggestion } from "@/actions/ai.action";
import { useFetchDoctors } from "@/hooks/useDoctors";
import { useFetchAreas } from "@/hooks/useAreas";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const VET_KEYWORDS = ["Veterinary", "Avian", "Exotic Animal", "Zoo", "Aquatic", "Equine", "Large Animal", "Small Animal"];

export default function DoctorsListing() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
	const [areaSearch, setAreaSearch] = useState("");
	const [symptoms, setSymptoms] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [aiResult, setAiResult] = useState<DoctorSuggestion | null>(null);

	const { data: doctorData, isLoading: doctorsLoading } = useFetchDoctors();
	const { data: areas, isLoading: areasLoading } = useFetchAreas();

	const doctorsList = useMemo(() => {
		const items = doctorData?.items || [];
		return items.filter((doc: any) => {
			const isVet = doc.departments?.some((dept: string) => 
				VET_KEYWORDS.some(keyword => dept.includes(keyword))
			);
			return !isVet;
		});
	}, [doctorData]);

	const dynamicCategories = useMemo(() => {
		const departments = new Set<string>();
		doctorsList.forEach((doc: { departments: string[] }) => {
			doc.departments?.forEach((dept: string) => {
				departments.add(dept);
			});
		});
		return Array.from(departments).slice(0, 8);
	}, [doctorsList]);

	const handleAIAnalysis = useCallback(async () => {
		if (!symptoms) return;
		setIsAnalyzing(true);
		try {
			const result = await askAI<DoctorSuggestion>("doctor-suggestion", symptoms);
			setAiResult(result);
			setSearchQuery(result.department);
		} catch (error) {
			console.error(error);
		} finally {
			setIsAnalyzing(false);
		}
	}, [symptoms]);

	const filteredAreas = useMemo(() => {
		if (!areas) return [];
		return areas.filter((a) => 
			a.name.toLowerCase().includes(areaSearch.toLowerCase())
		);
	}, [areas, areaSearch]);

	const filteredDoctors = useMemo(() => {
		return doctorsList.filter((doc: any) => {
			const query = searchQuery.toLowerCase();
			const matchesSearch =
				doc.name.toLowerCase().includes(query) ||
				doc.designation.toLowerCase().includes(query) ||
				doc.departments?.some((d: string) => d.toLowerCase().includes(query));
			
			const matchesArea = selectedAreas.length === 0 || 
				doc.chamber?.some((c: any) => selectedAreas.includes(c.address?.area));

			return matchesSearch && matchesArea;
		});
	}, [searchQuery, selectedAreas, doctorsList]);

	const toggleArea = useCallback((areaName: string) => {
		setSelectedAreas(prev => 
			prev.includes(areaName) ? prev.filter(a => a !== areaName) : [...prev, areaName]
		);
	}, []);

	const resetFilters = useCallback(() => {
		setSearchQuery("");
		setSelectedAreas([]);
	}, []);

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			<section className="bg-white border-b border-slate-100 pt-16 pb-12 relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 block">AI-Assistant</span>
							<h1 className="text-5xl font-black text-slate-900 leading-tight mb-6">Which <span className="text-blue-600">Specialist</span> <br />do you need?</h1>
							<p className="text-slate-500 text-lg mb-8 max-w-md">Our AI analyzes your symptoms and finds the best doctor for your condition.</p>
						</div>
						<div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm relative">
							<div className="flex items-center gap-2 mb-4 text-blue-600"><Sparkles className="w-5 h-5" /><span className="font-bold text-sm">Symptoms Description:</span></div>
							<textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 h-32 resize-none shadow-inner" placeholder="e.g. Sharp stomach pain for 2 days..." />
							<button type="button" onClick={handleAIAnalysis} disabled={isAnalyzing || !symptoms} className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:bg-slate-300">
								{isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
								{isAnalyzing ? "Analyzing..." : "Ask AI Assistant"}
							</button>
						</div>
					</div>
					<AnimatePresence>
						{aiResult && (
							<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-8 bg-blue-600 rounded-[2rem] p-8 text-white relative shadow-xl">
								<button type="button" onClick={() => setAiResult(null)} className="absolute top-6 right-6 hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
									<div><p className="text-blue-100 text-[10px] font-black uppercase mb-2">Recommended Dept.</p><h3 className="text-3xl font-black">{aiResult.department}</h3></div>
									<div className="bg-white/10 p-4 rounded-2xl border border-white/10"><p className="text-blue-100 text-[10px] font-black uppercase mb-1">Severity</p><p className="font-bold uppercase tracking-widest text-xs">{aiResult.severity} Risk</p></div>
									<div><p className="text-blue-100 text-[10px] font-black uppercase mb-1">AI Reason</p><p className="text-sm italic">&quot;{aiResult.reason}&quot;</p></div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</section>

			<section className="bg-white border-b border-slate-100 py-6 sticky top-0 z-30 shadow-sm">
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl w-full border border-slate-200">
						<Search className="w-4 h-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search by Doctor Name, Specialty or Disease..."
							className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && <X className="w-4 h-4 cursor-pointer" onClick={() => setSearchQuery("")} />}
					</div>
					<div className="mt-4 flex flex-wrap items-center gap-2">
						<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Quick Filter:</span>
						{dynamicCategories.map((dept) => (
							<button
								type="button"
								key={dept}
								onClick={() => setSearchQuery(dept === searchQuery ? "" : dept)}
								className={cn(
									"flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all",
									searchQuery === dept 
										? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" 
										: "bg-white text-slate-600 border-slate-200 hover:border-blue-600 hover:text-blue-600"
								)}
							>
								<Stethoscope className="w-3 h-3" /> {dept}
							</button>
						))}
					</div>
				</div>
			</section>

			<main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
				<aside className="w-full lg:w-64 shrink-0 space-y-8">
					<div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm sticky top-40">
						<div className="flex items-center justify-between mb-6">
							<h3 className="font-bold text-slate-900 flex items-center gap-2">
								<MapPin className="w-4 h-4 text-blue-600" /> Areas
							</h3>
							{selectedAreas.length > 0 && (
								<button type="button" onClick={() => setSelectedAreas([])} className="text-[10px] font-bold text-blue-600 hover:underline">RESET</button>
							)}
						</div>

						<div className="relative mb-6">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
							<input 
								type="text" 
								placeholder="Search location..." 
								className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
								value={areaSearch}
								onChange={(e) => setAreaSearch(e.target.value)}
							/>
						</div>

						<div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
							{areasLoading ? (
								[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-8 bg-slate-50 rounded-lg animate-pulse mb-2" />)
							) : filteredAreas.length > 0 ? (
								filteredAreas.map((area: any) => (
									<label key={area._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors">
										<input 
											type="checkbox" 
											className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
											checked={selectedAreas.includes(area.name)}
											onChange={() => toggleArea(area.name)}
										/>
										<span className={cn("text-xs transition-colors", selectedAreas.includes(area.name) ? "font-bold text-blue-600" : "text-slate-600 group-hover:text-slate-900")}>
											{area.name}
										</span>
									</label>
								))
							) : (
								<p className="text-xs text-slate-400 text-center py-4">No areas found</p>
							)}
						</div>
					</div>
				</aside>

				<div className="flex-1">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-black text-slate-900">
							{searchQuery ? `Specialists: ${searchQuery}` : "Available Doctors"}
						</h2>
						<p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{filteredDoctors.length} results found</p>
					</div>

					{doctorsLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1, 2, 3, 4].map((i) => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse" />)}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filteredDoctors.map((doc: any) => (
								<motion.div key={doc._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
									<div className="flex items-start gap-5 mb-6">
										<div className="relative shrink-0">
											<Image 
												width={80} height={80} 
												src={doc.profileImage || "https://avatar.iran.liara.run/public/doctor"} 
												alt={doc.name} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100" 
											/>
											{doc.isVerified && <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full border-2 border-white"><ShieldCheck className="w-3 h-3" /></div>}
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2 mb-1 flex-wrap">
												<span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">{doc.experience}+ Yrs</span>
												<div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded">
													<Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
													<span className="text-[9px] font-black text-amber-700">{doc.rating || "5.0"}</span>
												</div>
											</div>
											<h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{doc.name}</h3>
											<p className="text-[11px] font-bold text-blue-600 mb-3">{doc.designation}</p>
											
											<div className="space-y-1.5">
												<div className="flex items-center gap-2 text-slate-500 text-[11px]"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{doc.chamber?.[0]?.name || "Consultation Chamber"}</span></div>
												<div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold"><Activity className="w-3 h-3 shrink-0" /><span>{doc.departments?.[0]}</span></div>
											</div>
										</div>
									</div>

									<div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
										<div className="flex flex-col">
											<span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fee starts at</span>
											<span className="text-sm font-black text-slate-900">৳800 - 1,500</span>
										</div>
										<Link href={`/doctors/${doc._id}`} className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all">VIEW PROFILE</Link>
									</div>
								</motion.div>
							))}
						</div>
					)}
					
					{!doctorsLoading && filteredDoctors.length === 0 && (
						<div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
							<Filter className="w-12 h-12 text-slate-200 mb-4" />
							<h3 className="text-lg font-bold text-slate-900">No doctors match your criteria</h3>
							<p className="text-slate-400 text-sm max-w-xs">Try selecting a different area or removing your search keyword.</p>
							<button type="button" onClick={resetFilters} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Clear all filters</button>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
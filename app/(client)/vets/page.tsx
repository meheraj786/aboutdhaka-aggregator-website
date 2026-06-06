"use client";

import { type ClassValue, clsx } from "clsx";
import { motion } from "framer-motion";
import {
	Clock,
	Loader2,
	MapPin,
	Search,
	Star,
	Stethoscope,
	ShieldCheck,
	Filter,
	PawPrint,
	Activity,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useFetchDoctors } from "@/hooks/useDoctors";
import { useFetchAreas } from "@/hooks/useAreas";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export default function VetDoctorsListing() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
	const [areaSearch, setAreaSearch] = useState("");

	// --- DATA FETCHING ---
	const { data: doctorData, isLoading: doctorsLoading } = useFetchDoctors();
	const { data: areas, isLoading: areasLoading } = useFetchAreas();

	// --- FILTER VET DOCTORS ONLY ---
	const vetDoctorsList = useMemo(() => {
		const allDoctors = doctorData?.items || [];
		return allDoctors.filter((doc: { departments: string[] }) =>
			doc.departments?.some((dept: string) => 
				dept.startsWith("Veterinary") || 
				dept.includes("Animal") || 
				dept.includes("Medicine") && (dept.includes("Avian") || dept.includes("Equine"))
			)
		);
	}, [doctorData]);

	// --- DYNAMIC VET CATEGORIES ---
	const dynamicVetCategories = useMemo(() => {
		const departments = new Set<string>();
		vetDoctorsList.forEach((doc: { departments: string[] }) => {
			doc.departments?.forEach((dept: string) => {
				departments.add(dept);
			});
		});
		return Array.from(departments).slice(0, 8);
	}, [vetDoctorsList]);

	// --- SEARCH & SIDEBAR FILTERING ---
	const filteredAreas = useMemo(() => {
		if (!areas) return [];
		return areas.filter((a) => a.name.toLowerCase().includes(areaSearch.toLowerCase()));
	}, [areas, areaSearch]);

const filteredVets = useMemo(() => {
    return vetDoctorsList.filter((doc: { 
        name: string; 
        designation: string; 
        departments: string[]; 
        chamber: { address: { area: string } }[] 
    }) => {
        const query = searchQuery.toLowerCase();
        
        const matchesSearch =
            doc.name.toLowerCase().includes(query) ||
            doc.designation.toLowerCase().includes(query) ||
            doc.departments?.some((d: string) => d.toLowerCase().includes(query));
        
        const matchesArea = selectedAreas.length === 0 || 
            doc.chamber?.some((c) => selectedAreas.includes(c.address?.area));

        return matchesSearch && matchesArea;
    });
}, [searchQuery, selectedAreas, vetDoctorsList]);

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			{/* --- HERO SECTION (Static, No AI) --- */}
			<section className="bg-white border-b border-slate-100 pt-20 pb-16 relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6 border border-blue-100">
						<PawPrint className="w-4 h-4 text-blue-600" />
						<span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Animal Healthcare</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
						Find the Best <span className="text-blue-600">Veterinary</span> <br /> Specialists for your Pets
					</h1>
					<p className="text-slate-500 text-lg max-w-2xl mx-auto">
						Connect with certified veterinary surgeons, dermatologists, and general practitioners across Dhaka.
					</p>
				</div>
			</section>

			{/* --- SEARCH & QUICK FILTERS --- */}
			<section className="bg-white border-b border-slate-100 py-6 sticky top-0 z-30 shadow-sm">
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl w-full border border-slate-200">
						<Search className="w-4 h-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search Vet Name or Specialty (e.g. Surgery)..."
							className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="mt-4 flex flex-wrap items-center gap-2">
						<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Vet Departments:</span>
						{dynamicVetCategories.map((dept) => (
							<button
								key={dept}
								type="button"
								onClick={() => setSearchQuery(dept === searchQuery ? "" : dept)}
								className={cn(
									"flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all",
									searchQuery === dept ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-600 hover:text-blue-600"
								)}
							>
								{dept}
							</button>
						))}
					</div>
				</div>
			</section>

			<main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
				{/* --- SIDEBAR AREA FILTER --- */}
				<aside className="w-full lg:w-64 shrink-0">
					<div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm sticky top-40">
						<div className="flex items-center justify-between mb-6">
							<h3 className="font-bold text-slate-900 flex items-center gap-2">
								<MapPin className="w-4 h-4 text-blue-600" /> Areas
							</h3>
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
								[1, 2, 3].map((i) => <div key={i} className="h-8 bg-slate-50 rounded-lg animate-pulse mb-2" />)
							) : filteredAreas.map((area: { _id: string; name: string }) => (
								<label key={area._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors">
									<input 
										type="checkbox" 
										className="w-4 h-4 rounded border-slate-200 text-blue-600"
										checked={selectedAreas.includes(area.name)}
										onChange={() => setSelectedAreas(prev => prev.includes(area.name) ? prev.filter(a => a !== area.name) : [...prev, area.name])}
									/>
									<span className={cn("text-xs transition-colors", selectedAreas.includes(area.name) ? "font-bold text-blue-600" : "text-slate-600")}>
										{area.name}
									</span>
								</label>
							))}
						</div>
					</div>
				</aside>

				{/* --- VET LISTING GRID --- */}
				<div className="flex-1">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-black text-slate-900">Recommended Vets</h2>
						<p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{filteredVets.length} vets found</p>
					</div>

					{doctorsLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1, 2, 3, 4].map((i) => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse" />)}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filteredVets.map((doc: { _id: string; name: string; profileImage: string; isVerified: boolean; departments: string[]; location: string; rating: number; reviews: number; specialties: string[]; designation: string, chamber: {name:string}[], slug: string}) => (
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
												<span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">Pet Specialist</span>
												<div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded">
													<Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
													<span className="text-[9px] font-black text-amber-700">{doc.rating || "5.0"}</span>
												</div>
											</div>
											<h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{doc.name}</h3>
											<p className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-tighter">{doc.designation}</p>
											
											<div className="space-y-1.5">
												<div className="flex items-center gap-2 text-slate-500 text-[11px]"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{doc.chamber?.[0]?.name || "Vet Clinic"}</span></div>
												<div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold"><Activity className="w-3 h-3 shrink-0" /><span>{doc.departments?.[0]}</span></div>
											</div>
										</div>
									</div>

									<div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
										<div className="flex flex-col">
											<span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Consultation</span>
											<span className="text-sm font-black text-slate-900">৳600 - 1,200</span>
										</div>
										<Link href={`/doctors/${doc._id}`} className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all">PROFILE</Link>
									</div>
								</motion.div>
							))}
						</div>
					)}
					
					{!doctorsLoading && filteredVets.length === 0 && (
						<div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
							<Filter className="w-12 h-12 text-slate-200 mb-4" />
							<h3 className="text-lg font-bold text-slate-900">No Veterinary Surgeons found</h3>
							<p className="text-slate-400 text-sm max-w-xs">Try selecting a different area or removing your search keyword.</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
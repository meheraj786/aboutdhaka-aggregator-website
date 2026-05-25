"use client";

import { type ClassValue, clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
	Baby,
	Brain,
	// ChevronRight,
	Clock,
	// DollarSign,
	Heart,
	Loader2,
	// LayoutGrid,
	// List as ListIcon,
	MapPin,
	Search,
	Sparkles,
	Star,
	Stethoscope,
	User,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { type DoctorSuggestion, askAI } from "@/actions/ai.action";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const CATEGORIES = [
	{
		id: "cardiology",
		name: "Cardiology",
		icon: Heart,
		color: "bg-rose-50 text-rose-600",
	},
	{
		id: "neurology",
		name: "Neurology",
		icon: Brain,
		color: "bg-indigo-50 text-indigo-600",
	},
	{
		id: "pediatrics",
		name: "Pediatrics",
		icon: Baby,
		color: "bg-amber-50 text-amber-600",
	},
	{
		id: "gynecology",
		name: "Gynecology",
		icon: User,
		color: "bg-pink-50 text-pink-600",
	},
	{
		id: "dermatology",
		name: "Dermatology",
		icon: Stethoscope,
		color: "bg-emerald-50 text-emerald-600",
	},
];

const SPECIALISTS = [
	{
		id: "mahir-ahmed",
		name: "Dr. Mahir Ahmed",
		title: "Consultant Cardiologist",
		department: "Cardiology",
		hospital: "Evercare Hospital, Bashundhara R/A",
		availability: "Mon - Thu • 04:00 PM - 08:00 PM",
		fee: "1,200",
		rating: 4.9,
		image: "https://picsum.photos/seed/doc1/200/200",
		tag: "AVAILABLE TODAY",
		tagColor: "bg-emerald-50 text-emerald-600",
	},
	{
		id: "sarah-faruque",
		name: "Dr. Sarah Faruque",
		title: "Senior Neurologist",
		department: "Neurology",
		hospital: "Square Hospital, Panthapath",
		availability: "Sat - Wed • 05:00 PM - 09:00 PM",
		fee: "1,500",
		rating: 5.0,
		image: "https://picsum.photos/seed/doc2/200/200",
		tag: "HIGHLY RATED",
		tagColor: "bg-amber-50 text-amber-600",
	},
	{
		id: "asif-rahman",
		name: "Dr. Asif Rahman",
		title: "Pediatric Surgeon",
		department: "Pediatrics",
		hospital: "United Hospital, Gulshan",
		availability: "Sun - Thu • 03:00 PM - 06:00 PM",
		fee: "1,000",
		rating: 4.8,
		image: "https://picsum.photos/seed/doc3/200/200",
		tag: "AVAILABLE SAT",
		tagColor: "bg-blue-50 text-blue-600",
	},
	{
		id: "nusrat-jahan",
		name: "Dr. Nusrat Jahan",
		title: "Dermatologist",
		department: "Dermatology",
		hospital: "Labaid Specialized Hospital",
		availability: "All Week • 05:00 PM - 09:00 PM",
		fee: "1,000",
		rating: 4.7,
		image: "https://picsum.photos/seed/doc4/200/200",
		tag: "AVAILABLE TODAY",
		tagColor: "bg-emerald-50 text-emerald-600",
	},
	{
		id: "tanveer-ahmed",
		name: "Dr. Tanveer Ahmed",
		title: "Internal Medicine",
		department: "Medicine",
		hospital: "Apollo Hospital (Evercare)",
		availability: "Mon - Thu • 10:00 AM - 02:00 PM",
		fee: "1,800",
		rating: 4.9,
		image: "https://picsum.photos/seed/doc5/200/200",
		tag: "NEXT: MON",
		tagColor: "bg-slate-50 text-slate-600",
	},
];

export default function DoctorsListing() {
	// const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [location, setLocation] = useState("All Locations (Dhaka)");
	const [symptoms, setSymptoms] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [aiResult, setAiResult] = useState<DoctorSuggestion | null>(null);

	const handleAIAnalysis = async () => {
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
	};

	const filteredDoctors = useMemo(() => {
		return SPECIALISTS.filter((doc) => {
			const query = searchQuery.toLowerCase();
			const matchesSearch =
				doc.name.toLowerCase().includes(query) ||
				doc.title.toLowerCase().includes(query) ||
				doc.department.toLowerCase().includes(query);
			const matchesLocation =
				location === "All Locations (Dhaka)" || doc.hospital.includes(location);
			return matchesSearch && matchesLocation;
		});
	}, [searchQuery, location]);

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			<section className="bg-white border-b border-slate-100 pt-16 pb-12 relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 block">
								AI-Powered Health Assistant
							</span>
							<h1 className="text-5xl font-black text-slate-900 leading-tight mb-6">
								Don&apos;t know which{" "}
								<span className="text-blue-600">Doctor</span> <br />
								to see?
							</h1>
							<p className="text-slate-500 text-lg mb-8 max-w-md">
								Describe your symptoms, and our AI will guide you to the right
								specialist in seconds.
							</p>
						</div>

						<div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm relative">
							<div className="flex items-center gap-2 mb-4 text-blue-600">
								<Sparkles className="w-5 h-5" />
								<span className="font-bold text-sm">
									Describe how you feel:
								</span>
							</div>
							<textarea
								value={symptoms}
								onChange={(e) => setSymptoms(e.target.value)}
								className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 h-32 resize-none shadow-inner"
								placeholder="e.g. I have a sharp pain in my chest and feeling dizzy..."
							/>
							<button
								type="button"
								onClick={handleAIAnalysis}
								disabled={isAnalyzing || !symptoms}
								className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:bg-slate-300"
							>
								{isAnalyzing ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<Sparkles className="w-5 h-5" />
								)}
								{isAnalyzing ? "Analyzing Symptoms..." : "Ask AI Assistant"}
							</button>
						</div>
					</div>

					<AnimatePresence>
						{aiResult && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="mt-8 bg-blue-600 rounded-[2rem] p-8 text-white relative shadow-xl"
							>
								<button
									type="button"
									onClick={() => setAiResult(null)}
									className="absolute top-6 right-6 hover:rotate-90 transition-transform"
								>
									<X className="w-6 h-6" />
								</button>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
									<div>
										<p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2">
											Recommended Department
										</p>
										<h3 className="text-3xl font-black">
											{aiResult.department}
										</h3>
									</div>
									<div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
										<p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">
											Severity
										</p>
										<p className="font-bold">{aiResult.severity} Risk</p>
									</div>
									<div>
										<p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">
											AI Insight
										</p>
										<p className="text-sm italic">
											&quot;{aiResult.reason}&quot;
										</p>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</section>

			<section className="bg-white border-b border-slate-100 py-6 sticky top-0 z-30 shadow-sm">
				<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-4">
					<div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl w-full border border-slate-200">
						<Search className="w-4 h-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search Name, Specialty or Department..."
							className="bg-transparent border-none focus:ring-0 text-sm w-full"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<X
								className="w-4 h-4 cursor-pointer"
								onClick={() => setSearchQuery("")}
							/>
						)}
					</div>
					<div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl w-full md:w-64 border border-slate-200">
						<MapPin className="w-4 h-4 text-slate-400" />
						<select
							className="bg-transparent border-none focus:ring-0 text-sm w-full cursor-pointer"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						>
							<option>All Locations (Dhaka)</option>
							<option>Dhanmondi</option>
							<option>Gulshan</option>
							<option>Uttara</option>
						</select>
					</div>
				</div>
				<div className="max-w-7xl mx-auto px-6 mt-4 flex flex-wrap items-center gap-3">
					<span className="text-xs font-bold text-slate-400">
						Filter by Department:
					</span>
					{CATEGORIES.map((cat) => (
						<button
							key={cat.id}
							type="button"
							onClick={() => setSearchQuery(cat.name)}
							className={cn(
								"flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
								searchQuery === cat.name
									? "bg-blue-600 text-white border-blue-600"
									: cn(cat.color, "border-transparent hover:shadow-md"),
							)}
						>
							<cat.icon className="w-3 h-3" />
							{cat.name}
						</button>
					))}
				</div>
			</section>

			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-2xl font-black text-slate-900">
						{searchQuery ? `Results for "${searchQuery}"` : "All Specialists"}
					</h2>
					<p className="text-slate-400 text-sm font-bold">
						{filteredDoctors.length} Doctors Found
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredDoctors.map((doc) => (
						<motion.div
							key={doc.id}
							layout
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group p-6"
						>
							<div className="flex items-start justify-between mb-6">
								<div className="flex items-center gap-4">
									<Image
										width={64}
										height={64}
										src={doc.image}
										alt={doc.name}
										className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50"
									/>
									<div>
										<span
											className={cn(
												"inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mb-1",
												doc.tagColor,
											)}
										>
											{doc.tag}
										</span>
										<h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
											{doc.name}
										</h3>
										<p className="text-[11px] font-bold text-blue-600">
											{doc.title}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
									<Star className="w-3 h-3 text-amber-500 fill-current" />
									<span className="text-[10px] font-black text-amber-700">
										{doc.rating}
									</span>
								</div>
							</div>

							<div className="space-y-3 mb-6">
								<div className="flex items-center gap-3 text-slate-500 text-xs">
									<MapPin className="w-3.5 h-3.5" /> <span>{doc.hospital}</span>
								</div>
								<div className="flex items-center gap-3 text-slate-500 text-xs">
									<Clock className="w-3.5 h-3.5" />{" "}
									<span>{doc.availability}</span>
								</div>
								<div className="flex items-center gap-3 text-blue-600 text-xs font-bold">
									<Stethoscope className="w-3.5 h-3.5" />{" "}
									<span>{doc.department}</span>
								</div>
							</div>

							<div className="flex items-center justify-between pt-4 border-t border-slate-50">
								<span className="text-sm font-black text-slate-900">
									৳{doc.fee}
								</span>
								<Link
									href={`/doctors/${doc.id}`}
									className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all"
								>
									BOOK NOW
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</main>
		</div>
	);
}

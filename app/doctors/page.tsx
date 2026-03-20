"use client";

import { type ClassValue, clsx } from "clsx";
import {
	Baby,
	Brain,
	ChevronRight,
	Clock,
	DollarSign,
	Heart,
	LayoutGrid,
	List as ListIcon,
	MapPin,
	Search,
	Star,
	Stethoscope,
	User,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

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
		hospital: "Apollo Hospital (Evercare)",
		availability: "Mon - Thu • 10:00 AM - 02:00 PM",
		fee: "1,800",
		rating: 4.9,
		image: "https://picsum.photos/seed/doc5/200/200",
		tag: "NEXT: MON",
		tagColor: "bg-slate-50 text-slate-600",
	},
];

export default function HospitalsListing() {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [location, setLocation] = useState("All Locations (Dhaka)");

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			{/* Hero Section */}
			<section className="bg-white border-b border-slate-100 pt-16 pb-12">
				<div className="max-w-7xl mx-auto px-6">
					<div className="mb-10">
						<span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 block">
							TRUSTED MEDICAL DIRECTORY
						</span>
						<h1 className="text-5xl font-black text-slate-900 leading-tight mb-6">
							Find the specialized <span className="text-blue-600">care</span>{" "}
							<br />
							you deserve.
						</h1>
					</div>

					{/* Search Bar */}
					<div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-2 flex flex-col md:flex-row items-center gap-2 max-w-4xl">
						<div className="flex-1 flex items-center gap-3 px-4 py-3 w-full">
							<Search className="w-5 h-5 text-slate-400" />
							<input
								type="text"
								placeholder="Search by doctor name or specialty..."
								className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="w-px h-8 bg-slate-200 hidden md:block" />
						<div className="flex-1 flex items-center gap-3 px-4 py-3 w-full">
							<MapPin className="w-5 h-5 text-slate-400" />
							<select
								className="w-full bg-transparent border-none focus:ring-0 text-slate-900 font-medium appearance-none cursor-pointer"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
							>
								<option>All Locations (Dhaka)</option>
								<option>Dhanmondi</option>
								<option>Gulshan</option>
								<option>Uttara</option>
								<option>Banani</option>
							</select>
						</div>
						<button
							type="button"
							className="w-full md:w-auto px-8 py-3.5 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
						>
							<Search className="w-4 h-4" />
							Search
						</button>
					</div>

					{/* Popular Categories */}
					<div className="mt-8 flex flex-wrap items-center gap-4">
						<span className="text-sm font-bold text-slate-400">Popular:</span>
						{CATEGORIES.map((cat) => (
							<button
								key={cat.id}
								type="button"
								className={cn(
									"flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border border-transparent",
									cat.color,
									"hover:shadow-md hover:-translate-y-0.5",
								)}
							>
								<cat.icon className="w-3.5 h-3.5" />
								{cat.name}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="flex items-center justify-between mb-10">
					<div>
						<h2 className="text-2xl font-black text-slate-900 mb-1">
							Available Specialists
						</h2>
						<p className="text-sm text-slate-500 font-medium">
							Showing 128 verified practitioners in Dhaka City
						</p>
					</div>
					<div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							className={cn(
								"p-2 rounded-lg transition-all",
								viewMode === "grid"
									? "bg-slate-100 text-blue-600"
									: "text-slate-400 hover:text-slate-600",
							)}
						>
							<LayoutGrid className="w-4 h-4" />
						</button>
						<button
							type="button"
							onClick={() => setViewMode("list")}
							className={cn(
								"p-2 rounded-lg transition-all",
								viewMode === "list"
									? "bg-slate-100 text-blue-600"
									: "text-slate-400 hover:text-slate-600",
							)}
						>
							<ListIcon className="w-4 h-4" />
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{SPECIALISTS.map((doc) => (
						<motion.div
							key={doc.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group overflow-hidden"
						>
							<div className="p-6">
								<div className="flex items-start justify-between mb-6">
									<div className="flex items-center gap-4">
										<div className="relative">
											<Image
												width={64}
												height={64}
												src={doc.image}
												alt={doc.name}
												className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-blue-50 transition-all"
											/>
											<div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm">
												<div className="bg-emerald-500 w-2.5 h-2.5 rounded-full" />
											</div>
										</div>
										<div>
											<div
												className={cn(
													"inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mb-1.5",
													doc.tagColor,
												)}
											>
												{doc.tag}
											</div>
											<h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
												{doc.name}
											</h3>
											<p className="text-xs font-bold text-blue-600">
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

								<div className="space-y-3 mb-8">
									<div className="flex items-center gap-3 text-slate-500">
										<div className="p-1.5 bg-slate-50 rounded-lg">
											<Stethoscope className="w-3.5 h-3.5" />
										</div>
										<span className="text-xs font-medium">{doc.hospital}</span>
									</div>
									<div className="flex items-center gap-3 text-slate-500">
										<div className="p-1.5 bg-slate-50 rounded-lg">
											<Clock className="w-3.5 h-3.5" />
										</div>
										<span className="text-xs font-medium">
											{doc.availability}
										</span>
									</div>
									<div className="flex items-center gap-3 text-slate-500">
										<div className="p-1.5 bg-slate-50 rounded-lg">
											<DollarSign className="w-3.5 h-3.5" />
										</div>
										<span className="text-xs font-medium">Fee: ৳{doc.fee}</span>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<Link
										href={`/doctors/${doc.id}`}
										className="flex-1 py-3 text-center text-xs font-black text-slate-400 hover:text-blue-600 transition-colors"
									>
										View Profile
									</Link>
									{/* <button type="button" className="flex-[1.5] py-3 bg-[#0F172A] text-white text-xs font-black rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                    Book Appointment
                  </button> */}
								</div>
							</div>
						</motion.div>
					))}

					{/* CTA Card */}
					<div className="bg-[#0F172A] rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
						<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
						<div className="relative z-10">
							<h3 className="text-2xl font-black mb-4">
								Don&apos;t see your regular doctor?
							</h3>
							<p className="text-sm text-slate-400 leading-relaxed mb-8">
								Suggest a practitioner or invite them to join AboutDhaka&apos;s
								verified medical network.
							</p>
						</div>
						<button
							type="button"
							className="w-full py-4 bg-white text-[#0F172A] font-black rounded-xl hover:bg-blue-50 transition-all relative z-10"
						>
							Recommend a Doctor
						</button>
					</div>
				</div>

				{/* Pagination */}
				<div className="mt-16 flex items-center justify-center gap-2">
					<button
						type="button"
						className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
					>
						<ChevronRight className="w-5 h-5 rotate-180" />
					</button>
					<button
						type="button"
						className="w-10 h-10 rounded-xl bg-[#0F172A] text-white font-black text-sm"
					>
						1
					</button>
					<button
						type="button"
						className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50"
					>
						2
					</button>
					<button
						type="button"
						className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50"
					>
						3
					</button>
					<button
						type="button"
						className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
					>
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			</main>
		</div>
	);
}

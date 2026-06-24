"use client";

import {
	Activity,
	ArrowLeft,
	Award,
	Calendar,
	ChevronRight,
	Heart,
	MapPin,
	Monitor,
	ShieldCheck,
	Star,
	Stethoscope,
	Loader2,
	Mail,
	Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetchDoctorById } from "@/hooks/useDoctors"; // Ensure this hook exists

export default function SpecialistDetail() {
	const { id } = useParams();
	const { data: response, isLoading } = useFetchDoctorById(id as string);
	const doctor = response?.data;

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<Loader2 className="w-10 h-10 animate-spin text-blue-600" />
			</div>
		);
	}

	if (!doctor) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="font-bold text-slate-500">Doctor not found.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			{/* Hero Section */}
			<section className="bg-[#0F172A] text-white pt-24 pb-32 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full -mr-64 -mt-64 blur-[120px]" />
				<div className="max-w-7xl mx-auto px-6 relative z-10">
					<Link
						href="/doctors"
						className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 text-sm font-bold group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Back to Directory
					</Link>
					<div className="max-w-3xl">
						<span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 block">
							{doctor.departments?.[0] || "SPECIALIST PHYSICIAN"}
						</span>
						<h1 className="text-6xl font-black mb-6 tracking-tight">
							{doctor.name}
						</h1>
						<p className="text-xl text-slate-400 leading-relaxed font-medium">
							{doctor.designation}. Expert in {doctor.speciality?.join(", ") || "Advanced Healthcare"}.
						</p>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 -mt-20 pb-24">
				<div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">
					{/* Sidebar */}
					<aside className="space-y-8 lg:sticky lg:top-8">
						<div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
							<div className="aspect-[4/5] relative bg-slate-100">
								<Image
									fill
									priority
									src={doctor.profileImage || "https://avatar.iran.liara.run/public/doctor"}
									alt={doctor.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="p-8">
								<div className="space-y-6 mb-8">
									<div>
										<h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
											QUALIFICATIONS
										</h4>
										<div className="space-y-2">
											{doctor.qualifications?.map((q: { degree: string; institution: string; passingYear: string }) => (
												<p key={q.degree} className="text-sm font-bold text-slate-900 leading-relaxed">
													{q.degree} from {q.institution} ({q.passingYear})
												</p>
											))}
										</div>
									</div>
									<div>
										<h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
											PRIMARY CHAMBER
										</h4>
										<div className="flex items-start gap-3">
											<div className="p-2 bg-blue-50 rounded-lg">
												<Stethoscope className="w-4 h-4 text-blue-600" />
											</div>
											<div>
												<Link href={`/hospitals/${doctor.chamber?.[0]?._id}`} className="text-sm font-bold text-slate-900">
													{doctor.chamber?.[0]?.name || "No Chamber Found"}
												</Link>
												<p className="text-xs text-slate-500 font-medium">
													{doctor.chamber?.[0]?.address?.area || "Dhaka"}
												</p>
											</div>
										</div>
									</div>
									<div className="pt-4 border-t border-slate-50 space-y-3">
										<div className="flex items-center gap-3 text-slate-600">
											<Phone className="w-4 h-4" />
											<span className="text-sm font-bold">{doctor.contact?.phone}</span>
										</div>
										<div className="flex items-center gap-3 text-slate-600">
											<Mail className="w-4 h-4" />
											<span className="text-sm font-bold">{doctor.contact?.email}</span>
										</div>
									</div>
								</div>
								<button
									type="button"
									className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
								>
									Book Appointment
								</button>
							</div>
						</div>

						{/* Quick Contact Card */}
						<div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
							<h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
								BMDC REGISTRATION
							</h4>
							<div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
								<ShieldCheck className="w-6 h-6 text-emerald-500" />
								<div>
									<p className="text-xs font-black text-slate-400 uppercase">Status</p>
									<p className="text-sm font-black text-slate-900 tracking-tight">Verified: {doctor.bmdc}</p>
								</div>
							</div>
						</div>
					</aside>

					{/* Content Area */}
					<div className="space-y-12">
						{/* Professional Overview */}
						<section className="bg-white rounded-3xl border border-slate-100 p-10 shadow-sm">
							<div className="flex items-center gap-4 mb-8">
								<div className="w-12 h-1 bg-blue-600 rounded-full" />
								<h2 className="text-2xl font-black text-slate-900">
									Professional Overview
								</h2>
							</div>
							<p className="text-lg text-slate-500 leading-relaxed mb-10 font-medium">
								{doctor.bio}
							</p>

							{/* Stats Grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 transition-colors">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Experience</p>
									<p className="text-2xl font-black text-blue-600">{doctor.experience || 0}+ Yrs</p>
								</div>
								<div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 transition-colors">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rating</p>
									<p className="text-2xl font-black text-blue-600">{doctor.rating || "5.0"}</p>
								</div>
								<div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 transition-colors">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reviews</p>
									<p className="text-2xl font-black text-blue-600">{doctor.reviewCount || 0}</p>
								</div>
								<div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 transition-colors">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
									<p className="text-sm font-black text-emerald-600 uppercase pt-2">Active</p>
								</div>
							</div>
						</section>

						{/* Areas of Specialization */}
						<section>
							<div className="flex items-center gap-4 mb-10">
								<div className="w-12 h-1 bg-blue-600 rounded-full" />
								<h2 className="text-2xl font-black text-slate-900">
									Specialized Areas
								</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{doctor.speciality?.map((spec: string) => (
									<div
										key={spec}
										className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group"
									>
										<div className="p-3 bg-blue-50 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 transition-colors">
											<Activity className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
										</div>
										<h3 className="text-lg font-black text-slate-900 mb-3">
											{spec}
										</h3>
										<p className="text-sm text-slate-500 leading-relaxed font-medium">
											Expertise in {spec} related clinical cases and procedures.
										</p>
									</div>
								))}
							</div>
						</section>

						{/* Chamber Details / Location */}
						<section>
							<div className="flex items-center gap-4 mb-10">
								<div className="w-12 h-1 bg-blue-600 rounded-full" />
								<h2 className="text-2xl font-black text-slate-900">
									Chambers & Schedule
								</h2>
							</div>
							<div className="space-y-4">
								{doctor.chamber?.map((hosp: { name: string; address: { area: string; district: string }}) => (
									<div key={hosp.name} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
										<div className="flex items-center gap-4">
											<div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600">
												<MapPin className="w-6 h-6" />
											</div>
											<div>
												<h4 className="text-lg font-black text-slate-900">{hosp.name}</h4>
												<p className="text-sm font-medium text-slate-500">{hosp.address?.area}, {hosp.address?.district}</p>
											</div>
										</div>
										<button type="button" className="px-6 py-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
											Get Directions <ChevronRight className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						</section>

						{/* Call to Action */}
						<section className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
							<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
							<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
								<div>
									<h4 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-4">
										READY TO VISIT?
									</h4>
									<p className="text-2xl font-black">
										Book an appointment for consultation
									</p>
								</div>
								<button
									type="button"
									className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all text-sm"
								>
									Schedule Visit
								</button>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
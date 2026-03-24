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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STATS = [
	{ label: "YEARS EXP.", value: "15+", icon: Calendar },
	{ label: "SURGERIES", value: "5k+", icon: Activity },
	{ label: "AWARDS", value: "12+", icon: Award },
	{ label: "RATING", value: "4.9", icon: Star },
];

const SERVICES = [
	{
		title: "Cardiac Consultation",
		desc: "Detailed evaluation and personalized heart care plans.",
		icon: Heart,
	},
	{
		title: "Echocardiography",
		desc: "Advanced 4D imaging for precise heart structural analysis.",
		icon: Monitor,
	},
	{
		title: "Angioplasty",
		desc: "State-of-the-art stent placements and block clearance.",
		icon: Activity,
	},
	{
		title: "Preventive Screenings",
		desc: "Comprehensive vascular and arterial risk assessments.",
		icon: ShieldCheck,
	},
];

export default function SpecialistDetail() {
	return (
		<div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
			{/* Hero Section */}
			<section className="bg-[#0F172A] text-white pt-24 pb-32 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full -mr-64 -mt-64 blur-[120px]" />
				<div className="max-w-7xl mx-auto px-6 relative z-10">
					<Link
						href="/hospitals"
						className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 text-sm font-bold group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Back to Directory
					</Link>
					<div className="max-w-3xl">
						<span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 block">
							SPECIALIST PHYSICIAN
						</span>
						<h1 className="text-6xl font-black mb-6 tracking-tight">
							Dr. Sarah Rahman
						</h1>
						<p className="text-xl text-slate-400 leading-relaxed font-medium">
							Lead Cardiologist & Interventional Specialist with over 15 years
							of excellence in cardiovascular care and patient-centric
							treatment.
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
									src="https://picsum.photos/seed/sarah/800/1000"
									alt="Dr. Sarah Rahman"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="p-8">
								<div className="space-y-6 mb-8">
									<div>
										<h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
											QUALIFICATIONS
										</h4>
										<p className="text-sm font-bold text-slate-900 leading-relaxed">
											MBBS (DMC), FCPS (Cardiology), MRCP (UK), FACC (USA)
										</p>
									</div>
									<div>
										<h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
											AFFILIATION
										</h4>
										<div className="flex items-start gap-3">
											<div className="p-2 bg-blue-50 rounded-lg">
												<Stethoscope className="w-4 h-4 text-blue-600" />
											</div>
											<div>
												<p className="text-sm font-bold text-slate-900">
													Dhaka Medical College & Hospital
												</p>
												<p className="text-xs text-slate-500 font-medium">
													Department of Cardiology
												</p>
											</div>
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

						{/* Location Map Mock */}
						<div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
							<h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
								LOCATION MAP
							</h4>
							<div className="aspect-video bg-slate-100 rounded-2xl mb-4 relative overflow-hidden group cursor-pointer">
								<Image
									width={600}
									height={400}
									src="https://picsum.photos/seed/map/600/400"
									alt="Map Location"
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
										<MapPin className="w-5 h-5" />
									</div>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs font-bold text-slate-900">
									121/A, Dhanmondi, Dhaka
								</p>
								<div className="p-2 bg-slate-50 rounded-lg">
									<ChevronRight className="w-4 h-4 text-slate-400" />
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
								Dr. Sarah Rahman is a board-certified cardiologist specializing
								in interventional cardiology. With over 15 years of clinical
								experience, she has pioneered several minimally invasive cardiac
								procedures in Dhaka. Her patient-centric approach focuses on
								holistic recovery and long-term heart health management.
							</p>

							{/* Stats Grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{STATS.map((stat) => (
									<div
										key={stat.label}
										className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:border-blue-100 transition-colors"
									>
										<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
											{stat.label}
										</p>
										<p className="text-2xl font-black text-blue-600">
											{stat.value}
										</p>
									</div>
								))}
							</div>
						</section>

						{/* Specialized Services */}
						<section>
							<div className="flex items-center gap-4 mb-10">
								<div className="w-12 h-1 bg-blue-600 rounded-full" />
								<h2 className="text-2xl font-black text-slate-900">
									Specialized Services
								</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{SERVICES.map((service) => (
									<div
										key={service.title}
										className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group"
									>
										<div className="p-3 bg-blue-50 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 transition-colors">
											<service.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
										</div>
										<h3 className="text-lg font-black text-slate-900 mb-3">
											{service.title}
										</h3>
										<p className="text-sm text-slate-500 leading-relaxed font-medium">
											{service.desc}
										</p>
									</div>
								))}
							</div>
						</section>

						{/* Weekly Availability */}
						<section className="bg-blue-600 rounded-3xl p-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
							<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
							<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
								<div>
									<h4 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-4">
										WEEKLY AVAILABILITY
									</h4>
									<p className="text-2xl font-black">
										Monday — Friday: 4:00 PM - 9:00 PM
									</p>
								</div>
								<button
									type="button"
									className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all text-sm"
								>
									Next Available: Tomorrow, 4:30 PM
								</button>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}

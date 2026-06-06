"use client";

import {
	ArrowRight,
	BookOpen,
	Building2,
	CheckCircle2,
	Info,
	MapPin,
	Phone,
	Star,
} from "lucide-react";
import Image from "next/image";

const education = [
	"MBBS - Dhaka Medical College",
	"FCPS (Medicine) - BCPS",
	"MD (Cardiology) - National Institute of Cardiovascular Diseases (NICVD)",
	"Advanced Fellowship in Interventional Cardiology - Singapore",
];

const schedule = [
	{ days: "Sat - Tue", time: "6:00 PM - 9:00 PM" },
	{ days: "Thursday", time: "4:00 PM - 7:00 PM" },
	{ days: "Friday", time: "Closed", isClosed: true },
];

export default function DoctorDetailPage() {
	return (
		<div className="min-h-screen bg-slate-50/30 pb-20 pt-12">
			<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
				{/* Left Column: Profile & Info */}
				<div className="lg:col-span-8 space-y-12">
					{/* Main Profile Card */}
					<div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
						<div className="flex flex-col md:flex-row gap-10 items-start">
							<div className="relative w-48 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-2xl shadow-slate-200">
								<Image
									src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
									alt="Dr. Ariful Islam"
									fill
									className="object-cover"
									referrerPolicy="no-referrer"
								/>
							</div>
							<div className="flex-grow">
								<div className="flex items-center gap-3 mb-2">
									<h1 className="text-4xl font-black text-slate-900 tracking-tight">
										Dr. Ariful Islam
									</h1>
									<CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-50" />
								</div>
								<p className="text-blue-600 font-bold text-xl mb-2">
									Senior Consultant, Cardiology
								</p>
								<p className="text-slate-400 text-sm mb-6">
									MBBS, FCPS, MD (Cardiology)
								</p>

								<div className="flex flex-wrap gap-2">
									{[
										"Cardiologist",
										"Heart Specialist",
										"Interventional Cardiology",
									].map((tag) => (
										<span
											key={tag}
											className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-50">
							<div className="text-center">
								<span className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
									Experience
								</span>
								<span className="text-2xl font-black text-slate-900">
									15+ Years
								</span>
							</div>
							<div className="text-center border-x border-slate-50">
								<span className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
									Patients
								</span>
								<span className="text-2xl font-black text-slate-900">
									5,000+
								</span>
							</div>
							<div className="text-center">
								<span className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
									Rating
								</span>
								<div className="flex items-center justify-center gap-1.5">
									<span className="text-2xl font-black text-slate-900">
										4.9
									</span>
									<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
								</div>
							</div>
						</div>
					</div>

					{/* About Section */}
					<section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
						<h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
							About Dr. Ariful Islam
						</h2>
						<p className="text-slate-500 leading-relaxed mb-8 text-lg">
							Dr. Ariful Islam is a highly experienced Interventional
							Cardiologist with over 15 years of clinical practice. He
							specializes in complex coronary interventions, heart failure
							management, and preventive cardiology. He is dedicated to
							providing compassionate care and utilizing the latest medical
							advancements to ensure the best outcomes for his patients.
						</p>

						<div className="space-y-6">
							<div className="flex items-center gap-3">
								<BookOpen className="w-5 h-5 text-blue-600" />
								<h3 className="font-bold text-slate-900">
									Education & Training
								</h3>
							</div>
							<ul className="space-y-4 ml-8">
								{education.map((item) => (
									<li
										key={item}
										className="text-slate-500 flex items-center gap-3"
									>
										<div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
										{item}
									</li>
								))}
							</ul>
						</div>
					</section>

					{/* Hospital Affiliation */}
					<section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
						<h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
							Hospital Affiliation
						</h2>
						<div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
							<div className="flex items-center gap-6">
								<div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
									<Building2 className="w-8 h-8 text-blue-600" />
								</div>
								<div>
									<h3 className="font-black text-slate-900 text-lg">
										Evercare Hospital Dhaka
									</h3>
									<p className="text-slate-400 text-sm">
										Plot 81, Block E, Bashundhara R/A, Dhaka 1229
									</p>
									<button
										type="button"
										className="text-blue-600 text-[10px] font-black uppercase tracking-wider mt-2 flex items-center gap-1"
									>
										View Hospital Details <ArrowRight className="w-3 h-3" />
									</button>
								</div>
							</div>
						</div>
					</section>

					{/* Patient Reviews */}
					<section>
						<div className="flex items-center justify-between mb-8">
							<h2 className="text-2xl font-black text-slate-900 tracking-tight">
								Patient Reviews (128)
							</h2>
							<button
								type="button"
								className="text-blue-600 font-bold text-sm hover:underline"
							>
								See all reviews
							</button>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[
								{
									name: "Nusrat Jahan",
									text: "Dr. Ariful is very patient and explained my condition very clearly. I felt very safe under his care.",
									initial: "NJ",
								},
								{
									name: "Tanvir Ahmed",
									text: "Excellent experience. The consultation was thorough and the appointment was right on time.",
									initial: "TA",
								},
							].map((review) => (
								<div
									key={review.name}
									className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
								>
									<div className="flex items-center gap-4 mb-4">
										<div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold">
											{review.initial}
										</div>
										<div>
											<h4 className="font-bold text-slate-900">
												{review.name}
											</h4>
											<div className="flex gap-0.5">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star
														key={star}
														className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400"
													/>
												))}{" "}
											</div>
										</div>
									</div>
									<p className="text-slate-500 text-sm leading-relaxed italic">
										"{review.text}"
									</p>
								</div>
							))}
						</div>
					</section>
				</div>

				{/* Right Column: Sidebar */}
				<div className="lg:col-span-4 space-y-8">
					{/* Consultation Card */}
					<div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm sticky top-8">
						<h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
							Consultation
						</h2>

						<div className="space-y-6 mb-10">
							<div className="flex items-center justify-between">
								<span className="text-slate-400 font-bold">
									Consultation Fee
								</span>
								<span className="text-2xl font-black text-slate-900 flex items-center gap-1">
									<span className="text-slate-400 text-lg">৳</span> 1,500
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-400 font-bold">
									Next Available Slot
								</span>
								<span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
									Tomorrow
								</span>
							</div>
						</div>

						<div className="space-y-6 mb-10">
							<span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
								Schedule
							</span>
							{schedule.map((item) => (
								<div
									key={item.days}
									className="flex items-center justify-between text-sm"
								>
									<span className="text-slate-600 font-bold">{item.days}</span>
									<span
										className={`font-black ${item.isClosed ? "text-rose-500" : "text-blue-600"}`}
									>
										{item.time}
									</span>
								</div>
							))}
						</div>

						<button
							type="button"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 mb-4"
						>
							Book Appointment
						</button>
						<button
							type="button"
							className="w-full bg-white hover:bg-slate-50 text-slate-900 font-black py-5 rounded-2xl transition-all border border-slate-100 flex items-center justify-center gap-3"
						>
							<Phone className="w-5 h-5 text-blue-600" />
							+880 1711 000000
						</button>

						<div className="mt-8 flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
							<Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
							<p className="text-[11px] text-blue-800 leading-relaxed font-medium">
								Please arrive 15 minutes before your scheduled appointment time
								for registration.
							</p>
						</div>
					</div>

					{/* Location Map Card */}
					<div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
						<div className="relative h-48 bg-slate-100 flex items-center justify-center group cursor-pointer">
							<div className="absolute inset-0 bg-emerald-500/10" />
							<div className="relative z-10 flex flex-col items-center gap-3">
								<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
									<MapPin className="w-5 h-5" />
								</div>
								<span className="font-bold text-slate-900 text-sm">
									Location Map
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

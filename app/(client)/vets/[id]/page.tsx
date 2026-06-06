"use client";

import {
	Activity,
	ChevronRight,
	Info,
	MapPin,
	Microscope,
	Phone,
	PlusCircle,
	Scissors,
	ShieldAlert,
	Star,
	Stethoscope,
	Syringe,
} from "lucide-react";
import Image from "next/image";

const doctors = [
	{
		name: "Dr. Ariful Islam",
		specialty: "Senior Surgeon",
		experience: "12+ Years Experience",
		image:
			"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
	},
	{
		name: "Dr. Sarah Rahman",
		specialty: "Pet Nutritionist",
		experience: "8+ Years Experience",
		image:
			"https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200",
	},
];

const services = [
	{ icon: Syringe, label: "Vaccination" },
	{ icon: Scissors, label: "Surgery" },
	{ icon: Stethoscope, label: "Grooming" },
	{ icon: Activity, label: "X-Ray" },
	{ icon: Microscope, label: "Laboratory" },
	{ icon: PlusCircle, label: "Critical Care" },
];

export default function VetHospitalDetailPage() {
	return (
		<div className="min-h-screen bg-slate-50/30 pb-20">
			{/* Hero Section */}
			<div className="relative h-[500px] w-full">
				<Image
					src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1920"
					alt="Paws & Claws Veterinary Hospital"
					fill
					className="object-cover"
					referrerPolicy="no-referrer"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

				<div className="absolute bottom-12 left-6 md:left-12 lg:left-24 max-w-4xl">
					<div className="flex gap-3 mb-6">
						<span className="bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider">
							Emergency 24/7
						</span>
						<span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
							<Star className="w-3 h-3 fill-white" /> 4.8 Rating
						</span>
					</div>
					<h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
						Paws & Claws Veterinary Hospital
					</h1>
					<div className="flex flex-wrap items-center gap-6 text-blue-50/80 font-bold">
						<div className="flex items-center gap-2">
							<MapPin className="w-5 h-5" />
							<span>Gulshan 2, Dhaka</span>
						</div>
						<div className="flex items-center gap-2">
							<Phone className="w-5 h-5" />
							<span>+880 1234-567890</span>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Action Bar */}
			<div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
				<div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-4">
					<button
						type="button"
						className="w-full md:w-auto flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
					>
						<Phone className="w-5 h-5" />
						Call Now
					</button>
					<button
						type="button"
						className="w-full md:w-auto flex-grow bg-slate-50 hover:bg-slate-100 text-slate-900 font-black px-12 py-5 rounded-2xl transition-all border border-slate-100 flex items-center justify-center gap-3"
					>
						<MapPin className="w-5 h-5 text-blue-600" />
						Get Directions
					</button>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
				{/* Left Column */}
				<div className="lg:col-span-8 space-y-20">
					{/* About */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<Info className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-black text-slate-900 tracking-tight">
								About the Clinic
							</h2>
						</div>
						<div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm leading-relaxed text-slate-500 text-lg font-medium">
							Paws & Claws Veterinary Hospital has been a cornerstone of pet
							care in Gulshan since 2012. We provide comprehensive medical,
							surgical, and dental care for your furry companions. Our
							state-of-the-art facility is equipped with the latest diagnostic
							technology to ensure your pets receive the best possible
							treatment. We believe in compassionate care and treating every
							animal as if they were our own family.
						</div>
					</section>

					{/* Medical Services */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<Activity className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-black text-slate-900 tracking-tight">
								Medical Services
							</h2>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
							{services.map((service) => (
								<div
									key={service.label}
									className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-blue-200 transition-all cursor-pointer"
								>
									<div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-blue-600">
										<service.icon className="w-6 h-6" />
									</div>
									<span className="font-bold text-slate-900 text-sm">
										{service.label}
									</span>
								</div>
							))}
						</div>
					</section>

					{/* Our Specialist Vets */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<Stethoscope className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-black text-slate-900 tracking-tight">
								Our Specialist Vets
							</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{doctors.map((doc) => (
								<div
									key={doc.name}
									className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer"
								>
									<div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
										<Image
											src={doc.image}
											alt={doc.name}
											fill
											className="object-cover"
											referrerPolicy="no-referrer"
										/>
									</div>
									<div>
										<h3 className="font-bold text-slate-900 text-lg mb-1">
											{doc.name}
										</h3>
										<p className="text-blue-600 text-xs font-bold mb-1">
											{doc.specialty}
										</p>
										<p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
											{doc.experience}
										</p>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* Location */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<MapPin className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-black text-slate-900 tracking-tight">
								Location
							</h2>
						</div>
						<div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
							<div className="relative h-96 bg-slate-100 flex items-center justify-center group cursor-pointer">
								<div className="absolute inset-0 bg-blue-500/5" />
								<div className="relative z-10 flex flex-col items-center gap-4">
									<div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
										<MapPin className="w-7 h-7" />
									</div>
								</div>
							</div>
							<div className="p-8 bg-white border-t border-slate-50">
								<h4 className="font-black text-slate-900 mb-1">
									House 24, Road 12, Gulshan 2
								</h4>
								<p className="text-slate-400 text-sm">Dhaka 1212, Bangladesh</p>
							</div>
						</div>
					</section>
				</div>

				{/* Right Column */}
				<div className="lg:col-span-4 space-y-12">
					{/* Opening Hours */}
					<section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
						<div className="flex items-center justify-between mb-8">
							<h3 className="text-xl font-black text-slate-900 tracking-tight">
								Opening Hours
							</h3>
							<span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
								Open Now
							</span>
						</div>
						<div className="space-y-4">
							{[
								{ days: "Mon - Thu", time: "09:00 AM - 10:00 PM" },
								{ days: "Friday", time: "Closed", isClosed: true },
								{ days: "Saturday", time: "10:00 AM - 08:00 PM" },
								{ days: "Sunday", time: "09:00 AM - 09:00 PM" },
							].map((item) => (
								<div key={item.days} className="flex justify-between text-sm">
									<span className="text-slate-500 font-bold">{item.days}</span>
									<span
										className={`font-black ${item.isClosed ? "text-rose-500" : "text-slate-900"}`}
									>
										{item.time}
									</span>
								</div>
							))}
						</div>
						<div className="mt-8 flex items-center gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
							<ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
							<p className="text-[11px] text-rose-800 font-bold uppercase tracking-wider">
								Emergency services available 24/7
							</p>
						</div>
					</section>

					{/* Book Appointment */}
					<section className="bg-blue-50/50 rounded-[2.5rem] p-10 border border-blue-100">
						<h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">
							Book Appointment
						</h3>
						<div className="space-y-6">
							<div>
								<label
									htmlFor="type"
									className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
								>
									Pet Type
								</label>
								<select className="w-full bg-white border border-blue-100 rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700">
									<option>Dog</option>
									<option>Cat</option>
									<option>Bird</option>
									<option>Exotic</option>
								</select>
							</div>
							<div>
								<label
									htmlFor="preferred-date"
									className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
								>
									Preferred Date
								</label>
								<input
									id="preferred-date"
									type="date"
									className="w-full bg-white border border-blue-100 rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
								/>
							</div>
							<button
								type="button"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20"
							>
								Request Booking
							</button>
						</div>
					</section>

					{/* Customer Reviews */}
					<section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
						<h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">
							Customer Reviews
						</h3>
						<div className="space-y-8">
							{[
								{
									name: "Zayn Khan",
									text: "The best vet in Dhaka. They treated my cat with such care during her surgery. Highly recommend!",
									initial: "ZK",
								},
								{
									name: "Riya Ahmed",
									text: "Professional staff and clean facilities. A bit of a wait on weekends but worth it.",
									initial: "RA",
								},
							].map((review) => (
								<div key={review.name} className="space-y-3">
									<div className="flex gap-0.5">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400"
											/>
										))}{" "}
									</div>
									<h4 className="font-bold text-slate-900 text-sm">
										{review.name}
									</h4>
									<p className="text-slate-500 text-xs leading-relaxed italic">
										"{review.text}"
									</p>
								</div>
							))}
							<button
								type="button"
								className="w-full text-blue-600 font-bold text-sm hover:underline flex items-center justify-center gap-2"
							>
								Read All 142 Reviews <ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

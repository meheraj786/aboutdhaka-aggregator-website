"use client";

import {
	Activity,
	ChevronRight,
	Info,
	Loader2,
	MapPin,
	Microscope,
	Phone,
	PlusCircle,
	Scissors,
	ShieldAlert,
	Star,
	Stethoscope,
	Syringe,
	Clock,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useFetchHospitalById } from "@/hooks/useHospitals";
import { useFetchDoctors } from "@/hooks/useDoctors";
import FindBusButton from "@/components/appComponents/FindBusButton";

export default function VetHospitalDetailPage() {
	const { id } = useParams();
	
	// Fetch Hospital Data
	const { data: response, isLoading } = useFetchHospitalById(id as string);
	const clinic = response?.data;

	// Fetch Doctors associated with this clinic (chamber)
	const { data: doctorData } = useFetchDoctors();
	const staffDoctors = doctorData?.items?.filter((doc: any) => 
		doc.chamber?.some((chamber: any) => chamber._id === id || chamber === id)
	) || [];

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<Loader2 className="w-10 h-10 animate-spin text-blue-600" />
			</div>
		);
	}

	if (!clinic) return <div className="text-center py-20 font-bold">Clinic not found.</div>;

	return (
		<div className="min-h-screen bg-slate-50/30 pb-20">
			{/* Hero Section */}
			<div className="relative h-[500px] w-full">
				<Image
					src={clinic.images?.[0] || clinic.thumbnail || "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1920"}
					alt={clinic.name}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

				<div className="absolute bottom-12 left-6 md:left-12 lg:left-24 max-w-4xl">
					<div className="flex gap-3 mb-6">
						<span className="bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider">
							Emergency 24/7
						</span>
						<span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
							<Star className="w-3 h-3 fill-white" /> {clinic.rating || "5.0"} Rating
						</span>
					</div>
					<h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
						{clinic.name}
					</h1>
					<div className="flex flex-wrap items-center gap-6 text-blue-50/80 font-bold">
						<div className="flex items-center gap-2">
							<MapPin className="w-5 h-5" />
							<span>{clinic.address?.area}, {clinic.address?.district}</span>
						</div>
						<div className="flex items-center gap-2">
							<Phone className="w-5 h-5" />
							<span>{clinic.contact?.phone?.[0] || "Contact info N/A"}</span>
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
							{clinic.about || "This veterinary facility provides comprehensive medical, surgical, and dental care for your furry companions. Our staff is dedicated to providing compassionate care to every animal."}
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
							{clinic.services?.map((service: any) => (
								<div
									key={service._id}
									className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-blue-200 transition-all"
								>
									<div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-blue-600">
										<Stethoscope className="w-6 h-6" />
									</div>
									<span className="font-bold text-slate-900 text-sm">
										{service.name}
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
								Clinicians & Specialists
							</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{staffDoctors.length > 0 ? staffDoctors.map((doc: any) => (
								<div
									key={doc._id}
									className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer"
								>
									<div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
										<Image
											src={doc.profileImage || "https://avatar.iran.liara.run/public/doctor"}
											alt={doc.name}
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<h3 className="font-bold text-slate-900 text-lg mb-1">
											{doc.name}
										</h3>
										<p className="text-blue-600 text-xs font-bold mb-1">
											{doc.designation}
										</p>
										<p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
											{doc.experience}+ Years Experience
										</p>
									</div>
								</div>
							)) : (
								<p className="text-slate-400 font-medium italic">Contact clinic for doctor availability.</p>
							)}
						</div>
					</section>

					{/* Location */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<MapPin className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-black text-slate-900 tracking-tight">
								Map Location
							</h2>
						</div>
						<div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
							<div className="relative h-96 bg-slate-100 flex items-center justify-center group cursor-pointer">
								<div className="absolute inset-0 bg-blue-500/5" />
								<div className="relative z-10 flex flex-col items-center gap-4">
									<div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
										<MapPin className="w-7 h-7" />
									</div>
									<span className="font-black text-blue-600 text-sm">View on Google Maps</span>
								</div>
							</div>
							<div className="p-8 bg-white border-t border-slate-50">
								<h4 className="font-black text-slate-900 mb-1">
									{clinic.address?.area}, {clinic.address?.district}
								</h4>
								<p className="text-slate-400 text-sm mb-6">{clinic.address?.division}, Bangladesh</p>
								<FindBusButton 
									hospitalLat={clinic.address?.coordinates?.lat} 
									hospitalLng={clinic.address?.coordinates?.lng} 
								/>
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
								Clinic Hours
							</h3>
							<span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
								Open Now
							</span>
						</div>
						<div className="space-y-4">
							<div className="flex justify-between text-sm">
								<span className="text-slate-500 font-bold">Standard Hours</span>
								<span className="font-black text-slate-900">09:00 AM - 10:00 PM</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-500 font-bold">Emergency Care</span>
								<span className="font-black text-rose-500">24/7 Available</span>
							</div>
						</div>
						<div className="mt-8 flex items-center gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
							<ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
							<p className="text-[11px] text-rose-800 font-bold uppercase tracking-wider">
								Call ahead for critical care
							</p>
						</div>
					</section>

					{/* Book Appointment Placeholder */}
					<section className="bg-blue-50/50 rounded-[2.5rem] p-10 border border-blue-100">
						<h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">
							Book Visit
						</h3>
						<div className="space-y-6">
							<div>
								<label htmlFor="pet" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pet Species</label>
								<select className="w-full bg-white border border-blue-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-700">
									<option>Dog / Cat</option>
									<option>Bird / Avian</option>
									<option>Exotic / Reptile</option>
								</select>
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
							Pet Parent Reviews
						</h3>
						<div className="space-y-8">
							{clinic.reviews?.length > 0 ? clinic.reviews.map((review: any, idx: number) => (
								<div key={idx} className="space-y-3">
									<div className="flex gap-0.5">
										{[...Array(review.rating || 5)].map((_, i) => (
											<Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
										))}
									</div>
									<h4 className="font-bold text-slate-900 text-sm">{review.reviewer}</h4>
									<p className="text-slate-500 text-xs leading-relaxed italic">
										"{review.comment}"
									</p>
								</div>
							)) : (
								<p className="text-slate-400 text-sm">No reviews yet.</p>
							)}
							<button
								type="button"
								className="w-full text-blue-600 font-bold text-sm hover:underline flex items-center justify-center gap-2"
							>
								Read All Reviews <ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
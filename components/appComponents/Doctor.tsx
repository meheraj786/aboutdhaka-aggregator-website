"use client";

import { useFetchRandomDoctors } from "@/hooks/useDoctors";
import { Star, User, Award, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

const DoctorSkeleton = () => (
	<div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col animate-pulse">
		<div className="relative w-full aspect-square rounded-[2rem] bg-slate-200 mb-6" />
		<div className="space-y-3 px-2">
			<div className="h-4 w-20 bg-slate-200 rounded-full" />
			<div className="h-7 w-3/4 bg-slate-200 rounded-md" />
			<div className="h-4 w-1/2 bg-slate-100 rounded-md" />
			<div className="pt-4 flex gap-2">
				<div className="h-10 flex-1 bg-slate-50 rounded-2xl" />
			</div>
		</div>
	</div>
);

export function Doctors() {
	const { data: doctors, isLoading } = useFetchRandomDoctors();

	return (
		<section className="py-20 px-6 max-w-7xl mx-auto">
			<SectionHeader
				title="Find a Specialist"
				viewAllText="View All Doctors"
				viewAllHref="/doctors"
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{isLoading
					? Array.from({ length: 4 }).map((_, i) => <DoctorSkeleton key={i} />)
					: doctors?.map((doc: any) => (
							<Link
								key={doc._id}
								href={`/doctors/${doc._id}`}
								className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-5 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-500"
							>
								<div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-slate-50">
									{doc.profileImage ? (
										<Image
											src={doc.profileImage}
											alt={doc.name}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
											referrerPolicy="no-referrer"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-200">
											<User className="w-20 h-20" />
										</div>
									)}
									
									<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
										<Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
										<span className="text-xs font-bold text-slate-900">
											{(doc.rating || 0).toFixed(1)}
										</span>
									</div>

									{doc.isVerified && (
										<div className="absolute top-4 left-4 bg-blue-600 text-white p-1.5 rounded-xl shadow-lg">
											<CheckCircle2 className="w-4 h-4" />
										</div>
									)}
								</div>
								
								<div className="px-2 flex flex-col flex-grow">
									<div className="flex items-center gap-2 mb-2">
										<span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
											{doc.departments?.[0] || "Specialist"}
										</span>
									</div>

									<h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
										{doc.name}
									</h3>
									
									<p className="text-slate-500 text-sm font-medium mb-4 line-clamp-1">
										{doc.designation}
									</p>

									<div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
										<div className="flex flex-col">
											<span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Experience</span>
											<span className="text-sm font-bold text-slate-700">{doc.experience || 0}+ Years</span>
										</div>
										<div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
											<Award className="w-5 h-5" />
										</div>
									</div>
								</div>
							</Link>
					  ))}
			</div>
		</section>
	);
}
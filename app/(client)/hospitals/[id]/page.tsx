
"use client";
import { useState, useMemo } from "react";
import {
Activity,
BadgeCheck,
Bed,
ChevronRight,
Clock,
GraduationCap,
Heart,
Info,
Loader2,
MapPin,
Phone,
Search,
Share2,
Star,
Stethoscope,
User2,
Filter,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import FindBusButton from "@/components/appComponents/FindBusButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchHospitalById } from "@/hooks/useHospitals";
import Link from "next/link";
export default function HospitalDetailPage() {
const { id } = useParams();
const { data: response, isLoading } = useFetchHospitalById(id as string);
const hospital = response?.data;
const [doctorSearch, setDoctorSearch] = useState("");
const [doctorDeptFilter, setDoctorDeptFilter] = useState("All");

const availableDepts = useMemo(() => {
	const depts = new Set<string>();
	hospital?.doctors?.forEach((doc: any) => {
		doc.departments?.forEach((d: string) => depts.add(d));
	});
	return Array.from(depts).sort();
}, [hospital?.doctors]);

console.log(hospital)

const filteredDoctorsByDept = useMemo(() => {
	const filtered = (hospital?.doctors || []).filter((doc: any) => {
		const matchesSearch =
			doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
			doc.speciality?.some((s: string) =>
				s.toLowerCase().includes(doctorSearch.toLowerCase()),
			);
		const matchesDept =
			doctorDeptFilter === "All" || doc.departments.includes(doctorDeptFilter);
		return matchesSearch && matchesDept;
	});

	return filtered.reduce((acc: any, doctor: any) => {
		const dept = doctor.departments[0] || "General";
		if (!acc[dept]) acc[dept] = [];
		acc[dept].push(doctor);
		return acc;
	}, {});
}, [hospital?.doctors, doctorSearch, doctorDeptFilter]);

if (isLoading) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center space-y-4">
			<Loader2 className="h-10 w-10 animate-spin text-blue-600" />
			<p className="text-slate-500 font-medium">Loading hospital details...</p>
		</div>
	);
}

if (!hospital)
	return <div className="text-center py-20">Hospital not found.</div>;

return (
	<div className="min-h-screen bg-slate-50/50 pb-20">
		<div className="relative h-[450px] w-full overflow-hidden">
			<Image
				src={hospital.images?.[0] || hospital.thumbnail}
				alt={hospital.name}
				fill
				className="object-cover"
				priority
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
			<div className="absolute top-6 right-6 flex gap-3">
				<Button
					variant="default"
					size="icon"
					className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"
				>
					<Share2 className="w-5 h-5" />
				</Button>
				<Button
					variant="default"
					size="icon"
					className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"
				>
					<Heart className="w-5 h-5" />
				</Button>
			</div>
			<div className="absolute bottom-10 left-6 md:left-12 lg:left-24 right-6">
				<div className="flex flex-wrap gap-2 mb-4">
					{hospital.isVerified && (
						<Badge className="bg-green-500 hover:bg-green-600 border-none px-3 py-1 gap-1">
							<BadgeCheck className="w-3 h-3" /> Verified
						</Badge>
					)}
					<Badge className="bg-blue-600 border-none px-3 py-1 gap-1">
						<Clock className="w-3 h-3" /> 24/7 Emergency
					</Badge>
					{hospital.types?.map((type: string) => (
						<Badge
							key={type}
							variant="secondary"
							className="bg-white/20 backdrop-blur-md text-white border-white/20"
						>
							{type}
						</Badge>
					))}
				</div>
				<h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
					{hospital.name}
				</h1>
				<div className="flex items-center gap-4 text-white/90">
					<div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
						<MapPin className="w-4 h-4 text-blue-400" />
						<span className="text-sm font-medium">
							{hospital.address?.area}, {hospital.address?.district}
						</span>
					</div>
					<div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full backdrop-blur-sm border border-yellow-500/30">
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<span className="text-sm font-bold text-yellow-100">
							{hospital.rating} Rating
						</span>
					</div>
				</div>
			</div>
		</div>

		<div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<Card className="shadow-lg border-slate-100 rounded-xl bg-white overflow-hidden">
					<CardContent className="p-3 flex items-center gap-3">
						<div className="w-10 h-10 shrink-0 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
							<Phone className="w-5 h-5" />
						</div>
						<div className="min-w-0">
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
								Emergency
							</p>
							<p className="text-base font-black text-slate-900 truncate">
								{hospital.contact?.phone?.[0] || "N/A"}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-lg border-slate-100 rounded-xl bg-white overflow-hidden">
					<CardContent className="p-3 flex items-center gap-3">
						<div className="w-10 h-10 shrink-0 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
							<Bed className="w-5 h-5" />
						</div>
						<div className="min-w-0">
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
								Capacity
							</p>
							<p className="text-base font-black text-slate-900 truncate">
								{hospital.totalBeds === 0
									? "N/A"
									: `${hospital.totalBeds} Patient Beds`}
							</p>
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-2 h-[66px]">
					
					<Link
						href={`tel:${hospital.contact?.phone?.[0]}`} className="flex-1 rounded-xl h-full flex shadow-md items-center justify-center p-2 text-white font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 text-sm">
						<Phone className="w-4 h-4 mr-2" /> Call Now

					</Link>

						<Link className="flex-1 rounded-xl h-full font-bold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 p-2 flex items-center justify-center shadow-md text-sm" href={`https://www.google.com/maps/search/?api=1&query=${hospital.address?.area}, ${hospital.address?.district}`} target="_blank" rel="noopener noreferrer">
						<MapPin className="w-4 h-4 mr-2" /> Directions
						</Link>
				</div>
			</div>
		</div>

		<div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
			<div className="lg:col-span-8 space-y-10">
				<Tabs defaultValue="overview" className="w-full">
					<TabsList className="bg-white p-1 rounded-xl border border-slate-200 w-full md:w-auto h-auto flex-wrap mb-8">
						<TabsTrigger
							value="overview"
							className="rounded-lg py-2.5 px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
						>
							Overview
						</TabsTrigger>
						<TabsTrigger
							value="services"
							className="rounded-lg py-2.5 px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
						>
							Services
						</TabsTrigger>
						<TabsTrigger
							value="pricing"
							className="rounded-lg py-2.5 px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
						>
							Test Pricing
						</TabsTrigger>
						<TabsTrigger
							value="doctors"
							className="rounded-lg py-2.5 px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
						>
							Doctors
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="overview"
						className="space-y-8 animate-in fade-in-50 duration-500"
					>
						<section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
							<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
								<Info className="w-5 h-5 text-blue-600" /> About the Institution
							</h3>
							<p className="text-slate-600 leading-relaxed text-lg">
								{hospital.detail ||
									"Islamia Hospital Bangladesh is committed to providing healthcare services with state-of-the-art facilities."}
							</p>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
								{hospital.facilities?.map((facility: string) => (
									<div
										key={facility}
										className="bg-slate-50 p-3 rounded-xl flex items-center gap-2 border border-slate-100"
									>
										<div className="w-2 h-2 rounded-full bg-blue-500" />
										<span className="text-sm font-semibold text-slate-700">
											{facility}
										</span>
									</div>
								))}
							</div>
						</section>

						<section>
							<h3 className="text-xl font-bold mb-6 flex items-center gap-2">
								<Activity className="w-5 h-5 text-blue-600" /> Hospital Gallery
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{hospital.images?.map((img: string, idx: number) => (
									<div
										key={idx}
										className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer"
									>
										<Image
											src={img}
											alt="Gallery"
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									</div>
								))}
							</div>
						</section>
					</TabsContent>

					<TabsContent
						value="services"
						className="animate-in fade-in-50 duration-500"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{hospital.services?.map((service: { _id: string; name: string }) => (
								<Card
									key={service._id}
									className="border-slate-100 shadow-sm hover:border-blue-200 transition-all group"
								>
									<CardContent className="p-4 flex items-center gap-4">
										<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
											<Stethoscope className="w-5 h-5" />
										</div>
										<span className="font-bold text-slate-800">{service.name}</span>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent
						value="pricing"
						className="animate-in fade-in-50 duration-500"
					>
						<Card className="rounded-[2rem] overflow-hidden border-slate-100 shadow-sm">
							<div className="p-6 border-b bg-slate-50/50">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<input
										className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm"
										placeholder="Filter tests..."
									/>
								</div>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
											<th className="px-8 py-4 text-left">Diagnostic Test</th>
											<th className="px-8 py-4 text-right">Price (BDT)</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-50">
										{hospital.testPrices?.length > 0 ? (
											hospital.testPrices.map((test: { name: string; price: number }) => (
												<tr
													key={test.name}
													className="hover:bg-blue-50/30 transition-colors"
												>
													<td className="px-8 py-4 font-bold text-slate-700">
														{test.name}
													</td>
													<td className="px-8 py-4 text-right font-black text-blue-600">
														{test.price} ৳
													</td>
												</tr>
											))
										) : (
											<tr>
												<td
													colSpan={2}
													className="px-8 py-10 text-center text-slate-400"
												>
													No pricing data currently available.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</Card>
					</TabsContent>

					<TabsContent
						value="doctors"
						className="space-y-8 animate-in fade-in-50 duration-500"
					>
						<div className="flex flex-col md:row gap-4 mb-8">
							<div className="flex-1 relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<input
									type="text"
									placeholder="Search doctor by name or specialty..."
									className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
									value={doctorSearch}
									onChange={(e) => setDoctorSearch(e.target.value)}
								/>
							</div>
							<div className="md:w-64 relative">
								<Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<select
									className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium cursor-pointer"
									value={doctorDeptFilter}
									onChange={(e) => setDoctorDeptFilter(e.target.value)}
								>
									<option value="All">All Departments</option>
									{availableDepts.map((dept) => (
										<option key={dept} value={dept}>
											{dept}
										</option>
									))}
								</select>
							</div>
						</div>

						{Object.keys(filteredDoctorsByDept).length > 0 ? (
							Object.entries(filteredDoctorsByDept).map(([dept, doctors]: [string, any]) => (
								<div key={dept} className="space-y-4">
									<div className="flex items-center gap-3 mb-4">
										<div className="h-8 w-1 bg-blue-600 rounded-full" />
										<h3 className="text-xl font-black text-slate-800">{dept}</h3>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{doctors.map((doctor: any) => (
											<Link href={`/doctors/${doctor._id}`} key={doctor._id}>
												<Card className="hover:shadow-md transition-all border-slate-100 group overflow-hidden bg-white">
													<CardContent className="p-5 flex items-start gap-4">
														<div className="relative w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
															{doctor.profileImage ? (
																<Image
																	src={doctor.profileImage}
																	alt={doctor.name}
																	fill
																	className="object-cover"
																/>
															) : (
																<div className="flex items-center justify-center h-full text-slate-400">
																	<User2 className="w-8 h-8" />
																</div>
															)}
														</div>
														<div className="flex-1 min-w-0">
															<h4 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
																{doctor.name}
															</h4>
															<p className="text-xs font-medium text-blue-600 mb-2">
																{doctor.designation}
															</p>
															<div className="flex items-center gap-1.5 text-slate-500">
																<GraduationCap className="w-3.5 h-3.5" />
																<p className="text-[11px] truncate font-medium">
																	{doctor.qualifications?.[0]?.degree}
																	{doctor.qualifications?.length > 1 &&
																		` +${doctor.qualifications.length - 1} more`}
																</p>
															</div>
														</div>
														<div className="self-center">
															<ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
														</div>
													</CardContent>
												</Card>
											</Link>
										))}
									</div>
								</div>
							))
						) : (
							<div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
								<Stethoscope className="w-12 h-12 text-slate-200 mx-auto mb-4" />
								<p className="text-slate-400 font-bold">No doctors match your search.</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>

			<div className="lg:col-span-4 space-y-8">
				<Card className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden bg-white">
					<CardHeader className="p-8 pb-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
								<MapPin className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<CardTitle className="text-xl font-bold text-slate-900">Location</CardTitle>
								<p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
									How to find us
								</p>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-8 pt-0 space-y-6">
						<div className="relative h-48 w-full rounded-3xl overflow-hidden border border-slate-100 group cursor-pointer">
							<div className="absolute inset-0 bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
								<div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
									<MapPin className="w-6 h-6 fill-current opacity-20" />
									<MapPin className="w-6 h-6 absolute" />
								</div>
								<span className="text-xs font-bold text-slate-400">Interact with map</span>
							</div>
							<div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/0 transition-colors" />
							<a
								href={hospital?.googleMapReviewLink}
								target="_blank"
								rel="noopener noreferrer"
								className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700 flex items-center gap-2 hover:bg-white transition-all"
							>
								Open Maps <ChevronRight className="w-3 h-3" />
							</a>
						</div>
						<div className="space-y-4">
							<div className="flex gap-4">
								<div className="flex-1">
									<h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">
										Detailed Address
									</h4>
									<p className="text-slate-600 text-[15px] leading-relaxed font-medium">
										{hospital?.address?.area}, {hospital?.address?.district}
										<br />
										{hospital?.address?.division}, Bangladesh
									</p>
								</div>
								<Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-xl bg-slate-50">
									<Share2 className="w-4 h-4" />
								</Button>
							</div>
							<div className="pt-2">
								<FindBusButton
									hospitalLat={hospital?.address?.coordinates?.lat}
									hospitalLng={hospital?.address?.coordinates?.lng}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
					<div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
					<div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
					<div className="relative z-10">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-white/20 rounded-lg">
								<Clock className="w-5 h-5 text-white" />
							</div>
							<span className="font-bold tracking-tight">Operating Hours</span>
						</div>
						<div className="space-y-3">
							<div className="flex justify-between items-center border-b border-white/10 pb-2">
								<span className="text-blue-100 text-sm">Emergency</span>
								<span className="font-bold">24 Hours</span>
							</div>
							<div className="flex justify-between items-center border-b border-white/10 pb-2">
								<span className="text-blue-100 text-sm">OPD</span>
								<span className="font-bold">08:00 AM - 10:00 PM</span>
							</div>
							<div className="flex justify-between items-center pt-2">
								<span className="text-blue-100 text-sm">Visiting Hours</span>
								<span className="font-bold">04:00 PM - 08:00 PM</span>
							</div>
						</div>
					</div>
				</div>

				<section className="space-y-5">
					<div className="flex items-center justify-between px-2">
						<h3 className="text-lg font-black text-slate-900 tracking-tight">Patient Reviews</h3>
						<div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
							<Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
							<span className="text-xs font-black text-yellow-700">{hospital?.rating}</span>
						</div>
					</div>
					{hospital?.reviews?.length > 0 ? (
						hospital.reviews.slice(0, 2).map((review: { _id: string }) => (
							<Card key={review._id} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
								<CardContent className="p-6" />
							</Card>
						))
					) : (
						<div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center">
							<p className="text-sm font-bold text-slate-400">No reviews shared yet</p>
							<Button variant="link" className="text-blue-600 font-bold text-xs mt-1">
								Be the first to rate
							</Button>
						</div>
					)}
				</section>
			</div>
		</div>
	</div>
);
}
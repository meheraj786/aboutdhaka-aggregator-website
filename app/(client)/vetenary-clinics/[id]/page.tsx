"use client";

import {
	Activity,
	BadgeCheck,
	ChevronRight,
	Clock,
	Heart,
	Info,
	Loader2,
	MapPin,
	PawPrint,
	Phone,
	Search,
	Share2,
	Star,
	Stethoscope,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import FindBusButton from "@/components/appComponents/FindBusButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchHospitalById } from "@/hooks/useHospitals";

export default function VetClinicDetailPage() {
	const { id } = useParams();
	const { data: response, isLoading } = useFetchHospitalById(id as string);

	const clinic = response?.data;

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center space-y-4">
				<Loader2 className="h-10 w-10 animate-spin text-blue-600" />
				<p className="text-slate-500 font-medium">Loading clinic details...</p>
			</div>
		);
	}

	if (!clinic)
		return <div className="text-center py-20 font-bold">Clinic not found.</div>;

	return (
		<div className="min-h-screen bg-slate-50/50 pb-20">
			{/* --- HERO SECTION --- */}
			<div className="relative h-[450px] w-full overflow-hidden">
				<Image
					src={clinic.images?.[0] || clinic.thumbnail || "/placeholder-vet.jpg"}
					alt={clinic.name}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

				<div className="absolute top-6 right-6 flex gap-3">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/40"
					>
						<Share2 className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/40"
					>
						<Heart className="w-5 h-5" />
					</Button>
				</div>

				<div className="absolute bottom-10 left-6 md:left-12 lg:left-24 right-6">
					<div className="flex flex-wrap gap-2 mb-4">
						{clinic.isVerified && (
							<Badge className="bg-green-500 hover:bg-green-600 border-none px-3 py-1 gap-1">
								<BadgeCheck className="w-3 h-3" /> Certified Clinic
							</Badge>
						)}
						<Badge className="bg-blue-600 border-none px-3 py-1 gap-1 font-bold">
							<PawPrint className="w-3 h-3" /> Veterinary Care
						</Badge>
					</div>
					<h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
						{clinic.name}
					</h1>
					<div className="flex items-center gap-4 text-white/90">
						<div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
							<MapPin className="w-4 h-4 text-blue-400" />
							<span className="text-sm font-medium">
								{clinic.address?.area}, {clinic.address?.district}
							</span>
						</div>
						<div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full backdrop-blur-sm border border-yellow-500/30">
							<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
							<span className="text-sm font-bold text-yellow-100">
								{clinic.rating} Rating
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* --- SLIM STATS BAR --- */}
			<div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<Card className="shadow-lg border-slate-100 rounded-xl bg-white overflow-hidden">
						<CardContent className="p-3 flex items-center gap-3">
							<div className="w-10 h-10 shrink-0 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
								<Phone className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
									Emergency Desk
								</p>
								<p className="text-base font-black text-slate-900 truncate">
									{clinic.contact?.phone?.[0] || "N/A"}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-lg border-slate-100 rounded-xl bg-white overflow-hidden">
						<CardContent className="p-3 flex items-center gap-3">
							<div className="w-10 h-10 shrink-0 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
								<Activity className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
									Recovery Units
								</p>
								<p className="text-base font-black text-slate-900 truncate">
									{clinic.totalBeds || "0"} Spaces Available
								</p>
							</div>
						</CardContent>
					</Card>

					<div className="flex gap-2 h-[66px]">
						<Button className="flex-1 rounded-xl h-full font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 text-sm">
							<Phone className="w-4 h-4 mr-2" /> Call Now
						</Button>
						<Button
							variant="outline"
							className="flex-1 rounded-xl h-full font-bold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm"
						>
							<MapPin className="w-4 h-4 mr-2" /> Directions
						</Button>
					</div>
				</div>
			</div>

			{/* --- MAIN CONTENT GRID --- */}
			<div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Left Column */}
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
								Vet Services
							</TabsTrigger>
							<TabsTrigger
								value="pricing"
								className="rounded-lg py-2.5 px-6 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
							>
								Vaccine & Tests
							</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-8">
							<section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
								<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
									<Info className="w-5 h-5 text-blue-600" /> About the Clinic
								</h3>
								<p className="text-slate-600 leading-relaxed text-lg">
									{clinic.about ||
										`${clinic.name} provides expert medical care for pets, specialized in diagnostics, surgery, and routine vaccinations.`}
								</p>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
									{clinic.facilities?.map((facility: string) => (
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

							{/* Gallery */}
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{clinic.images?.map((img: string, idx: number) => (
									<div
										key={idx}
										className="relative h-48 rounded-2xl overflow-hidden group"
									>
										<Image
											src={img}
											alt="Clinic view"
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									</div>
								))}
							</div>
						</TabsContent>

						<TabsContent value="services">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{clinic.services?.map(
									(service: { _id: string; name: string }) => (
										<Card
											key={service._id}
											className="border-slate-100 shadow-sm hover:border-blue-200 transition-all"
										>
											<CardContent className="p-4 flex items-center gap-4">
												<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
													<Stethoscope className="w-5 h-5" />
												</div>
												<span className="font-bold text-slate-800">
													{service.name}
												</span>
											</CardContent>
										</Card>
									),
								)}
							</div>
						</TabsContent>

						<TabsContent value="pricing">
							<Card className="rounded-[2rem] overflow-hidden border-slate-100 shadow-sm bg-white">
								<div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
									<div className="relative w-full max-w-xs">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
										<input
											className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm"
											placeholder="Search tests/vaccines..."
										/>
									</div>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
												<th className="px-8 py-4 text-left">Service/Test</th>
												<th className="px-8 py-4 text-right">Price (BDT)</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-50">
											{clinic.testPrices?.map(
												(test: { name: string; price: number }) => (
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
												),
											)}
										</tbody>
									</table>
								</div>
							</Card>
						</TabsContent>
					</Tabs>
				</div>

				{/* Right Column (Location Sidebar) */}
				<div className="lg:col-span-4 space-y-8">
					<Card className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden bg-white">
						<CardHeader className="p-8 pb-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
									<MapPin className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<CardTitle className="text-xl font-bold text-slate-900">
										Location
									</CardTitle>
									<p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
										Clinic Address
									</p>
								</div>
							</div>
						</CardHeader>

						<CardContent className="p-8 pt-0 space-y-6">
							<div className="relative h-48 w-full rounded-3xl overflow-hidden border border-slate-100 group cursor-pointer bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
								<MapPin className="w-8 h-8 text-blue-600/20" />
								<a
									href={clinic.googleMapReviewLink}
									target="blank"
									className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700 hover:bg-white transition-all flex items-center gap-2"
								>
									Open Google Maps <ChevronRight className="w-3 h-3" />
								</a>
							</div>

							<div className="space-y-4">
								<div>
									<h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">
										Detailed Address
									</h4>
									<p className="text-slate-600 text-[15px] leading-relaxed font-medium">
										{clinic.address?.area}, {clinic.address?.district}
										<br />
										{clinic.address?.division}, Bangladesh
									</p>
								</div>
								<Separator />
								<FindBusButton
									hospitalLat={clinic.address?.coordinates?.lat}
									hospitalLng={clinic.address?.coordinates?.lng}
								/>
							</div>
						</CardContent>
					</Card>

					<div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
						<div className="relative z-10">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-white/20 rounded-lg">
									<Clock className="w-5 h-5 text-white" />
								</div>
								<span className="font-bold tracking-tight">Visting Hours</span>
							</div>
							<div className="space-y-3">
								<div className="flex justify-between items-center border-b border-white/10 pb-2">
									<span className="text-blue-100 text-sm">Emergency</span>
									<span className="font-bold">24/7 Available</span>
								</div>
								<div className="flex justify-between items-center pt-2">
									<span className="text-blue-100 text-sm">Consultation</span>
									<span className="font-bold">09:00 AM - 09:00 PM</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

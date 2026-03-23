import { Star } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "./SectionHeader";

const SPECIALISTS = [
	{
		id: "s1",
		name: "Dr. Ariful Islam",
		role: "Cardiologist",
		rating: 4.9,
		image: "https://picsum.photos/seed/doc1/400/400",
	},
	{
		id: "s2",
		name: "Dr. Sarah Khan",
		role: "Neurologist",
		rating: 4.8,
		image: "https://picsum.photos/seed/doc2/400/400",
	},
	{
		id: "s3",
		name: "Dr. Nusrat Jahan",
		role: "Pediatrician",
		rating: 5.0,
		image: "https://picsum.photos/seed/doc3/400/400",
	},
	{
		id: "s4",
		name: "Dr. Rezwan Ahmed",
		role: "Orthopedic",
		rating: 4.7,
		image: "https://picsum.photos/seed/doc4/400/400",
	},
];

export function Doctors() {
	return (
		<section className="py-16 px-4 max-w-7xl mx-auto">
			<SectionHeader
				title="Find a Specialist"
				viewAllText="View All Doctors"
				viewAllHref="/doctors"
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{SPECIALISTS.map((doc) => (
					<div
						key={doc.id}
						className="bg-white border border-slate-100 rounded-[32px] p-8 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
					>
						<div className="relative w-32 h-32 rounded-3xl overflow-hidden mb-6">
							<Image
								src={doc.image}
								alt={doc.name}
								fill
								className="object-cover"
								referrerPolicy="no-referrer"
							/>
						</div>
						<h3 className="text-xl font-bold text-slate-900 mb-1">
							{doc.name}
						</h3>
						<p className="text-blue-600 text-sm font-medium mb-4">{doc.role}</p>
						<div className="flex items-center gap-1 mb-8">
							<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
							<span className="font-bold text-slate-900">
								{doc.rating.toFixed(1)}
							</span>
						</div>
						<button
							type="button"
							className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-colors"
						>
							Book Appointment
						</button>
					</div>
				))}
			</div>
		</section>
	);
}

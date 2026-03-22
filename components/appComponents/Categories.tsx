"use client";
import Autoplay from "embla-carousel-autoplay";
import {
	BookOpen,
	Bus,
	Cpu,
	Dog,
	GraduationCap,
	Hospital,
	Key,
	MapPin,
	ShoppingBag,
	Stethoscope,
	User,
	Utensils,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";

export const categories = [
	{
		icon: MapPin,
		label: "Places",
		color: "bg-blue-50 text-blue-500",
		link: "/places",
	},
	{
		icon: Hospital,
		label: "Hospitals",
		color: "bg-red-50 text-red-500",
		link: "/hospitals",
	},
	{
		icon: Stethoscope,
		label: "Doctors",
		color: "bg-pink-50 text-pink-500",
		link: "/doctors",
	},
	{
		icon: Utensils,
		label: "Dine",
		color: "bg-orange-50 text-orange-500",
		link: "/restaurants",
	},
	{
		icon: ShoppingBag,
		label: "Malls",
		color: "bg-purple-50 text-purple-500",
		link: "/malls",
	},
	{
		icon: Cpu,
		label: "PC Build",
		color: "bg-gray-100 text-gray-700",
		link: "/pc-builder",
	},
	{
		icon: Key,
		label: "Rent",
		color: "bg-yellow-50 text-yellow-600",
		link: "/rent",
	},
	{
		icon: Dog,
		label: "Vets",
		color: "bg-green-50 text-green-600",
		link: "/vets",
	},
	{
		icon: Bus,
		label: "Bus Routes",
		color: "bg-indigo-50 text-indigo-500",
		link: "/bus-routes",
	},
	{
		icon: GraduationCap,
		label: "Teachers",
		color: "bg-teal-50 text-teal-600",
		link: "/teachers",
	},
	{
		icon: User,
		label: "Freelancers",
		color: "bg-cyan-50 text-cyan-600",
		link: "/freelancers",
	},
	{
		icon: BookOpen,
		label: "Blogs",
		color: "bg-rose-50 text-rose-500",
		link: "/blogs",
	},
];

const Categories = () => {
	const plugin = React.useRef(
		Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true }),
	);
	return (
		<section id="categories" className="py-12 px-6 md:px-12 lg:px-24 bg-white">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-2xl font-bold text-slate-900">
						Quick Categories
					</h2>
				</div>

				<Carousel
					plugins={[plugin.current]}
					opts={{
						align: "start",
					}}
					className="w-full  "
				>
					<CarouselContent>
						{categories.map((cat) => (
							<CarouselItem key={cat.label} className="basis-1/8">
								<Link href={cat.link}>
									<div
										key={cat.label}
										className="group flex flex-col items-center p-6 bg-white border border-slate-50 rounded-2xl hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer"
									>
										<div
											className={`p-3 rounded-xl mb-4 transition-transform group-hover:scale-110 ${cat.color}`}
										>
											<cat.icon className="w-6 h-6" />
										</div>
										<span className="text-sm font-semibold text-slate-700">
											{cat.label}
										</span>
									</div>
								</Link>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>

				{/* <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
					{categories.map((cat) => (
						<div
							key={cat.label}
							className="group flex flex-col items-center p-6 bg-white border border-slate-50 rounded-2xl hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer"
						>
							<div
								className={`p-3 rounded-xl mb-4 transition-transform group-hover:scale-110 ${cat.color}`}
							>
								<cat.icon className="w-6 h-6" />
							</div>
							<span className="text-sm font-semibold text-slate-700">
								{cat.label}
							</span>
						</div>
					))}
				</div> */}
			</div>
		</section>
	);
};

export default Categories;

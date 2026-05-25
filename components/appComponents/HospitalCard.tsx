import { MapPin, Star } from "lucide-react";
import type mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";

export interface HospitalCardProps {
	_id: string;
	name: string;
	address?: {
		area?: string;
	};
	location?: string;
	types?: string[];
	detail?: string;
	rating?: number;
	phone?: string;
	testPrices?: object;
	services?: string[];
	reviewsCount?: number;
	doctors?: mongoose.Types.ObjectId[];
	thumbnail?: string;
	images?: string[];
}

const HospitalCard: React.FC<HospitalCardProps> = ({
	_id,
	name,
	address,
	types,
	rating,
	detail,
	thumbnail,
	images,
}) => {
	const imageSrc = thumbnail || images?.[0] || "/placeholder.svg";
	const category = types?.[0] || "Hospital";
	const areaName = address?.area || "Dhaka";

	return (
		<Link href={`/hospitals/${_id}`}>
			<div className="card-shine bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
				<div className="relative h-48 w-full">
					<Image
						src={imageSrc}
						alt={name || ""}
						fill
						loading="eager"
						className="object-cover"
						referrerPolicy="no-referrer"
					/>
					<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
						<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
						<span className="text-xs font-bold text-slate-700">{rating}</span>
					</div>
				</div>

				<div className="p-5 flex flex-col grow">
					<div className="flex justify-between items-start mb-2">
						<h3 className="text-lg font-bold text-slate-900 leading-tight">
							{name}
						</h3>
						<span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
							{category}
						</span>
					</div>

					<div className="flex items-center gap-1 text-slate-400 mb-3">
						<MapPin className="w-3 h-3" />
						<span className="text-xs">{areaName}</span>
					</div>

					<p className="text-slate-500 text-sm line-clamp-2 mb-2 grow">
						{detail}
					</p>
					<span className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 text-slate-900 hover:text-white font-semibold rounded-xl text-sm text-center transition-colors duration-200">
						View Details
					</span>
				</div>
			</div>
		</Link>
	);
};

export default HospitalCard;

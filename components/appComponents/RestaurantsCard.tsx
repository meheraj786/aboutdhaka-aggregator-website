import { MapPin, Star } from "lucide-react";
import type { Types } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { IRestaurantBase } from "@/models/restaurants.model";

interface RestaurantCardProps extends Partial<IRestaurantBase> {
	_id: string | Types.ObjectId;
}

const RestaurantsCard: React.FC<RestaurantCardProps> = ({
	_id,
	name,
	category,
	location,
	rating,
	gallery,
	detail,
}) => {
	const image = gallery?.[0] || "/restaurant-placeholder.jpg";

	return (
		<div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-shadow flex flex-col h-full">
			<div className="relative h-48 w-full">
				<Image
					src={image}
					alt={name || "Restaurant"}
					fill
					className="object-cover"
					referrerPolicy="no-referrer"
				/>
				<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
					<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
					<span className="text-xs font-bold text-slate-700">
						{rating || 0}
					</span>
				</div>
			</div>

			<div className="p-5 flex flex-col flex-grow">
				<div className="flex justify-between items-start mb-2">
					<h3 className="text-lg font-bold text-slate-900 leading-tight">
						{name}
					</h3>
					{category && (
						<span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
							{category}
						</span>
					)}
				</div>

				<div className="flex items-center gap-1 text-slate-400 mb-3">
					<MapPin className="w-3 h-3" />
					<span className="text-xs truncate">{location}</span>
				</div>

				<p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow">
					{detail || "No description available."}
				</p>

				<Link href={`/restaurants/${String(_id)}`}>
					<button
						type="button"
						className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-colors text-sm"
					>
						View Details
					</button>
				</Link>
			</div>
		</div>
	);
};

export default RestaurantsCard;

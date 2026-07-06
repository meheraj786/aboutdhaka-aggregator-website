
import mongoose, { type Document, Schema } from "mongoose";

export interface IPlace extends Document {
	name: string;
	area: mongoose.Types.ObjectId;
	location: string;
	category: string;
	detail?: string;
	rating?: number;
	reviews?: number;
	hours?: Record<string | number, string>;
	closingDay?: string;
	experience?: string[];
	fee?: number;
	contact?: string;
	facilities?: string[];
	gallery?: string[];
	gps?: { type: string; coordinates: [number, number] };
}

const PlaceSchema: Schema<IPlace> = new Schema(
	{
		name: { type: String, required: true },
		area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
		location: { type: String, required: true },
		gps: {
			type: { type: String, enum: ["Point"] },
			coordinates: [Number],
		},
		category: String,
		detail: String,
		experience: [String],
		rating: { type: Number, default: 0, min: 0, max: 5 },
		reviews: { type: Number, default: 0 },
		hours: { type: Object, default: {} },
		closingDay: String,
		fee: Number,
		contact: String,
		facilities: [String],
		gallery: [String],
	},
	{ timestamps: true },
);

export const Place =
	mongoose.models.Place || mongoose.model<IPlace>("Place", PlaceSchema);

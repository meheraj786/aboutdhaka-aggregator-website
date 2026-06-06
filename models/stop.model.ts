import mongoose, { type Document, Schema } from "mongoose";

interface IBusStop extends Document {
	stopName: string;
	area: string;
	location: {
		type: "Point";
		coordinates: [number, number];
	};
}

const BusStopSchema = new Schema<IBusStop>({
	stopName: { type: String, required: true, unique: true },
	area: { type: String, required: true },
	location: {
		type: { type: String, enum: ["Point"], required: true },
		coordinates: { type: [Number], required: true },
	},
});

BusStopSchema.index({ location: "2dsphere" });

export const BusStop =
	mongoose.models.BusStop || mongoose.model<IBusStop>("BusStop", BusStopSchema);

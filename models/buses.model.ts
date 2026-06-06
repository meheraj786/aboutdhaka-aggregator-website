import mongoose, { type Document, Schema } from "mongoose";

interface IBus extends Document {
	busName: string;
	stops: mongoose.Types.ObjectId[];
}

const BusSchema = new Schema<IBus>({
	busName: { type: String, required: true, unique: true },

	stops: [{ type: Schema.Types.ObjectId, ref: "BusStop" }],
});

export const Bus =
	mongoose.models.Bus || mongoose.model<IBus>("Bus", BusSchema);

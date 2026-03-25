import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IArea extends Document {
	name: string;
	buses?: mongoose.Types.ObjectId[];
}

const AreaSchema: Schema<IArea> = new Schema(
	{
		name: { type: String, required: true, unique: true },
		buses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
	},
	{ timestamps: true },
);

export const Area: Model<IArea> = mongoose.model<IArea>("Area", AreaSchema);

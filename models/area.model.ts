import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IArea extends Document {
	name: string;
	buses?: mongoose.Types.ObjectId[];
	stops?: {
		name: string;
		buses?: mongoose.Types.ObjectId[];
	}[];
}

const modelName = "Area";

const AreaSchema: Schema<IArea> = new Schema(
	{
		name: { type: String, required: true, unique: true },
		buses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
		stops: [{
			name: String,
			buses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
		}],
	},
	{ timestamps: true },
);

export const Area: Model<IArea> =
	mongoose.models[modelName] || mongoose.model<IArea>(modelName, AreaSchema);

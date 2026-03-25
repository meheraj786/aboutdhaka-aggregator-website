import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlace extends Document {
  name: string;
  area: mongoose.Types.ObjectId;
  location: string;
  category: string;
  detail?: string;
  rating?: number;
  hours?: object;
  closingDay?: string;
  fee?: number;
  contact?: string;
  facilities?: string[];
  gallery?: string[];
}

const PlaceSchema: Schema<IPlace> = new Schema(
  {
    name: { type: String, required: true },
    area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
    location: { type: String, required: true },
    category: String,
    detail: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    hours: Object,
    closingDay: String,
    fee: Number,
    contact: String,
    facilities: [String],
    gallery: [String],
  },
  { timestamps: true },
);

export const Place: Model<IPlace> = mongoose.model<IPlace>(
  "Place",
  PlaceSchema,
);

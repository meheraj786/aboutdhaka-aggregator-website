import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IRestaurantBase {
  name: string;
  area: mongoose.Types.ObjectId;
  location: string;
  category: string;
  detail?: string;
  rating?: number;
  phone?: string;
  menu?: object;
  amenities?: string[];
  experience?: string[];
  hours?: object;
  gallery?: string[];
  reviewsCount?: number;
}

export interface IRestaurant extends IRestaurantBase, Document {}

export const modelName = "Restaurant";

export const RESTAURANT_EXPERIENCES = [
  "Date Night",
  "Family",
  "Friends",
  "Business Meeting",
  "Celebration",
  "Rooftop",
];

const RestaurantSchema: Schema<IRestaurant> = new Schema(
  {
    name: { type: String, required: true },
    area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
    location: { type: String, required: true },
    category: String,
    detail: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    phone: String,
    menu: Object,
    amenities: [String],
    experience: {
      type: [String],
      enum: RESTAURANT_EXPERIENCES,
      default: [],
    },
    hours: Object,
    gallery: [String],
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Restaurant: Model<IRestaurant> =
  mongoose.models[modelName] ||
  mongoose.model<IRestaurant>(modelName, RestaurantSchema);
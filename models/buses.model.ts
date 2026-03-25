import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBus extends Document {
  name: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  stopages?: string[];
}

const BusSchema: Schema<IBus> = new Schema(
  {
    name: { type: String, required: true },
    category: String,
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    stopages: [String],
  },
  { timestamps: true }
);

export const Bus: Model<IBus> = mongoose.model<IBus>('Bus', BusSchema);
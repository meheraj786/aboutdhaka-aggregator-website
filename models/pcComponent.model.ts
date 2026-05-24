import mongoose, { type Model, Schema } from "mongoose";

export type ComponentCategory =
	| "CPU"
	| "GPU"
	| "RAM"
	| "Motherboard"
	| "Storage"
	| "PSU"
	| "Case"
	| "Cooler";

export interface IShopListing {
	shop: mongoose.Types.ObjectId;
	price: number;
	stock: "in_stock" | "out_of_stock" | "limited";
	url?: string;
	lastUpdated: Date;
}

// component.model.ts

export type UsageTag =
	| "Gaming"
	| "Content Creation"
	| "Development"
	| "Office & Web";
export type BudgetTier = "budget" | "mid" | "high-end";

export interface IPCComponent extends mongoose.Document {
	name: string;
	brand: string;
	category: ComponentCategory;
	imageUrl?: string;
	specs: Record<string, string | number | boolean>;
	shopListings: IShopListing[];

	// New fields
	usageTags: UsageTag[]; // not optional — matches .default([])
	minBudgetTier: BudgetTier; // not optional — matches .default("mid")

	cores?: number;
	threads?: number;
	createdAt: Date;
	updatedAt: Date;
}

const ShopListingSchema = new Schema<IShopListing>({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
	price: { type: Number, required: true },
	stock: {
		type: String,
		enum: ["in_stock", "out_of_stock", "limited"],
		default: "in_stock",
	},
	url: { type: String },
	lastUpdated: { type: Date, default: Date.now },
});

const PCComponentSchema = new Schema<IPCComponent>(
	{
		name: { type: String, required: true },
		brand: { type: String, required: true },
		category: {
			type: String,
			required: true,
			enum: [
				"CPU",
				"GPU",
				"RAM",
				"Motherboard",
				"Storage",
				"PSU",
				"Case",
				"Cooler",
			],
		},
		imageUrl: { type: String },
		specs: { type: Schema.Types.Mixed, default: {} },
		shopListings: [ShopListingSchema],
		usageTags: {
			type: [String],
			enum: ["Gaming", "Content Creation", "Development", "Office & Web"],
			default: [],
		},
		minBudgetTier: {
			type: String,
			enum: ["budget", "mid", "high-end"],
			default: "mid",
		},
		cores: { type: Number, sparse: true },
		threads: { type: Number, sparse: true },
	},
	{ timestamps: true },
);

PCComponentSchema.index({ category: 1 });
PCComponentSchema.index({ brand: 1 });
PCComponentSchema.index({ cores: 1, threads: 1 });

const modelName = "PCComponent";
export const PCComponent: Model<IPCComponent> =
	mongoose.models[modelName] ||
	mongoose.model<IPCComponent>(modelName, PCComponentSchema);

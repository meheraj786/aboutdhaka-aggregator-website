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

export type UsageTag =
	| "Gaming"
	| "Content Creation"
	| "Development"
	| "Office & Web";

export type BudgetTier = "budget" | "mid" | "high-end";

export type StockStatus = "in_stock" | "out_of_stock" | "limited";

export type RamGeneration = "DDR3" | "DDR4" | "DDR5";

export type StorageInterface = "NVMe_Gen3" | "NVMe_Gen4" | "SATA";

export type SocketType =
	| "AM4"
	| "AM5"
	| "LGA1700"
	| "LGA1200"
	| "LGA1151"
	| "other";

export interface IShopListing {
	shop: mongoose.Types.ObjectId;
	price: number;
	stock: StockStatus;
	url?: string;
	lastUpdated: Date;
}

export interface IPCComponent extends mongoose.Document {
	name: string;
	brand: string;
	category: ComponentCategory;
	imageUrl?: string;
	specs: Record<string, string | number | boolean>;
	shopListings: IShopListing[];
	usageTags: UsageTag[];
	minBudgetTier: BudgetTier;

	// CPU & Motherboard socket compatibility
	socket?: SocketType;

	// CPU specific
	cores?: number;
	threads?: number;
	tdpWatt?: number;

	// Motherboard specific
	supportedRamGeneration?: RamGeneration;
	supportedStorageInterfaces?: StorageInterface[];

	// RAM specific
	ramGeneration?: RamGeneration;
	ramCapacityGb?: number;

	// GPU specific
	vramGb?: number;
	gpuTdpWatt?: number;

	// Storage specific
	storageInterface?: StorageInterface;
	storageCapacityGb?: number;

	// PSU specific
	wattage?: number;

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
		socket: {
			type: String,
			enum: ["AM4", "AM5", "LGA1700", "LGA1200", "LGA1151", "other"],
		},
		cores: { type: Number },
		threads: { type: Number },
		tdpWatt: { type: Number },
		supportedRamGeneration: {
			type: String,
			enum: ["DDR3", "DDR4", "DDR5"],
		},
		supportedStorageInterfaces: {
			type: [String],
			enum: ["NVMe_Gen3", "NVMe_Gen4", "SATA"],
			default: undefined,
		},
		ramGeneration: {
			type: String,
			enum: ["DDR3", "DDR4", "DDR5"],
		},
		ramCapacityGb: { type: Number },
		vramGb: { type: Number },
		gpuTdpWatt: { type: Number },
		storageInterface: {
			type: String,
			enum: ["NVMe_Gen3", "NVMe_Gen4", "SATA"],
		},
		storageCapacityGb: { type: Number },
		wattage: { type: Number },
	},
	{ timestamps: true },
);

PCComponentSchema.index({ category: 1 });
PCComponentSchema.index({ category: 1, usageTags: 1, minBudgetTier: 1 });
PCComponentSchema.index({ category: 1, socket: 1 });
PCComponentSchema.index({ category: 1, ramGeneration: 1 });
PCComponentSchema.index({ category: 1, storageInterface: 1 });

const modelName = "PCComponent";
export const PCComponent: Model<IPCComponent> =
	mongoose.models[modelName] ||
	mongoose.model<IPCComponent>(modelName, PCComponentSchema);

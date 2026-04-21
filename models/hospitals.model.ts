import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IHospitalContact {
	phone?: string[];
	email?: string;
	website?: string;
}

export interface IHospitalCoordinates {
	lat?: number;
	lng?: number;
}

export interface IHospitalAddress {
	area?: string;
	district?: string;
	division?: string;
	coordinates?: IHospitalCoordinates;
}

export interface IHospitalOpenHours {
	open?: string;
	close?: string;
	isOpen24Hours?: boolean;
}

export interface IHospitalReview {
	reviewer?: string;
	comment?: string;
	time?: Date;
	initial?: string;
	rating?: number;
}

export interface IHospitalService {
	name: string;
	description?: string;
	icon?: string;
	averageCost?: number;
}

export interface IHospitalTestPrice {
	name: string;
	price: string;
}

export interface IHospital extends Document {
	name: string;
	slug?: string;
	types?: mongoose.Types.ObjectId[];
	services?: IHospitalService[];
	testPrices?: IHospitalTestPrice[];
	contact?: IHospitalContact;
	address?: IHospitalAddress;
	images?: string[];
	thumbnail?: string;
	facilities?: string[];
	totalBeds?: number;
	established?: number;
	openHours?: IHospitalOpenHours;
	reviews?: IHospitalReview[];
	googleMapReviewLink?: string;
	isVerified: boolean;
	isActive: boolean;
	rating: number;
}

export const modelName = "Hospital";

let hospitalIndexesEnsured = false;

const slugifyHospitalName = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const hospitalSchema: Schema<IHospital> = new Schema(
	{
		name: { type: String, required: true, trim: true },
		slug: { type: String, unique: true, trim: true },
		types: [{ type: Schema.Types.ObjectId, ref: "MedicalCategory" }],
		services: [
			{
				name: { type: String, required: true, trim: true },
				description: { type: String },
				icon: { type: String },
				averageCost: { type: Number, min: 0 },
			},
		],
		testPrices: [
			{
				name: { type: String, required: true, trim: true },
				price: { type: String, required: true, trim: true },
			},
		],
		contact: {
			phone: [{ type: String }],
			email: { type: String },
			website: { type: String },
		},
		address: {
			area: { type: String },
			district: { type: String, default: "Dhaka" },
			division: { type: String, default: "Dhaka" },
			coordinates: {
				lat: { type: Number },
				lng: { type: Number },
			},
		},
		images: [{ type: String }],
		thumbnail: { type: String },
		facilities: [{ type: String }],
		totalBeds: { type: Number },
		established: { type: Number },
		openHours: {
			open: { type: String },
			close: { type: String },
			isOpen24Hours: { type: Boolean, default: false },
		},
		reviews: [
			{
				reviewer: { type: String },
				comment: { type: String },
				time: { type: Date },
				initial: { type: String },
				rating: { type: Number },
			},
		],
		googleMapReviewLink: { type: String },
		isVerified: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
		rating: { type: Number, default: 0, min: 0, max: 5 },
	},
	{ timestamps: true },
);

hospitalSchema.index({ name: "text", "address.area": "text" });

export const Hospital: Model<IHospital> =
	mongoose.models[modelName] ||
	mongoose.model<IHospital>(modelName, hospitalSchema);

async function backfillMissingHospitalSlugs() {
	const hospitalsWithoutSlugs = await Hospital.find({
		$or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
	})
		.select("_id name slug")
		.sort({ createdAt: 1 })
		.lean();

	for (const hospital of hospitalsWithoutSlugs) {
		const baseSlug =
			slugifyHospitalName(hospital.name || "") || `hospital-${hospital._id}`;
		let candidateSlug = baseSlug;
		let suffix = 1;

		while (
			await Hospital.exists({
				slug: candidateSlug,
				_id: { $ne: hospital._id },
			})
		) {
			candidateSlug = `${baseSlug}-${suffix}`;
			suffix += 1;
		}

		await Hospital.updateOne(
			{ _id: hospital._id },
			{ $set: { slug: candidateSlug } },
		);
	}
}

export async function ensureHospitalIndexes() {
	if (hospitalIndexesEnsured) return;

	const existingIndexes = await Hospital.collection.indexes();
	const hasSlugIndex = existingIndexes.some((index) => index.name === "slug_1");

	if (hasSlugIndex) {
		hospitalIndexesEnsured = true;
		return;
	}

	await backfillMissingHospitalSlugs();
	await Hospital.syncIndexes();
	hospitalIndexesEnsured = true;
}

export default Hospital;

"use server";

import { z } from "zod";
import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/db";
import { ensureHospitalIndexes, Hospital } from "@/models/hospitals.model";
import { createHospitalSchema } from "@/validators/hospitals";
import "@/models/area.model";

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const isMongoDuplicateKeyError = (
	error: unknown,
): error is Error & { code: number; keyPattern?: Record<string, number> } =>
	typeof error === "object" &&
	error !== null &&
	"code" in error &&
	(error as { code?: unknown }).code === 11000;

const buildUniqueHospitalSlug = async (
	name: string,
	providedSlug?: string,
	excludeId?: string,
) => {
	const baseSlug = slugify(providedSlug || name) || `hospital-${Date.now()}`;
	let candidateSlug = baseSlug;
	let suffix = 1;

	while (
		await Hospital.exists(
			excludeId
				? { slug: candidateSlug, _id: { $ne: excludeId } }
				: { slug: candidateSlug },
		)
	) {
		candidateSlug = `${baseSlug}-${suffix}`;
		suffix += 1;
	}

	return candidateSlug;
};

/**
 * Extract Cloudinary public_id from a Cloudinary URL
 * Example URL: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/hospital-aggregator/hospitals/abc123.jpg
 * Returns: hospital-aggregator/hospitals/abc123
 */
const extractCloudinaryPublicId = (url: string): string | null => {
	try {
		const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
		return match ? match[1] : null;
	} catch {
		return null;
	}
};

/**
 * Delete images from Cloudinary
 */
const deleteCloudinaryImages = async (imageUrls: string[]) => {
	const deletePromises = imageUrls
		.map((url) => extractCloudinaryPublicId(url))
		.filter((publicId): publicId is string => publicId !== null)
		.map((publicId) =>
			cloudinary.uploader
				.destroy(publicId)
				.catch((error) =>
					console.error(`Failed to delete image ${publicId}:`, error),
				),
		);

	await Promise.allSettled(deletePromises);
};

export interface GetHospitalsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	areas?: string[];
	types?: string[];
	excludeTypes?: string[];
	minRating?: number;
	sortBy?: "popular" | "rating_desc";
}

export async function getHospitals(params: GetHospitalsParams = {}) {
	try {
		await dbConnect();
		const page = Math.max(1, params.page ?? 1);
		const pageSize = params.pageSize ?? 10;
		const skip = (page - 1) * pageSize;

		const filter: Record<string, unknown> = {};

		if (params.search) {
			filter.name = { $regex: params.search, $options: "i" };
		}
		if (params.areas?.length) {
			filter["address.area"] = { $in: params.areas };
		}
		if (params.types?.length) {
			filter.types = { $in: params.types };
		} else if (params.excludeTypes?.length) {
			filter.types = { $nin: params.excludeTypes };
		}
		if (params.minRating !== undefined) {
			filter.rating = { $gte: params.minRating };
		}

		const sortOptions = {
			popular: { rating: -1, reviewCount: -1 },
			rating_desc: { rating: -1 },
		} as const;
		const sort = sortOptions[params.sortBy ?? "popular"];

		const [items, totalCount] = await Promise.all([
			Hospital.find(filter).sort(sort).skip(skip).limit(pageSize).lean(),
			Hospital.countDocuments(filter),
		]);

		return {
			items: JSON.parse(JSON.stringify(items)),
			totalCount,
			currentPage: page,
		};
	} catch {
		throw new Error("Failed to fetch hospitals");
	}
}

export async function createHospital(payload: unknown) {
	try {
		const data = createHospitalSchema.parse(payload);

		await dbConnect();
		await ensureHospitalIndexes();

		const generatedSlug = await buildUniqueHospitalSlug(data.name, data.slug);

		const hospitalData = {
			name: data.name,
			slug: generatedSlug,
			types: data.types || [],
			rating: data.rating,
			services: data.services || [],
			testPrices: data.testPrices || [],
			contact: {
				phone: data.contact.phone.filter((p) => p.trim()),
				email: data.contact.email || undefined,
				website: data.contact.website || undefined,
			},
			address: {
				area: data.address.area,
				district: data.address.district,
				division: data.address.division,
				coordinates: data.address.coordinates,
			},
			thumbnail: data.thumbnail || data.images?.[0],
			images: data.images || [],
			facilities: data.facilities || [],
			totalBeds: data.totalBeds,
			established: data.established,
			// openHours: data.openHours,
			reviews: (data.reviews || []).map((review) => ({
				reviewer: review.reviewer,
				comment: review.comment,
				time: review.time ? new Date(review.time) : undefined,
				initial: review.initial,
				rating: review.rating,
			})),
			googleMapReviewLink: data.googleMapReviewLink,
			isVerified: data.isVerified,
			isActive: data.isActive,
		};

		const res = await Hospital.create(hospitalData);
		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch (error) {
		if (error instanceof z.ZodError) throw new Error(error.issues[0].message);
		if (isMongoDuplicateKeyError(error)) {
			if (error.keyPattern?.slug) {
				throw new Error(
					"A hospital with a similar name already exists. Please change the hospital name.",
				);
			}

			throw new Error(
				"A hospital with the same unique details already exists.",
			);
		}
		if (error instanceof Error) {
			console.error("Create hospital error:", error);
			throw new Error(error.message || "Failed to create hospital");
		}
		throw new Error("Failed to create hospital");
	}
}

export async function updateHospital(id: string, payload: unknown) {
	try {
		const data = createHospitalSchema.parse(payload);

		await dbConnect();
		await ensureHospitalIndexes();

		const generatedSlug = await buildUniqueHospitalSlug(
			data.name,
			data.slug,
			id,
		);

		const hospitalData = {
			name: data.name,
			slug: generatedSlug,
			types: data.types || [],
			rating: data.rating,
			services: data.services || [],
			testPrices: data.testPrices || [],
			contact: {
				phone: data.contact.phone.filter((p) => p.trim()),
				email: data.contact.email || undefined,
				website: data.contact.website || undefined,
			},
			address: {
				area: data.address.area,
				district: data.address.district,
				division: data.address.division,
				coordinates: data.address.coordinates,
			},
			thumbnail: data.thumbnail || data.images?.[0],
			images: data.images || [],
			facilities: data.facilities || [],
			totalBeds: data.totalBeds,
			established: data.established,
			// openHours: data.openHours,minor
			reviews: (data.reviews || []).map((review) => ({
				reviewer: review.reviewer,
				comment: review.comment,
				time: review.time ? new Date(review.time) : undefined,
				initial: review.initial,
				rating: review.rating,
			})),
			googleMapReviewLink: data.googleMapReviewLink,
			isVerified: data.isVerified,
			isActive: data.isActive,
		};

		const res = await Hospital.findByIdAndUpdate(id, hospitalData, {
			new: true,
			runValidators: true,
		});

		if (!res) {
			throw new Error("Hospital not found");
		}

		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch (error) {
		if (error instanceof z.ZodError) throw new Error(error.issues[0].message);
		if (isMongoDuplicateKeyError(error)) {
			if (error.keyPattern?.slug) {
				throw new Error(
					"A hospital with a similar name already exists. Please change the hospital name.",
				);
			}

			throw new Error(
				"A hospital with the same unique details already exists.",
			);
		}
		if (error instanceof Error) {
			console.error("Update hospital error:", error);
			throw new Error(error.message || "Failed to update hospital");
		}
		throw new Error("Failed to update hospital");
	}
}

export async function deleteHospital(id: string) {
	try {
		await dbConnect();

		// Fetch hospital to get image URLs before deletion
		const hospital = await Hospital.findById(id).lean();

		if (!hospital) {
			throw new Error("Hospital not found");
		}

		// Collect all image URLs (images array + thumbnail)
		const imageUrls: string[] = [];

		if (hospital.images && Array.isArray(hospital.images)) {
			imageUrls.push(...hospital.images);
		}

		if (hospital.thumbnail && typeof hospital.thumbnail === "string") {
			// Only add thumbnail if it's not already in images array
			if (!imageUrls.includes(hospital.thumbnail)) {
				imageUrls.push(hospital.thumbnail);
			}
		}

		// Delete images from Cloudinary (don't block deletion if this fails)
		if (imageUrls.length > 0) {
			await deleteCloudinaryImages(imageUrls);
		}

		// Delete hospital from database
		await Hospital.findByIdAndDelete(id);

		return { success: true };
	} catch (error) {
		console.error("Delete hospital error:", error);
		throw new Error("Failed to delete hospital");
	}
}

export async function getHospitalById(id: string) {
	try {
		await dbConnect();
		const res = await Hospital.findById(id).lean();
		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch {
		throw new Error("Failed to fetch hospital");
	}
}

export type GetHospitalsReturn = Awaited<ReturnType<typeof getHospitals>>;

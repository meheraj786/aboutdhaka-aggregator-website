"use server";

import { z } from "zod";
import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/db";
import { DoctorHospital } from "@/models/doctorhospital.model";
import { Doctor } from "@/models/doctors.model";
import { createDoctorSchema, updateDoctorSchema } from "@/validators/doctors";
import "@/models/hospitals.model";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

const buildUniqueDoctorSlug = async (
	name: string,
	providedSlug?: string,
): Promise<string> => {
	const baseSlug = slugify(providedSlug || name) || `doctor-${Date.now()}`;
	let candidateSlug = baseSlug;
	let suffix = 1;

	while (await Doctor.exists({ slug: candidateSlug })) {
		candidateSlug = `${baseSlug}-${suffix}`;
		suffix += 1;
	}

	return candidateSlug;
};

/**
 * Extract Cloudinary public_id from a Cloudinary URL.
 * e.g. https://res.cloudinary.com/{cloud}/image/upload/v123/folder/file.jpg
 * → folder/file
 */
const extractCloudinaryPublicId = (url: string): string | null => {
	try {
		const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
		return match ? match[1] : null;
	} catch {
		return null;
	}
};

const deleteCloudinaryImage = async (imageUrl: string): Promise<void> => {
	const publicId = extractCloudinaryPublicId(imageUrl);
	if (!publicId) return;
	await cloudinary.uploader
		.destroy(publicId)
		.catch((err) =>
			console.error(`Failed to delete Cloudinary image ${publicId}:`, err),
		);
};

// ---------------------------------------------------------------------------
// GET — list
// ---------------------------------------------------------------------------

export interface GetDoctorsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export async function getDoctors(params: GetDoctorsParams = {}) {
	try {
		await dbConnect();

		const page = Math.max(1, params.page ?? 1);
		const pageSize = Math.min(100, params.pageSize ?? 10);
		const skip = (page - 1) * pageSize;

		const filter = params.search
			? {
					$or: [
						{ name: { $regex: params.search, $options: "i" } },
						{ designation: { $regex: params.search, $options: "i" } },
						{ speciality: { $regex: params.search, $options: "i" } },
					],
				}
			: {};

		const sortField = params.sortBy ?? "createdAt";
		const sortDirection = params.sortOrder === "asc" ? 1 : -1;

		const [items, totalCount] = await Promise.all([
			Doctor.find(filter)
				.populate("chamber", "name slug")
				.sort({ [sortField]: sortDirection })
				.skip(skip)
				.limit(pageSize)
				.lean(),
			Doctor.countDocuments(filter),
		]);

		return {
			items: JSON.parse(JSON.stringify(items)),
			totalCount,
			currentPage: page,
		};
	} catch (error) {
		console.error("Error fetching doctors:", error);
		throw new Error("Failed to fetch doctors");
	}
}

export type GetDoctorsReturn = Awaited<ReturnType<typeof getDoctors>>;

// ---------------------------------------------------------------------------
// GET — single
// ---------------------------------------------------------------------------

export async function getDoctorById(id: string) {
	try {
		await dbConnect();

		const doctor = await Doctor.findById(id)
			.populate("chamber", "name slug")
			.lean();

		if (!doctor) {
			throw new Error("Doctor not found");
		}

		return { success: true, data: JSON.parse(JSON.stringify(doctor)) };
	} catch (error) {
		console.error("Error fetching doctor:", error);
		if (error instanceof Error) throw error;
		throw new Error("Failed to fetch doctor");
	}
}

export type GetDoctorByIdReturn = Awaited<ReturnType<typeof getDoctorById>>;

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------

export async function createDoctor(payload: unknown) {
	try {
		const data = createDoctorSchema.parse(payload);

		await dbConnect();

		const generatedSlug = await buildUniqueDoctorSlug(data.name, data.slug);

		const doctor = await Doctor.create({
			name: data.name,
			slug: generatedSlug,
			departments: data.departments ?? [],
			qualifications: data.qualifications ?? [],
			designation: data.designation,
			experience: data.experience,
			bio: data.bio,
			contact: data.contact,
			profileImage: data.profileImage,
			gender: data.gender,
			bmdc: data.bmdc || undefined,
			speciality: data.speciality ?? [],
			chamber: data.chamber ?? [],
			isVerified: data.isVerified,
			isActive: data.isActive,
			rating: data.rating,
			reviewCount: data.reviewCount,
		});

		return { success: true, data: JSON.parse(JSON.stringify(doctor)) };
	} catch (error) {
		console.error("Error creating doctor:", error);

		if (error instanceof z.ZodError) {
			throw new Error(error.issues[0].message);
		}

		if (isMongoDuplicateKeyError(error)) {
			if (error.keyPattern?.bmdc) {
				throw new Error(
					"A doctor with this BMDC registration number already exists.",
				);
			}
			throw new Error("A doctor with the same unique details already exists.");
		}

		throw new Error("Failed to create doctor");
	}
}

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------

export async function updateDoctor(id: string, payload: unknown) {
	try {
		const data = updateDoctorSchema.parse(payload);

		await dbConnect();

		// If a new profileImage is supplied, delete the old one from Cloudinary
		if (data.profileImage) {
			const existing = await Doctor.findById(id).select("profileImage").lean();
			if (
				existing?.profileImage &&
				existing.profileImage !== data.profileImage
			) {
				await deleteCloudinaryImage(existing.profileImage);
			}
		}

		// Rebuild slug only when explicitly provided in the update payload
		let slug: string | undefined;
		if (data.slug !== undefined) {
			const existingDoctor = await Doctor.findById(id).select("name").lean();
			if (!existingDoctor) {
				throw new Error("Doctor not found");
			}
			slug = await buildUniqueDoctorSlug(
				data.name ?? existingDoctor.name,
				data.slug,
			);
		}

		const updatePayload = {
			...data,
			...(slug ? { slug } : {}),
			// Prevent bmdc from being set to empty string — keep sparse unique intact
			...(data.bmdc === "" ? { bmdc: undefined } : {}),
		};

		const doctor = await Doctor.findByIdAndUpdate(id, updatePayload, {
			new: true,
			runValidators: true,
		}).lean();

		if (!doctor) {
			throw new Error("Doctor not found");
		}

		return { success: true, data: JSON.parse(JSON.stringify(doctor)) };
	} catch (error) {
		console.error("Error updating doctor:", error);

		if (error instanceof z.ZodError) {
			throw new Error(error.issues[0].message);
		}

		if (isMongoDuplicateKeyError(error)) {
			if (error.keyPattern?.bmdc) {
				throw new Error(
					"A doctor with this BMDC registration number already exists.",
				);
			}
			throw new Error("A doctor with the same unique details already exists.");
		}

		if (error instanceof Error) throw error;
		throw new Error("Failed to update doctor");
	}
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export async function deleteDoctor(id: string) {
	try {
		await dbConnect();

		const doctor = await Doctor.findById(id).select("profileImage").lean();

		if (!doctor) {
			throw new Error("Doctor not found");
		}

		// Remove profile image from Cloudinary before deleting the record
		if (doctor.profileImage) {
			await deleteCloudinaryImage(doctor.profileImage);
		}

		await Doctor.findByIdAndDelete(id);
		await DoctorHospital.deleteMany({ doctor: id });

		return { success: true };
	} catch (error) {
		console.error("Error deleting doctor:", error);
		if (error instanceof Error) throw error;
		throw new Error("Failed to delete doctor");
	}
}

export async function getRandomDoctors(size: number = 4) {
	try {
		await dbConnect();

		const excludeRegex = /Veterinary|Animal|Avian|Wildlife|Zoo|Aquatic|Equine/i;

		const items = await Doctor.aggregate([
			{
				$match: {
					departments: { 
						$not: { $elemMatch: { $regex: excludeRegex } } 
					},
					isActive: true, 
				},
			},
			{ $sample: { size } },
		]);

		return JSON.parse(JSON.stringify(items));
	} catch (error) {
		console.error("Error fetching random doctors:", error);
		throw new Error("Failed to fetch random doctors");
	}
}
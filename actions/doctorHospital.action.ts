"use server";

import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { DoctorHospital } from "@/models/doctorhospital.model";
import {
	createDoctorHospitalSchema,
	updateDoctorHospitalSchema,
} from "@/validators/doctorHospitals";
import "@/models/doctors.model";
import "@/models/hospitals.model";

class ActionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ActionError";
	}
}

const isMongoDuplicateKeyError = (
	error: unknown,
): error is Error & { code: number } =>
	typeof error === "object" &&
	error !== null &&
	"code" in error &&
	(error as { code?: unknown }).code === 11000;

const normalizeOptionalString = (value?: string) => {
	const normalized = value?.trim();
	return normalized ? normalized : undefined;
};

export interface GetDoctorHospitalsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	doctor?: string;
	hospital?: string;
	appointmentAvailable?: boolean;
	isActive?: boolean;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export async function getDoctorHospitals(
	params: GetDoctorHospitalsParams = {},
) {
	try {
		await dbConnect();

		const page = Math.max(1, params.page ?? 1);
		const pageSize = Math.min(100, params.pageSize ?? 10);
		const skip = (page - 1) * pageSize;
		const filter: Record<string, unknown> = {};

		if (params.search) {
			filter.$or = [
				{ department: { $regex: params.search, $options: "i" } },
				{ roomOrChamber: { $regex: params.search, $options: "i" } },
			];
		}

		if (params.doctor) {
			filter.doctor = params.doctor;
		}

		if (params.hospital) {
			filter.hospital = params.hospital;
		}

		if (params.appointmentAvailable !== undefined) {
			filter.appointmentAvailable = params.appointmentAvailable;
		}

		if (params.isActive !== undefined) {
			filter.isActive = params.isActive;
		}

		const sortField = params.sortBy ?? "createdAt";
		const sortDirection = params.sortOrder === "asc" ? 1 : -1;
		const sort = { [sortField]: sortDirection } as Record<string, 1 | -1>;

		const [items, totalCount] = await Promise.all([
			DoctorHospital.find(filter)
				.populate("doctor", "name slug designation profileImage")
				.populate("hospital", "name slug thumbnail address")
				.sort(sort)
				.skip(skip)
				.limit(pageSize)
				.lean(),
			DoctorHospital.countDocuments(filter),
		]);

		return {
			items: JSON.parse(JSON.stringify(items)),
			totalCount,
			currentPage: page,
		};
	} catch (error) {
		console.error("Error fetching doctor-hospital assignments:", error);
		throw new ActionError("Failed to fetch doctor-hospital assignments");
	}
}

export type GetDoctorHospitalsReturn = Awaited<
	ReturnType<typeof getDoctorHospitals>
>;

export async function getDoctorHospitalById(id: string) {
	try {
		await dbConnect();

		const doctorHospital = await DoctorHospital.findById(id)
			.populate("doctor", "name slug designation profileImage")
			.populate("hospital", "name slug thumbnail address")
			.lean();

		if (!doctorHospital) {
			throw new ActionError("Doctor-hospital assignment not found");
		}

		return { success: true, data: JSON.parse(JSON.stringify(doctorHospital)) };
	} catch (error) {
		console.error("Error fetching doctor-hospital assignment:", error);
		if (error instanceof ActionError) throw error;
		throw new ActionError("Failed to fetch doctor-hospital assignment");
	}
}

export type GetDoctorHospitalByIdReturn = Awaited<
	ReturnType<typeof getDoctorHospitalById>
>;

export async function createDoctorHospital(payload: unknown) {
	try {
		const data = createDoctorHospitalSchema.parse(payload);

		await dbConnect();

		const doctorHospital = await DoctorHospital.create({
			doctor: data.doctor,
			hospital: data.hospital,
			department: normalizeOptionalString(data.department),
			roomOrChamber: normalizeOptionalString(data.roomOrChamber),
			schedule: data.schedule ?? [],
			consultationFee: data.consultationFee,
			appointmentAvailable: data.appointmentAvailable,
			isActive: data.isActive,
		});

		const populatedDoctorHospital = await DoctorHospital.findById(
			doctorHospital._id,
		)
			.populate("doctor", "name slug designation profileImage")
			.populate("hospital", "name slug thumbnail address")
			.lean();

		return {
			success: true,
			message: "Doctor-hospital assignment created successfully",
			data: JSON.parse(JSON.stringify(populatedDoctorHospital)),
		};
	} catch (error) {
		console.error("Error creating doctor-hospital assignment:", error);

		if (error instanceof z.ZodError) {
			const message = error.issues.map((issue) => issue.message).join(", ");
			throw new ActionError(`Validation failed: ${message}`);
		}

		if (isMongoDuplicateKeyError(error)) {
			throw new ActionError(
				"This doctor is already assigned to the selected hospital",
			);
		}

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to create doctor-hospital assignment");
	}
}

export async function updateDoctorHospital(id: string, payload: unknown) {
	try {
		const data = updateDoctorHospitalSchema.parse(payload);

		await dbConnect();

		const updateData = {
			...data,
			...(data.department !== undefined
				? { department: normalizeOptionalString(data.department) }
				: {}),
			...(data.roomOrChamber !== undefined
				? { roomOrChamber: normalizeOptionalString(data.roomOrChamber) }
				: {}),
		};

		const doctorHospital = await DoctorHospital.findByIdAndUpdate(
			id,
			updateData,
			{
				new: true,
				runValidators: true,
			},
		)
			.populate("doctor", "name slug designation profileImage")
			.populate("hospital", "name slug thumbnail address")
			.lean();

		if (!doctorHospital) {
			throw new ActionError("Doctor-hospital assignment not found");
		}

		return {
			success: true,
			message: "Doctor-hospital assignment updated successfully",
			data: JSON.parse(JSON.stringify(doctorHospital)),
		};
	} catch (error) {
		console.error("Error updating doctor-hospital assignment:", error);

		if (error instanceof z.ZodError) {
			const message = error.issues.map((issue) => issue.message).join(", ");
			throw new ActionError(`Validation failed: ${message}`);
		}

		if (isMongoDuplicateKeyError(error)) {
			throw new ActionError(
				"This doctor is already assigned to the selected hospital",
			);
		}

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to update doctor-hospital assignment");
	}
}

export async function deleteDoctorHospital(id: string) {
	try {
		await dbConnect();

		const doctorHospital = await DoctorHospital.findByIdAndDelete(id);

		if (!doctorHospital) {
			throw new ActionError("Doctor-hospital assignment not found");
		}

		return {
			success: true,
			message: "Doctor-hospital assignment deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting doctor-hospital assignment:", error);

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to delete doctor-hospital assignment");
	}
}

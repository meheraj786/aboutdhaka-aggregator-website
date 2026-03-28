"use server";

import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Hospital } from "@/models/hospitals.model";
import { createHospitalSchema } from "@/validators/hospitals";
import "@/models/area.model";

export interface GetHospitalsParams {
	page?: number;
	pageSize?: number;
	search?: string;
}

export async function getHospitals(params: GetHospitalsParams = {}) {
	try {
		await dbConnect();
		const page = Math.max(1, params.page ?? 1);
		const pageSize = params.pageSize ?? 10;
		const skip = (page - 1) * pageSize;

		const filter = params.search
			? { name: { $regex: params.search, $options: "i" } }
			: {};

		const [items, totalCount] = await Promise.all([
			Hospital.find(filter)
				.populate("area", "name")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(pageSize)
				.lean(),
			Hospital.countDocuments(filter),
		]);

		return {
			items: JSON.parse(JSON.stringify(items)),
			totalCount,
			currentPage: page,
		};
	} catch (_) {
		throw new Error("Failed to fetch hospitals");
	}
}

export async function createHospital(payload: unknown) {
	try {
		const data = createHospitalSchema.parse(payload);
		await dbConnect();
		const res = await Hospital.create(data);
		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch (error) {
		if (error instanceof z.ZodError) throw new Error(error.issues[0].message);
		throw new Error("Failed to create hospital");
	}
}

export async function deleteHospital(id: string) {
	try {
		await dbConnect();
		await Hospital.findByIdAndDelete(id);
		return { success: true };
	} catch (_) {
		throw new Error("Failed to delete hospital");
	}
}

export async function getHospitalById(id: string) {
	try {
		await dbConnect();
		const res = await Hospital.findById(id).populate("area", "name").lean();
		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch (_) {
		throw new Error("Failed to fetch hospital");
	}
}

export type GetHospitalsReturn = Awaited<ReturnType<typeof getHospitals>>;

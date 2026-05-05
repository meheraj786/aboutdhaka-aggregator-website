import { z } from "zod";

const objectIdSchema = z.string().trim().min(1, "ID is required");

const scheduleSlotSchema = z.object({
	day: z.enum([
		"Saturday",
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
	]),
	startTime: z.string().trim().min(1, "Start time is required"),
	endTime: z.string().trim().min(1, "End time is required"),
	maxPatients: z.coerce
		.number()
		.int()
		.min(1, "Max patients must be at least 1"),
});

export const createDoctorHospitalSchema = z.object({
	doctor: objectIdSchema.min(1, "Doctor is required"),
	hospital: objectIdSchema.min(1, "Hospital is required"),
	department: z.string().trim().optional(),
	roomOrChamber: z.string().trim().optional(),
	schedule: z
		.array(scheduleSlotSchema)
		.min(1, "At least one schedule slot is required"),
	consultationFee: z.coerce
		.number()
		.min(0, "Consultation fee cannot be negative")
		.optional(),
	appointmentAvailable: z.boolean().default(true),
	isActive: z.boolean().default(true),
});

export const updateDoctorHospitalSchema = createDoctorHospitalSchema.partial();

export type CreateDoctorHospitalInput = z.infer<
	typeof createDoctorHospitalSchema
>;
export type UpdateDoctorHospitalInput = z.infer<
	typeof updateDoctorHospitalSchema
>;

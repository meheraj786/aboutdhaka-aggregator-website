import mongoose, { type Document, type Model, Schema } from "mongoose";

export type Weekday =
	| "Saturday"
	| "Sunday"
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday";

export interface IScheduleSlot {
	day: Weekday;
	startTime: string;
	endTime: string;
	maxPatients: number;
}

export interface IDoctorHospital extends Document {
	doctor: mongoose.Types.ObjectId;
	hospital: mongoose.Types.ObjectId;
	department?: string;
	roomOrChamber?: string;
	schedule?: IScheduleSlot[];
	consultationFee?: number;
	appointmentAvailable: boolean;
	isActive: boolean;
}

export const modelName = "DoctorHospital";

const scheduleSlotSchema: Schema<IScheduleSlot> = new Schema(
	{
		day: {
			type: String,
			enum: [
				"Saturday",
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
			],
			required: true,
		},
		startTime: { type: String, required: true },
		endTime: { type: String, required: true },
		maxPatients: { type: Number, default: 20 },
	},
	{ _id: false },
);

const doctorHospitalSchema: Schema<IDoctorHospital> = new Schema(
	{
		doctor: {
			type: Schema.Types.ObjectId,
			ref: "Doctor",
			required: true,
		},
		hospital: {
			type: Schema.Types.ObjectId,
			ref: "Hospital",
			required: true,
		},
		department: { type: String },
		roomOrChamber: { type: String },
		schedule: [scheduleSlotSchema],
		consultationFee: { type: Number },
		appointmentAvailable: { type: Boolean, default: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

doctorHospitalSchema.index({ doctor: 1, hospital: 1 }, { unique: true });

export const DoctorHospital: Model<IDoctorHospital> =
	mongoose.models[modelName] ||
	mongoose.model<IDoctorHospital>(modelName, doctorHospitalSchema);

export default DoctorHospital;

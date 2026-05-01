import mongoose, { type Document, type Model, Schema } from "mongoose";

export type DoctorGender = "male" | "female" | "other";

export interface IDoctorQualification {
	degree: string;
	institution: string;
	passingYear: number;
}

export interface IDoctorContact {
	phone: string;
	email: string;
}

export interface IDoctor extends Document {
	name: string;
	slug?: string;
	departments: mongoose.Types.ObjectId[];
	qualifications: IDoctorQualification[];
	designation: string;
	experience?: number;
	bio: string;
	contact: IDoctorContact;
	profileImage?: string;
	gender?: DoctorGender;
	bmdc: string;
	speciality?: string[];
	chamber: mongoose.Types.ObjectId[];
	isVerified: boolean;
	isActive: boolean;
	rating: number;
	reviewCount: number;
}

export const modelName = "Doctor";

const doctorSchema: Schema<IDoctor> = new Schema(
	{
		name: { type: String, required: true, trim: true },
		slug: { type: String, unique: true, trim: true },
		departments: {
			type: [{ type: Schema.Types.ObjectId, ref: "MedicalCategory" }],
			required: true,
			validate: {
				validator: (value: mongoose.Types.ObjectId[]) => value.length > 0,
				message: "At least one department is required",
			},
		},
		qualifications: {
			type: [
				{
					degree: { type: String, required: true, trim: true },
					institution: { type: String, required: true, trim: true },
					passingYear: { type: Number, required: true },
				},
			],
			required: true,
			validate: {
				validator: (value: IDoctorQualification[]) => value.length > 0,
				message: "At least one qualification is required",
			},
		},
		designation: { type: String, required: true, trim: true },
		experience: { type: Number },
		bio: { type: String, required: true, trim: true },
		contact: {
			type: {
				phone: { type: String, required: true, trim: true },
				email: { type: String, required: true, trim: true },
			},
			required: true,
		},
		profileImage: { type: String },
		gender: { type: String, enum: ["male", "female", "other"] },
		bmdc: { type: String, required: true, unique: true, trim: true },
		speciality: [{ type: String, trim: true }],
		chamber: {
			type: [{ type: Schema.Types.ObjectId, ref: "Hospital" }],
			required: true,
			validate: {
				validator: (value: mongoose.Types.ObjectId[]) => value.length > 0,
				message: "At least one chamber is required",
			},
		},
		isVerified: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
		rating: { type: Number, required: true, min: 0, max: 5 },
		reviewCount: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

doctorSchema.index({ name: "text" });

export const Doctor: Model<IDoctor> =
	mongoose.models[modelName] ||
	mongoose.model<IDoctor>(modelName, doctorSchema);

export default Doctor;

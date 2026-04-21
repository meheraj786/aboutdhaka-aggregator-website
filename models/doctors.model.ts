import mongoose, { type Document, type Model, Schema } from "mongoose";

export type DoctorGender = "male" | "female" | "other";

export interface IDoctorQualification {
  degree?: string;
  institution?: string;
  passingYear?: number;
}

export interface IDoctorContact {
  phone?: string;
  email?: string;
}

export interface IDoctorConsultationFee {
  min?: number;
  max?: number;
}

export interface IDoctor extends Document {
  name: string;
  slug?: string;
  specializations?: mongoose.Types.ObjectId[];
  qualifications?: IDoctorQualification[];
  designation?: string;
  experience?: number;
  bio?: string;
  contact?: IDoctorContact;
  profileImage?: string;
  gender?: DoctorGender;
  bmdc?: string;
  consultationFee?: IDoctorConsultationFee;
  languages?: string[];
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
    specializations: [{ type: Schema.Types.ObjectId, ref: "MedicalCategory" }],
    qualifications: [
      {
        degree: { type: String },
        institution: { type: String },
        passingYear: { type: Number },
      },
    ],
    designation: { type: String },
    experience: { type: Number },
    bio: { type: String },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    profileImage: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    bmdc: { type: String, unique: true, sparse: true },
    consultationFee: {
      min: { type: Number },
      max: { type: Number },
    },
    languages: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

doctorSchema.index({ name: "text" });

export const Doctor: Model<IDoctor> =
  mongoose.models[modelName] ||
  mongoose.model<IDoctor>(modelName, doctorSchema);

export default Doctor;
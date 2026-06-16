import { Doctor } from "@/models";
import mongoose from "mongoose";  // adjust path if needed

const doctorsSeed = [


	// ==================== NEUROLOGY / NEUROMEDICINE ====================
	{
		name: "Prof. Brig (Rtd.) Gen. Dr. Md. Ismail Chowdhury",
		slug: "prof-brig-gen-dr-md-ismail-chowdhury",
		departments: ["Neurology"],
		qualifications: [
			{ degree: "MBBS", institution: "", passingYear: 1985 },
			{ degree: "FCPS (Medicine)", institution: "BCPS", passingYear: 1992 },
			{ degree: "MD (Neurology)", institution: "", passingYear: 2000 },
		],
		designation: "Senior Consultant, Neurology",
		experience: 35,
		bio: "Highly experienced neurologist specializing in stroke, epilepsy and neuromuscular disorders.",
		contact: { phone: "+880 9610-010616", email: "ismail.chowdhury@squarehospital.com" },
		gender: "male",
		bmdc: undefined,
		speciality: ["Stroke", "Epilepsy", "Neuromuscular Disorders"],
		chamber: ["6a2430eb10a3e82e814b17d5"],
		isVerified: true,
		isActive: true,
		rating: 4.8,
		reviewCount: 240,
	},

	// ==================== GASTROENTEROLOGY ====================
	{
		name: "Prof. Dr. Md. Hasan Masud",
		slug: "prof-dr-md-hasan-masud",
		departments: ["Gastroenterology"],
		qualifications: [
			{ degree: "MBBS", institution: "", passingYear: 1990 },
			{ degree: "MD (Gastroenterology)", institution: "", passingYear: 2000 },
		],
		designation: "Senior Consultant, Gastroenterology",
		experience: 30,
		bio: "Expert in Liver diseases, Endoscopy and ERCP.",
		contact: { phone: "+880 9610-010616", email: "hasan.masud@squarehospital.com" },
		gender: "male",
		bmdc: undefined,
		speciality: ["Hepatology", "Endoscopy", "ERCP"],
		chamber: ["6a2430eb10a3e82e814b17d5"],
		isVerified: true,
		isActive: true,
		rating: 4.7,
		reviewCount: 195,
	},

	// ==================== INTERNAL MEDICINE ====================
	{
		name: "Dr. Ahmad Mursel Anam",
		slug: "dr-ahmad-mursel-anam",
		departments: ["Internal Medicine"],
		qualifications: [
			{ degree: "MBBS", institution: "Dhaka Medical College", passingYear: 2008 },
			{ degree: "FCPS (Internal Medicine)", institution: "BCPS", passingYear: 2015 },
		],
		designation: "Associate Consultant, Internal Medicine",
		experience: 14,
		bio: "Specialist in Internal Medicine and Acute Care.",
		contact: { phone: "+880 9610-010616", email: "ahmad.anam@squarehospital.com" },
		gender: "male",
		bmdc: undefined,
		speciality: ["Internal Medicine", "Acute Medicine"],
		chamber: ["6a2430eb10a3e82e814b17d5"],
		isVerified: true,
		isActive: true,
		rating: 4.5,
		reviewCount: 130,
	},
];

async function seedDoctors() {
	try {
		await mongoose.connect(
			"mongodb+srv://meherajhosen786_db_user:hossen5799raj@primary.ydl4rgk.mongodb.net/dhaka-aggregator"
		);
		console.log("✅ MongoDB Connected");

		let insertedCount = 0;

		for (const doc of doctorsSeed) {
			// const existing = await Doctor.findOne({ bmdc: doc.bmdc });
			// if (existing) {
			// 	console.log(`⚠️ Already exists: ${doc.name}`);
			// 	continue;
			// }

			await Doctor.create(doc);
			insertedCount++;
			console.log(`✅ Added: ${doc.name}`);
		}

		console.log(`🎉 Successfully seeded ${insertedCount} doctors!`);
	} catch (error: any) {
		console.error("❌ Seeding failed:", error.message);
	} finally {
		await mongoose.disconnect();
	}
}

seedDoctors();
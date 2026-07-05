// import { Doctor } from "@/models";
// import mongoose from "mongoose";  // adjust path if needed

// const IBN_SINA_DHANMONDI_ID = "6a3b995bb8b56320358b0efa"; // New ID for Ibn Sina
// const BSMMU_ID = "6a243183beabfad2d46f2c5f";
// const DHAKA_MEDICAL="6a243212f35e8dbf3607ebc8"
// const SOROARDI="6a243212f35e8dbf3607ebcd"
// const SIR_SOLIMULLAH="6a243215f35e8dbf3607ec19"




// const doctorsSeed = [
// 	{
// 		name: "Prof. Dr. Kaniz Moula",
// 		slug: "prof-dr-kaniz-moula",
// 		departments: ["Medicine"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "", passingYear: null },
// 			{ degree: "FCPS (Medicine)", institution: "BCPS", passingYear: null },
// 			{ degree: "FACP (USA), FRCP (Edin)", institution: "", passingYear: null },
// 		],
// 		designation: "Professor & Head of the Department (Rtd.)",
// 		experience: 35,
// 		bio: "Retired Professor & Head at Holy Family Red Crescent Medical College. Renowned Medicine Specialist with international fellowships.",
// 		contact: { phone: "+88 09610010615", email: "kaniz.moula@ibnsina.com" },
// 		gender: "female",
// 		bmdc: "BMDC-IS-038",
// 		speciality: ["Medicine Specialist"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.9,
// 		reviewCount: 420,
// 	},
// 	{
// 		name: "Dr. Mohammad Tariqul Islam",
// 		slug: "dr-mohammad-tariqul-islam",
// 		departments: ["Medicine"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "Dhaka Medical College", passingYear: null },
// 			{ degree: "MD (Internal Medicine)", institution: "DMC", passingYear: null },
// 			{ degree: "FACP (USA)", institution: "", passingYear: null },
// 		],
// 		designation: "Associate Professor",
// 		experience: 20,
// 		bio: "Associate Professor at Dhaka Medical College & Hospital. Specialist in Medicine and Rheumatology (Arthritis).",
// 		contact: { phone: "+88 09610010615", email: "tariqul.islam@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-039",
// 		speciality: ["Medicine", "Rheumatology", "Arthritis"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.8,
// 		reviewCount: 155,
// 	},
// 	{
// 		name: "Prof. Dr. AKM Aminul Hoque",
// 		slug: "prof-dr-akm-aminul-hoque",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "BSMMU", passingYear: null },
// 			{ degree: "FCPS (Medicine)", institution: "BCPS", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "BSMMU", passingYear: null },
// 		],
// 		designation: "Professor",
// 		experience: 30,
// 		bio: "Professor of Gastroenterology at BSMMU. Expert in liver diseases and gastrointestinal health.",
// 		contact: { phone: "+88 09610010615", email: "aminul.hoque@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-040",
// 		speciality: ["Gastroenterology", "Liver", "Medicine"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.9,
// 		reviewCount: 280,
// 	},
// 	{
// 		name: "Prof. Dr. S.M.A. Jaigirdar",
// 		slug: "prof-dr-s-m-a-jaigirdar",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "", passingYear: null },
// 		],
// 		designation: "Professor & Head of the Department (Ex.)",
// 		experience: 38,
// 		bio: "Former Professor & Head at Sir Salimullah Medical College. Specialist in Gastroenterology and Liver Diseases.",
// 		contact: { phone: "+88 09610010615", email: "jaigirdar@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-041",
// 		speciality: ["Gastroenterology", "Liver Diseases"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.7,
// 		reviewCount: 190,
// 	},
// 	{
// 		name: "Prof. Dr. Md. Ashraful Islam",
// 		slug: "prof-dr-md-ashraful-islam",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "Mymensingh Medical College", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "", passingYear: null },
// 		],
// 		designation: "Professor & Head of the Department (Ex.)",
// 		experience: 35,
// 		bio: "Former Professor & Head at Mymensingh Medical College & Hospital. Expert in Gastro, Liver & Pancreas.",
// 		contact: { phone: "+88 09610010615", email: "ashraful.islam@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-042",
// 		speciality: ["Gastroenterology", "Liver", "Pancreas"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.8,
// 		reviewCount: 215,
// 	},
// 	{
// 		name: "Prof. Dr. Swapan Kumar Dhar",
// 		slug: "prof-dr-swapan-kumar-dhar",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "Dhaka Medical College", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "DMC", passingYear: null },
// 		],
// 		designation: "Professor",
// 		experience: 28,
// 		bio: "Professor at Dhaka Medical College & Hospital. Specialized in Gastroenterology and Hepatology.",
// 		contact: { phone: "+88 09610010615", email: "swapan.dhar@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-043",
// 		speciality: ["Gastroenterology", "Liver Disease"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.7,
// 		reviewCount: 140,
// 	},
// 	{
// 		name: "Dr. Md. Masudur Rahman (Khan)",
// 		slug: "dr-md-masudur-rahman-khan",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "", passingYear: null },
// 		],
// 		designation: "Associate Professor",
// 		experience: 18,
// 		bio: "Associate Professor at National Institute of Cancer Research & Hospital. Gastroenterology and Liver specialist.",
// 		contact: { phone: "+88 09610010615", email: "masudur.rahman@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-044",
// 		speciality: ["Gastroenterology", "Liver Disease"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.6,
// 		reviewCount: 98,
// 	},
// 	{
// 		name: "Prof. Dr. Faruque Ahmed",
// 		slug: "prof-dr-faruque-ahmed",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "", passingYear: null },
// 			{ degree: "FACG, FRCP (G)", institution: "", passingYear: null },
// 		],
// 		designation: "Professor & Director",
// 		experience: 32,
// 		bio: "Director and Professor at Sheikh Russel National Gastroliver Institute. Renowned Gastro & Pancreas expert.",
// 		contact: { phone: "+88 09610010615", email: "faruque.ahmed@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-045",
// 		speciality: ["Gastroenterology", "Liver", "Pancreas"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 5.0,
// 		reviewCount: 510,
// 	},
// 	{
// 		name: "Dr. S.M. Ishaque",
// 		slug: "dr-s-m-ishaque",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "BSMMU", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "BSMMU", passingYear: null },
// 			{ degree: "Ph.D (Gastroenterology)", institution: "", passingYear: null },
// 		],
// 		designation: "Associate Professor",
// 		experience: 22,
// 		bio: "Associate Professor at BSMMU. Advanced specialist with a Ph.D. in Gastroenterology & Liver Diseases.",
// 		contact: { phone: "+88 09610010615", email: "sm.ishaque@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-046",
// 		speciality: ["Gastroenterology", "Liver Diseases"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.8,
// 		reviewCount: 165,
// 	},
// 	{
// 		name: "Prof. Dr. Salimur Rahman",
// 		slug: "prof-dr-salimur-rahman",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "BSMMU", passingYear: null },
// 			{ degree: "FCPS (Medicine)", institution: "BCPS", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "BSMMU", passingYear: null },
// 		],
// 		designation: "Professor (Ex)",
// 		experience: 36,
// 		bio: "Former Professor of Gastroenterology at BSMMU. Senior expert in gastrointestinal and liver health.",
// 		contact: { phone: "+88 09610010615", email: "salimur.rahman@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-047",
// 		speciality: ["Gastroenterology", "Liver Diseases"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.9,
// 		reviewCount: 310,
// 	},
// 	{
// 		name: "Dr. Mohammad Monwarul Islam",
// 		slug: "dr-mohammad-monwarul-islam",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "BSMMU", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "BSMMU", passingYear: null },
// 		],
// 		designation: "Associate Professor",
// 		experience: 19,
// 		bio: "Associate Professor at BSMMU. Specialist in Stomach, Gallbladder, Pancreas, and Liver conditions.",
// 		contact: { phone: "+88 09610010615", email: "monwarul.islam@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-048",
// 		speciality: ["Gastroenterology", "Stomach", "Pancreas"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.7,
// 		reviewCount: 120,
// 	},
// 	{
// 		name: "Prof. Dr. Chanchal Kumar Ghosh",
// 		slug: "prof-dr-chanchal-kumar-ghosh",
// 		departments: ["Gastroenterology"],
// 		qualifications: [
// 			{ degree: "MBBS", institution: "Dhaka Medical College", passingYear: null },
// 			{ degree: "MD (Gastroenterology)", institution: "DMC", passingYear: null },
// 			{ degree: "PhD", institution: "", passingYear: null },
// 		],
// 		designation: "Professor & Head of the Department",
// 		experience: 30,
// 		bio: "Professor & Head of Gastroenterology at Dhaka Medical College. Highly experienced clinician and researcher.",
// 		contact: { phone: "+88 09610010615", email: "chanchal.ghosh@ibnsina.com" },
// 		gender: "male",
// 		bmdc: "BMDC-IS-049",
// 		speciality: ["Gastroenterology", "Liver Specialist"],
// 		chamber: [IBN_SINA_DHANMONDI_ID],
// 		isVerified: true,
// 		isActive: true,
// 		rating: 4.9,
// 		reviewCount: 260,
// 	},
// ];

// async function seedDoctors() {
// 	try {
// 		await mongoose.connect(
// 			"mongodb+srv://meherajhosen786_db_user:hossen5799raj@primary.ydl4rgk.mongodb.net/dhaka-aggregator"
// 		);
// 		console.log("✅ MongoDB Connected");

// 		let insertedCount = 0;

// 		for (const doc of doctorsSeed) {
// 			const existing = await Doctor.findOne({ bmdc: doc.bmdc });
// 			if (existing) {
// 				console.log(`⚠️ Already exists: ${doc.name}`);
// 				continue;
// 			}

// 			await Doctor.create(doc);
// 			insertedCount++;
// 			console.log(`✅ Added: ${doc.name}`);
// 		}

// 		console.log(`🎉 Successfully seeded ${insertedCount} doctors!`);
// 	} catch (error: any) {
// 		console.error("❌ Seeding failed:", error.message);
// 	} finally {
// 		await mongoose.disconnect();
// 	}
// }

// seedDoctors();
"use server";

import { dbConnect } from "@/lib/db";
import { Area } from "@/models/area.model";

const DHAKA_AREAS = [
  "Adabor",
  "Badda",
  "Bangsal",
  "Bimanbandar",
  "Cantonment",
  "Chawkbazar",
  "Dakshinkhan",
  "Darus Salam",
  "Demra",
  "Dhanmondi",
  "Gendaria",
  "Gulshan",
  "Hazaribagh",
  "Jatrabari",
  "Kadamtali",
  "Kafrul",
  "Kalabagan",
  "Kamrangirchar",
  "Khilgaon",
  "Khilkhet",
  "Kotwali",
  "Lalbagh",
  "Mirpur",
  "Mohammadpur",
  "Motijheel",
  "Mugda",
  "New Market",
  "Pallabi",
  "Paltan",
  "Ramna",
  "Rampura",
  "Sabujbagh",
  "Shah Ali",
  "Shahbagh",
  "Sher-e-Bangla Nagar",
  "Shyampur",
  "Sutrapur",
  "Tejgaon",
  "Tejgaon Industrial Area",
  "Turag",
  "Uttara",
  "Uttar Khan",
  "Vatara",
  "Wari",
];

export async function getAreas() {
  try {
    await dbConnect();
    const areas = await Area.find({})
      .select("_id name")
      .sort({ name: 1 })
      .lean();
    return areas.map(({ _id, name }) => ({
      _id: _id.toString(),
      name,
    }));
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw new Error("Failed to fetch areas");
  }
}

export async function seedAreas() {
  try {
    await dbConnect();

    const existingAreas = await Area.find({
      name: { $in: DHAKA_AREAS },
    }).select("name");
    const existingNames = new Set(existingAreas.map((a) => a.name));

    const areasToSeed = DHAKA_AREAS.filter(
      (name) => !existingNames.has(name),
    ).map((name) => ({ name }));

    if (areasToSeed.length > 0) {
      await Area.insertMany(areasToSeed);
      return {
        success: true,
        message: `Seeded ${areasToSeed.length} new areas.`,
      };
    }

    return { success: true, message: "All areas already exist." };
  } catch (error) {
    console.error("Error seeding areas:", error);
    return { success: false, message: "Failed to seed areas." };
  }
}

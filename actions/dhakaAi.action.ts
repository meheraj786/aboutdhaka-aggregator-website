"use server";

import Groq from "groq-sdk";
import mongoose from "mongoose";
import { Doctor } from "@/models";
import { DoctorHospital } from "@/models";
import { Restaurant } from "@/models";
import { Place } from "@/models";
import { Bus } from "@/models";
import { BusStop } from "@/models";
import { Area } from "@/models";
import { PCComponent } from "@/models";
import { Shop } from "@/models";
import { dbConnect } from "@/lib/db";
import { Hospital } from "@/models";
import { DOCTOR_DEPARTMENTS } from "@/lib/doctorDepartments";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface DhakaAIResult {
  reply: string;
  intent: string;
  resultsCount: number;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 300
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      const wait = delayMs * Math.pow(2, attempt);
      console.warn(`Retry ${attempt + 1}/${retries} after ${wait}ms`, err);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }
  throw lastError;
}

const INTENT_SYSTEM = `You are an intent classifier for a Dhaka city information assistant.
Given a user message, classify it into ONE of these intents and extract relevant parameters.

Intents:
- hospital: find hospitals, clinics, medical centers (params: type, area, name)
- doctor: find doctors, specialists (params: department, name, area, hospital)
- restaurant: find restaurants, food, cafes (params: category, area, name)
- place: find parks, schools, mosques, attractions (params: category, area, name)
- bus: find bus routes, bus stops, buses between areas (params: from, to, busName, area)
- pc_component: find PC parts, components, hardware (params: category, brand, usage, budget)
- shop: find tech shops, stores (params: name, location)
- general: general questions about Dhaka, greetings, help

Respond ONLY with valid JSON in this exact format:
{
  "intent": "<one of the intents above>",
  "params": {
    "name": "<optional>",
    "area": "<optional>",
    "type": "<optional>",
    "department": "<optional>",
    "category": "<optional>",
    "from": "<optional>",
    "to": "<optional>",
    "busName": "<optional>",
    "brand": "<optional>",
    "usage": "<optional>",
    "budget": "<optional>",
    "location": "<optional>",
    "hospital": "<optional>"
  },
  "userQuery": "<rephrased clean search query>"
}`;

async function classifyIntent(userMessage: string) {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: INTENT_SYSTEM },
      { role: "user", content: userMessage },
    ],
    max_tokens: 300,
    temperature: 0.1,
  });

  const raw = res.choices[0]?.message?.content ?? "{}";
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { intent: "general", params: {}, userQuery: userMessage };
  }
}

function normalizeDepartment(input: string): string | null {
  if (!input) return null;
  const normalized = input.toLowerCase().trim();
  for (const dept of DOCTOR_DEPARTMENTS) {
    const deptLower = dept.toLowerCase();
    if (deptLower === normalized) return dept;
    if (deptLower.includes(normalized) || normalized.includes(deptLower)) return dept;
  }
  // common aliases
  const aliasMap: Record<string, string> = {
    gyne: "Gynecology",
    gyno: "Gynecology",
    obs: "Obstetrics and Gynecology",
    obgyn: "Obstetrics and Gynecology",
    ent: "ENT",
    neuro: "Neurology",
    cardio: "Cardiology",
    derma: "Dermatology",
    ortho: "Orthopedics",
    ped: "Pediatrics",
    peds: "Pediatrics",
    gen: "General Medicine",
    "general medicine": "General Medicine",
    med: "General Medicine",
    surg: "General Surgery",
    "general surgery": "General Surgery",
  };
  if (aliasMap[normalized]) return aliasMap[normalized];
  return null;
}

async function queryHospitals(params: Record<string, string>) {
  const filter: Record<string, unknown> = { isActive: true };
  if (params.name) filter.$text = { $search: params.name };
  if (params.type) filter.types = { $in: [params.type] };
  if (params.area) filter["address.area"] = new RegExp(params.area, "i");

  const hospitals = await Hospital.find(filter)
    .select("name types address contact rating isVerified services facilities totalBeds")
    .sort({ rating: -1 })
    .limit(5)
    .lean();

  return hospitals;
}

async function queryDoctors(params: Record<string, string>) {
  const filter: Record<string, unknown> = { isActive: true };
  let doctorIds: mongoose.Types.ObjectId[] | null = null;
  let matchedHospital: any = null;

  // ---- Normalize department ----
  let department = params.department;
  if (department) {
    const normalized = normalizeDepartment(department);
    if (normalized) department = normalized;
    else {
      // still keep original, but we'll do a text search on departments as fallback
    }
  }

  // ---- Find hospitals by area or hospital name ----
  const hospitalFilters: Record<string, any> = { isActive: true };
  if (params.area) hospitalFilters["address.area"] = new RegExp(params.area, "i");
  if (params.hospital) hospitalFilters.name = new RegExp(params.hospital, "i");
  // Also try to match hospital name from params.name if no doctor found later
  let hospitalQuery: any = { isActive: true };
  if (Object.keys(hospitalFilters).length > 1 || params.area || params.hospital) {
    hospitalQuery = { $and: [] };
    if (params.area) hospitalQuery.$and.push({ "address.area": new RegExp(params.area, "i") });
    if (params.hospital) hospitalQuery.$and.push({ name: new RegExp(params.hospital, "i") });
  }

  const hospitals = await Hospital.find(hospitalQuery).select("_id name address contact").lean();
  if (hospitals.length) {
    matchedHospital = hospitals[0]; // pick first for fallback
    const hospitalIds = hospitals.map(h => h._id);
    const postings = await DoctorHospital.find({
      hospital: { $in: hospitalIds },
      isActive: true,
    }).select("doctor").lean();
    const ids = postings.map(p => p.doctor);
    if (ids.length) {
      doctorIds = ids;
    }
  }

  // ---- If no hospital was matched but params.hospital exists, try a more lenient search ----
  if (!hospitals.length && params.hospital) {
    const fuzzyHospitals = await Hospital.find({
      name: { $regex: params.hospital, $options: "i" },
      isActive: true,
    }).select("_id name address contact").lean();
    if (fuzzyHospitals.length) {
      matchedHospital = fuzzyHospitals[0];
      const hospitalIds = fuzzyHospitals.map(h => h._id);
      const postings = await DoctorHospital.find({
        hospital: { $in: hospitalIds },
        isActive: true,
      }).select("doctor").lean();
      const ids = postings.map(p => p.doctor);
      if (ids.length) {
        doctorIds = ids;
      }
    }
  }

  // ---- If still no hospital and params.name might be a hospital ----
  if (!hospitals.length && params.name && !doctorIds) {
    const hospitalByName = await Hospital.find({
      name: new RegExp(params.name, "i"),
      isActive: true,
    }).select("_id name address contact").lean();
    if (hospitalByName.length) {
      matchedHospital = hospitalByName[0];
      const hospitalIds = hospitalByName.map(h => h._id);
      const postings = await DoctorHospital.find({
        hospital: { $in: hospitalIds },
        isActive: true,
      }).select("doctor").lean();
      const ids = postings.map(p => p.doctor);
      if (ids.length) {
        doctorIds = ids;
      }
    }
  }

  // ---- If we have doctorIds, apply department filter ----
  if (doctorIds && doctorIds.length) {
    filter._id = { $in: doctorIds };
  }

  if (department) {
    // try exact match on department enum
    filter.departments = { $in: [department] };
  }

  // ---- If no department match but we have a department string, use text search on doctor fields ----
  if (department && !filter.departments) {
    // fallback: search departments array with regex
    filter.departments = { $elemMatch: { $regex: department, $options: "i" } };
  }

  // ---- Fetch doctors ----
  let doctors = await Doctor.find(filter)
    .select("name departments designation qualifications speciality rating reviewCount gender profileImage")
    .sort({ rating: -1 })
    .limit(5)
    .lean();

  // ---- If no doctors found but we have a hospital, return hospital info as a fallback ----
  if (doctors.length === 0 && matchedHospital) {
    // Return a special object that the LLM can use to suggest contacting the hospital
    return {
      __fallback: "hospital",
      hospital: matchedHospital,
      message: `No doctors found matching your criteria at ${matchedHospital.name}. You can contact the hospital directly.`,
    };
  }

  // ---- Enrich with hospital postings ----
  if (doctors.length > 0) {
    const ids = doctors.map((d) => d._id);
    const postings = await DoctorHospital.find({
      doctor: { $in: ids },
      isActive: true,
    })
      .populate("hospital", "name address.area")
      .select("doctor hospital consultationFee schedule department roomOrChamber")
      .lean();

    return doctors.map((doc) => ({
      ...doc,
      hospitalPostings: postings.filter(
        (p) => p.doctor.toString() === doc._id.toString()
      ),
    }));
  }

  return doctors;
}

async function queryRestaurants(params: Record<string, string>) {
  const filter: Record<string, unknown> = {};
  if (params.name) filter.name = new RegExp(params.name, "i");
  if (params.category) filter.category = new RegExp(params.category, "i");

  const areaFilter: Record<string, unknown> = {};
  if (params.area) areaFilter.name = new RegExp(params.area, "i");
  const areas = Object.keys(areaFilter).length
    ? await Area.find(areaFilter).select("_id").lean()
    : [];
  if (areas.length) filter.area = { $in: areas.map((a) => a._id) };

  const restaurants = await Restaurant.find(filter)
    .populate("area", "name")
    .select("name category detail rating phone amenities hours location area")
    .sort({ rating: -1 })
    .limit(5)
    .lean();

  return restaurants;
}

async function queryPlaces(params: Record<string, string>) {
  const filter: Record<string, unknown> = {};
  if (params.name) filter.name = new RegExp(params.name, "i");
  if (params.category) filter.category = new RegExp(params.category, "i");

  const areaFilter: Record<string, unknown> = {};
  if (params.area) areaFilter.name = new RegExp(params.area, "i");
  const areas = Object.keys(areaFilter).length
    ? await Area.find(areaFilter).select("_id").lean()
    : [];
  if (areas.length) filter.area = { $in: areas.map((a) => a._id) };

  const places = await Place.find(filter)
    .populate("area", "name")
    .select("name category detail rating hours closingDay fee contact facilities location area")
    .sort({ rating: -1 })
    .limit(5)
    .lean();

  return places;
}

async function queryBus(params: Record<string, string>) {
  if (params.from && params.to) {
    const [fromStop, toStop] = await Promise.all([
      BusStop.find({ stopName: new RegExp(params.from, "i") }).select("_id stopName area").lean(),
      BusStop.find({ stopName: new RegExp(params.to, "i") }).select("_id stopName area").lean(),
    ]);

    if (fromStop.length && toStop.length) {
      const fromIds = fromStop.map((s) => s._id);
      const toIds = toStop.map((s) => s._id);
      const buses = await Bus.find({
        stops: { $all: [{ $elemMatch: { $in: fromIds } }, { $elemMatch: { $in: toIds } }] },
      })
        .select("busName stops")
        .limit(5)
        .lean();

      return { fromStops: fromStop, toStops: toStop, buses };
    }
  }

  if (params.area) {
    const areaDoc = await Area.findOne({ name: new RegExp(params.area, "i") })
      .populate("buses", "busName")
      .select("name buses stops")
      .lean();
    return areaDoc ? [areaDoc] : [];
  }

  if (params.busName) {
    const buses = await Bus.find({ busName: new RegExp(params.busName, "i") })
      .populate("stops", "stopName area")
      .select("busName stops")
      .limit(5)
      .lean();
    return buses;
  }

  return [];
}

async function queryPCComponents(params: Record<string, string>) {
  const filter: Record<string, unknown> = {};
  if (params.category) filter.category = params.category;
  if (params.brand) filter.brand = new RegExp(params.brand, "i");
  if (params.usage) filter.usageTags = { $in: [params.usage] };
  if (params.budget) filter.minBudgetTier = params.budget;

  const components = await PCComponent.find(filter)
    .populate("shopListings.shop", "name location phone")
    .select("name brand category specs shopListings usageTags minBudgetTier cores vramGb ramCapacityGb storageCapacityGb wattage imageUrl")
    .sort({ "shopListings.price": 1 })
    .limit(5)
    .lean();

  return components;
}

async function queryShops(params: Record<string, string>) {
  const filter: Record<string, unknown> = {};
  if (params.name) filter.name = new RegExp(params.name, "i");
  if (params.location) filter.location = new RegExp(params.location, "i");

  const shops = await Shop.find(filter)
    .select("name location rating website phone")
    .sort({ rating: -1 })
    .limit(5)
    .lean();

  return shops;
}

const RESPONSE_SYSTEM = `You are Dhaka AI — a smart, friendly city guide for Dhaka, Bangladesh.
You have access to a real database of hospitals, doctors, restaurants, places, bus routes, PC components, and shops in Dhaka.

When given database results, synthesize them into a helpful, conversational response.
- Be concise but informative
- Format using markdown (bold for names, bullet lists for multiple items)
- Include practical details: ratings, contact info, addresses, fees
- If no results found, suggest alternatives or what the user can try
- Always respond in the same language as the user (Bengali or English)
- Never make up data — only use what's provided
- Add relevant emojis sparingly for readability`;

async function generateResponse(
  userMessage: string,
  intent: string,
  dbResults: unknown,
  conversationHistory: { role: "user" | "assistant"; content: string }[]
) {
  // Handle special fallback from queryDoctors
  let contextMsg = "";
  if (dbResults && typeof dbResults === "object" && "__fallback" in dbResults && dbResults.__fallback === "hospital") {
    const hospital = (dbResults as any).hospital;
    contextMsg = `No doctors found, but here is hospital info: ${JSON.stringify(hospital, null, 2)}. Suggest the user contact the hospital directly.`;
  } else {
    contextMsg =
      dbResults && (Array.isArray(dbResults) ? (dbResults as unknown[]).length > 0 : true)
        ? `Database results for intent "${intent}":\n${JSON.stringify(dbResults, null, 2)}`
        : `No database results found for intent "${intent}". Let the user know and offer alternatives.`;
  }

  const messages = [
    ...conversationHistory.slice(-6),
    {
      role: "user" as const,
      content: `User message: "${userMessage}"\n\n${contextMsg}`,
    },
  ];

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: RESPONSE_SYSTEM }, ...messages],
    max_tokens: 1024,
    temperature: 0.7,
  });

  return res.choices[0]?.message?.content ?? "I couldn't generate a response. Please try again.";
}

export async function askDhakaAI(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<DhakaAIResult> {
  if (!message?.trim()) {
    return { reply: "Please type a message.", intent: "general", resultsCount: 0 };
  }

  return withRetry(
    async () => {
      await dbConnect();

      const { intent, params } = await classifyIntent(message);

      let dbResults: unknown = null;
      switch (intent) {
        case "hospital":
          dbResults = await queryHospitals(params);
          break;
        case "doctor":
          dbResults = await queryDoctors(params);
          break;
        case "restaurant":
          dbResults = await queryRestaurants(params);
          break;
        case "place":
          dbResults = await queryPlaces(params);
          break;
        case "bus":
          dbResults = await queryBus(params);
          break;
        case "pc_component":
          dbResults = await queryPCComponents(params);
          break;
        case "shop":
          dbResults = await queryShops(params);
          break;
        default:
          dbResults = null;
      }

      const reply = await generateResponse(message, intent, dbResults, history);

      return {
        reply,
        intent,
        resultsCount: Array.isArray(dbResults) ? dbResults.length : dbResults ? 1 : 0,
      };
    },
    2,
    300
  ).catch((err) => {
    console.error("Dhaka AI fatal error after retries:", err);
    return {
      reply: "I'm having trouble connecting to the city database right now. Please try again in a moment.",
      intent: "general",
      resultsCount: 0,
    };
  });
}
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

  if (params.area) {
    const hospitals = await Hospital.find({
      "address.area": new RegExp(params.area, "i"),
      isActive: true,
    }).select("_id").lean();
    if (hospitals.length) {
      const hospitalIds = hospitals.map(h => h._id);
      const postings = await DoctorHospital.find({
        hospital: { $in: hospitalIds },
        isActive: true,
      }).select("doctor").lean();
      doctorIds = postings.map(p => p.doctor);
      if (!doctorIds.length) return [];
    } else {
      return [];
    }
  }

  if (params.hospital) {
    const hospitals = await Hospital.find({
      name: new RegExp(params.hospital, "i"),
      isActive: true,
    }).select("_id").lean();
    if (hospitals.length) {
      const hospitalIds = hospitals.map(h => h._id);
      const postings = await DoctorHospital.find({
        hospital: { $in: hospitalIds },
        isActive: true,
      }).select("doctor").lean();
      const ids = postings.map(p => p.doctor);
      if (doctorIds) {
        doctorIds = doctorIds.filter(id => ids.some(did => did.equals(id)));
      } else {
        doctorIds = ids;
      }
      if (!doctorIds || !doctorIds.length) return [];
    } else {
      return [];
    }
  }

  if (params.name) {
    const doctorsByName = await Doctor.find({
      name: new RegExp(params.name, "i"),
      isActive: true,
    }).select("_id").lean();
    const doctorIdsByName = doctorsByName.map(d => d._id);
    if (doctorIdsByName.length) {
      if (doctorIds) {
        doctorIds = doctorIds.filter(id => doctorIdsByName.some(did => did.equals(id)));
      } else {
        doctorIds = doctorIdsByName;
      }
    } else {
      const hospitals = await Hospital.find({
        name: new RegExp(params.name, "i"),
        isActive: true,
      }).select("_id").lean();
      if (hospitals.length) {
        const hospitalIds = hospitals.map(h => h._id);
        const postings = await DoctorHospital.find({
          hospital: { $in: hospitalIds },
          isActive: true,
        }).select("doctor").lean();
        const ids = postings.map(p => p.doctor);
        if (doctorIds) {
          doctorIds = doctorIds.filter(id => ids.some(did => did.equals(id)));
        } else {
          doctorIds = ids;
        }
        if (!doctorIds || !doctorIds.length) return [];
      } else {
        return [];
      }
    }
  }

  if (params.department) {
    filter.departments = { $in: [params.department] };
  }

  if (doctorIds && doctorIds.length) {
    filter._id = { $in: doctorIds };
  }

  const doctors = await Doctor.find(filter)
    .select("name departments designation qualifications speciality rating reviewCount gender profileImage")
    .sort({ rating: -1 })
    .limit(5)
    .lean();

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
  const contextMsg =
    dbResults && (Array.isArray(dbResults) ? (dbResults as unknown[]).length > 0 : true)
      ? `Database results for intent "${intent}":\n${JSON.stringify(dbResults, null, 2)}`
      : `No database results found for intent "${intent}". Let the user know and offer alternatives.`;

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
"use server";

import OpenAI from "openai";
import type { IPCComponentPopulated } from "@/actions/pcComponent.action";

const GROQ_MODEL = "llama-3.3-70b-versatile";

type AITool = "pc-build" | "doctor-suggestion" | "pc-compatibility";

export interface CompatibilityIssue {
	severity: "error" | "warning";
	component: string;
	issue: string;
	fix: string;
}

export interface CompatibilityResult {
	compatible: boolean;
	issues: CompatibilityIssue[];
	summary: string;
	totalEstimatedWattage: number;
	psuRecommendedWattage: number;
}

export interface DoctorSuggestion {
	department: string;
	severity: string;
	suggested_action: string;
	reason: string;
}

function getGroqClient(): OpenAI {
	const apiKey = process.env.GROQ_API_KEY;
	if (!apiKey) throw new Error("GROQ_API_KEY is not defined");
	return new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });
}

function getSystemPrompt(tool: AITool): string {
	const base =
		"You are a professional assistant. You must respond ONLY in valid JSON format with no extra text.";

	if (tool === "pc-build") {
		return `${base} You are a PC hardware expert. Analyze the user's requirements and return recommended minimum specs.
JSON structure: {
  "title": "string",
  "cpu_cores": number,
  "cpu_threads": number,
  "ram_gb": number,
  "vram_gb": number,
  "ssd_gb": number,
  "explanation": "string"
}`;
	}

	if (tool === "doctor-suggestion") {
		return `${base} You are a medical triage assistant. Identify the correct department based on symptoms.
JSON structure: {
  "department": "string",
  "severity": "Low | Medium | High",
  "suggested_action": "string",
  "reason": "string"
}`;
	}

	if (tool === "pc-compatibility") {
		return `${base} You are a PC hardware compatibility expert with deep knowledge of AMD and Intel platforms.

Your job is to analyze a PC build and detect ALL compatibility issues including:
- CPU socket vs Motherboard socket mismatch (e.g. AM4 CPU with LGA1700 motherboard)
- RAM generation mismatch (e.g. DDR4 RAM with DDR5 motherboard)
- Storage interface mismatch (e.g. NVMe_Gen4 SSD with a motherboard that only supports NVMe_Gen3 or SATA)
- PSU wattage being too low for the GPU + CPU TDP combination
- Any other critical compatibility issues

Rules:
- If socket field is missing from CPU or Motherboard, note it as a warning that compatibility cannot be verified
- If ramGeneration is missing from RAM or supportedRamGeneration is missing from Motherboard, flag as warning
- If storageInterface is missing, flag as warning
- Be strict: even a single socket mismatch is a hard error, the build will not POST

JSON structure: {
  "compatible": boolean,
  "issues": [
    {
      "severity": "error | warning",
      "component": "CPU | Motherboard | RAM | Storage | PSU | General",
      "issue": "short description of the problem",
      "fix": "what to replace or change to fix it"
    }
  ],
  "summary": "1-2 sentence overall verdict",
  "totalEstimatedWattage": number,
  "psuRecommendedWattage": number
}`;
	}

	return base;
}

export async function askAI<T = unknown>(
	tool: AITool,
	userInput: string,
): Promise<T> {
	const groq = getGroqClient();

	try {
		const completion = await groq.chat.completions.create({
			model: GROQ_MODEL,
			messages: [
				{ role: "system", content: getSystemPrompt(tool) },
				{ role: "user", content: userInput },
			],
			temperature: 0.1,
			response_format: { type: "json_object" },
		});

		const content = completion.choices[0]?.message?.content ?? "{}";
		return JSON.parse(content) as T;
	} catch {
		throw new Error("AI service failed. Please try again.");
	}
}

// ─── PC Compatibility Check ────────────────────────────────────────────────────

export async function checkBuildCompatibility(
	components: IPCComponentPopulated[],
): Promise<CompatibilityResult> {
	const cpu = components.find((c) => c.category === "CPU");
	const motherboard = components.find((c) => c.category === "Motherboard");
	const ram = components.find((c) => c.category === "RAM");
	const storage = components.find((c) => c.category === "Storage");
	const gpu = components.find((c) => c.category === "GPU");
	const psu = components.find((c) => c.category === "PSU");

	const buildSummary = {
		cpu: cpu
			? {
					name: cpu.name,
					socket: cpu.socket ?? "unknown",
					cores: cpu.cores,
					tdpWatt: cpu.tdpWatt,
				}
			: null,
		motherboard: motherboard
			? {
					name: motherboard.name,
					socket: motherboard.socket ?? "unknown",
					supportedRamGeneration:
						motherboard.supportedRamGeneration ?? "unknown",
					supportedStorageInterfaces:
						motherboard.supportedStorageInterfaces ?? [],
				}
			: null,
		ram: ram
			? {
					name: ram.name,
					ramGeneration: ram.ramGeneration ?? "unknown",
					ramCapacityGb: ram.ramCapacityGb,
				}
			: null,
		storage: storage
			? {
					name: storage.name,
					storageInterface: storage.storageInterface ?? "unknown",
					storageCapacityGb: storage.storageCapacityGb,
				}
			: null,
		gpu: gpu
			? {
					name: gpu.name,
					vramGb: gpu.vramGb,
					gpuTdpWatt: gpu.gpuTdpWatt,
				}
			: null,
		psu: psu
			? {
					name: psu.name,
					wattage: psu.wattage,
				}
			: null,
	};

	const prompt = `Check this PC build for compatibility issues:

${JSON.stringify(buildSummary, null, 2)}

Analyze all compatibility issues and return the result.`;

	const result = await askAI("pc-compatibility", prompt);

	// Type-safe cast with validation
	const raw = result as Record<string, unknown>;

	return {
		compatible: typeof raw.compatible === "boolean" ? raw.compatible : false,
		issues: Array.isArray(raw.issues)
			? (raw.issues as CompatibilityIssue[])
			: [],
		summary: typeof raw.summary === "string" ? raw.summary : "",
		totalEstimatedWattage:
			typeof raw.totalEstimatedWattage === "number"
				? raw.totalEstimatedWattage
				: 0,
		psuRecommendedWattage:
			typeof raw.psuRecommendedWattage === "number"
				? raw.psuRecommendedWattage
				: 0,
	};
}

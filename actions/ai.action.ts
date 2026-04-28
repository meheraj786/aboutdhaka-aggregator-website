"use server";

import OpenAI from "openai";

export async function askAI(
  tool: "pc-build" | "doctor-suggestion",
  userInput: string,
) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined in environment variables");
  }

  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const systemPrompt = getSystemPrompt(tool);

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch {
    console.error("AI Service Error:");
  }
}

function getSystemPrompt(tool: string): string {
  const base =
    "You are a professional assistant. You must respond ONLY in a valid JSON format.";

  if (tool === "pc-build") {
    return `${base} You are a PC expert. Analyze requirements and provide technical specs. JSON Structure: {"title": "string", "cpu_cores": number, "cpu_threads": number, "ram_gb": number, "vram_gb": number, "ssd_gb": number, "explanation": "string"}`;
  }

  if (tool === "doctor-suggestion") {
    return `${base} You are a medical triage assistant. Identify the correct department based on symptoms. JSON Structure: {"department": "string", "severity": "Low | Medium | High", "suggested_action": "string", "reason": "string"}`;
  }

  return base;
}

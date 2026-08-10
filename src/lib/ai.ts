import OpenAI from "openai";

// Inbuilt AI via local OpenAI-compatible gateway.
// Env overrides allow rotation without code change. Defaults match user-supplied creds.
export const AI_MODEL = process.env.AI_MODEL || "ag/gemini-3.6-flash-high";
export const AI_BASE_URL = process.env.AI_BASE_URL || "http://192.168.1.204:20128/v1";
export const AI_API_KEY = process.env.AI_API_KEY || "sk-65a365b37797b81f-0ffdg3-6a4378be";

let _client: OpenAI | null = null;

export function getAIClient(): OpenAI {
  if (_client) return _client;
  _client = new OpenAI({
    baseURL: AI_BASE_URL,
    apiKey: AI_API_KEY,
  });
  return _client;
}

// Prompt builder for deterministic research: LLM explains, engine decides.
// Keeps legal-safety: never ask LLM to re-evaluate eligibility, only to summarize/explain with citations.
export function buildResearchPrompt(opts: {
  companyName: string;
  projectTitle: string;
  city: string;
  state: string;
  trade: string;
  value: number;
  status: string;
  blockers: { label: string; reason: string; remediation: string }[];
  warnings: { label: string; reason: string }[];
  satisfied: string[];
  citations: { title: string; authority: string; url: string }[];
  reciprocity: string[];
  estimatedReadiness: string;
}) {
  const blockerText = opts.blockers.length
    ? opts.blockers.map((b, i) => `${i + 1}. ${b.label} — ${b.reason} → Fix: ${b.remediation}`).join("\n")
    : "None — ready to bid (no blockers).";
  const warningText = opts.warnings.length
    ? opts.warnings.map((w) => `- ${w.label}: ${w.reason}`).join("\n")
    : "None.";
  const citationsText = opts.citations.map((c) => `- ${c.title} (${c.authority}) — ${c.url}`).join("\n");
  return [
    `You are Gooner Research — an AI compliance explainer for specialty contractors (electrical/HVAC/fire-protection) in NC/SC/VA.`,
    `CRITICAL RULES:`,
    `- Do NOT make eligibility determinations. The deterministic rules engine has already decided: status = ${opts.status.toUpperCase()}. You only EXPLAIN, SUMMARIZE, and CITE.`,
    `- Always cite the official sources provided. Do not invent sources or URLs.`,
    `- Include a "Not legal advice" disclaimer.`,
    `- Keep tone crisp, ops-manager friendly. Use bullets.`,
    `- If reciprocity is available, call it out.`,
    ``,
    `CONTEXT:`,
    `Company: ${opts.companyName}`,
    `Project: ${opts.projectTitle} — ${opts.city}, ${opts.state} — ${opts.trade} — $${opts.value.toLocaleString()}`,
    `Engine status: ${opts.status.toUpperCase()} | Readiness: ${opts.estimatedReadiness}`,
    ``,
    `BLOCKERS (must fix before bid):`,
    blockerText,
    ``,
    `Warnings:`,
    warningText,
    ``,
    `Already satisfied: ${opts.satisfied.join(", ") || "none"}`,
    `Reciprocity opportunities: ${opts.reciprocity.join("; ") || "none"}`,
    ``,
    `AUTHORITATIVE SOURCES (cite these):`,
    citationsText,
    ``,
    `TASK: Write a short markdown briefing (<=220 words) with sections:`,
    `1) **Executive summary** (1-2 sentences, include status badge)`,
    `2) **What blocks this bid** (bullets, each with required authority cite)`,
    `3) **Fastest path to eligible** (ordered steps + lead-time hint)`,
    `4) **Sources** (bullet list of provided URLs)`,
    `End with: _Not legal advice — confirm with the issuing board before bidding._`,
  ].join("\n");
}

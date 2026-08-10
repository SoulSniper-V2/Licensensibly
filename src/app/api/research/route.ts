import { NextRequest } from "next/server";
import { getAIClient, AI_MODEL, buildResearchPrompt } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
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
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "content-type": "application/json" } });
  }
  const prompt = buildResearchPrompt({
    companyName: body.companyName || "Unknown Co",
    projectTitle: body.projectTitle || "Untitled",
    city: body.city || "",
    state: body.state || "NC",
    trade: body.trade || "electrical",
    value: Number(body.value) || 0,
    status: body.status || "conditional",
    blockers: body.blockers || [],
    warnings: body.warnings || [],
    satisfied: body.satisfied || [],
    citations: body.citations || [],
    reciprocity: body.reciprocity || [],
    estimatedReadiness: body.estimatedReadiness || "",
  });

  const streamRequested = req.headers.get("accept")?.includes("text/event-stream") || (body as any).stream !== false;

  try {
    const client = getAIClient();
    if (streamRequested) {
      const stream = await client.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: "system", content: "You are Gooner Research. You EXPLAIN compliance gaps with citations. You never decide eligibility — the engine already decided. Be concise, accurate, cite sources." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 900,
        stream: true,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const delta = chunk.choices?.[0]?.delta?.content || "";
              if (delta) controller.enqueue(encoder.encode(delta));
            }
          } catch (e: any) {
            controller.enqueue(encoder.encode(`\n\n[upstream error: ${e?.message || String(e)}]`));
          } finally {
            controller.close();
          }
        },
      });
      return new Response(readable, {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-cache",
          "x-gooner-model": AI_MODEL,
        },
      });
    } else {
      const res = await getAIClient().chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: "system", content: "You are Gooner Research. Explain compliance gaps with citations. Never decide eligibility." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 900,
      });
      const text = res.choices[0]?.message?.content || "";
      return new Response(JSON.stringify({ text, model: AI_MODEL }), { headers: { "content-type": "application/json" } });
    }
  } catch (err: any) {
    const msg = err?.message || String(err);
    // graceful fallback: return deterministic summary so UI never blanks
    return new Response(JSON.stringify({ error: msg, fallback: true }), { status: 502, headers: { "content-type": "application/json" } });
  }
}

import { NextRequest } from "next/server";
import { getAIClient, AI_MODEL } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Generic chat proxy for floating assistant. Keeps key server-side.
export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "content-type": "application/json" } }); }
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = body.messages || [];
  const systemPreamble = `You are Gooner — the inbuilt AI for the Pre-Bid Compliance OS (the app is called Gooner). You help specialty contractors (electrical/HVAC/fire-protection) decide if they can legally bid jobs in NC/SC/VA. You EXPLAIN rules and cite official sources; the deterministic engine DECIDES eligibility. Never hallucinate license URLs — if unsure, say to verify with the NCBEEC / NC Licensing Board / SC LLR / VA DPOR. Keep answers short and ops-friendly. Not legal advice.`;
  // Ensure system is first
  const merged = [{ role: "system" as const, content: systemPreamble }, ...messages.filter((m: any) => m.role !== "system")];

  const wantsStream = req.headers.get("accept")?.includes("text/event-stream") || body.stream !== false;

  try {
    const client = getAIClient();
    if (wantsStream) {
      const stream = await client.chat.completions.create({
        model: AI_MODEL,
        messages: merged,
        temperature: 0.4,
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
          } finally { controller.close(); }
        },
      });
      return new Response(readable, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-cache", "x-gooner-model": AI_MODEL } });
    } else {
      const res = await client.chat.completions.create({ model: AI_MODEL, messages: merged, temperature: 0.4, max_tokens: 900 });
      const text = res.choices[0]?.message?.content || "";
      return new Response(JSON.stringify({ text, model: AI_MODEL }), { headers: { "content-type": "application/json" } });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 502, headers: { "content-type": "application/json" } });
  }
}

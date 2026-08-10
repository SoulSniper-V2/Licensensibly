"use client";
import { useEffect, useRef, useState } from "react";
import type { EligibilityResult } from "@/lib/types";

export default function AIResearchPanel({ result, city, state, trade, value }: { result: EligibilityResult; city: string; state: string; trade: string; value: number }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    setText("");

    const payload = {
      companyName: result.company.legalName,
      projectTitle: result.project.title,
      city,
      state,
      trade,
      value,
      status: result.status,
      blockers: result.blockers.map(b => ({ label: b.requirement.label, reason: b.reason, remediation: b.remediation })),
      warnings: result.warnings.map(w => ({ label: w.requirement.label, reason: w.reason })),
      satisfied: result.satisfied.map(s => s.label),
      citations: result.citations.map(c => ({ title: c.title, authority: c.authority, url: c.url })),
      reciprocity: result.reciprocityOpportunities.map(r => `${r.requirement.label} via ${r.canUse.state} ${r.canUse.licenseNumber} — ${r.note}`),
      estimatedReadiness: result.estimatedReadiness.label,
    };

    (async () => {
      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "content-type": "application/json", accept: "text/plain" },
          body: JSON.stringify(payload),
          signal: ac.signal,
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Research upstream ${res.status}`);
        }
        const reader = res.body?.getReader();
        if (!reader) {
          const t = await res.text();
          if (!ac.signal.aborted) setText(t);
          return;
        }
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value: chunk } = await reader.read();
          if (done) break;
          acc += decoder.decode(chunk, { stream: true });
          if (!ac.signal.aborted) setText(acc);
        }
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message || String(e));
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [result, city, state, trade, value]);

  // simple markdown-ish rendering: bold, bullets, links
  function renderMarkdown(s: string) {
    // very light: split lines, handle **bold**, [text](url), bullets
    const lines = s.split("\n");
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      // headings
      if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-black mt-3">{line.slice(4)}</h4>;
      if (line.startsWith("## ")) return <h4 key={i} className="text-sm font-black mt-3">{line.slice(3)}</h4>;
      if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.")) {
        return <div key={i} className="text-sm leading-relaxed ml-4 list-decimal">{formatInline(line)}</div>;
      }
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return <div key={i} className="text-sm leading-relaxed ml-4">• {formatInline(line.trim().slice(2))}</div>;
      }
      return <p key={i} className="text-sm leading-relaxed">{formatInline(line)}</p>;
    });
  }

  function formatInline(s: string) {
    // handle **bold** and links
    const parts: any[] = [];
    let last = 0;
    const re = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    let m: RegExpExecArray | null;
    let idx = 0;
    while ((m = re.exec(s))) {
      if (m.index > last) parts.push(<span key={idx++}>{s.slice(last, m.index)}</span>);
      const token = m[0];
      if (token.startsWith("**")) {
        parts.push(<strong key={idx++} className="font-bold text-slate-900">{token.slice(2, -2)}</strong>);
      } else {
        const lm = token.match(/\[(.*?)\]\((.*?)\)/);
        if (lm) parts.push(<a key={idx++} href={lm[2]} target="_blank" className="underline text-sky-700">{lm[1]}</a>);
        else parts.push(<span key={idx++}>{token}</span>);
      }
      last = m.index + token.length;
    }
    if (last < s.length) parts.push(<span key={idx++}>{s.slice(last)}</span>);
    return parts.length ? <>{parts}</> : s;
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-black">AINSIDE — Regulatory research</h3>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-800">ag/gemini-3.6-flash-high</span>
        {loading && <span className="ml-auto text-xs text-slate-500 animate-pulse">Researching…</span>}
        {!loading && !error && text && <span className="ml-auto text-xs text-emerald-600">● live via AINSIDE</span>}
      </div>
      <p className="text-xs text-slate-600 mt-1">Deterministic engine decided <span className="font-black uppercase">{result.status}</span> — AINSIDE explains & cites. No filing in v1.</p>

      <div className="mt-3 min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 p-4">
        {loading && !text && <div className="text-sm text-slate-500">Asking AINSIDE at {process.env.NEXT_PUBLIC_AI_BASE_URL || "http://192.168.1.204:20128/v1"}… <span className="inline-block w-2 h-2 bg-slate-400 rounded-full animate-bounce" /></div>}
        {error && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-amber-900">AINSIDE unreachable — showing deterministic fallback.</div>
            <div className="text-xs text-slate-600">{error}</div>
            <div className="rounded-lg bg-white border border-slate-200 p-3 text-sm leading-relaxed text-slate-700">
              For a <strong>${value.toLocaleString()} {trade}</strong> job in <strong>{city}, {state}</strong>, the engine extracted <strong>{result.satisfied.length + result.blockers.length} requirements</strong> and determined <strong className="uppercase">{result.status}</strong>. Primary blocker: <strong>{result.blockers[0]?.requirement.label || "none — ready to bid"}</strong>. Reciprocity {result.reciprocityOpportunities.length ? "available via " + result.reciprocityOpportunities[0].canUse.state : "not available"}.
              <div className="mt-2 text-xs text-slate-500">Sources: {result.citations.slice(0, 2).map(c => c.authority).join(" & ")} • Verified 2026-08-01</div>
            </div>
          </div>
        )}
        {!error && text && <div className="space-y-1">{renderMarkdown(text)}</div>}
        {!error && !loading && !text && <div className="text-xs text-slate-500">No output.</div>}
      </div>
      <div className="mt-2 text-[11px] text-slate-500">Model: <span className="font-mono">ag/gemini-3.6-flash-high</span> via <span className="font-mono">http://192.168.1.204:20128/v1</span> • Key server-side only. Streaming. Not legal advice.</div>
    </div>
  );
}

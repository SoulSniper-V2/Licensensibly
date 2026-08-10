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
      city, state, trade, value,
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
        const res = await fetch("/api/research", { method: "POST", headers: { "content-type": "application/json", accept: "text/plain" }, body: JSON.stringify(payload), signal: ac.signal });
        if (!res.ok) { const j = await res.json().catch(()=>({})); throw new Error(j.error || `Research upstream ${res.status}`); }
        const reader = res.body?.getReader();
        if (!reader) { const t = await res.text(); if (!ac.signal.aborted) setText(t); return; }
        const decoder = new TextDecoder(); let acc = "";
        while (true) { const { done, value: chunk } = await reader.read(); if (done) break; acc += decoder.decode(chunk, { stream: true }); if (!ac.signal.aborted) setText(acc); }
      } catch (e: any) { if (e?.name === "AbortError") return; setError(e?.message || String(e)); } finally { if (!ac.signal.aborted) setLoading(false); }
    })();
    return () => ac.abort();
  }, [result, city, state, trade, value]);

  function renderMarkdown(s: string) {
    return s.split("\n").map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      if (line.startsWith("### ") || line.startsWith("## ")) return <h4 key={i} className="text-sm font-bold mt-3">{line.replace(/^#+\s/, "")}</h4>;
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) return <div key={i} className="text-sm leading-relaxed ml-4 text-zinc-700">• {formatInline(line.trim().slice(2))}</div>;
      if (/^\d+\./.test(line.trim())) return <div key={i} className="text-sm leading-relaxed ml-4 text-zinc-700">{formatInline(line)}</div>;
      return <p key={i} className="text-sm leading-relaxed text-zinc-700">{formatInline(line)}</p>;
    });
  }
  function formatInline(s: string) {
    const parts: any[] = []; let last = 0; const re = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g; let m: RegExpExecArray | null; let idx=0;
    while ((m = re.exec(s))) {
      if (m.index > last) parts.push(<span key={idx++}>{s.slice(last, m.index)}</span>);
      const token = m[0];
      if (token.startsWith("**")) parts.push(<strong key={idx++} className="font-semibold text-zinc-900 dark:text-zinc-100">{token.slice(2,-2)}</strong>);
      else { const lm = token.match(/\[(.*?)\]\((.*?)\)/); if (lm) parts.push(<a key={idx++} href={lm[2]} target="_blank" className="underline text-sky-700">{lm[1]}</a>); else parts.push(<span key={idx++}>{token}</span>); }
      last = m.index + token.length;
    }
    if (last < s.length) parts.push(<span key={idx++}>{s.slice(last)}</span>);
    return parts.length ? <>{parts}</> : s;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50">
        <span className="h-2 w-2 rounded-full bg-white dark:bg-zinc-9000 animate-pulse" />
        <h3 className="mono text-xs tracking-[0.14em] font-semibold">AINSIDE — REGULATORY RESEARCH</h3>
        <span className="mono text-[11px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-full px-2 py-0.5 text-zinc-500 dark:text-zinc-400">ag/gemini-3.6-flash-high</span>
        {loading && <span className="ml-auto mono text-xs text-zinc-500 dark:text-zinc-400 animate-pulse">Researching…</span>}
        {!loading && !error && text && <span className="ml-auto mono text-xs text-emerald-600">● live</span>}
      </div>
      <div className="px-5 py-2 mono text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-100">Engine decided <span className="text-zinc-900 dark:text-zinc-100 font-semibold uppercase">{result.status}</span> — AINSIDE explains and cites.</div>
      <div className="p-5 min-h-[140px] bg-white dark:bg-zinc-900">
        {loading && !text && <div className="mono text-sm text-zinc-500 dark:text-zinc-400">Asking AINSIDE… <span className="inline-block w-2 h-2 bg-zinc-300 rounded-full animate-bounce" /></div>}
        {error && (
          <div className="space-y-3">
            <div className="mono text-sm font-medium text-amber-800 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3">AINSIDE unreachable — showing deterministic fallback.</div>
            <div className="mono text-xs text-zinc-500 dark:text-zinc-400 break-all">{error}</div>
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 text-sm leading-relaxed text-zinc-700">
              For a <span className="font-semibold">${value.toLocaleString()} {trade}</span> job in <span className="font-semibold">{city}, {state}</span>, engine determined <span className="font-semibold uppercase">{result.status}</span>. Primary blocker: <span className="font-semibold">{result.blockers[0]?.requirement.label || "none — ready to bid"}</span>.
              <div className="mono text-xs text-zinc-500 dark:text-zinc-400 mt-2">Sources: {result.citations.slice(0,2).map(c=>c.authority).join(" • ")} • Verified 2026-08-01</div>
            </div>
          </div>
        )}
        {!error && text && <div className="space-y-1">{renderMarkdown(text)}</div>}
        {!error && !loading && !text && <div className="mono text-xs text-zinc-400">No output.</div>}
      </div>
      <div className="px-5 py-2 bg-zinc-50 border-t border-zinc-200 dark:border-zinc-800 mono text-[11px] text-zinc-500 dark:text-zinc-400">Model ag/gemini-3.6-flash-high via http://192.168.1.204:20128/v1 • Streaming • Not legal advice</div>
    </div>
  );
}

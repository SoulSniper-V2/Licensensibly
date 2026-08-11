"use client";
import { useEffect, useRef, useState } from "react";
import type { EligibilityResult } from "@/lib/types";
import { Sparkle, ArrowSquareOut } from "@phosphor-icons/react";

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
      if (line.startsWith("### ") || line.startsWith("## ")) return <h4 key={i} className="text-[13px] font-bold mt-3 text-[var(--ink)]">{line.replace(/^#+\s/, "")}</h4>;
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) return <div key={i} className="text-[13px] leading-relaxed ml-4 text-[var(--muted)]">· {formatInline(line.trim().slice(2))}</div>;
      if (/^\d+\./.test(line.trim())) return <div key={i} className="text-[13px] leading-relaxed ml-4 text-[var(--muted)]">{formatInline(line)}</div>;
      return <p key={i} className="text-[13px] leading-relaxed text-[var(--ink)]">{formatInline(line)}</p>;
    });
  }
  function formatInline(s: string) {
    const parts: any[] = []; let last = 0; const re = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g; let m: RegExpExecArray | null; let idx=0;
    while ((m = re.exec(s))) {
      if (m.index > last) parts.push(<span key={idx++}>{s.slice(last, m.index)}</span>);
      const token = m[0];
      if (token.startsWith("**")) parts.push(<strong key={idx++} className="font-semibold text-[var(--ink)]">{token.slice(2,-2)}</strong>);
      else { const lm = token.match(/\[(.*?)\]\((.*?)\)/); if (lm) parts.push(<a key={idx++} href={lm[2]} target="_blank" className="underline decoration-[var(--border-2)] underline-offset-2 text-sky-700 dark:text-sky-300 hover:text-sky-800">{lm[1]}</a>); else parts.push(<span key={idx++}>{token}</span>); }
      last = m.index + token.length;
    }
    if (last < s.length) parts.push(<span key={idx++}>{s.slice(last)}</span>);
    return parts.length ? <>{parts}</> : s;
  }

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-soft">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
        <span className={`h-2 w-2 rounded-full ${loading ? "bg-amber-400 animate-pulse" : error ? "bg-[var(--accent)]" : "bg-[var(--success)]"}`} />
        <h3 className="mono text-[11px] tracking-[0.14em] font-semibold flex items-center gap-1.5"><Sparkle size={12} weight="fill" className="text-[var(--muted)]"/> AINSIDE — RESEARCH</h3>
        <span className="mono text-[10px] border border-[var(--border)] bg-[var(--surface)] rounded-full px-2 py-0.5 text-[var(--muted)]">ag/gemini-3.6-flash-high</span>
        {loading && <span className="ml-auto mono text-[11px] text-[var(--muted)] animate-pulse">Researching…</span>}
        {!loading && !error && text && <span className="ml-auto inline-flex items-center gap-1 mono text-[11px] font-medium text-[var(--success)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]"/> live</span>}
      </div>
      <div className="px-5 py-2.5 mono text-[11px] text-[var(--muted)] border-b border-[var(--border)]/60 bg-[var(--surface)]">Engine decided <span className="text-[var(--ink)] font-semibold uppercase tracking-wide">{result.status}</span> — AINSIDE explains and cites.</div>
      <div className="p-5 min-h-[140px]">
        {loading && !text && <div className="mono text-[13px] text-[var(--muted)] flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--border-2)] animate-pulse"/> Asking AINSIDE…</div>}
        {error && (
          <div className="space-y-3">
            <div className="mono text-[12px] font-medium text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2.5">AINSIDE unreachable — showing deterministic fallback.</div>
            <div className="mono text-[11px] text-[var(--muted-2)] break-all border border-[var(--border)] rounded-xl px-3 py-2 bg-[var(--surface-2)]/50">{error}</div>
            <div className="rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] p-4 text-[13px] leading-relaxed">
              For a <span className="font-semibold">${value.toLocaleString()} {trade}</span> job in <span className="font-semibold">{city}, {state}</span>, engine determined <span className="font-semibold uppercase">{result.status}</span>. Primary blocker: <span className="font-semibold">{result.blockers[0]?.requirement.label || "none — ready to bid"}</span>.
              <div className="mono text-[11px] text-[var(--muted)] mt-2">Sources: {result.citations.slice(0,2).map(c=>c.authority).join(" · ")} · Verified 2026-08-01</div>
            </div>
          </div>
        )}
        {!error && text && <div className="space-y-1">{renderMarkdown(text)}</div>}
        {!error && !loading && !text && <div className="mono text-[11px] text-[var(--muted-2)]">No output.</div>}
      </div>
      <div className="px-5 py-2.5 bg-[var(--surface-2)] border-t border-[var(--border)] mono text-[10px] tracking-wide text-[var(--muted-2)] flex items-center gap-1.5">
        <span>Model ag/gemini-3.6-flash-high · Streaming · Not legal advice</span>
        <ArrowSquareOut size={10} className="ml-auto opacity-50"/>
      </div>
    </div>
  );
}

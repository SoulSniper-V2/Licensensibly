"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ONBOARDING_STEPS, getOnboardingProgress } from "@/lib/onboarding";
import { Check, ArrowRight } from "@phosphor-icons/react";

const STORAGE_KEY = "licensensibly_onboarding_dismissed";
const COMPLETED_KEY = "licensensibly_onboarding_completed";

export default function OnboardingPanel() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
      const c = JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]");
      if (Array.isArray(c)) setCompleted(c);
    } catch {}
  }, []);

  function dismiss() {
    setDismissed(true);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  }
  function reopen() {
    setDismissed(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }
  function toggleStep(id: string) {
    setCompleted(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem(COMPLETED_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }
  function reset() {
    setCompleted([]);
    try { localStorage.removeItem(COMPLETED_KEY); } catch {}
  }

  const { done, total, pct } = getOnboardingProgress(completed);

  if (dismissed) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-3 flex justify-end">
        <button onClick={reopen} className="mono text-[11px] tracking-wide border border-[var(--border)] bg-[var(--surface)] rounded-full px-3.5 py-1.5 hover:bg-[var(--surface-2)] font-medium">
          Show onboarding — {done}/{total} done
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-8">
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-soft">
        <div className="px-6 md:px-8 py-6 flex flex-wrap gap-4 items-start justify-between border-b border-[var(--border)] bg-[var(--surface-2)]/40">
          <div className="max-w-[60ch]">
            <div className="inline-flex items-center gap-2 mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" /> ONBOARDING — START HERE
              <span className="hidden sm:inline font-normal text-[var(--muted-2)]">· auto-updates when features ship</span>
            </div>
            <h2 className="mt-2 text-[18px] md:text-[20px] font-bold tracking-[-0.02em]">Every step to use Licensensibly</h2>
            <p className="mt-1.5 mono text-[12px] leading-relaxed text-[var(--muted)]">
              Follow in order. Each step links to where you do it. Check it off when tried — saves locally.
              <span className="font-semibold text-[var(--ink)]"> Adding a feature? Just add it to <code className="bg-[var(--surface)] border border-[var(--border)] rounded px-1 py-0.5 mono text-[11px]">ONBOARDING_STEPS</code>.</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] font-medium text-[var(--muted)]">{done}/{total} · {pct}%</span>
              <div className="w-28 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                <div className="h-full bg-[var(--ink)] transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setExpanded(v => !v)} className="mono text-[11px] font-medium border border-[var(--border)] rounded-full px-3 py-1.5 bg-[var(--surface)] hover:bg-[var(--surface-2)]">
                {expanded ? "Collapse" : "Expand"}
              </button>
              <button onClick={reset} className="mono text-[11px] font-medium border border-[var(--border)] rounded-full px-3 py-1.5 bg-[var(--surface)] hover:bg-[var(--surface-2)]">Reset</button>
              <button onClick={dismiss} className="mono text-[11px] font-semibold bg-[var(--ink)] text-white dark:bg-white dark:text-black rounded-full px-3 py-1.5 hover:opacity-90">Dismiss</button>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ONBOARDING_STEPS.map((s, i) => {
                const isDone = completed.includes(s.id);
                return (
                  <div key={s.id} className={`rounded-[20px] border p-5 flex flex-col gap-3 transition-all hover:shadow-sm ${isDone ? "bg-[var(--ink)] text-white dark:bg-white dark:text-black border-[var(--ink)] dark:border-white" : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-2)]"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center mono text-[11px] font-bold shrink-0 ${isDone ? "bg-white text-black dark:bg-black dark:text-white" : "bg-[var(--ink)] text-white dark:bg-white dark:text-black"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <button
                        onClick={() => toggleStep(s.id)}
                        className={`inline-flex items-center gap-1 mono text-[11px] font-medium tracking-wide rounded-full px-2.5 py-1 border transition-colors ${isDone ? "bg-white text-black border-white dark:bg-black dark:text-white dark:border-black" : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-2)]"}`}
                      >
                        {isDone ? <><Check size={10} weight="bold"/> Done</> : "Mark done"}
                      </button>
                    </div>
                    <h3 className={`text-[13px] font-bold leading-tight ${isDone ? "text-white dark:text-black" : ""}`}>{s.title}</h3>
                    <p className={`mono text-[11px] leading-relaxed ${isDone ? "text-white/70 dark:text-black/60" : "text-[var(--muted)]"}`}>{s.description}</p>
                    <p className={`mono text-[11px] leading-relaxed ${isDone ? "text-white/50 dark:text-black/40" : "text-[var(--muted-2)]"}`}>{s.details}</p>
                    <Link href={s.href} className={`mt-auto inline-flex items-center gap-1 mono text-[11px] font-semibold ${isDone ? "text-white dark:text-black underline decoration-white/30 dark:decoration-black/20" : "text-[var(--ink)] underline decoration-[var(--border-2)] underline-offset-4 hover:decoration-[var(--ink)]"}`}>
                      {s.action} <ArrowRight size={11} weight="bold"/>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="mono text-[11px] leading-relaxed text-[var(--muted)]">
                <span className="font-semibold text-[var(--ink)]">Keep it updated:</span> add to <code className="bg-[var(--surface)] border border-[var(--border)] rounded px-1">ONBOARDING_STEPS</code> — progress and copy update automatically.
              </div>
              <Link href="/check" className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] text-white dark:bg-white dark:text-black mono text-[11px] font-semibold px-4 py-2 hover:opacity-90">Start at Check <ArrowRight size={12} weight="bold"/></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

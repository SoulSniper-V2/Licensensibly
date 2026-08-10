"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ONBOARDING_STEPS, getOnboardingProgress } from "@/lib/onboarding";

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
      <div className="mx-auto max-w-[1200px] px-6 py-3 flex justify-end">
        <button onClick={reopen} className="mono text-xs tracking-wide border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-full px-3 py-1 hover:bg-white dark:bg-zinc-900">
          Show onboarding — {done}/{total} done
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        {/* header — airier like freebuff */}
        <div className="px-6 md:px-8 py-6 flex flex-wrap gap-4 items-start justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="max-w-[62ch]">
            <div className="inline-flex items-center gap-2 mono text-[11px] tracking-[0.14em] text-zinc-900 dark:text-zinc-100">
              <span className="h-2 w-2 rounded-full bg-white dark:bg-zinc-900 animate-pulse" /> ONBOARDING — START HERE
              <span className="hidden sm:inline">• auto-updates when new features ship</span>
            </div>
            <h2 className="mt-2 text-xl md:text-2xl font-bold tracking-tight">Every step to use Licensensibly</h2>
            <p className="mt-2 mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Follow in order. Each step links to the real page where you do it. Check a box when you have tried it — progress saves locally.
              <span className="font-semibold text-zinc-900 dark:text-zinc-100"> Adding a new feature? Just add it to <code className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-1">ONBOARDING_STEPS</code> in <code className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-1">src/lib/onboarding.ts</code> — this panel updates automatically.</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <span className="mono text-xs text-zinc-500 dark:text-zinc-400">{done}/{total} • {pct}%</span>
              <div className="w-28 h-2 rounded-full bg-zinc-200 overflow-hidden">
                <div className="h-full bg-zinc-900 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setExpanded(v => !v)} className="mono text-xs border border-zinc-200 dark:border-zinc-800 rounded-full px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-white dark:bg-zinc-900">
                {expanded ? "Collapse" : "Expand"}
              </button>
              <button onClick={reset} className="mono text-xs border border-zinc-200 dark:border-zinc-800 rounded-full px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-white dark:bg-zinc-900">Reset</button>
              <button onClick={dismiss} className="mono text-xs bg-zinc-900 text-white rounded-full px-3 py-1.5 hover:bg-zinc-900">Dismiss</button>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="p-6 md:p-8">
            {/* airier grid — not compacted: p-8 gap-6 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ONBOARDING_STEPS.map((s, i) => {
                const isDone = completed.includes(s.id);
                return (
                  <div key={s.id} className={`rounded-2xl border p-6 flex flex-col gap-3 hover:shadow-md transition-shadow ${isDone ? "bg-zinc-900 text-white border-zinc-900" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center mono text-xs font-bold shrink-0 ${isDone ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100" : "bg-zinc-900 text-white"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <button
                        onClick={() => toggleStep(s.id)}
                        className={`mono text-[11px] tracking-wide rounded-full px-2.5 py-1 border ${isDone ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-white" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"}`}
                      >
                        {isDone ? "✓ Done" : "Mark done"}
                      </button>
                    </div>
                    <h3 className={`text-sm font-bold leading-tight ${isDone ? "text-white" : "text-zinc-900 dark:text-zinc-100"}`}>{s.title}</h3>
                    <p className={`mono text-xs leading-relaxed ${isDone ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}`}>{s.description}</p>
                    <p className={`mono text-[11px] leading-relaxed ${isDone ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>{s.details}</p>
                    <Link href={s.href} className={`mt-auto mono text-xs font-semibold inline-flex items-center gap-1 ${isDone ? "text-white underline decoration-white/30" : "text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300"}`}>
                      {s.action}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="mono text-xs text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">How to keep it updated:</span> add a new entry to <code className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-1">ONBOARDING_STEPS</code> — panel, progress, and this copy update automatically. No manual sync.
              </div>
              <Link href="/check" className="rounded-full bg-zinc-900 text-white mono text-xs font-semibold px-4 py-2 hover:bg-zinc-900">Start at Check →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

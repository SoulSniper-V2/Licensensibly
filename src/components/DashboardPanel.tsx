"use client";
import { MOCK_PROJECTS, MOCK_COMPANIES } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import { Buildings, FolderOpen, SealCheck, Warning, XCircle } from "@phosphor-icons/react";

export default function DashboardPanel() {
  let eligible = 0, conditional = 0, blocked = 0;
  for (const c of MOCK_COMPANIES) {
    for (const p of MOCK_PROJECTS) {
      const r = evaluateEligibility(c, p);
      if (r.status === "eligible") eligible++;
      else if (r.status === "conditional") conditional++;
      else blocked++;
    }
  }
  const total = eligible + conditional + blocked;

  const kpis = [
    { label: "Portfolio checks", value: total, sub: "Companies × projects", icon: FolderOpen, tone: "ink" as const },
    { label: "Eligible", value: eligible, sub: "Ready to bid", icon: SealCheck, tone: "good" as const },
    { label: "Conditional", value: conditional, sub: "Fix to bid", icon: Warning, tone: "warn" as const },
    { label: "Blocked", value: blocked, sub: "Not eligible", icon: XCircle, tone: "bad" as const },
  ];

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-8 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Buildings size={16} weight="regular" className="text-[var(--muted)]" />
        <h2 className="text-[13px] font-bold tracking-[-0.01em]">Live portfolio</h2>
        <span className="mono text-[11px] text-[var(--muted)] hidden sm:inline">· Deterministic checks across all mock companies</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-3 hover:border-[var(--border-2)] hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] tracking-wide font-medium text-[var(--muted)]">{k.label}</span>
                <span className={`h-7 w-7 rounded-full flex items-center justify-center border ${
                  k.tone==="good" ? "bg-[var(--success-soft)] border-emerald-200 text-[var(--success)]" :
                  k.tone==="warn" ? "bg-[var(--warn-soft)] border-amber-200 text-[var(--warn)]" :
                  k.tone==="bad" ? "bg-[var(--accent-soft)] border-red-200 text-[var(--accent)]" :
                  "bg-[var(--surface-2)] border-[var(--border)] text-[var(--muted)]"
                }`}>
                  <Icon size={14} weight={k.tone==="ink"?"regular":"fill"} />
                </span>
              </div>
              <div>
                <div className={`text-[28px] font-bold tracking-[-0.03em] leading-none ${
                  k.tone==="good" ? "text-[var(--success)]" :
                  k.tone==="warn" ? "text-[var(--warn)]" :
                  k.tone==="bad" ? "text-[var(--accent)]" :
                  "text-[var(--ink)]"
                }`}>{k.value}</div>
                <div className="mono text-[11px] text-[var(--muted)] mt-1">{k.sub}</div>
              </div>
              {k.tone!=="ink" && total>0 && (
                <div className="h-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${k.tone==="good"?"bg-[var(--success)]": k.tone==="warn"?"bg-[var(--warn)]":"bg-[var(--accent)]"}`} style={{width: `${total? Math.round(k.value/total*100):0}%`}}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

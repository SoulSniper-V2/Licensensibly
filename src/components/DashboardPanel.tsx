"use client";
import { MOCK_PROJECTS, MOCK_COMPANIES } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import {
  Buildings, FolderOpen, CheckCircle, Warning, XCircle,
} from "@phosphor-icons/react";

export default function DashboardPanel() {
  // Aggregate KPIs across all mock companies x projects
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
    { label: "Portfolio checks", value: total, icon: FolderOpen, tone: "default" },
    { label: "Eligible", value: eligible, icon: CheckCircle, tone: "good" },
    { label: "Conditional", value: conditional, icon: Warning, tone: "warn" },
    { label: "Blocked", value: blocked, icon: XCircle, tone: "bad" },
  ];

  const toneMap: Record<string, string> = {
    good: "text-emerald-600 dark:text-emerald-400",
    warn: "text-amber-600 dark:text-amber-400",
    bad: "text-red-600 dark:text-red-400",
    default: "text-zinc-900 dark:text-zinc-100",
  };

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Buildings size={18} weight="bold" className="text-zinc-400" />
        <h2 className="text-sm font-bold tracking-tight dark:text-white">Dashboard</h2>
        <span className="mono text-[11px] text-zinc-400">live eligibility across all companies</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] tracking-wide text-zinc-500 dark:text-zinc-400">{k.label}</span>
                <Icon size={16} weight="bold" className={toneMap[k.tone]} />
              </div>
              <div className={`text-2xl font-bold tracking-tight ${toneMap[k.tone]}`}>{k.value}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

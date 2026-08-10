"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { buildCalendarEvents, eventsByMonth } from "@/lib/calendar";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";

type Filter = "all" | "bid-deadline" | "renewal" | "application";

function typeBadge(t: string) {
  if (t === "bid-deadline") return { label: "BID DEADLINE", cls: "bg-amber-400 text-zinc-900 dark:text-zinc-100 border-amber-400" };
  if (t === "renewal") return { label: "RENEWAL", cls: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200" };
  return { label: "APPLICATION", cls: "bg-white dark:bg-zinc-900 text-sky-700 border-zinc-200 dark:border-zinc-800" };
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function colorFor(e: { type: string; date: string }) {
  const d = daysUntil(e.date);
  if (e.type === "bid-deadline") return d < 14 ? "border-amber-300 bg-white dark:bg-zinc-900" : "border-slate-200 bg-white dark:bg-zinc-900";
  if (e.type === "renewal") {
    if (d < 0) return "border-red-300 bg-red-50 dark:bg-red-950";
    if (d < 60) return "border-amber-300 bg-white dark:bg-zinc-900";
    return "border-slate-200 bg-white dark:bg-zinc-900";
  }
  return "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50";
}

export default function CalendarPage() {
  const all = useMemo(() => buildCalendarEvents(), []);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => (filter === "all" ? all : all.filter((e) => e.type === filter)), [all, filter]);
  const filteredGrouped = useMemo(() => eventsByMonth(filtered), [filtered]);

  const months = Array.from(filteredGrouped.keys()).sort();

  const upcoming = filtered.slice(0, 6);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black tracking-[-0.02em]">Compliance Calendar</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-[70ch]">
            MVP #5 — Deterministic deadlines derived from license renewals, GL insurance expiry, bid dates, and checklist
            lead times. Events are sorted chronologically; <span className="font-semibold">bid-deadline = amber</span>,{" "}
            <span className="font-semibold">renewal = red (&lt;60d amber)</span>, application = sky. Grouped by month via{" "}
            <span className="font-mono text-xs">eventsByMonth()</span>.
          </p>
        </div>
        <Link href="/check" className="border bg-amber-400 hover:bg-amber-300 text-zinc-900 dark:text-zinc-100 font-bold px-5 py-2.5 text-sm">
          Run Eligibility Check →
        </Link>
      </div>

      {/* Filters + quick stats */}
      <div className="border bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 flex flex-wrap items-center gap-3">
        <div className="text-xs font-black tracking-wide text-zinc-500 dark:text-zinc-400">FILTER</div>
        {(
          [
            ["all", "All"],
            ["bid-deadline", "Bid deadlines"],
            ["renewal", "Renewals"],
            ["application", "Applications / Checklist"],
          ] as const
        ).map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`border border px-3 py-1.5 text-xs font-bold ${filter === v ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-slate-900" : "bg-white dark:bg-zinc-900 text-zinc-700 border-slate-200 hover:bg-black"}`}
          >
            {l} <span className="opacity-60">({v === "all" ? all.length : all.filter((e) => e.type === v).length})</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 border bg-amber-400 border border-amber-500" /> bid
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 border bg-red-50 dark:bg-red-950" /> renewal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 border bg-sky-400" /> application
          </span>
        </div>
      </div>

      {/* Upcoming strip */}
      <div className="border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-5">
        <div className="text-xs tracking-[0.14em] font-black text-amber-300">UP NEXT — {filter === "all" ? "ALL EVENTS" : filter.toUpperCase()}</div>
        {upcoming.length ? (
          <div className="mt-3 grid md:grid-cols-3 gap-3">
            {upcoming.map((e) => {
              const b = typeBadge(e.type);
              const d = daysUntil(e.date);
              return (
                <div key={e.id} className="border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className={`border border px-2 py-0.5 text-[10px] font-black tracking-wide ${b.cls}`}>{b.label}</span>
                    <span className={`text-xs font-bold ${d < 0 ? "text-red-600" : d < 14 ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-500 dark:text-zinc-400"}`}>{d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? "today" : `${d}d`}</span>
                  </div>
                  <div className="text-sm font-semibold leading-tight mt-1.5 line-clamp-2">{e.title}</div>
                  <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">{e.date}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-300">No events for this filter.</div>
        )}
      </div>

      {/* Grouped by month */}
      {months.length === 0 ? (
        <div className="border bg-white dark:bg-zinc-900 border border-dashed border-slate-300 p-10 text-center">
          <div className="text-sm font-bold text-zinc-700">No events match the current filter.</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Try “All” or add a bid date to a project in <Link href="/projects" className="underline font-semibold">/projects</Link> or a license expiry in <Link href="/companies" className="underline font-semibold">/companies</Link>.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {months.map((ym) => {
            const evts = filteredGrouped.get(ym)!;
            const [y, m] = ym.split("-");
            const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
            return (
              <div key={ym}>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-sm font-black tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{label.toUpperCase()}</h2>
                  <span className="text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border px-2 py-0.5">{evts.length}</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  {evts.map((e) => {
                    const b = typeBadge(e.type);
                    const d = daysUntil(e.date);
                    const urgency = d < 0 ? "OVERDUE" : d < 7 ? "THIS WEEK" : d < 30 ? "THIS MONTH" : "";
                    return (
                      <div key={e.id} className={`border border p-4 flex gap-3 ${colorFor(e)}`}>
                        <div className="flex-shrink-0 h-12 w-12 border bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center">
                          <div className="text-[10px] font-black tracking-wide text-zinc-500 dark:text-zinc-400">{new Date(e.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</div>
                          <div className="text-lg font-black leading-none">{new Date(e.date).getDate()}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`border border px-2 py-0.5 text-[10px] font-black tracking-wide ${b.cls}`}>{b.label}</span>
                            {urgency && <span className={`border px-2 py-0.5 text-[10px] font-black ${d < 0 ? "bg-red-600 text-zinc-900 dark:text-zinc-100" : "bg-amber-400 text-zinc-900 dark:text-zinc-100"}`}>{urgency}</span>}
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono ml-auto">{e.date}</span>
                          </div>
                          <div className="text-sm font-semibold leading-snug mt-1">{e.title}</div>
                          <div className="mt-2 flex gap-2">
                            {e.projectId && (
                              <Link href={`/check?projectId=${e.projectId}`} className="text-xs font-bold underline text-zinc-700">
                                Open check →
                              </Link>
                            )}
                            {e.licenseId && (
                              <Link href="/companies" className="text-xs font-bold underline text-zinc-700">
                                Manage license →
                              </Link>
                            )}
                            {!e.projectId && !e.licenseId && <span className="text-xs text-zinc-500 dark:text-zinc-400">{d < 0 ? `${Math.abs(d)} days overdue` : `${d} days`}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="border bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5">
        <h3 className="text-sm font-black">How this calendar is built</h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
          <span className="font-mono text-[11px] bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded px-1.5 py-0.5">buildCalendarEvents()</span> collects (a) every{" "}
          <span className="font-semibold">license expiry</span> and <span className="font-semibold">GL insurance expiry</span> for all companies, (b) every project{" "}
          <span className="font-semibold">bidDate</span>, and (c) checklist <span className="font-semibold">dueDates</span> derived from the deterministic engine&apos;s lead-time estimates (e.g., foreign qualification 5–14 days before bid). All events are sorted chronologically;{" "}
          <span className="font-mono text-[11px] bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded px-1.5 py-0.5">eventsByMonth()</span> groups by <span className="font-mono">YYYY-MM</span>. Renewals &lt;60 days get an amber warning in eligibility results too.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Link href="/projects" className="border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-4 py-2 font-bold">
            Browse projects
          </Link>
          <Link href="/companies" className="border bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 font-bold">
            Manage companies
          </Link>
          <span className="text-zinc-500 dark:text-zinc-400 self-center ml-2">Seed: {MOCK_COMPANIES.length} companies · {MOCK_PROJECTS.length} projects · {all.length} events</span>
        </div>
      </div>
    </div>
  );
}

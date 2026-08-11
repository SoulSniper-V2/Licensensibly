"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import OnboardingPanel from "@/components/OnboardingPanel";
import DashboardPanel from "@/components/DashboardPanel";
import { ArrowRight, Check, SealCheck, FileText, Buildings } from "@phosphor-icons/react";

export default function Dashboard() {
  const [companyIdx, setCompanyIdx] = useState(0);
  const [projectIdx, setProjectIdx] = useState(0);
  const company = MOCK_COMPANIES[companyIdx];
  const project = MOCK_PROJECTS[projectIdx];
  const result = useMemo(()=> evaluateEligibility(company, project), [company, project]);

  const statusTone =
    result.status === "eligible" ? "good" :
    result.status === "conditional" ? "warn" : "bad";

  return (
    <div>
      {/* ── HERO ── */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-8 pt-10 md:pt-16 pb-12">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-10 items-start">
          {/* Left — editorial */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="mono text-[11px] tracking-[0.14em] font-medium text-[var(--muted)]">FOR ESTIMATORS · NC SC VA</span>
              <span className="hidden sm:inline mono text-[11px] text-[var(--muted-2)]">· Deterministic</span>
            </div>

            <h1 className="mt-6 display font-[800] text-[44px] sm:text-[52px] md:text-[64px] text-[var(--ink)]">
              <span className="block">Can we</span>
              <span className="block -mt-1.5 md:-mt-2">legally bid</span>
              <span className="inline-flex items-center gap-3 mt-1.5">
                <span className="inline-block bg-[var(--ink)] text-white dark:bg-white dark:text-black px-4 py-1 rounded-2xl text-[36px] sm:text-[42px] md:text-[56px] leading-none tracking-[-0.04em]">this job?</span>
                <span className="hidden sm:inline-flex h-[42px] w-[42px] md:h-[48px] md:w-[48px] rounded-full border border-[var(--border)] bg-[var(--surface)] items-center justify-center text-[var(--muted)]">
                  <FileText size={18} weight="regular" />
                </span>
              </span>
            </h1>

            <p className="mt-5 text-[15px] md:text-[16px] leading-[1.65] text-[var(--muted)] max-w-[48ch]">
              <span className="font-semibold text-[var(--ink)]">Licensensibly</span> is the pre-bid compliance folder. Pick your company and the job — get a clear <span className="inline-flex items-center gap-1 font-medium text-[var(--ink)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]"/>Yes</span> · <span className="inline-flex items-center gap-1 font-medium text-[var(--ink)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--warn)]"/>Maybe</span> · <span className="inline-flex items-center gap-1 font-medium text-[var(--ink)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"/>No</span> and a checklist of what to fix before you bid.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/check" className="group inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white dark:bg-white dark:text-black font-semibold px-6 py-3 text-[14px] hover:opacity-90 active:scale-[0.98] transition-all">
                Run eligibility check
                <span className="h-6 w-6 rounded-full bg-white/15 dark:bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform"><ArrowRight size={12} weight="bold" /></span>
              </Link>
              <Link href="/companies" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-[14px] font-medium hover:border-[var(--border-2)] hover:bg-[var(--surface-2)] active:scale-[0.98] transition-all">
                Company profiles <span className="text-[var(--muted)]">→</span>
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 mono text-[11px] text-[var(--muted)]">
              <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-[var(--muted-2)]"/> No account needed to try</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-[var(--muted-2)]"/> Mobile-ready</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-[var(--muted-2)]"/> Cites the board</span>
            </div>

            {/* Proof strip — not 3 equal cards anymore, asymmetric */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
              {[
                { k: "521k", label: "Specialty firms", sub: "US Census" },
                { k: "22k+", label: "Requirements mapped", sub: "Harbor benchmark" },
                { k: "NC SC VA", label: "Narrow vertical", sub: "Our day-one moat" },
              ].map(s=> (
                <div key={s.k} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5">
                  <div className="text-[18px] font-bold tracking-[-0.03em] leading-none">{s.k}</div>
                  <div className="mono text-[11px] font-medium text-[var(--ink)] leading-tight mt-1">{s.label}</div>
                  <div className="mono text-[10px] text-[var(--muted)]">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — job folder (double-bezel) */}
          <div className="lg:sticky lg:top-[88px]">
            <div className="bezel-outer shadow-soft">
              <div className="bezel-inner overflow-hidden">
                {/* Folder tab */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
                  <span className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">JOB FOLDER · LIVE CHECK</span>
                  <span className={`inline-flex items-center gap-1.5 mono text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full border ${
                    statusTone==="good" ? "bg-[var(--success-soft)] border-emerald-200 text-[var(--success)] dark:border-emerald-900" :
                    statusTone==="warn" ? "bg-[var(--warn-soft)] border-amber-200 text-[var(--warn)] dark:border-amber-900" :
                    "bg-[var(--accent-soft)] border-red-200 text-[var(--accent)] dark:border-red-900"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusTone==="good"?"bg-[var(--success)]": statusTone==="warn"?"bg-[var(--warn)]":"bg-[var(--accent)]"}`} />
                    {result.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-5 space-y-4 bg-[var(--surface)]">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1.5">
                      <span className="mono text-[11px] font-semibold tracking-wide text-[var(--muted)]">COMPANY</span>
                      <select value={companyIdx} onChange={e=> setCompanyIdx(Number(e.target.value))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-[13px] font-medium focus:outline-none focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--ink)]/10">
                        {MOCK_COMPANIES.map((c,i)=> <option key={c.id} value={i}>{c.legalName}</option>)}
                      </select>
                    </label>
                    <label className="space-y-1.5">
                      <span className="mono text-[11px] font-semibold tracking-wide text-[var(--muted)]">PROJECT</span>
                      <select value={projectIdx} onChange={e=> setProjectIdx(Number(e.target.value))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-[13px] font-medium focus:outline-none focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--ink)]/10">
                        {MOCK_PROJECTS.map((p,i)=> <option key={p.id} value={i}>{p.title.slice(0,26)}…</option>)}
                      </select>
                    </label>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold leading-tight truncate">{project.title}</div>
                        <div className="mono text-[11px] text-[var(--muted)] mt-1">{project.city}, {project.state} · {project.trade} · ${project.contractValue.toLocaleString()}</div>
                      </div>
                      <span className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center border ${statusTone==="good"?"bg-[var(--success-soft)] border-emerald-200 text-[var(--success)]": statusTone==="warn"?"bg-[var(--warn-soft)] border-amber-200 text-[var(--warn)]":"bg-[var(--accent-soft)] border-red-200 text-[var(--accent)]"}`}>
                        {statusTone==="good" ? <SealCheck size={14} weight="fill"/> : statusTone==="warn" ? <span className="text-[11px] font-bold">!</span> : <span className="text-[11px] font-bold">×</span>}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className={`mono text-[11px] font-medium rounded-full px-2.5 py-1 border bg-[var(--surface)] ${statusTone==="good"?"border-emerald-200 text-[var(--success)]": statusTone==="warn"?"border-amber-200 text-[var(--warn)]":"border-red-200 text-[var(--accent)]"}`}>{result.status}</span>
                      <span className="mono text-[11px] rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1">{result.blockers.length} blockers</span>
                      <span className="mono text-[11px] rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1">{result.estimatedReadiness.label}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/check?projectId=${project.id}&companyId=${company.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--ink)] text-white dark:bg-white dark:text-black mono text-[12px] font-semibold py-2.5 hover:opacity-90 active:scale-[0.98] transition-all">
                      Open in Check <ArrowRight size={12} weight="bold"/>
                    </Link>
                    <Link href="/calendar" className="rounded-full border border-[var(--border)] bg-[var(--surface)] mono text-[12px] font-semibold px-4 py-2.5 hover:bg-[var(--surface-2)] active:scale-[0.98] transition-all">Calendar</Link>
                  </div>

                  <p className="mono text-[11px] leading-relaxed text-[var(--muted)] flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] mt-1.5 shrink-0"/>
                    Engine runs on every keystroke. No LLM in the decision path.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 flex items-start gap-2.5 mono text-[11px] leading-relaxed text-[var(--muted)]">
              <Check size={14} weight="bold" className="text-[var(--success)] mt-0.5 shrink-0"/>
              <span><span className="font-semibold text-[var(--ink)]">What you get:</span> Yes / Maybe / No + what to fix, each with a link to the state board.</span>
            </div>
          </div>
        </div>
      </section>

      <OnboardingPanel />
      <DashboardPanel />

      {/* ── HOW IT WORKS — bento, not 3 columns ── */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-8 py-10">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-soft">
          <div className="px-6 md:px-8 py-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-2)]/50">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">How it works — built for the trailer, not the office</h2>
            <span className="mono text-[11px] tracking-wide text-[var(--muted)]">Three steps · Plain language</span>
          </div>
          <div className="p-6 md:p-8 grid md:grid-cols-12 gap-4">
            <div className="md:col-span-7 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">01 — A STRAIGHT ANSWER</div>
              <div className="text-[17px] font-bold tracking-tight mt-2">Get a clear yes, no, or “fix this first.”</div>
              <p className="mono text-[13px] leading-relaxed text-[var(--muted)] mt-2">No maybe-language. The engine checks your licenses, foreign qualification, and dollar thresholds against the real board rules.</p>
              <div className="mt-4 inline-flex items-center gap-2 mono text-[11px] font-medium">
                <span className="h-2 w-2 rounded-full bg-[var(--success)]"/> Eligible
                <span className="h-2 w-2 rounded-full bg-[var(--warn)] ml-2"/> Conditional
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] ml-2"/> Blocked
              </div>
            </div>
            <div className="md:col-span-5 rounded-[20px] bg-[var(--ink)] text-white dark:bg-white dark:text-black p-6 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/10 dark:border-black/10" />
              <div className="mono text-[11px] tracking-[0.14em] font-semibold text-white/60 dark:text-black/50">02 — CITED TO THE BOARD</div>
              <div className="text-[17px] font-bold mt-2">Every rule links to the source.</div>
              <p className="mono text-[13px] leading-relaxed text-white/70 dark:text-black/60 mt-2">Tap “Source ↗” on any blocker to open the issuing authority. No guesswork.</p>
            </div>
            <div className="md:col-span-5 rounded-[20px] border border-[var(--border)] bg-[var(--surface-2)] p-6">
              <div className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">03 — BUILT FOR YOUR TRADE</div>
              <div className="text-[14px] font-semibold mt-2 flex items-center gap-2"><Buildings size={14}/> Electrical · HVAC · Fire Protection</div>
              <p className="mono text-[11px] leading-relaxed text-[var(--muted)] mt-1">Focused on NC, SC, VA — not 50-state thin. Deep, not wide.</p>
              <div className="mt-3 flex flex-wrap gap-1.5 mono text-[11px]">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">NCBEEC</span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">SC LLR</span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">VA DPOR</span>
              </div>
            </div>
            <div className="md:col-span-7 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">THE FLOW</div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { n: "01", t: "Pick job", d: "Address & value" },
                  { n: "02", t: "We check", d: "License + standing" },
                  { n: "03", t: "Get list", d: "What to fix to bid" },
                ].map(s=> (
                  <div key={s.n} className="text-center sm:text-left">
                    <div className="mono text-[11px] font-bold tracking-wide text-[var(--muted)]">{s.n}</div>
                    <div className="text-[13px] font-semibold mt-1">{s.t}</div>
                    <div className="mono text-[11px] text-[var(--muted)]">{s.d}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-px bg-[var(--border)]" />
              <div className="mt-3 flex items-center gap-2 mono text-[11px] text-[var(--muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"/> Pure function — evaluateEligibility(company, project) — no LLM in decision path
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-8 pb-14">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-soft">
          <div className="px-6 md:px-8 py-8 text-center border-b border-[var(--border)] bg-[var(--surface-2)]/50">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">Pricing — start narrow, expand after PMF</h2>
            <p className="mono text-[11px] text-[var(--muted)] mt-1">B2B — hundreds per month, not $10 consumer. Validates the wedge.</p>
          </div>
          <div className="p-6 md:p-8 grid md:grid-cols-3 gap-5 max-w-[960px] mx-auto">
            {[
              { tier: "Solo", price: "$49–79", detail: "One state · up to 10 checks", features: ["NC or SC or VA", "10 checks / mo", "Checklist + calendar"], cta: "Start solo" },
              { tier: "Growth", price: "$199–299", detail: "Multi-state · unlimited", features: ["NC + SC + VA", "Unlimited checks", "Renewal + reciprocity"], highlight: true, cta: "Most teams →" },
              { tier: "Multi-state", price: "$499+", detail: "Multiple entities", features: ["Unlimited entities", "Team + qualifiers", "Jurisdiction reports"], cta: "Talk to us" },
            ].map(p=> (
              <div key={p.tier} className={`rounded-[20px] border p-6 flex flex-col ${p.highlight ? "bg-[var(--ink)] text-white dark:bg-white dark:text-black border-[var(--ink)] dark:border-white shadow-lift md:-mt-2 md:mb-2" : "bg-[var(--surface)] border-[var(--border)]"}`}>
                <div className={`mono text-[11px] tracking-[0.14em] font-semibold ${p.highlight ? "text-white/60 dark:text-black/50" : "text-[var(--muted)]"}`}>{p.tier.toUpperCase()}</div>
                <div className="text-[24px] font-bold tracking-[-0.03em] mt-1">{p.price}<span className={`text-[13px] font-medium ${p.highlight ? "text-white/60 dark:text-black/50" : "text-[var(--muted)]"}`}> /mo</span></div>
                <div className={`mono text-[11px] mt-1 ${p.highlight ? "text-white/60 dark:text-black/50" : "text-[var(--muted)]"}`}>{p.detail}</div>
                <div className={`mt-4 h-px ${p.highlight ? "bg-white/10 dark:bg-black/10" : "bg-[var(--border)]"}`} />
                <div className="mt-4 space-y-2 flex-1">
                  {p.features.map(f=> <div key={f} className={`flex gap-2 mono text-[12px] ${p.highlight ? "text-white/80 dark:text-black/70" : "text-[var(--muted)]"}`}><span className={p.highlight ? "text-white/40 dark:text-black/30" : "text-[var(--muted-2)]"}>—</span>{f}</div>)}
                </div>
                <div className={`mt-6 text-center rounded-full px-4 py-2.5 mono text-[12px] font-semibold transition-colors ${p.highlight ? "bg-white text-black dark:bg-black dark:text-white hover:bg-zinc-100" : "bg-[var(--ink)] text-white dark:bg-white dark:text-black hover:opacity-90"}`}>{p.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

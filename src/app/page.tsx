"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import OnboardingPanel from "@/components/OnboardingPanel";
import DashboardPanel from "@/components/DashboardPanel";

// Design Read: B2B SaaS landing for specialty contractors (technical buyers/procurement), trust-first deterministic language, leaning toward Tailwind v4 + Geist + Radix-like tokens, restrained motion. Dials: VARIANCE 4 / MOTION 3 / DENSITY 4
export default function Dashboard() {
  const [companyIdx, setCompanyIdx] = useState(0);
  const [projectIdx, setProjectIdx] = useState(0);
  const company = MOCK_COMPANIES[companyIdx];
  const project = MOCK_PROJECTS[projectIdx];
  const result = useMemo(()=> evaluateEligibility(company, project), [company, project]);

  return (
    <div className="bg-white dark:bg-zinc-950">
      {/* HERO — anti-slop: left-aligned editorial, not centered hero over dark mesh. Asymmetric split, large type, no purple gradient */}
      <section className="mx-auto max-w-[1200px] px-6 pt-14 md:pt-20 pb-10">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 mono text-[11px] tracking-[0.14em] text-zinc-600 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-white dark:bg-zinc-900" /> FOR CONTRACTORS • NC SC VA
            </div>
            <h1 className="mt-5 text-[46px] md:text-[68px] font-[800] tracking-[-0.05em] leading-[0.88]">
              <span className="block text-zinc-900 dark:text-zinc-100">Can we</span>
              <span className="block text-zinc-900 dark:text-zinc-100 -mt-2">legally bid</span>
              <span className="inline-block bg-zinc-900 text-white px-4 py-1 rounded-[14px] mt-1 text-[44px] md:text-[60px]">this job?</span>
            </h1>
            <p className="mt-5 text-[16px] leading-[1.6] text-zinc-600 dark:text-zinc-400 dark:text-zinc-400 max-w-[52ch]">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 dark:text-white">Licensensibly</span> checks if you can take a job. Pick your company and the job — get a clear <span className="font-semibold text-zinc-900 dark:text-zinc-100 dark:text-white">Yes / Maybe / No</span> and a simple checklist of what to fix before you bid.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/check" className="rounded-full bg-zinc-900 text-white font-semibold px-7 py-3 hover:bg-black transition-colors">Run eligibility check →</Link>
              <Link href="/settings" className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium px-6 py-3 hover:bg-zinc-50 dark:bg-zinc-800">Company in Settings</Link>
            </div>
            <div className="mt-4 flex gap-6 mono text-xs text-zinc-500 dark:text-zinc-400">
              <span>• Try it free</span><span>• Works on your phone</span><span>• Shows what you need</span>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-[560px]">
              {[
                { k: "521k", v: "Specialty establishments", sub: "Census" },
                { k: "22k+", v: "Filings benchmark", sub: "Harbor" },
                { k: "NC SC VA", v: "Narrow vertical", sub: "Day-one moat" },
              ].map(s=> (
                <div key={s.k} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 p-4">
                  <div className="text-xl font-bold tracking-tight">{s.k}</div>
                  <div className="mono text-[11px] text-zinc-600 dark:text-zinc-400 leading-tight">{s.v}</div>
                  <div className="mono text-[10px] text-zinc-400">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right — live deterministic preview, not a mesh-gradient card */}
          <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 shadow-sm">
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="px-5 py-3 flex items-center justify-between bg-zinc-900 text-white">
                <span className="mono text-[11px] tracking-[0.14em]">CHECK A JOB</span>
                <span className={`mono text-xs font-bold px-2.5 py-1 rounded-full ${result.status==='eligible'?'bg-white dark:bg-zinc-900':result.status==='conditional'?'bg-white dark:bg-zinc-900':'bg-red-50 dark:bg-red-950'}`}>{result.status.toUpperCase()}</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="mono text-xs font-semibold text-zinc-700">Company
                    <select value={companyIdx} onChange={e=> setCompanyIdx(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm">
                      {MOCK_COMPANIES.map((c,i)=> <option key={c.id} value={i}>{c.legalName}</option>)}
                    </select>
                  </label>
                  <label className="mono text-xs font-semibold text-zinc-700">Project
                    <select value={projectIdx} onChange={e=> setProjectIdx(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm">
                      {MOCK_PROJECTS.map((p,i)=> <option key={p.id} value={i}>{p.title.slice(0,28)}…</option>)}
                    </select>
                  </label>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 p-3 mono text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">{project.title}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">{project.city}, {project.state} • {project.trade} • ${project.contractValue.toLocaleString()}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium border ${result.status==='eligible'?'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-700 dark:text-emerald-300':result.status==='conditional'?'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300':'bg-red-50 dark:bg-red-950 border-red-200 text-red-700 dark:text-red-300'}`}>{result.status}</span>
                    <span className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-xs">{result.blockers.length} blockers</span>
                    <span className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-xs">{result.estimatedReadiness.label}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/check?projectId=${project.id}&companyId=${company.id}`} className="flex-1 rounded-full bg-zinc-900 text-white mono text-xs font-semibold py-2.5 text-center hover:bg-black">Open in Check →</Link>
                  <Link href="/calendar" className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mono text-xs font-semibold px-4 py-2.5 hover:bg-zinc-50 dark:bg-zinc-800">Calendar</Link>
                </div>
                <div className="mono text-[11px] text-zinc-500 dark:text-zinc-400">Engine runs on every keystroke. No LLM in decision path.</div>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 mono text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 dark:text-white">What you get:</span> Yes/Maybe/No + what to fix, with links to the state board.
            </div>
          </div>
        </div>
      </section>

      <OnboardingPanel />

      <DashboardPanel />

      {/* VALUE — horizontal bento, not 3 equal cards */}
      <section className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight dark:text-white">How it works — simple</h2>
            <span className="mono text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-400">For contractors, not paperwork experts</span>
          </div>
          <div className="mt-6 grid md:grid-cols-12 gap-4">
            <div className="md:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 p-6">
              <div className="mono text-xs tracking-[0.14em] text-zinc-500 dark:text-zinc-400 dark:text-zinc-400">01 — SIMPLE ANSWER</div>
              <div className="text-lg font-bold mt-1 dark:text-white">Get a clear answer.</div>
              <p className="mono text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">Licensensibly tells you <span className="font-semibold text-zinc-900 dark:text-zinc-100 dark:text-white">yes, no, or what to fix</span> before you bid. No guessing.</p>
            </div>
            <div className="md:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-white p-6">
              <div className="mono text-xs tracking-[0.14em] text-amber-300">02 — TRUSTED LINKS</div>
              <div className="text-lg font-bold mt-1">Links to the state board</div>
              <p className="mono text-sm text-zinc-300 mt-2">Every rule links to the real state website. No guesswork.</p>
            </div>
            <div className="md:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="mono text-xs tracking-[0.14em] text-zinc-500 dark:text-zinc-400 dark:text-zinc-400">03 — MADE FOR YOU</div>
              <div className="text-sm font-semibold mt-1 dark:text-white">Electrical, HVAC & Fire in NC, SC, VA</div>
              <p className="mono text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-400 mt-1">We keep it simple and focused on your trades.</p>
            </div>
            <div className="md:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <div className="mono text-xs tracking-[0.14em] text-zinc-500 dark:text-zinc-400">HOW IT WORKS</div>
              <div className="mt-3 grid grid-cols-3 gap-4 mono text-xs">
                <div><span className="font-bold dark:text-white">01 Pick job</span><br/><span className="text-zinc-500 dark:text-zinc-400 dark:text-zinc-400">Address & price</span></div>
                <div><span className="font-bold dark:text-white">02 Check</span><br/><span className="text-zinc-500 dark:text-zinc-400 dark:text-zinc-400">We check your license</span></div>
                <div><span className="font-bold dark:text-white">03 Get list</span><br/><span className="text-zinc-500 dark:text-zinc-400 dark:text-zinc-400">What to fix to bid</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — kept but with more air, not compact */}
      <section className="mx-auto max-w-[1200px] px-6 pb-12">
        <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 p-6 md:p-8">
          <h2 className="text-xl font-bold tracking-tight text-center">Pricing — start narrow, expand later</h2>
          <p className="mono text-xs text-zinc-500 dark:text-zinc-400 text-center mt-1">Hundreds/mo — not $10 consumer. Validates wedge ROI.</p>
          <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            {[
              { tier: "Solo", price: "$49–79", detail: "1 state • limited projects", features: ["NC or SC or VA", "10 checks/mo", "Checklist + calendar"], cta: "Start solo" },
              { tier: "Growth", price: "$199–299", detail: "multi-state • unlimited", features: ["NC + SC + VA", "Unlimited checks", "Renewal + reciprocity"], highlight: true, cta: "Most teams" },
              { tier: "Multi-state", price: "$499+", detail: "multiple entities", features: ["Unlimited entities", "Team + qualifiers", "New-jurisdiction reports"], cta: "Contact" },
            ].map(p=> (
              <div key={p.tier} className={`rounded-2xl border p-7 flex flex-col hover:shadow-md transition-shadow ${p.highlight ? "bg-zinc-900 text-white border-zinc-900" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"}`}>
                <div className="mono text-xs tracking-[0.14em] opacity-60">{p.tier.toUpperCase()}</div>
                <div className="text-2xl font-bold mt-1">{p.price}<span className="text-sm font-medium opacity-60">/mo</span></div>
                <div className="mono text-xs mt-1 opacity-60">{p.detail}</div>
                <div className="mt-4 space-y-1.5 flex-1">
                  {p.features.map(f=> <div key={f} className="flex gap-2 mono text-xs"><span className={p.highlight ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}>•</span>{f}</div>)}
                </div>
                <div className={`mt-5 text-center rounded-full px-4 py-2 mono text-xs font-semibold ${p.highlight ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100" : "bg-zinc-900 text-white"}`}>{p.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

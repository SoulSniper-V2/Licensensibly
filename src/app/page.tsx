"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import EligibilityCard from "@/components/EligibilityCard";
import { classificationNeeded } from "@/lib/regulatory-data";

export default function Dashboard() {
  const [companyIdx, setCompanyIdx] = useState(0);
  const [projectIdx, setProjectIdx] = useState(0);
  const company = MOCK_COMPANIES[companyIdx];
  const project = MOCK_PROJECTS[projectIdx];
  const result = useMemo(()=> evaluateEligibility(company, project), [company, project]);

  return (
    <div className="bg-white">
      {/* HERO - freebuff-like: centered, airy, big type, no dark grid */}
      <section className="mx-auto max-w-[1200px] px-6 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 mono text-xs tracking-wide text-zinc-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Pre-bid, not post-hold • NC SC VA
        </div>
        <h1 className="mt-6 text-[44px] md:text-[64px] font-bold tracking-[-0.04em] leading-[0.92]">
          <span className="block">Can we</span>
          <span className="block -mt-1">legally bid</span>
          <span className="inline-block bg-zinc-900 text-white px-4 py-1 rounded-[16px] mt-1">this job?</span>
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-zinc-600 max-w-[56ch] mx-auto">
          <span className="font-semibold text-zinc-900">Gooner</span> is the pre-bid compliance OS for specialty contractors.
          Drop an address, value, trade, and company profile — get a deterministic <span className="font-semibold text-zinc-900">Eligible / Conditional / Ineligible</span> with blockers, reciprocity, lead time, checklist, and citations. LLM explains, <span className="underline decoration-zinc-300">engine decides</span>.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/check" className="rounded-full bg-zinc-900 text-white font-semibold px-7 py-3 hover:bg-black">Run eligibility check →</Link>
          <Link href="/companies" className="rounded-full border border-zinc-200 bg-white font-medium px-7 py-3 hover:bg-zinc-50">Manage company profile</Link>
        </div>
        <div className="mt-3 mono text-xs text-zinc-500">No signup needed to try • Engine runs locally • AINSIDE streams explanations</div>

        {/* trust stats like freebuff's $0 vs others */}
        <div className="mt-10 grid grid-cols-3 gap-3 max-w-[720px] mx-auto">
          {[
            { k: "521k", v: "Specialty establishments", sub: "Census, employer" },
            { k: "22k+", v: "Regulatory filings", sub: "Harbor benchmark" },
            { k: "$499", v: "Multi-state tier", sub: "Wedge validates ROI" },
          ].map(s=> (
            <div key={s.k} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
              <div className="text-2xl font-bold tracking-tight">{s.k}</div>
              <div className="mono text-xs text-zinc-600">{s.v}</div>
              <div className="mono text-[11px] text-zinc-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE DEMO - the working AI shit, like freebuff's interactive calculator */}
      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-3 md:p-6 shadow-sm border border-zinc-200 bg-zinc-50 p-3 md:p-4">
          <div className="grid lg:grid-cols-[380px_1fr] gap-4">
            <div className="rounded-2xl bg-white border border-zinc-200 p-5">
              <div className="mono text-xs tracking-[0.14em] text-zinc-500">LIVE — DETERMINISTIC ENGINE</div>
              <div className="mt-3 rounded-xl bg-zinc-900 text-white px-3 py-2 flex items-center justify-between">
                <span className="mono text-xs tracking-wide">AT RISK</span>
                <span className="text-sm font-bold">${project.contractValue.toLocaleString()} • {result.status.toUpperCase()}</span>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="mono text-xs font-semibold text-zinc-700">Company</div>
                  <select value={companyIdx} onChange={e=> setCompanyIdx(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium">
                    {MOCK_COMPANIES.map((c,i)=> <option key={c.id} value={i}>{c.legalName} — {c.licenses.map(l=> `${l.state}:${l.classification}`).join(", ")}</option>)}
                  </select>
                </div>
                <div>
                  <div className="mono text-xs font-semibold text-zinc-700">Project (job opportunity)</div>
                  <select value={projectIdx} onChange={e=> setProjectIdx(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium">
                    {MOCK_PROJECTS.map((p,i)=> <option key={p.id} value={i}>{p.state} • ${p.contractValue.toLocaleString()} • {p.trade} — {p.title.slice(0,44)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                    <div className="mono text-[11px] text-zinc-500">Classification needed</div>
                    <div className="text-sm font-semibold mt-1">{classificationNeeded(project.state, project.trade, project.contractValue)}</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                    <div className="mono text-[11px] text-zinc-500">Jurisdiction</div>
                    <div className="text-sm font-semibold mt-1">{project.city}, {project.state}</div>
                    <div className="mono text-xs text-zinc-500">${project.contractValue.toLocaleString()} • {project.trade}</div>
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 p-3 flex items-center justify-between">
                  <span className={`mono text-xs font-bold px-2.5 py-1 rounded-full ${result.status==="eligible" ? "bg-emerald-500 text-white" : result.status==="conditional" ? "bg-amber-400 text-zinc-900" : "bg-red-500 text-white"}`}>{result.status.toUpperCase()}</span>
                  <span className="mono text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-full">{result.estimatedReadiness.label}</span>
                </div>
                <div className="mono text-xs text-zinc-500">Blockers <span className="text-red-600 font-bold">{result.blockers.length}</span> • Warnings {result.warnings.length} • Satisfied {result.satisfied.length}</div>
                <Link href={`/check?projectId=${project.id}&companyId=${company.id}`} className="block text-center rounded-full bg-zinc-900 text-white text-sm font-semibold py-2.5 hover:bg-black">Open full check →</Link>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mono text-xs leading-relaxed text-amber-900">
                  Not another renewal tracker. Harbor wins “maintain what you have.” Gooner wins the <span className="font-semibold">job-level go/no-go</span>.
                </div>
              </div>
            </div>
            <div>
              <EligibilityCard result={result} />
              <div className="mt-3 mono text-xs text-zinc-500 text-center">AINSIDE streams the explanation below on <Link href="/check" className="underline hover:text-zinc-900">/check</Link> — try changing value/city/trade</div>
            </div>
          </div>
        </div>
      </section>

      {/* how it works + gate - like freebuff's sections */}
      <section className="mx-auto max-w-[1200px] px-6 pb-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">The wedge is the bid, not the license</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 max-w-[62ch]">
            Existing tools answer “how do I maintain licenses I already have?” Gooner answers <span className="font-semibold text-zinc-900">“We just got this $800k Charlotte electrical job — are we legal to bid, and what’s missing?”</span> That decision happens before any tracker. Embed there, and switching costs compound: company credentials, jurisdiction history, qualifiers, prior checks.
          </p>
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            {[
              { n: "01", t: "Drop job", d: "Address, value, trade, scope, public/private, role" },
              { n: "02", t: "Engine decides", d: "Jurisdiction × trade × value × credentials → eligible" },
              { n: "03", t: "AINSIDE explains", d: "Streams blockers, reciprocity, citations to the board" },
            ].map(s=> (
              <div key={s.n} className="rounded-2xl border border-zinc-200 p-4">
                <div className="mono text-xs font-bold text-zinc-400">{s.n}</div>
                <div className="text-sm font-semibold mt-1">{s.t}</div>
                <div className="mono text-xs text-zinc-500 mt-1">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 p-5">
            <h3 className="text-sm font-bold">Research gate — conditional green</h3>
            <p className="mono text-xs leading-relaxed text-zinc-600 mt-2">Market green, timing green, tech green. Competition yellow — Harbor 40k clients, Copliancy $59/site. Biggest risk is data maintenance → start narrow 1 trade × 3 states.</p>
            <div className="mt-3 grid grid-cols-2 gap-2 mono text-xs font-medium">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 text-center">Market: Green</span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 text-center">Timing: Green</span>
              <span className="rounded-full bg-amber-50 border border-amber-200 text-amber-800 px-2 py-1 text-center">Competition: Yellow</span>
              <span className="rounded-full bg-red-50 border border-red-200 text-red-800 px-2 py-1 text-center">Data: Red/Yellow</span>
            </div>
          </div>
          <div className="rounded-2xl bg-zinc-900 text-white p-5">
            <h3 className="text-sm font-semibold text-amber-300">5-thing MVP — shipped</h3>
            <ol className="mt-3 space-y-1.5 mono text-xs text-zinc-300">
              <li>01 — Company profile (licenses, qualifiers, insurance)</li>
              <li>02 — Project intake (address, value, trade, scope)</li>
              <li>03 — Deterministic engine (no LLM decision)</li>
              <li>04 — AI research with citations (AINSIDE streaming)</li>
              <li>05 — Gap checklist + calendar</li>
            </ol>
          </div>
        </div>
      </section>

      {/* pricing like freebuff's comparison */}
      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-3 md:p-6 shadow-sm border border-zinc-200 p-6 md:p-8 bg-white">
          <h2 className="text-xl font-bold tracking-tight text-center">Pricing — start narrow, expand later</h2>
          <p className="mono text-xs text-zinc-500 text-center mt-1">Hundreds/mo — not $10 consumer. Validates wedge ROI.</p>
          <div className="mt-6 grid md:grid-cols-3 gap-4 max-w-[900px] mx-auto">
            {[
              { tier: "Solo", price: "$49–79", detail: "1 state • limited projects", features: ["NC or SC or VA", "10 checks/mo", "Checklist + calendar"], cta: "Start solo" },
              { tier: "Growth", price: "$199–299", detail: "multi-state • unlimited", features: ["NC + SC + VA", "Unlimited checks", "Renewal + reciprocity"], highlight: true, cta: "Most teams" },
              { tier: "Multi-state", price: "$499+", detail: "multiple entities", features: ["Unlimited entities", "Team + qualifiers", "New-jurisdiction reports"], cta: "Contact" },
            ].map(p=> (
              <div key={p.tier} className={`rounded-2xl border p-6 flex flex-col hover:shadow-md transition-shadow ${p.highlight ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 border-zinc-200"}`}>
                <div className="mono text-xs tracking-[0.14em] opacity-60">{p.tier.toUpperCase()}</div>
                <div className="text-2xl font-bold mt-1">{p.price}<span className="text-sm font-medium opacity-60">/mo</span></div>
                <div className="mono text-xs mt-1 opacity-60">{p.detail}</div>
                <div className="mt-4 space-y-1.5 flex-1">
                  {p.features.map(f=> <div key={f} className="flex gap-2 mono text-xs"><span className={p.highlight ? "text-zinc-400" : "text-zinc-500"}>•</span>{f}</div>)}
                </div>
                <div className={`mt-5 text-center rounded-full px-4 py-2 mono text-xs font-semibold ${p.highlight ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"}`}>{p.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
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
    <div className="bg-[#09090b]">
      {/* HERO - ASYMMETRIC SPLIT like freebuff but industrial */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-[#09090b]">
        <div className="absolute inset-0 bg-grid opacity-40" />
        {/* scanline */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]" />
        
        <div className="relative mx-auto max-w-[1400px] px-4 md:px-6 pt-10 md:pt-14 pb-8">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-6 items-start">
            {/* LEFT: editorial */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }} className="min-w-0">
              <div className="inline-flex items-center gap-2 border border-[#facc15] bg-[#facc15] text-black mono text-[10px] tracking-[0.18em] px-3 py-1 font-black">
                <span className="h-2 w-2 bg-black animate-pulse" /> THE WEDGE — PRE-BID, NOT POST-HOLD
              </div>
              <h1 className="mt-5 text-[42px] md:text-[64px] font-black leading-[0.85] tracking-[-0.04em]">
                CAN WE<br/>
                <span className="bg-[#facc15] text-black px-2 inline-block -rotate-[0.5deg]">LEGALLY BID</span><br/>
                THIS JOB?
              </h1>
              <p className="mt-5 mono text-[13px] leading-relaxed text-zinc-400 max-w-[52ch] border-l-2 border-zinc-800 pl-4">
                Gooner is an <span className="text-white font-bold">AI-native pre-bid compliance OS</span> for specialty contractors.
                Drop address, value, trade, company profile — get deterministic <span className="text-white bg-zinc-800 px-1">ELIGIBLE / CONDITIONAL / INELIGIBLE</span> with blockers, reciprocity, lead time, checklist, citations. Built narrow: <span className="text-[#facc15] font-bold">Electrical + HVAC • NC SC VA</span> — LLM explains, <span className="underline decoration-[#facc15] underline-offset-4">engine decides</span>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/check" className="mono text-[13px] tracking-[0.12em] font-black bg-[#facc15] text-black px-7 py-3 hover:bg-yellow-300 border border-[#facc15] shadow-[4px_4px_0px_0px_rgba(250,204,21,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.25)] transition-all">RUN ELIGIBILITY CHECK →</Link>
                <Link href="/companies" className="mono text-[13px] tracking-[0.12em] font-bold border border-zinc-700 text-zinc-300 px-7 py-3 hover:bg-zinc-900 hover:text-white">COMPANY PROFILE</Link>
              </div>

              {/* stats - brutalist grid */}
              <div className="mt-8 grid grid-cols-3 gap-0 border border-zinc-800 max-w-[560px] bg-black">
                {[
                  { k: "521K", v: "Specialty trade establishments", sub: "Census 2023" },
                  { k: "22K+", v: "Regulatory filings", sub: "Harbor benchmark" },
                  { k: "$499", v: "Multi-state tier", sub: "Wedge validates ROI" },
                ].map(s=> (
                  <div key={s.k} className="p-4 border-r last:border-r-0 border-zinc-800">
                    <div className="text-[22px] font-black tracking-tighter leading-none">{s.k}</div>
                    <div className="mono text-[10px] tracking-[0.08em] leading-tight text-zinc-400 mt-1">{s.v}</div>
                    <div className="mono text-[9px] text-zinc-600 mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 mono text-[10px] tracking-[0.14em] text-zinc-600 flex gap-4">
                <span>521,315 employer establishments</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Deterministic • No LLM decision</span>
              </div>
            </motion.div>

            {/* RIGHT: live terminal - the working AI shit */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16,1,0.3,1] }} className="border border-zinc-800 bg-black overflow-hidden">
              {/* terminal chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 bg-red-500" /><span className="h-2.5 w-2.5 bg-yellow-500" /><span className="h-2.5 w-2.5 bg-green-500" /></div>
                <span className="mono text-[10px] tracking-[0.14em] text-zinc-500 ml-2">gooner --deterministic --live</span>
                <span className="ml-auto mono text-[10px] bg-emerald-500 text-black px-2 py-0.5 font-bold animate-pulse">● LIVE ENGINE</span>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <div className="mono text-[10px] tracking-[0.14em] text-zinc-500">COMPANY</div>
                  <select value={companyIdx} onChange={e=> setCompanyIdx(Number(e.target.value))} className="mt-1 w-full bg-zinc-900 border border-zinc-800 mono text-xs font-bold text-white px-3 py-2.5 focus:outline-none focus:border-zinc-600">
                    {MOCK_COMPANIES.map((c,i)=> <option key={c.id} value={i}>{c.legalName} — {c.licenses.map(l=> `${l.state}:${l.classification}`).join(", ")}</option>)}
                  </select>
                </div>
                <div>
                  <div className="mono text-[10px] tracking-[0.14em] text-zinc-500">PROJECT</div>
                  <select value={projectIdx} onChange={e=> setProjectIdx(Number(e.target.value))} className="mt-1 w-full bg-zinc-900 border border-zinc-800 mono text-xs font-bold text-white px-3 py-2.5 focus:outline-none focus:border-zinc-600">
                    {MOCK_PROJECTS.map((p,i)=> <option key={p.id} value={i}>{p.state} • ${p.contractValue.toLocaleString()} • {p.trade} — {p.title.slice(0,42)}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-zinc-800 bg-[#0a0a0b] p-3">
                    <div className="mono text-[10px] tracking-[0.14em] text-zinc-500">CLASS NEEDED</div>
                    <div className="mono text-xs font-black text-white mt-1 leading-tight">{classificationNeeded(project.state, project.trade, project.contractValue)}</div>
                  </div>
                  <div className="border border-zinc-800 bg-[#0a0a0b] p-3">
                    <div className="mono text-[10px] tracking-[0.14em] text-zinc-500">JURISDICTION</div>
                    <div className="mono text-xs font-black text-white mt-1">{project.city}, {project.state}</div>
                    <div className="mono text-[10px] text-zinc-600">${project.contractValue.toLocaleString()} • {project.trade}</div>
                  </div>
                </div>

                <div className="border border-zinc-800 p-3 bg-zinc-950">
                  <div className="flex items-center justify-between">
                    <span className={`mono text-[11px] tracking-[0.12em] font-black px-2 py-1 border ${result.status==="eligible" ? "bg-emerald-500 text-black border-emerald-600" : result.status==="conditional" ? "bg-[#facc15] text-black border-yellow-600" : "bg-red-600 text-white border-red-700"}`}>{result.status.toUpperCase()}</span>
                    <span className="mono text-[11px] font-bold border border-zinc-800 bg-black px-2 py-1">{result.estimatedReadiness.label}</span>
                  </div>
                  <div className="mono text-[11px] text-zinc-500 mt-2">Blockers: <span className="text-red-400 font-bold">{result.blockers.length}</span> • Warnings: {result.warnings.length} • Satisfied: {result.satisfied.length}</div>
                  {result.blockers[0] && (
                    <div className="mono text-xs text-zinc-300 mt-2 leading-relaxed border-l-2 border-[#facc15] pl-2">
                      → {result.blockers[0].requirement.label}: <span className="text-zinc-500">{result.blockers[0].reason.slice(0,90)}</span>
                    </div>
                  )}
                </div>

                <Link href={`/check?projectId=${project.id}&companyId=${company.id}`} className="block text-center mono text-xs tracking-[0.14em] font-black bg-white text-black py-3 hover:bg-zinc-200 border border-white">OPEN FULL CHECK →</Link>

                <div className="mono text-[10px] leading-relaxed text-zinc-500 border border-amber-900/50 bg-amber-950/20 p-2">
                  Not another renewal tracker. Harbor wins <span className="text-amber-200">maintain what you have</span>. Gooner wins <span className="text-white">$800k Charlotte electrical — are we legal?</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE - like freebuff's kinetic strip */}
      <div className="border-y border-zinc-800 bg-[#facc15] overflow-hidden py-2">
        <motion.div className="flex gap-8 mono text-xs font-black tracking-[0.18em] text-black whitespace-nowrap" animate={{ x: ["0%","-50%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
          {Array.from({length: 6}).map((_,i)=> (
            <span key={i} className="flex gap-8 items-center"><span>NC • SC • VA</span><span>•</span><span>DETERMINISTIC ENGINE</span><span>•</span><span>AINSIDE ag/gemini-3.6-flash-high</span><span>•</span><span>PRE-BID OS</span><span>•</span></span>
          ))}
        </motion.div>
      </div>

      {/* KPI - bento brutalist */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-6 py-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-0 border border-zinc-800 bg-black">
            {[
              { label: "Checks 30d", value: "127", sub: "+18 vs last month", accent: "text-emerald-400" },
              { label: "Blocked bids", value: "34", sub: "~$14M at risk", accent: "text-red-400" },
              { label: "Avg readiness", value: "18d", sub: "NC/SC/VA median", accent: "text-[#facc15]" },
            ].map(k=> (
              <div key={k.label} className="p-5 border-r last:border-r-0 border-zinc-800">
                <div className="mono text-[10px] tracking-[0.14em] text-zinc-500">{k.label.toUpperCase()}</div>
                <div className={`text-[28px] font-black tracking-tighter leading-none mt-1 ${k.accent}`}>{k.value}</div>
                <div className="mono text-[11px] text-zinc-500 mt-1">{k.sub}</div>
              </div>
            ))}
          </div>
          <EligibilityCard result={result} />
        </div>

        <div className="space-y-4">
          <div className="border border-zinc-800 bg-zinc-900 p-5">
            <h3 className="mono text-[11px] tracking-[0.16em] text-zinc-400">RESEARCH GATE — CONDITIONAL GREEN</h3>
            <p className="mono text-xs leading-relaxed text-zinc-300 mt-3">Market green, timing green, tech green. Competition yellow — Harbor 40k clients, Copliancy $59/site. Biggest risk is data maintenance → <span className="text-white font-bold">start narrow 1 trade × 3 states</span>. Next: interview 10 multi-jurisdiction supers: <em className="text-zinc-400">Walk me through last time you considered a job where you had not worked before…</em></p>
            <div className="mt-4 grid grid-cols-2 gap-2 mono text-[10px] font-bold tracking-wide">
              <span className="border border-emerald-800 bg-emerald-950/40 text-emerald-300 px-2 py-1 text-center">MARKET: GREEN</span>
              <span className="border border-emerald-800 bg-emerald-950/40 text-emerald-300 px-2 py-1 text-center">TIMING: GREEN</span>
              <span className="border border-amber-800 bg-amber-950/30 text-amber-300 px-2 py-1 text-center">COMPETITION: YELLOW</span>
              <span className="border border-red-900 bg-red-950/30 text-red-300 px-2 py-1 text-center">DATA: RED/YELLOW</span>
            </div>
          </div>

          <div className="border border-zinc-800 bg-black p-5">
            <h3 className="mono text-[11px] tracking-[0.16em]">5-THING MVP — SHIPPED IN THIS REPO</h3>
            <ol className="mt-4 space-y-3">
              {[
                "Company compliance profile — licenses, qualifiers, insurance, foreign qual",
                "Project intake — address, value, trade, scope, public/private, role",
                "Deterministic rules engine — jurisdiction × trade × value → eligible",
                "AI research with citations to official sources — AINSIDE streaming",
                "Gap checklist + calendar — deadlines, renewals, lead times",
              ].map((t,i)=> <li key={i} className="flex gap-3"><span className="h-6 w-6 shrink-0 bg-[#facc15] text-black flex items-center justify-center mono text-xs font-black">{i+1}</span><span className="mono text-xs text-zinc-300 leading-tight pt-1">{t}</span></li>)}
            </ol>
          </div>

          <div className="border border-[#facc15] bg-[#facc15] p-5">
            <h3 className="mono text-[11px] tracking-[0.16em] text-black">WHY THIS BEATS GENERIC COMPLIANCE</h3>
            <p className="mono text-xs leading-relaxed text-black mt-2">ROI is not saved office hours. It is <span className="font-black">prevented a bid you could not legally perform</span> or <span className="font-black">flagged a $500k job early enough to get licensed</span>. Embedded in <span className="bg-black text-[#facc15] px-1">opportunity → check → go/no-go → licensing → bid</span>, switching costs compound.</p>
          </div>
        </div>
      </section>

      {/* PRICING - bento */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-6 pb-8">
        <div className="border border-zinc-800 bg-black p-5 md:p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-black tracking-[-0.02em]">PRICING — START NARROW, EXPAND LATER</h2>
            <span className="mono text-[10px] border border-zinc-800 px-2 py-1 text-zinc-500">HUNDREDS/MO — NOT $10 CONSUMER</span>
          </div>
          <div className="mt-5 grid md:grid-cols-3 gap-0 border border-zinc-800">
            {[
              { tier: "SOLO", price: "$49-79", detail: "1 state / limited projects", features: ["NC or SC or VA", "10 checks/mo", "Checklist + calendar"] },
              { tier: "GROWTH", price: "$199-299", detail: "multi-state, unlimited checks", features: ["NC + SC + VA", "Unlimited checks", "Renewal mgmt", "Reciprocity"], highlight: true },
              { tier: "MULTI-STATE", price: "$499+", detail: "multiple entities, team", features: ["Unlimited entities", "Qualifiers + team", "History + workflows", "New-jurisdiction reports"] },
            ].map(p=> (
              <div key={p.tier} className={`p-5 border-r last:border-r-0 border-zinc-800 ${p.highlight ? "bg-zinc-900" : "bg-black"}`}>
                <div className="mono text-[11px] tracking-[0.16em] text-zinc-500">{p.tier}</div>
                <div className="text-[26px] font-black tracking-tighter mt-1">{p.price}<span className="text-sm font-bold text-zinc-500">/mo</span></div>
                <div className="mono text-xs text-zinc-400 mt-1">{p.detail}</div>
                <div className="mt-4 space-y-1.5 mono text-xs text-zinc-300">
                  {p.features.map(f=> <div key={f} className="flex gap-2"><span className="text-[#facc15]">›</span>{f}</div>)}
                </div>
                {p.highlight && <div className="mt-4 mono text-[10px] bg-[#facc15] text-black text-center py-1 font-black">MOST TEAMS START HERE</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOURCES */}
      <section className="border-t border-zinc-800 bg-black">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-4 flex flex-wrap gap-2 mono text-[10px] tracking-wide text-zinc-500">
          <span className="text-zinc-300">SOURCES:</span>
          <a href="https://www.ncbeec.org/licensing/" target="_blank" className="underline hover:text-white">NCBEEC</a>
          <span>•</span>
          <a href="https://www.nclicensing.org/" target="_blank" className="underline hover:text-white">NC PH&FS</a>
          <span>•</span>
          <a href="https://llr.sc.gov/" target="_blank" className="underline hover:text-white">SC LLR</a>
          <span>•</span>
          <a href="https://www.dpor.virginia.gov/" target="_blank" className="underline hover:text-white">VA DPOR</a>
          <span className="ml-auto hidden md:inline">JURISDICTION × TRADE × VALUE × CREDENTIALS → ELIGIBILITY</span>
        </div>
      </section>
    </div>
  );
}

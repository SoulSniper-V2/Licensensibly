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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stats = {
    checks: 127,
    blocked: 34,
    avgLead: "18 days",
  };

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 space-y-8">
      {/* Hero — wedge explanation */}
      <div className="rounded-[28px] bg-slate-900 text-white overflow-hidden">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-0">
          <div className="p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-slate-900 px-3 py-1 text-xs font-black tracking-wide">THE WEDGE • PRE-BID, NOT POST-HOLD</div>
            <h1 className="mt-4 text-[40px] font-black leading-[0.9] tracking-tight">Can we <span className="text-amber-400">legally bid</span> this job?</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-300 max-w-[62ch]">
              Gooner is an <span className="text-white font-semibold">AI-native pre-bid licensing & compliance OS</span> for specialty contractors. Drop an address, value, trade, and company profile — get a deterministic <span className="text-white">Eligible / Conditional / Ineligible</span> judgment with blockers, reciprocity, lead time, checklists, and citations to the issuing board. Built narrow: <span className="text-amber-300 font-semibold">Electrical + HVAC in NC • SC • VA + major municipalities</span>. LLM explains, <span className="underline decoration-amber-400">engine decides</span>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/check" className="rounded-full bg-amber-400 text-slate-900 font-black px-6 py-3 hover:bg-amber-300">Run Eligibility Check →</Link>
              <Link href="/companies" className="rounded-full bg-white text-slate-900 font-bold px-6 py-3">Manage Company Profile</Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-[560px]">
              {[
                { k: "521k", v: "Specialty establishments (Census)" },
                { k: "22k+", v: "Regulatory requirements tracked (Harbor benchmark)" },
                { k: "$499", v: "Multi-state pricing validates wedge ROI" },
              ].map(s=> (
                <div key={s.k} className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-xl font-black">{s.k}</div>
                  <div className="text-xs leading-tight text-slate-300">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white text-slate-900 p-6 lg:p-8 flex flex-col">
            <div className="text-[11px] tracking-[0.14em] font-black text-slate-500">TODAY&apos;S EXAMPLE — DETERMINISTIC</div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500">COMPANY</div>
              <select value={companyIdx} onChange={e=> setCompanyIdx(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                {MOCK_COMPANIES.map((c,i)=> <option key={c.id} value={i}>{c.legalName} — {c.licenses.map(l=> `${l.state}:${l.classification}`).join(", ")}</option>)}
              </select>
              <div className="text-xs font-bold text-slate-500 mt-3">PROJECT (JOB OPPORTUNITY)</div>
              <select value={projectIdx} onChange={e=> setProjectIdx(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                {MOCK_PROJECTS.map((p,i)=> <option key={p.id} value={i}>{p.state} • ${p.contractValue.toLocaleString()} • {p.trade} — {p.title.slice(0,40)}</option>)}
              </select>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white border border-slate-200 p-2">
                  <div className="font-bold text-slate-500">Classification needed</div>
                  <div className="font-bold">{classificationNeeded(project.state, project.trade, project.contractValue)}</div>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2">
                  <div className="font-bold text-slate-500">Jurisdiction</div>
                  <div className="font-bold">{project.city}, {project.state} • {project.county}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black border ${result.status==="eligible"?"bg-emerald-500 text-white border-emerald-600": result.status==="conditional"?"bg-amber-400 text-slate-900 border-amber-500":"bg-red-600 text-white border-red-700"}`}>{result.status.toUpperCase()}</span>
                <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-bold">{result.estimatedReadiness.label}</span>
              </div>
              <div className="text-xs text-slate-600 mt-2">Blockers: <span className="font-bold text-red-600">{result.blockers.length}</span> • Warnings: {result.warnings.length} • Satisfied: {result.satisfied.length}</div>
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Not another renewal tracker.</span> Harbor & Copliancy already win “maintain what you have.” Gooner wins the job-level go/no-go: <span className="font-semibold">“We just got this $800k Charlotte electrical job — are we legal to bid, and what’s missing?”</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI + recent */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Eligibility checks (30d)", value: "127", sub: "+18 vs last month" },
              { label: "Blocked bids prevented", value: "34", sub: "~$14M at risk" },
              { label: "Avg time to readiness", value: "18 days", sub: "NC/SC/VA median" },
            ].map(k=> (
              <div key={k.label} className="rounded-2xl bg-white border border-slate-200 p-5">
                <div className="text-xs font-bold tracking-wide text-slate-500">{k.label.toUpperCase()}</div>
                <div className="text-3xl font-black mt-1">{k.value}</div>
                <div className="text-xs font-medium text-emerald-600 mt-1">{k.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <EligibilityCard result={result} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <h3 className="text-sm font-black">Research Gate — Conditional green light</h3>
            <p className="text-xs leading-relaxed text-slate-600 mt-2">Market green, timing green, tech green. Competition yellow (Harbor 40k clients, Copliancy $59/site). Biggest risk = data maintenance across thousands of jurisdictions → start narrow (1 trade × 3 states). Next: interview 10 multi-jurisdiction GCs with: <em>“Walk me through last time you considered a job where you hadn’t worked before…”</em></p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-1 text-center font-bold text-emerald-800">Market: Green</span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-1 text-center font-bold text-emerald-800">Timing: Green</span>
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-1 text-center font-bold text-amber-800">Competition: Yellow</span>
              <span className="rounded-full bg-red-50 border border-red-200 px-2 py-1 text-center font-bold text-red-800">Data: Red/Yellow</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <h3 className="text-sm font-black">5-thing MVP (in this repo)</h3>
            <ol className="mt-3 space-y-2 text-sm">
              {[
                "Company compliance profile (licenses, qualifiers, insurance, foreign qual.)",
                "Project/job intake (address, value, trade, scope, public/private, role)",
                "Deterministic rules engine (jurisdiction × trade × value → eligible)",
                "AI-assisted research with citations to official sources",
                "Gap checklist + calendar (deadlines, renewals, lead times)",
              ].map((t,i)=> <li key={i} className="flex gap-2"><span className="h-6 w-6 shrink-0 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">{i+1}</span><span className="text-slate-700 leading-tight">{t}</span></li>)}
            </ol>
          </div>
          <div className="rounded-2xl bg-slate-900 text-white p-5">
            <h3 className="text-sm font-black text-amber-300">Why this beats generic compliance</h3>
            <p className="text-sm leading-relaxed text-slate-300 mt-2">ROI isn’t “saved office hours.” It’s <span className="text-white font-semibold">“prevented a bid you couldn’t legally perform”</span> or <span className="text-white font-semibold">“flagged a $500k job early enough to get licensed.”</span> Embedded in <code className="bg-white/10 px-1 rounded">opportunity → check → go/no-go → licensing work → bid</code>, switching costs compound.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

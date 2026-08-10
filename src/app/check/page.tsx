"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import EligibilityCard from "@/components/EligibilityCard";
import { ProjectInput, Trade } from "@/lib/types";
import AIResearchPanel from "@/components/AIResearchPanel";

function CheckPageInner() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const companyParam = searchParams.get("companyId");
  const initialProject = projectId ? MOCK_PROJECTS.find(p=> p.id===projectId) : undefined;
  const initialCompanyId = companyParam && MOCK_COMPANIES.find(c=> c.id===companyParam) ? companyParam : MOCK_COMPANIES[0].id;

  const [companyId, setCompanyId] = useState(initialCompanyId);
  const company = MOCK_COMPANIES.find(c=> c.id===companyId)!;
  const [form, setForm] = useState<ProjectInput>(() => initialProject ? { ...initialProject } : {
    id: "custom-1",
    title: "Hospital HVAC retrofit",
    address: "1000 Blythe Blvd",
    city: "Charlotte",
    county: "Mecklenburg",
    state: "NC",
    trade: "hvac",
    scope: "Chiller + controls retrofit",
    contractValue: 1400000,
    role: "subcontractor",
    isPublicWorks: false,
    bidDate: "2026-09-15",
    estimatedStartDate: "2026-10-20",
  });

  const result = useMemo(()=> evaluateEligibility(company, form), [company, form]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 space-y-6">
      <div className="border border-zinc-800 bg-black p-4 flex flex-wrap gap-3 items-center">
        <h1 className="text-[20px] font-black tracking-[-0.02em]">ELIGIBILITY CHECK</h1>
        <span className="mono text-[10px] tracking-[0.14em] border border-zinc-800 px-2 py-1 text-zinc-500">JURISDICTION × TRADE × VALUE × CREDENTIALS → ELIGIBLE</span>
        <span className="ml-auto mono text-[11px] bg-[#facc15] text-black px-3 py-1 font-black">{result.status.toUpperCase()} • {result.estimatedReadiness.label}</span>
      </div>
      <p className="mono text-xs text-zinc-500 -mt-2">Job-level go/no-go — not license tracking. Engine evaluates every keystroke. AINSIDE explains below.</p>

      <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
        <div className="space-y-4">
          <div className="border border-zinc-800 bg-zinc-900 p-4 space-y-3">
            <h2 className="mono text-[11px] tracking-[0.16em] text-zinc-400">01 — COMPANY PROFILE</h2>
            <select value={companyId} onChange={e=> setCompanyId(e.target.value)} className="w-full bg-black border border-zinc-800 mono text-xs font-bold px-3 py-2.5 text-white focus:border-zinc-600 focus:outline-none">
              {MOCK_COMPANIES.map(c=> <option key={c.id} value={c.id}>{c.legalName}</option>)}
            </select>
            <div className="border border-zinc-800 bg-black p-3 mono text-xs leading-relaxed">
              <div className="font-bold text-white">{company.legalName}</div>
              <div className="text-zinc-500">INC: {company.incorporatedStates.join(", ")} • FQ: {company.foreignQualifications.join(", ")||"—"}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {company.licenses.map(l=> <span key={l.id} className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 mono text-[10px]">{l.state} {l.trade} {l.classification}</span>)}
              </div>
              <div className="mt-2 text-zinc-600 mono text-[11px]">Qualifiers: {company.qualifiers.map(q=> `${q.name} (${q.states.join("/")})`).join(", ")}</div>
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900 p-4 space-y-3">
            <h2 className="mono text-[11px] tracking-[0.16em] text-zinc-400">02 — PROJECT / JOB INTAKE</h2>
            <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">PROJECT TITLE<input value={form.title} onChange={e=> setForm({...form, title:e.target.value})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">CITY<input value={form.city} onChange={e=> setForm({...form, city:e.target.value})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none" /></label>
              <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">STATE
                <select value={form.state} onChange={e=> setForm({...form, state:e.target.value as any})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs font-bold text-white focus:border-zinc-600 focus:outline-none">
                  <option value="NC">NC</option><option value="SC">SC</option><option value="VA">VA</option>
                </select>
              </label>
            </div>
            <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">ADDRESS<input value={form.address} onChange={e=> setForm({...form, address:e.target.value})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none" /></label>
            <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">COUNTY<input value={form.county} onChange={e=> setForm({...form, county:e.target.value})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none" placeholder="Mecklenburg" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">TRADE
                <select value={form.trade} onChange={e=> setForm({...form, trade:e.target.value as Trade})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none">
                  <option value="electrical">Electrical</option><option value="hvac">HVAC / Mechanical</option><option value="fire-protection">Fire Protection</option>
                </select>
              </label>
              <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">CONTRACT VALUE $<input type="number" value={form.contractValue} onChange={e=> setForm({...form, contractValue: Number(e.target.value)})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs font-bold text-white focus:border-zinc-600 focus:outline-none" /></label>
            </div>
            <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">SCOPE<textarea value={form.scope} onChange={e=> setForm({...form, scope:e.target.value})} rows={2} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">ROLE
                <select value={form.role} onChange={e=> setForm({...form, role:e.target.value as any})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none">
                  <option value="subcontractor">Subcontractor</option><option value="general-contractor">General Contractor</option><option value="prime">Prime</option>
                </select>
              </label>
              <label className="flex items-center gap-2 mono text-[11px] tracking-[0.1em] text-zinc-400 mt-6"><input type="checkbox" checked={!!form.isPublicWorks} onChange={e=> setForm({...form, isPublicWorks:e.target.checked})} className="accent-[#facc15]" /> PUBLIC WORKS?</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">BID DATE<input type="date" value={form.bidDate||""} onChange={e=> setForm({...form, bidDate:e.target.value})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none" /></label>
              <label className="block mono text-[11px] tracking-[0.1em] text-zinc-400">EST. START<input type="date" value={form.estimatedStartDate||""} onChange={e=> setForm({...form, estimatedStartDate:e.target.value})} className="mt-1 w-full bg-black border border-zinc-800 px-3 py-2 mono text-xs text-white focus:border-zinc-600 focus:outline-none" /></label>
            </div>
            <div className="border border-zinc-800 bg-black p-3 mono text-[11px] leading-relaxed text-zinc-500">
              Deterministic engine runs on every keystroke. No LLM decision — AINSIDE only explains and cites below.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <EligibilityCard result={result} />
          <AIResearchPanel result={result} city={form.city} state={form.state} trade={form.trade} value={form.contractValue} />
        </div>
      </div>
    </div>
  );
}

export default function CheckPage(){ return <Suspense fallback={<div className="mx-auto max-w-[1400px] px-6 py-10 mono text-xs text-zinc-500">Loading eligibility check…</div>}><CheckPageInner/></Suspense>; }

"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import EligibilityCard from "@/components/EligibilityCard";
import { ProjectInput, Trade } from "@/lib/types";

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
    <div className="mx-auto max-w-[1320px] px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Eligibility Check</h1>
        <p className="text-sm text-slate-600 mt-1">The wedge: <span className="font-semibold text-slate-900">Job-level go/no-go</span> — not license tracking. Deterministic engine evaluates jurisdiction × trade × value × credentials.</p>
      </div>

      <div className="grid lg:grid-cols-[420px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4">
            <h2 className="text-sm font-black tracking-wide">1 — COMPANY PROFILE</h2>
            <select value={companyId} onChange={e=> setCompanyId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold">
              {MOCK_COMPANIES.map(c=> <option key={c.id} value={c.id}>{c.legalName}</option>)}
            </select>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs leading-relaxed">
              <div className="font-bold">{company.legalName}</div>
              <div className="text-slate-600">Incorporated: {company.incorporatedStates.join(", ")} • Foreign: {company.foreignQualifications.join(", ")||"—"}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {company.licenses.map(l=> <span key={l.id} className="rounded-full bg-white border border-slate-200 px-2 py-0.5 font-semibold">{l.state} {l.trade} {l.classification} ({l.licenseNumber})</span>)}
              </div>
              <div className="mt-2 text-slate-500">Qualifiers: {company.qualifiers.map(q=> `${q.name} (${q.states.join("/")})`).join(", ")}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
            <h2 className="text-sm font-black tracking-wide">2 — PROJECT / JOB INTAKE</h2>
            <label className="block text-xs font-bold text-slate-700">Project title<input value={form.title} onChange={e=> setForm({...form, title:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-slate-700">City<input value={form.city} onChange={e=> setForm({...form, city:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
              <label className="block text-xs font-bold text-slate-700">State
                <select value={form.state} onChange={e=> setForm({...form, state:e.target.value as any})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">
                  <option value="NC">NC</option><option value="SC">SC</option><option value="VA">VA</option>
                </select>
              </label>
            </div>
            <label className="block text-xs font-bold text-slate-700">Address<input value={form.address} onChange={e=> setForm({...form, address:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
            <label className="block text-xs font-bold text-slate-700">County<input value={form.county} onChange={e=> setForm({...form, county:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Mecklenburg, Wake, etc." /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-slate-700">Trade
                <select value={form.trade} onChange={e=> setForm({...form, trade:e.target.value as Trade})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <option value="electrical">Electrical</option><option value="hvac">HVAC / Mechanical</option><option value="fire-protection">Fire Protection</option>
                </select>
              </label>
              <label className="block text-xs font-bold text-slate-700">Contract value ($)<input type="number" value={form.contractValue} onChange={e=> setForm({...form, contractValue: Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" /></label>
            </div>
            <label className="block text-xs font-bold text-slate-700">Scope<textarea value={form.scope} onChange={e=> setForm({...form, scope:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-slate-700">Role
                <select value={form.role} onChange={e=> setForm({...form, role:e.target.value as any})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <option value="subcontractor">Subcontractor</option><option value="general-contractor">General Contractor</option><option value="prime">Prime</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-6"><input type="checkbox" checked={!!form.isPublicWorks} onChange={e=> setForm({...form, isPublicWorks:e.target.checked})} /> Public works?</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-slate-700">Bid date<input type="date" value={form.bidDate||""} onChange={e=> setForm({...form, bidDate:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
              <label className="block text-xs font-bold text-slate-700">Est. start<input type="date" value={form.estimatedStartDate||""} onChange={e=> setForm({...form, estimatedStartDate:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
              Deterministic engine runs on every keystroke. No LLM decision — LLM is for research summarization only.
            </div>
          </div>
        </div>

        <div>
          <EligibilityCard result={result} />
          <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-5">
            <h3 className="text-sm font-black">AI-assisted regulatory research (mock v1)</h3>
            <p className="text-xs text-slate-600 mt-1">Per spec: LLMs extract, research, summarize, explain — with citations to official government sources. v1 keeps filing <span className="font-semibold">out</span>.</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs font-bold text-slate-500">AI SUMMARY FOR {form.city.toUpperCase()}, {form.state}</div>
                <div className="mt-1 leading-relaxed text-slate-700">For a <span className="font-semibold">${form.contractValue.toLocaleString()} {form.trade}</span> job in <span className="font-semibold">{form.city}, {form.state}</span>, the system extracted <span className="font-semibold">{result.satisfied.length + result.blockers.length} state/local requirements</span> and determined <span className="font-black uppercase">{result.status}</span>. Primary blocker: <span className="font-semibold">{result.blockers[0]?.requirement.label || "none — ready to bid"}</span>. Reciprocity {result.reciprocityOpportunities.length ? "available via " + result.reciprocityOpportunities[0].canUse.state : "not available"}.</div>
                <div className="mt-2 text-xs text-slate-500">Sources verified against {result.citations.slice(0,2).map(c=> c.authority).join(" & ")} on 2026-08-01.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckPage(){ return <Suspense fallback={<div className="mx-auto max-w-[1320px] px-6 py-10 text-sm text-slate-500">Loading eligibility check…</div>}><CheckPageInner/></Suspense>; }

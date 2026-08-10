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
    id: "custom-1", title: "Hospital HVAC retrofit", address: "1000 Blythe Blvd", city: "Charlotte", county: "Mecklenburg", state: "NC", trade: "hvac", scope: "Chiller + controls retrofit", contractValue: 1400000, role: "subcontractor", isPublicWorks: false, bidDate: "2026-09-15", estimatedStartDate: "2026-10-20",
  });
  const result = useMemo(()=> evaluateEligibility(company, form), [company, form]);
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Eligibility check</h1>
        <p className="mono text-sm text-zinc-600 mt-1">Job-level go/no-go — deterministic engine runs on every keystroke. <span className="font-semibold text-zinc-900">AINSIDE explains below.</span></p>
      </div>
      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3">
            <h2 className="mono text-xs tracking-[0.14em] text-zinc-500 font-semibold">01 — COMPANY PROFILE</h2>
            <select value={companyId} onChange={e=> setCompanyId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm">
              {MOCK_COMPANIES.map(c=> <option key={c.id} value={c.id}>{c.legalName}</option>)}
            </select>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 mono text-xs leading-relaxed">
              <div className="font-semibold text-zinc-900">{company.legalName}</div>
              <div className="text-zinc-500">INC: {company.incorporatedStates.join(", ")} • FQ: {company.foreignQualifications.join(", ")||"—"}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {company.licenses.map(l=> <span key={l.id} className="rounded-full bg-white border border-zinc-200 px-2 py-1 text-xs">{l.state} {l.trade} {l.classification}</span>)}
              </div>
              <div className="mt-2 text-zinc-500 mono text-xs">Qualifiers: {company.qualifiers.map(q=> `${q.name} (${q.states.join("/")})`).join(", ")}</div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3">
            <h2 className="mono text-xs tracking-[0.14em] text-zinc-500 font-semibold">02 — PROJECT / JOB INTAKE</h2>
            <label className="block mono text-xs font-semibold text-zinc-700">Project title<input value={form.title} onChange={e=> setForm({...form, title:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">City<input value={form.city} onChange={e=> setForm({...form, city:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" /></label>
              <label className="block mono text-xs font-semibold text-zinc-700">State<select value={form.state} onChange={e=> setForm({...form, state:e.target.value as any})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold"><option value="NC">NC</option><option value="SC">SC</option><option value="VA">VA</option></select></label>
            </div>
            <label className="block mono text-xs font-semibold text-zinc-700">Address<input value={form.address} onChange={e=> setForm({...form, address:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" /></label>
            <label className="block mono text-xs font-semibold text-zinc-700">County<input value={form.county} onChange={e=> setForm({...form, county:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" placeholder="Mecklenburg" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">Trade<select value={form.trade} onChange={e=> setForm({...form, trade:e.target.value as Trade})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"><option value="electrical">Electrical</option><option value="hvac">HVAC / Mechanical</option><option value="fire-protection">Fire Protection</option></select></label>
              <label className="block mono text-xs font-semibold text-zinc-700">Contract value $<input type="number" value={form.contractValue} onChange={e=> setForm({...form, contractValue: Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold" /></label>
            </div>
            <label className="block mono text-xs font-semibold text-zinc-700">Scope<textarea value={form.scope} onChange={e=> setForm({...form, scope:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">Role<select value={form.role} onChange={e=> setForm({...form, role:e.target.value as any})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"><option value="subcontractor">Subcontractor</option><option value="general-contractor">General Contractor</option><option value="prime">Prime</option></select></label>
              <label className="flex items-center gap-2 mono text-xs font-semibold text-zinc-700 mt-6"><input type="checkbox" checked={!!form.isPublicWorks} onChange={e=> setForm({...form, isPublicWorks:e.target.checked})} /> Public works?</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">Bid date<input type="date" value={form.bidDate||""} onChange={e=> setForm({...form, bidDate:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" /></label>
              <label className="block mono text-xs font-semibold text-zinc-700">Est. start<input type="date" value={form.estimatedStartDate||""} onChange={e=> setForm({...form, estimatedStartDate:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" /></label>
            </div>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 mono text-xs text-zinc-600">Deterministic engine runs every keystroke. No LLM decision — AINSIDE only explains below.</div>
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
export default function CheckPage(){ return <Suspense fallback={<div className="mx-auto max-w-[1200px] px-6 py-10 mono text-sm text-zinc-500">Loading…</div>}><CheckPageInner/></Suspense>; }

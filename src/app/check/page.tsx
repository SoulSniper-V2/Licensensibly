"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import EligibilityCard from "@/components/EligibilityCard";
import { ProjectInput, Trade } from "@/lib/types";
import AIResearchPanel from "@/components/AIResearchPanel";
import Link from "next/link";

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
  const [showCompanyPanel, setShowCompanyPanel] = useState(false);
  const [showIntakePanel, setShowIntakePanel] = useState(false);
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 space-y-6">
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eligibility check</h1>
          <p className="mono text-sm text-zinc-600 dark:text-zinc-400 mt-1">Job-level go/no-go — deterministic engine runs on every keystroke. <span className="font-semibold text-zinc-900 dark:text-zinc-100">AINSIDE explains below.</span></p>
        </div>
        <Link href="/settings" className="mono text-xs border border-zinc-200 dark:border-zinc-800 rounded-full px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:bg-zinc-800">Settings →</Link>
      </div>

      {/* Consolidated header bar — replaces static Company Profile card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="mono text-xs tracking-[0.14em] text-zinc-500 dark:text-zinc-400 font-semibold">COMPANY</span>
          <select value={companyId} onChange={e=> setCompanyId(e.target.value)} className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-sm font-medium">
            {MOCK_COMPANIES.map(c=> <option key={c.id} value={c.id}>{c.legalName}</option>)}
          </select>
          <span className="mono text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">{company.licenses.length} licenses • {company.licenses.map(l=> `${l.state} ${l.classification}`).join(" • ")}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={()=> setShowCompanyPanel(true)} className="mono text-xs bg-zinc-900 text-white rounded-full px-4 py-1.5 hover:bg-zinc-900">View company panel</button>
          <button onClick={()=> setShowIntakePanel(true)} className="mono text-xs border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:bg-zinc-800">Edit intake → panel</button>
        </div>
      </div>

      {/* Horizontal splits — per 5:00 AM request: was vertical [380px_1fr], now stacked */}
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Intake — now full-width horizontal */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="mono text-xs tracking-[0.14em] text-zinc-500 dark:text-zinc-400 font-semibold">02 — PROJECT / JOB INTAKE</h2>
              <button onClick={()=> setShowIntakePanel(true)} className="mono text-[11px] text-zinc-500 dark:text-zinc-400 underline">open as panel</button>
            </div>
            <label className="block mono text-xs font-semibold text-zinc-700">Project title<input value={form.title} onChange={e=> setForm({...form, title:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-3 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">City<input value={form.city} onChange={e=> setForm({...form, city:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
              <label className="block mono text-xs font-semibold text-zinc-700">State<select value={form.state} onChange={e=> setForm({...form, state:e.target.value as any})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm font-semibold"><option value="NC">NC</option><option value="SC">SC</option><option value="VA">VA</option></select></label>
              <label className="block mono text-xs font-semibold text-zinc-700">County<input value={form.county} onChange={e=> setForm({...form, county:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" placeholder="Mecklenburg" /></label>
            </div>
            <label className="block mono text-xs font-semibold text-zinc-700">Address<input value={form.address} onChange={e=> setForm({...form, address:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-3 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">Trade<select value={form.trade} onChange={e=> setForm({...form, trade:e.target.value as Trade})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm"><option value="electrical">Electrical</option><option value="hvac">HVAC / Mechanical</option><option value="fire-protection">Fire Protection</option></select></label>
              <label className="block mono text-xs font-semibold text-zinc-700">Contract value $<input type="number" value={form.contractValue} onChange={e=> setForm({...form, contractValue: Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm font-semibold" /></label>
              <label className="block mono text-xs font-semibold text-zinc-700">Role<select value={form.role} onChange={e=> setForm({...form, role:e.target.value as any})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm"><option value="subcontractor">Subcontractor</option><option value="general-contractor">General Contractor</option><option value="prime">Prime</option></select></label>
            </div>
            <label className="block mono text-xs font-semibold text-zinc-700">Scope<textarea value={form.scope} onChange={e=> setForm({...form, scope:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 mono text-xs font-semibold text-zinc-700 mt-2"><input type="checkbox" checked={!!form.isPublicWorks} onChange={e=> setForm({...form, isPublicWorks:e.target.checked})} /> Public works?</label>
              <span className="mono text-xs text-zinc-500 dark:text-zinc-400 flex items-center">Horizontal split — intake now 3-col</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">Bid date<input type="date" value={form.bidDate||""} onChange={e=> setForm({...form, bidDate:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
              <label className="block mono text-xs font-semibold text-zinc-700">Est. start<input type="date" value={form.estimatedStartDate||""} onChange={e=> setForm({...form, estimatedStartDate:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            </div>
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 mono text-xs text-zinc-600 dark:text-zinc-400">Deterministic engine runs every keystroke. No LLM decision — AINSIDE only explains below.</div>
          </div>
        </div>
        <div className="space-y-4">
          <EligibilityCard result={result} />
          <AIResearchPanel result={result} city={form.city} state={form.state} trade={form.trade} value={form.contractValue} />
        </div>
      </div>

      {/* Company Profile Slide-Over Panel */}
      {showCompanyPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-zinc-900/40 backdrop-blur-sm" onClick={()=>setShowCompanyPanel(false)} />
          <div className="w-[480px] max-w-[90vw] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="mono text-xs tracking-[0.14em] text-zinc-500 dark:text-zinc-400 font-semibold">COMPANY PROFILE — PANEL</h3>
              <button onClick={()=>setShowCompanyPanel(false)} className="rounded-full border border-zinc-200 dark:border-zinc-800 mono text-xs px-3 py-1.5 hover:bg-zinc-50 dark:bg-zinc-800">Close</button>
            </div>
            <div className="rounded-2xl bg-zinc-900 text-white p-5 space-y-2">
              <div className="font-bold">{company.legalName}</div>
              <div className="mono text-xs text-zinc-400">INC: {company.incorporatedStates.join(", ")} • FQ: {company.foreignQualifications.join(", ")||"—"}</div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {company.licenses.map(l=> <span key={l.id} className="rounded-full bg-white dark:bg-zinc-900/10 border border-white/20 px-2.5 py-1 text-xs">{l.state} {l.trade} {l.classification}</span>)}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="mono text-xs font-semibold text-zinc-700">Licenses</h4>
              {company.licenses.map(l=> (
                <div key={l.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 mono text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">{l.state} — {l.trade} — {l.classification}</div>
                  <div className="text-zinc-500 dark:text-zinc-400 mt-1">{l.licenseNumber} • Qualifier: {l.qualifier}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">Issued {l.issuedDate} • Exp {l.expiryDate} • {l.status}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 mono text-xs text-zinc-600 dark:text-zinc-400">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Qualifiers</div>
              <div className="mt-1">{company.qualifiers.map(q=> `${q.name} (${q.trades.join(", ")} — ${q.states.join("/")})`).join(" • ")}</div>
              <div className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">Insurance</div>
              <div className="mt-1">GL ${company.insurance.generalLiability.amount.toLocaleString()} exp {company.insurance.generalLiability.expiry} • Workers comp: {company.insurance.workersComp ? "yes" : "no"}</div>
            </div>
            <Link href="/settings" onClick={()=>setShowCompanyPanel(false)} className="block text-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mono text-xs font-semibold py-2.5 hover:bg-zinc-50 dark:bg-zinc-800">Open full Settings →</Link>
            <p className="mono text-xs text-zinc-500 dark:text-zinc-400">This panel consolidates the previously static Company Profile card into a popup per your 4:41 AM request. Same data, ~60% less vertical chrome on Check.</p>
          </div>
        </div>
      )}

      {showIntakePanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-zinc-900/40 backdrop-blur-sm" onClick={()=>setShowIntakePanel(false)} />
          <div className="w-[520px] max-w-[90vw] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="mono text-xs tracking-[0.14em] text-zinc-500 dark:text-zinc-400 font-semibold">PROJECT INTAKE — PANEL</h3>
              <button onClick={()=>setShowIntakePanel(false)} className="rounded-full border border-zinc-200 dark:border-zinc-800 mono text-xs px-3 py-1.5 hover:bg-zinc-50 dark:bg-zinc-800">Close</button>
            </div>
            <p className="mono text-xs text-zinc-600 dark:text-zinc-400">Full intake as a slide-over — proves the “everything in popups/panels” direction. You can keep the inline form or switch to panel-only later.</p>
            <label className="block mono text-xs font-semibold text-zinc-700">Project title<input value={form.title} onChange={e=> setForm({...form, title:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">City<input value={form.city} onChange={e=> setForm({...form, city:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
              <label className="block mono text-xs font-semibold text-zinc-700">State<select value={form.state} onChange={e=> setForm({...form, state:e.target.value as any})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm font-semibold"><option value="NC">NC</option><option value="SC">SC</option><option value="VA">VA</option></select></label>
            </div>
            <label className="block mono text-xs font-semibold text-zinc-700">Address<input value={form.address} onChange={e=> setForm({...form, address:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            <label className="block mono text-xs font-semibold text-zinc-700">County<input value={form.county} onChange={e=> setForm({...form, county:e.target.value})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block mono text-xs font-semibold text-zinc-700">Trade<select value={form.trade} onChange={e=> setForm({...form, trade:e.target.value as Trade})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm"><option value="electrical">Electrical</option><option value="hvac">HVAC</option><option value="fire-protection">Fire Protection</option></select></label>
              <label className="block mono text-xs font-semibold text-zinc-700">Value $<input type="number" value={form.contractValue} onChange={e=> setForm({...form, contractValue: Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            </div>
            <label className="block mono text-xs font-semibold text-zinc-700">Scope<textarea value={form.scope} onChange={e=> setForm({...form, scope:e.target.value})} rows={3} className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" /></label>
            <button onClick={()=>setShowIntakePanel(false)} className="w-full rounded-full bg-zinc-900 text-white mono text-xs font-semibold py-2.5 hover:bg-zinc-900">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default function CheckPage(){ return <Suspense fallback={<div className="mx-auto max-w-[1200px] px-6 py-10 mono text-sm text-zinc-500 dark:text-zinc-400">Loading…</div>}><CheckPageInner/></Suspense>; }

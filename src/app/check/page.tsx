"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import EligibilityCard from "@/components/EligibilityCard";
import { ProjectInput, Trade } from "@/lib/types";
import AIResearchPanel from "@/components/AIResearchPanel";
import Link from "next/link";
import { X, MagnifyingGlass, BuildingOffice } from "@phosphor-icons/react";

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

  const inputCls = "mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2.5 text-[13px] font-medium placeholder:text-[var(--muted-2)] focus:outline-none focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--ink)]/10 transition-all";
  const labelCls = "block mono text-[11px] font-semibold tracking-wide text-[var(--muted)]";

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-8 space-y-6">
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 mono text-[11px] tracking-[0.12em] font-semibold text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"/> ELIGIBILITY CHECK
          </div>
          <h1 className="text-[28px] font-bold tracking-[-0.03em] mt-1">Job-level go / no-go</h1>
          <p className="mono text-[13px] text-[var(--muted)] mt-1 leading-relaxed">Deterministic engine runs on every keystroke. <span className="font-semibold text-[var(--ink)]">AINSIDE only explains below.</span></p>
        </div>
        <Link href="/companies" className="hidden sm:inline-flex mono text-[11px] font-medium border border-[var(--border)] rounded-full px-3.5 py-2 bg-[var(--surface)] hover:bg-[var(--surface-2)]">Companies →</Link>
      </div>

      {/* Company bar — folder tab style */}
      <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-3 flex flex-wrap gap-3 items-center justify-between shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)] flex items-center gap-1.5"><BuildingOffice size={12}/> COMPANY</span>
          <select value={companyId} onChange={e=> setCompanyId(e.target.value)} className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2 text-[13px] font-semibold focus:outline-none focus:border-[var(--ink)]">
            {MOCK_COMPANIES.map(c=> <option key={c.id} value={c.id}>{c.legalName}</option>)}
          </select>
          <span className="mono text-[11px] text-[var(--muted)] hidden lg:inline border-l border-[var(--border)] pl-3 ml-1">{company.licenses.length} licenses · {company.licenses.map(l=> `${l.state} ${l.classification}`).join(" · ")}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={()=> setShowCompanyPanel(true)} className="mono text-[11px] font-semibold bg-[var(--ink)] text-white dark:bg-white dark:text-black rounded-full px-4 py-2 hover:opacity-90 active:scale-[0.98]">View company</button>
          <button onClick={()=> setShowIntakePanel(true)} className="mono text-[11px] font-semibold border border-[var(--border)] rounded-full px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-2)] active:scale-[0.98]">Edit intake</button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Intake */}
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-soft">
          <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)]/60">
            <h2 className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)] flex items-center gap-2"><MagnifyingGlass size={12}/> PROJECT / JOB INTAKE</h2>
            <button onClick={()=> setShowIntakePanel(true)} className="mono text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)] underline decoration-[var(--border)] underline-offset-4">Open as panel</button>
          </div>
          <div className="p-6 space-y-4">
            <label className={labelCls}>Project title<input value={form.title} onChange={e=> setForm({...form, title:e.target.value})} className={inputCls} placeholder="e.g. Hospital HVAC retrofit" /></label>
            <div className="grid sm:grid-cols-3 gap-4">
              <label className={labelCls}>City<input value={form.city} onChange={e=> setForm({...form, city:e.target.value})} className={inputCls} /></label>
              <label className={labelCls}>State<select value={form.state} onChange={e=> setForm({...form, state:e.target.value as any})} className={inputCls}><option value="NC">NC</option><option value="SC">SC</option><option value="VA">VA</option></select></label>
              <label className={labelCls}>County<input value={form.county} onChange={e=> setForm({...form, county:e.target.value})} className={inputCls} placeholder="Mecklenburg" /></label>
            </div>
            <label className={labelCls}>Street address<input value={form.address} onChange={e=> setForm({...form, address:e.target.value})} className={inputCls} /></label>
            <div className="grid sm:grid-cols-3 gap-4">
              <label className={labelCls}>Trade<select value={form.trade} onChange={e=> setForm({...form, trade:e.target.value as Trade})} className={inputCls}><option value="electrical">Electrical</option><option value="hvac">HVAC / Mechanical</option><option value="fire-protection">Fire Protection</option></select></label>
              <label className={labelCls}>Contract value — $<input type="number" value={form.contractValue} onChange={e=> setForm({...form, contractValue: Number(e.target.value)})} className={inputCls} /></label>
              <label className={labelCls}>Role<select value={form.role} onChange={e=> setForm({...form, role:e.target.value as any})} className={inputCls}><option value="subcontractor">Subcontractor</option><option value="general-contractor">General Contractor</option><option value="prime">Prime</option></select></label>
            </div>
            <label className={labelCls}>Scope<textarea value={form.scope} onChange={e=> setForm({...form, scope:e.target.value})} rows={2} className={inputCls + " resize-none"} /></label>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 mono text-[12px] font-medium text-[var(--ink)]"><input type="checkbox" checked={!!form.isPublicWorks} onChange={e=> setForm({...form, isPublicWorks:e.target.checked})} className="rounded border-[var(--border)]" /> Public works?</label>
              <span className="mono text-[11px] text-[var(--muted-2)]">Engine re-evaluates instantly — no save needed</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className={labelCls}>Bid date<input type="date" value={form.bidDate||""} onChange={e=> setForm({...form, bidDate:e.target.value})} className={inputCls} /></label>
              <label className={labelCls}>Est. start<input type="date" value={form.estimatedStartDate||""} onChange={e=> setForm({...form, estimatedStartDate:e.target.value})} className={inputCls} /></label>
            </div>
            <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 mono text-[11px] leading-relaxed text-[var(--muted)] flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] mt-1.5 shrink-0"/> Deterministic — no LLM in the decision. AINSIDE explains the result below.
            </div>
          </div>
        </div>

        <EligibilityCard result={result} />
        <AIResearchPanel result={result} city={form.city} state={form.state} trade={form.trade} value={form.contractValue} />
      </div>

      {/* Company slide-over */}
      {showCompanyPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-[var(--ink)]/30 backdrop-blur-sm" onClick={()=>setShowCompanyPanel(false)} />
          <div className="w-[480px] max-w-[90vw] bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl p-6 space-y-5 overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">COMPANY PROFILE</h3>
              <button onClick={()=>setShowCompanyPanel(false)} className="h-8 w-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-2)]"><X size={14}/></button>
            </div>
            <div className="rounded-2xl bg-[var(--ink)] text-white dark:bg-white dark:text-black p-5">
              <div className="font-bold text-[15px]">{company.legalName}</div>
              <div className="mono text-[11px] opacity-60 mt-1">INC: {company.incorporatedStates.join(", ")} · FQ: {company.foreignQualifications.join(", ")||"—"}</div>
              <div className="flex flex-wrap gap-1.5 pt-3">
                {company.licenses.map(l=> <span key={l.id} className="rounded-full bg-white/10 dark:bg-black/10 border border-white/15 dark:border-black/10 px-2.5 py-1 mono text-[11px]">{l.state} {l.trade} {l.classification}</span>)}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="mono text-[11px] font-semibold tracking-wide text-[var(--muted)]">LICENSES</h4>
              {company.licenses.map(l=> (
                <div key={l.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3 mono text-[12px]">
                  <div className="font-semibold">{l.state} — {l.trade} — {l.classification}</div>
                  <div className="text-[var(--muted)] mt-1">{l.licenseNumber} · Qualifier: {l.qualifier}</div>
                  <div className="text-[var(--muted)]">Issued {l.issuedDate} · Exp {l.expiryDate} · {l.status}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] p-4 mono text-[11px] leading-relaxed text-[var(--muted)]">
              <div className="font-semibold text-[var(--ink)]">Qualifiers</div>
              <div className="mt-1">{company.qualifiers.map(q=> `${q.name} (${q.trades.join(", ")} — ${q.states.join("/")})`).join(" · ") || "—"}</div>
              <div className="mt-3 font-semibold text-[var(--ink)]">Insurance</div>
              <div className="mt-1">GL ${company.insurance.generalLiability.amount.toLocaleString()} exp {company.insurance.generalLiability.expiry} · Workers comp: {company.insurance.workersComp ? "yes" : "no"}</div>
            </div>
            <Link href="/companies" onClick={()=>setShowCompanyPanel(false)} className="block text-center rounded-full border border-[var(--border)] bg-[var(--surface)] mono text-[12px] font-semibold py-2.5 hover:bg-[var(--surface-2)]">Open Companies →</Link>
          </div>
        </div>
      )}

      {showIntakePanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-[var(--ink)]/30 backdrop-blur-sm" onClick={()=>setShowIntakePanel(false)} />
          <div className="w-[520px] max-w-[90vw] bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl p-6 space-y-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">PROJECT INTAKE</h3>
              <button onClick={()=>setShowIntakePanel(false)} className="h-8 w-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-2)]"><X size={14}/></button>
            </div>
            <p className="mono text-[11px] leading-relaxed text-[var(--muted)]">Same form as a slide-over — use whichever feels faster.</p>
            <label className={labelCls}>Project title<input value={form.title} onChange={e=> setForm({...form, title:e.target.value})} className={inputCls} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelCls}>City<input value={form.city} onChange={e=> setForm({...form, city:e.target.value})} className={inputCls} /></label>
              <label className={labelCls}>State<select value={form.state} onChange={e=> setForm({...form, state:e.target.value as any})} className={inputCls}><option value="NC">NC</option><option value="SC">SC</option><option value="VA">VA</option></select></label>
            </div>
            <label className={labelCls}>Address<input value={form.address} onChange={e=> setForm({...form, address:e.target.value})} className={inputCls} /></label>
            <label className={labelCls}>County<input value={form.county} onChange={e=> setForm({...form, county:e.target.value})} className={inputCls} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelCls}>Trade<select value={form.trade} onChange={e=> setForm({...form, trade:e.target.value as Trade})} className={inputCls}><option value="electrical">Electrical</option><option value="hvac">HVAC</option><option value="fire-protection">Fire Protection</option></select></label>
              <label className={labelCls}>Value $<input type="number" value={form.contractValue} onChange={e=> setForm({...form, contractValue: Number(e.target.value)})} className={inputCls} /></label>
            </div>
            <label className={labelCls}>Scope<textarea value={form.scope} onChange={e=> setForm({...form, scope:e.target.value})} rows={3} className={inputCls + " resize-none"} /></label>
            <button onClick={()=>setShowIntakePanel(false)} className="w-full rounded-full bg-[var(--ink)] text-white dark:bg-white dark:text-black mono text-[12px] font-semibold py-2.5 hover:opacity-90">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default function CheckPage(){ return <Suspense fallback={<div className="mx-auto max-w-[1200px] px-6 md:px-8 py-10 mono text-[12px] text-[var(--muted)]">Loading…</div>}><CheckPageInner/></Suspense>; }

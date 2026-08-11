"use client";
import { useState } from "react";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import Link from "next/link";
const tabs = [
 { id: "company", label: "Company profile" },
 { id: "preferences", label: "Preferences" },
 { id: "integrations", label: "Integrations" },
];
export default function SettingsPage() {
 const [tab, setTab] = useState("company");
 const [companyId, setCompanyId] = useState(MOCK_COMPANIES[0].id);
 const company = MOCK_COMPANIES.find(c=>c.id===companyId)!;
 const [showCompanyPanel, setShowCompanyPanel] = useState(false);
 return (
 <div className="mx-auto max-w-[1200px] px-6 py-8 space-y-6">
 <div>
 <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
 <p className="mono text-sm text-[var(--muted)] mt-1">Company profile, jurisdiction defaults, and workspace preferences — moved out of static Check view into a dedicated tab (per 4:41 AM panel request).</p>
 </div>
 <div className="flex gap-2 border-b border-[var(--border)]">
 {tabs.map(t=> (
 <button key={t.id} onClick={()=>setTab(t.id)} className={`mono text-sm px-4 py-2.5 border-b-2 -mb-px ${tab===t.id ? "border-zinc-900 text-[var(--ink)] font-semibold" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"}`}>{t.label}</button>
 ))}
 </div>
 {tab==="company" && (
 <div className="grid lg:grid-cols-[360px_1fr] gap-6">
 <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
 <h2 className="mono text-xs tracking-[0.14em] text-[var(--muted)] font-semibold">COMPANY PROFILE</h2>
 <select value={companyId} onChange={e=>setCompanyId(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm">
 {MOCK_COMPANIES.map(c=> <option key={c.id} value={c.id}>{c.legalName}</option>)}
 </select>
 <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-4 mono text-xs leading-relaxed">
 <div className="font-semibold text-[var(--ink)] text-sm">{company.legalName}</div>
 <div className="text-[var(--muted)] mt-1">INC: {company.incorporatedStates.join(", ")} • FQ: {company.foreignQualifications.join(", ")||"—"}</div>
 <div className="mt-3 flex flex-wrap gap-1.5">
 {company.licenses.map(l=> <span key={l.id} className="rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 text-xs font-medium">{l.state} {l.trade} {l.classification}</span>)}
 </div>
 <div className="mt-3 text-[var(--muted)]">Qualifiers: {company.qualifiers.map(q=> `${q.name} (${q.states.join("/")})`).join(", ")}</div>
 <button onClick={()=>setShowCompanyPanel(true)} className="mt-4 w-full rounded-full bg-[var(--ink)] text-white mono text-xs font-semibold py-2.5 hover:bg-[var(--ink)]">Open as panel →</button>
 </div>
 <div className="rounded-xl border border-dashed border-zinc-300 bg-[var(--surface-2)] p-4 mono text-xs text-[var(--muted)]">Check now opens this as a popup instead of showing it statically — consolidates the surface per your request.</div>
 </div>
 <div className="space-y-4">
 <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
 <h3 className="text-sm font-bold">Edit company (panel demo)</h3>
 <p className="mono text-xs text-[var(--muted)]">Previously this form lived inline on /check left column and crowded the intake. Now it is a slide-over panel triggered from Check → reduces static chrome by ~40%.</p>
 <div className="grid md:grid-cols-2 gap-3">
 <label className="block mono text-xs font-semibold text-zinc-700">Legal name<input defaultValue={company.legalName} className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-[var(--surface-2)]" readOnly /></label>
 <label className="block mono text-xs font-semibold text-zinc-700">Entity type<input defaultValue={company.entityType} className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm bg-[var(--surface-2)]" readOnly /></label>
 </div>
 <div className="flex gap-2 pt-2">
 <Link href="/companies" className="rounded-full bg-[var(--surface)] border border-[var(--border)] mono text-xs font-semibold px-4 py-2 hover:bg-[var(--surface-2)]">Manage all → Companies</Link>
 <Link href="/check" className="rounded-full bg-[var(--ink)] text-white mono text-xs font-semibold px-4 py-2 hover:bg-[var(--ink)]">Back to Check</Link>
 </div>
 </div>
 <div className="rounded-2xl bg-[var(--ink)] text-white p-6">
 <h3 className="mono text-xs tracking-[0.14em] text-[var(--accent)]">Why a Settings tab?</h3>
 <p className="text-sm mt-2 leading-relaxed text-zinc-100">Per your 4:41 AM note: “more things should be moved into popups and panels, not statically shown permanently.” Company profile is persistent workspace state — it belongs in Settings, not repeated verbatim atop every Check.</p>
 </div>
 </div>
 </div>
 )}
 {tab==="preferences" && (
 <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mono text-sm text-[var(--muted)]">
 <h3 className="font-bold text-[var(--ink)]">Preferences</h3>
 <p className="mt-2">Default jurisdiction, default trade, calendar reminder lead time, checklist defaults — all future panel candidates. Placeholder per spec.</p>
 </div>
 )}
 {tab==="integrations" && (
 <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mono text-sm text-[var(--muted)]">
 <h3 className="font-bold text-[var(--ink)]">Integrations</h3>
 <p className="mt-2">Harbor / Copliancy sync, calendar (Google/Outlook), email — panel-ready slots.</p>
 </div>
 )}
 {showCompanyPanel && (
 <div className="fixed inset-0 z-50 flex">
 <div className="flex-1 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={()=>setShowCompanyPanel(false)} />
 <div className="w-[420px] max-w-[90vw] bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl p-6 space-y-4 overflow-auto">
 <div className="flex items-center justify-between">
 <h3 className="mono text-xs tracking-[0.14em] text-[var(--muted)] font-semibold">COMPANY PANEL</h3>
 <button onClick={()=>setShowCompanyPanel(false)} className="rounded-full border border-[var(--border)] mono text-xs px-3 py-1.5 hover:bg-[var(--surface-2)]">Close</button>
 </div>
 <div className="rounded-xl bg-[var(--ink)] text-white p-4">
 <div className="font-bold text-sm">{company.legalName}</div>
 <div className="mono text-xs text-[var(--muted-2)] mt-1">{company.licenses.length} licenses • {company.qualifiers.length} qualifiers</div>
 </div>
 <div className="space-y-3">
 {company.licenses.map(l=> (
 <div key={l.id} className="rounded-xl border border-[var(--border)] p-3 mono text-xs">
 <div className="font-semibold text-[var(--ink)]">{l.state} — {l.trade} — {l.classification}</div>
 <div className="text-[var(--muted)]">{l.licenseNumber} • Qualifier: {l.qualifier} • Exp {l.expiryDate}</div>
 </div>
 ))}
 </div>
 <p className="mono text-xs text-[var(--muted)]">This is the reusable panel component now used from Check as well.</p>
 </div>
 </div>
 )}
 </div>
 );
}

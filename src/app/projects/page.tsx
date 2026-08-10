"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_COMPANIES, MOCK_PROJECTS } from "@/lib/mock-data";
import { evaluateEligibility } from "@/lib/eligibility-engine";
import { classificationNeeded } from "@/lib/regulatory-data";

export default function ProjectsPage() {
  const [companyId, setCompanyId] = useState(MOCK_COMPANIES[0].id);
  const company = MOCK_COMPANIES.find(c=>c.id===companyId)!;
  const [stateFilter, setStateFilter] = useState<"all"|"NC"|"SC"|"VA">("all");
  const [tradeFilter, setTradeFilter] = useState<"all"|string>("all");

  const filtered = useMemo(()=> MOCK_PROJECTS.filter(p=>{
    if(stateFilter!=="all" && p.state!==stateFilter) return false;
    if(tradeFilter!=="all" && p.trade!==tradeFilter) return false;
    return true;
  }), [stateFilter, tradeFilter]);

  function badgeFor(p: typeof MOCK_PROJECTS[number]) {
    const res = evaluateEligibility(company, p);
    if(res.status==="eligible") return {label:"ELIGIBLE", cls:"bg-emerald-50 border-emerald-200 text-emerald-700"};
    if(res.status==="conditional") return {label:"CONDITIONAL", cls:"bg-amber-50 border-amber-300 text-amber-700"};
    return {label:"NOT ELIGIBLE", cls:"bg-red-50 border-red-300 text-red-700"};
  }

  const daysUntil = (iso?:string)=> {
    if(!iso) return null;
    const d = Math.ceil((new Date(iso).getTime()-Date.now())/86400000);
    return d;
  };

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Projects & Opportunities</h1>
          <p className="text-sm text-slate-600 mt-1">MVP #2 — Project intake feed. Each card shows <span className="font-semibold">classificationNeeded(state, trade, value)</span> + live eligibility vs selected company. Click “Check” to open the deterministic engine.</p>
        </div>
        <Link href="/check" className="rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 px-5 py-2.5 text-sm font-bold">+ New Eligibility Check →</Link>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-wrap items-center gap-3">
        <div className="text-xs font-black tracking-wide text-slate-500">FILTER</div>
        <select value={stateFilter} onChange={e=> setStateFilter(e.target.value as any)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
          <option value="all">All states</option><option value="NC">NC</option><option value="SC">SC</option><option value="VA">VA</option>
        </select>
        <select value={tradeFilter} onChange={e=> setTradeFilter(e.target.value as any)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
          <option value="all">All trades</option><option value="electrical">Electrical</option><option value="hvac">HVAC</option><option value="fire-protection">Fire Protection</option>
        </select>
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          Evaluate as
          <select value={companyId} onChange={e=> setCompanyId(e.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
            {MOCK_COMPANIES.map(c=> <option key={c.id} value={c.id}>{c.legalName}</option>)}
          </select>
        </label>
        <span className="text-xs text-slate-500 ml-auto hidden sm:inline">Showing {filtered.length} of {MOCK_PROJECTS.length} • NC {"<"} $40k exempt • SC {"<"} $5k • VA Class C/B/A thresholds</span>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(p=>{
          const needed = classificationNeeded(p.state, p.trade, p.contractValue);
          const badge = badgeFor(p);
          const res = evaluateEligibility(company, p);
          const d = daysUntil(p.bidDate);
          const urgent = d!==null && d<=14 && d>=0;
          const overdue = d!==null && d<0;
          return (
            <div key={p.id} className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black tracking-wide ${badge.cls}`}>{badge.label}</span>
                  <span className="text-xs font-semibold text-slate-500">{p.state} • {p.city}{p.county ? ` • ${p.county}`:""}</span>
                </div>
                <h3 className="text-[15px] font-bold leading-tight mt-3 line-clamp-2">{p.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{p.scope}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                  <span className="rounded-full bg-slate-900 text-white px-2.5 py-1">{p.trade}</span>
                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1">${p.contractValue.toLocaleString()}</span>
                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1">{p.role}</span>
                  {p.isPublicWorks ? <span className="rounded-full bg-violet-50 border border-violet-200 text-violet-700 px-2.5 py-1">Public works</span> : <span className="rounded-full bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1">Private</span>}
                </div>
              </div>
              <div className="mx-5 mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="text-[11px] font-bold tracking-wide text-slate-500">CLASSIFICATION NEEDED</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{needed}</div>
                <div className="text-xs text-slate-600 mt-1">{res.estimatedReadiness.label} • {res.blockers.length} blocker(s){res.reciprocityOpportunities.length?` • ${res.reciprocityOpportunities.length} reciprocity`:""}</div>
              </div>
              <div className="px-5 py-3 flex items-center gap-2 text-xs">
                <span className={`font-bold ${overdue?"text-red-600":urgent?"text-amber-600":"text-slate-600"}`}>{p.bidDate ? (overdue?`Bid was ${Math.abs(d!)}d ago`: urgent?`Bid in ${d}d — urgent`:`Bid ${p.bidDate}`): "No bid date"}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 truncate">{p.address}</span>
              </div>
              <div className="mt-auto border-t border-slate-100 p-4 flex gap-2">
                <Link href={`/check?projectId=${p.id}&companyId=${company.id}`} className="flex-1 rounded-full bg-slate-900 text-white text-sm font-bold py-2.5 text-center hover:bg-slate-800">Check eligibility →</Link>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(p.address+", "+p.city+", "+p.state)}`} target="_blank" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold">Map</a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length===0 && (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
          <div className="text-sm font-bold text-slate-700">No projects match filter</div>
          <button onClick={()=> {setStateFilter("all"); setTradeFilter("all");}} className="mt-3 text-sm font-semibold underline">Clear filters</button>
        </div>
      )}

      <div className="rounded-2xl bg-slate-900 text-white p-6 flex flex-wrap gap-6">
        <div className="min-w-[260px] flex-1">
          <div className="text-amber-300 text-xs font-black tracking-wide">NARROW VERTICAL • NC + SC + VA</div>
          <div className="text-sm leading-relaxed text-slate-300 mt-2">Commercial electrical + HVAC + fire-protection only. Thresholds enforced deterministically: NC {"<"} $40k exempt, SC {"<"} $5k, VA Class C {"<"} $30k / B {"<"} $120k / A unlimited. Going nationwide too early collapses the data moat.</div>
        </div>
        <div className="rounded-xl bg-white/10 border border-white/15 p-4 text-xs leading-relaxed text-slate-300 min-w-[280px]">
          <span className="font-bold text-white">Interview script (do 10 before scaling):</span><br/>“Walk me through the last time you considered taking a project somewhere you hadn’t worked before. How did you determine whether you could legally bid and perform it?”
        </div>
      </div>
    </div>
  );
}

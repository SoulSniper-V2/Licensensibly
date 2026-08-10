"use client";
import { EligibilityResult } from "@/lib/types";
import { classificationNeeded } from "@/lib/regulatory-data";

export default function EligibilityCard({ result }: { result: EligibilityResult }) {
  const statusLabel = result.status === "eligible" ? "ELIGIBLE TO BID" : result.status === "conditional" ? "CONDITIONAL" : result.status === "ineligible" ? "NOT ELIGIBLE" : "NEEDS REVIEW";
  const needed = classificationNeeded(result.project.state, result.project.trade, result.project.contractValue);
  const isEligible = result.status === "eligible";
  const isConditional = result.status === "conditional";
  return (
    <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-white">
      <div className={`px-6 py-5 flex flex-wrap gap-4 items-center justify-between ${isEligible ? "bg-emerald-50" : isConditional ? "bg-amber-50" : "bg-red-50"}`}>
        <div>
          <div className="mono text-[11px] tracking-[0.14em] text-zinc-500">BID ELIGIBILITY • DETERMINISTIC ENGINE</div>
          <div className={`text-xl font-bold tracking-tight mt-1 ${isEligible ? "text-emerald-700" : isConditional ? "text-amber-700" : "text-red-700"}`}>{statusLabel}</div>
          <div className="text-sm text-zinc-600 mt-1">{result.company.legalName} → {result.project.title}</div>
        </div>
        <div className="text-right">
          <div className="mono text-[11px] tracking-[0.14em] text-zinc-500">EST. READINESS</div>
          <div className="text-sm font-bold">{result.estimatedReadiness.label}</div>
          <div className="mono text-xs text-zinc-500 mt-1">{result.project.state} • {needed} • ${result.project.contractValue.toLocaleString()}</div>
        </div>
      </div>
      <div className="grid lg:grid-cols-[1.35fr_0.85fr] gap-0">
        <div className="p-6 space-y-4 bg-white border-t lg:border-t-0 lg:border-r border-zinc-200">
          <h3 className="mono text-xs tracking-[0.14em] text-zinc-500">BLOCKERS BEFORE BID <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 text-white text-xs px-1.5">{result.blockers.length}</span></h3>
          {result.blockers.length === 0 ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">No blockers — appears eligible. Verify local AHJ before submission.</div>
          ) : result.blockers.map(b => (
            <div key={b.requirement.id} className="rounded-xl border border-zinc-200 p-4 bg-zinc-50">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold">{b.requirement.label}</div>
                <a href={b.requirement.sourceUrl} target="_blank" className="mono text-[11px] text-zinc-500 underline shrink-0">SOURCE ↗</a>
              </div>
              <div className="text-xs text-amber-700 mt-1 font-medium">{b.reason}</div>
              <div className="text-sm text-zinc-700 mt-2 leading-relaxed">{b.remediation}</div>
              <div className="mt-3 flex flex-wrap gap-2 mono text-xs">
                <span className="rounded-full bg-white border border-zinc-200 px-2.5 py-1">{b.estimatedDays} days</span>
                {b.fee && <span className="rounded-full bg-white border border-zinc-200 px-2.5 py-1 text-zinc-600">{b.fee}</span>}
                <span className="rounded-full bg-zinc-900 text-white px-2.5 py-1">{b.requirement.authority}</span>
              </div>
            </div>
          ))}
          {result.reciprocityOpportunities.length>0 && (
            <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
              <div className="text-sm font-semibold text-sky-900">Reciprocity pathway</div>
              {result.reciprocityOpportunities.map((r,i)=> <div key={i} className="text-sm text-zinc-700 mt-1">Use <span className="font-semibold">{r.canUse.state} {r.canUse.classification} ({r.canUse.licenseNumber})</span> to endorse into {r.requirement.label}. <span className="mono text-xs text-zinc-500">{r.note}</span></div>)}
            </div>
          )}
          {result.warnings.length>0 && (
            <div className="space-y-2">
              <div className="mono text-xs tracking-[0.14em] text-amber-600">WARNINGS</div>
              {result.warnings.map(w=> <div key={w.requirement.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3 mono text-xs text-amber-800">{w.requirement.label}: {w.reason}</div>)}
            </div>
          )}
        </div>
        <div className="p-6 space-y-6 bg-zinc-50 border-t lg:border-t-0 border-zinc-200">
          <div>
            <h4 className="mono text-xs tracking-[0.14em] text-zinc-500">CHECKLIST</h4>
            <div className="mt-3 space-y-2">
              {result.checklist.map(item=> (
                <div key={item.id} className="flex gap-3 rounded-xl bg-white border border-zinc-200 p-3">
                  <div className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${item.status==="done" ? "bg-emerald-500" : item.status==="blocked" ? "bg-red-500" : "bg-zinc-300"}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold leading-tight">{item.title}</div>
                    <div className="mono text-[11px] text-zinc-500">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "no due date"} • {item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mono text-xs tracking-[0.14em] text-zinc-500">SATISFIED</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.satisfied.length===0 ? <span className="mono text-xs text-zinc-400">None yet</span> : result.satisfied.map(s=> <span key={s.id} className="mono text-xs border border-zinc-200 bg-white px-2.5 py-1 rounded-full">{s.label}</span>)}
            </div>
          </div>
          <div>
            <h4 className="mono text-xs tracking-[0.14em] text-zinc-500">CITATIONS</h4>
            <div className="mt-3 space-y-2">
              {result.citations.map(c=> (
                <a key={c.url} href={c.url} target="_blank" className="block rounded-xl bg-white border border-zinc-200 p-3 hover:border-zinc-300">
                  <div className="text-xs font-semibold leading-tight">{c.title}</div>
                  <div className="mono text-[11px] text-zinc-500">{c.authority} • {c.lastVerified}</div>
                  <div className="mono text-[11px] text-sky-700 truncate mt-1">{c.url}</div>
                </a>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 mono text-xs leading-relaxed text-amber-800">
              Not legal advice. Conservative heuristics from primary sources. Confirm with issuing board before bidding.
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-3 bg-zinc-900 text-zinc-400 mono text-xs flex flex-wrap gap-4">
        <span>{new Date(result.evaluatedAt).toLocaleString()} • {result.jurisdictionKey}</span>
        <span className="ml-auto">{result.project.id} → {result.company.id}</span>
      </div>
    </div>
  );
}

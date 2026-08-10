"use client";
import { EligibilityResult } from "@/lib/types";
import { classificationNeeded } from "@/lib/regulatory-data";

export default function EligibilityCard({ result }: { result: EligibilityResult }) {
  const statusLabel = result.status === "eligible" ? "ELIGIBLE TO BID" : result.status === "conditional" ? "CONDITIONAL" : result.status === "ineligible" ? "NOT ELIGIBLE" : "NEEDS REVIEW";
  const needed = classificationNeeded(result.project.state, result.project.trade, result.project.contractValue);
  const isEligible = result.status === "eligible";
  const isConditional = result.status === "conditional";
  return (
    <div className="border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* header */}
      <div className={`px-5 py-5 border-b border-zinc-800 flex flex-wrap gap-4 items-start justify-between ${isEligible ? "bg-emerald-500 text-black" : isConditional ? "bg-[#facc15] text-black" : "bg-red-600 text-white"}`}>
        <div>
          <div className="mono text-[10px] tracking-[0.18em] font-bold opacity-70">BID ELIGIBILITY • DETERMINISTIC ENGINE</div>
          <div className="text-[22px] font-black tracking-[-0.03em] leading-none mt-1">{statusLabel}</div>
          <div className="mono text-xs font-bold opacity-70 mt-1">{result.company.legalName} → {result.project.title}</div>
        </div>
        <div className="text-right">
          <div className="mono text-[10px] tracking-[0.14em] opacity-60">EST. READINESS</div>
          <div className="text-[15px] font-black tracking-tight">{result.estimatedReadiness.label}</div>
          <div className="mono text-[10px] opacity-60 mt-1">{result.project.state} • {needed} • ${result.project.contractValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-0">
        <div className="p-5 space-y-5 border-r border-zinc-800">
          <div className="flex items-center gap-2">
            <h3 className="mono text-[11px] tracking-[0.16em] text-zinc-400">BLOCKERS BEFORE BID</h3>
            <span className="mono text-xs font-bold bg-red-600 text-white px-2 py-0.5">{result.blockers.length}</span>
          </div>
          {result.blockers.length === 0 ? (
            <div className="border border-emerald-900 bg-emerald-950/40 p-4 mono text-xs leading-relaxed text-emerald-300">No blockers — appears eligible under current deterministic rules. Verify local AHJ before submission.</div>
          ) : result.blockers.map(b => (
            <div key={b.requirement.id} className="border border-zinc-800 bg-[#09090b] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-bold tracking-tight">{b.requirement.label}</div>
                <a href={b.requirement.sourceUrl} target="_blank" className="mono text-[10px] border border-zinc-700 px-2 py-1 hover:bg-zinc-800 shrink-0">SOURCE ↗</a>
              </div>
              <div className="mono text-xs text-amber-300 mt-1">{b.reason}</div>
              <div className="text-sm text-zinc-300 mt-2 leading-relaxed">{b.remediation}</div>
              <div className="mt-3 flex flex-wrap gap-2 mono text-[11px]">
                <span className="border border-zinc-800 bg-zinc-900 px-2 py-1">{b.estimatedDays} DAYS</span>
                {b.fee && <span className="border border-zinc-800 px-2 py-1 text-zinc-400">{b.fee}</span>}
                <span className="bg-zinc-100 text-black px-2 py-1 font-bold">{b.requirement.authority}</span>
              </div>
            </div>
          ))}

          {result.reciprocityOpportunities.length>0 && (
            <div className="border border-sky-900 bg-sky-950/30 p-4">
              <div className="mono text-[11px] tracking-[0.14em] text-sky-300">RECIPROCITY PATHWAY</div>
              {result.reciprocityOpportunities.map((r,i)=> (
                <div key={i} className="text-sm text-zinc-300 mt-2">Use <span className="font-bold text-white">{r.canUse.state} {r.canUse.classification} ({r.canUse.licenseNumber})</span> to endorse into {r.requirement.label}. <span className="mono text-xs text-zinc-500">{r.note}</span></div>
              ))}
            </div>
          )}

          {result.warnings.length>0 && (
            <div className="space-y-2">
              <div className="mono text-[11px] tracking-[0.14em] text-amber-300">WARNINGS</div>
              {result.warnings.map(w=> <div key={w.requirement.id} className="border border-amber-900/50 bg-amber-950/20 p-3 mono text-xs text-amber-200">{w.requirement.label}: {w.reason}</div>)}
            </div>
          )}
        </div>

        <div className="p-5 space-y-6 bg-[#0a0a0b]">
          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] text-zinc-500">CHECKLIST</h4>
            <div className="mt-3 space-y-2">
              {result.checklist.map(item=> (
                <div key={item.id} className="flex gap-3 border border-zinc-800 p-3 bg-zinc-900">
                  <div className={`mt-1 h-3 w-3 shrink-0 border ${item.status==="done" ? "bg-emerald-500 border-emerald-500" : item.status==="blocked" ? "bg-red-600 border-red-600" : "border-zinc-600"}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold tracking-tight leading-tight">{item.title}</div>
                    <div className="mono text-[11px] text-zinc-500">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "no due date"} • {item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] text-zinc-500">SATISFIED</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.satisfied.length===0 ? <span className="mono text-xs text-zinc-600">None yet</span> : result.satisfied.map(s=> <span key={s.id} className="mono text-[11px] border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300">{s.label}</span>)}
            </div>
          </div>

          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] text-zinc-500">CITATIONS — OFFICIAL SOURCES</h4>
            <div className="mt-3 space-y-2">
              {result.citations.map(c=> (
                <a key={c.url} href={c.url} target="_blank" className="block border border-zinc-800 bg-zinc-900 p-3 hover:border-zinc-700 hover:bg-zinc-800/50">
                  <div className="text-xs font-bold leading-tight">{c.title}</div>
                  <div className="mono text-[10px] text-zinc-500">{c.authority} • {c.lastVerified}</div>
                  <div className="mono text-[10px] text-zinc-400 truncate mt-1">{c.url}</div>
                </a>
              ))}
            </div>
            <div className="mt-3 border border-amber-900 bg-amber-950/30 p-3 mono text-[11px] leading-relaxed text-amber-200">
              Not legal advice. Conservative heuristics from primary sources. Confirm with issuing board before bidding.
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-black border-t border-zinc-800 mono text-[10px] tracking-wide text-zinc-500 flex flex-wrap gap-4">
        <span>{new Date(result.evaluatedAt).toLocaleString()} • {result.jurisdictionKey}</span>
        <span className="ml-auto">{result.project.id} → {result.company.id}</span>
      </div>
    </div>
  );
}

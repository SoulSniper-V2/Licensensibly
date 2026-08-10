"use client";
import { EligibilityResult } from "@/lib/types";
import { readinessColor } from "@/lib/eligibility-engine";
import { classificationNeeded } from "@/lib/regulatory-data";

export default function EligibilityCard({ result }: { result: EligibilityResult }) {
  const statusLabel = result.status === "eligible" ? "ELIGIBLE TO BID" : result.status === "conditional" ? "CONDITIONAL — ACTION REQUIRED" : result.status === "ineligible" ? "NOT ELIGIBLE" : "NEEDS REVIEW";
  const needed = classificationNeeded(result.project.state, result.project.trade, result.project.contractValue);
  return (
    <div className="rounded-[20px] bg-white border border-slate-200 overflow-hidden shadow-sm">
      {/* header */}
      <div className={`px-6 py-5 border-b flex flex-wrap items-center justify-between gap-4 ${readinessColor(result.status)} border`}>
        <div>
          <div className="text-[11px] tracking-[0.14em] font-bold opacity-70">BID ELIGIBILITY • DETERMINISTIC ENGINE</div>
          <div className="text-2xl font-black tracking-tight">{statusLabel}</div>
          <div className="text-sm font-medium opacity-80 mt-1">{result.company.legalName} → {result.project.title}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold opacity-60">EST. READINESS</div>
          <div className="text-lg font-black">{result.estimatedReadiness.label}</div>
          <div className="text-xs opacity-60">{result.project.state} • {needed} • ${result.project.contractValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_0.95fr] gap-0">
        {/* blockers */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-bold tracking-wide text-slate-900">BLOCKERS BEFORE BID <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold px-2">{result.blockers.length}</span></h3>
          {result.blockers.length === 0 ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-medium text-emerald-800">No blockers — company appears eligible to bid under current deterministic rules. Verify local AHJ before submission.</div>
          ) : result.blockers.map(b => (
            <div key={b.requirement.id} className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-bold text-slate-900">{b.requirement.label}</div>
                <a href={b.requirement.sourceUrl} target="_blank" className="text-[11px] font-bold text-slate-600 underline shrink-0">SOURCE ↗</a>
              </div>
              <div className="text-xs font-semibold text-amber-800 mt-1">{b.reason}</div>
              <div className="text-sm text-slate-700 mt-2 leading-relaxed">{b.remediation}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white border border-slate-200 px-2 py-1 font-semibold">Lead: {b.estimatedDays} days</span>
                {b.fee && <span className="rounded-full bg-white border border-slate-200 px-2 py-1">{b.fee}</span>}
                <span className="rounded-full bg-slate-900 text-white px-2 py-1 font-semibold">{b.requirement.authority}</span>
              </div>
            </div>
          ))}

          {result.reciprocityOpportunities.length>0 && (
            <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
              <div className="text-sm font-bold text-sky-900">Reciprocity pathway found</div>
              {result.reciprocityOpportunities.map((r,i)=> (
                <div key={i} className="text-sm text-slate-700 mt-1">Use <span className="font-bold">{r.canUse.state} {r.canUse.classification} ({r.canUse.licenseNumber})</span> to endorse into {r.requirement.label}. <span className="text-xs text-slate-500">{r.note}</span></div>
              ))}
            </div>
          )}

          {result.warnings.length>0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold tracking-[0.1em] text-slate-500">WARNINGS & LOCAL REQUIREMENTS</h4>
              {result.warnings.map(w=> (
                <div key={w.requirement.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-800">{w.requirement.label}</div>
                  <div className="text-xs text-slate-600">{w.reason}</div>
                  <div className="text-xs text-slate-600 mt-1">{w.remediation} <a href={w.requirement.sourceUrl} target="_blank" className="underline font-bold">Source</a></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* checklist + citations */}
        <div className="bg-slate-50 border-l border-slate-200 p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-900">COMPLIANCE CHECKLIST</h3>
            <p className="text-xs text-slate-500 mt-1">Deterministic gaps → actionable tasks. LLM explains, engine decides.</p>
            <div className="mt-3 space-y-2">
              {result.checklist.map(c=> (
                <label key={c.id} className="flex gap-3 rounded-xl bg-white border border-slate-200 p-3">
                  <input type="checkbox" className="mt-1" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{c.title}</div>
                    <div className="text-xs text-slate-600 leading-relaxed line-clamp-3">{c.description}</div>
                    <div className="flex gap-2 mt-2">
                      {c.dueDate && <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Due {c.dueDate}</span>}
                      <a href={c.sourceUrl} target="_blank" className="text-[11px] font-bold underline text-slate-600">Authority</a>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.1em] text-slate-500">SATISFIED REQUIREMENTS</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.satisfied.map(s=> <span key={s.id} className="text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 rounded-full">✓ {s.label}</span>)}
              {result.satisfied.length===0 && <span className="text-xs text-slate-500">None — all requirements blocked or pending.</span>}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.1em] text-slate-500">CITATIONS — OFFICIAL SOURCES ONLY</h4>
            <div className="mt-2 space-y-2">
              {result.citations.map(c=> (
                <a key={c.url} href={c.url} target="_blank" className="block rounded-lg bg-white border border-slate-200 p-3 hover:border-slate-300">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{c.title}</div>
                  <div className="text-[11px] text-slate-500">{c.authority} • Verified {c.lastVerified}</div>
                  <div className="text-xs text-slate-600 mt-1 line-clamp-2">“{c.excerpt}…”</div>
                  <div className="text-[11px] font-mono text-sky-700 truncate mt-1">{c.url}</div>
                </a>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Not legal advice.</span> Deterministic rules are conservative heuristics from primary sources. Always confirm with the issuing board before bidding. Harbor Compliance and primary board counsel should be consulted for filing.
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-900 text-slate-300 text-xs flex flex-wrap gap-4">
        <span>Evaluated {new Date(result.evaluatedAt).toLocaleString()} • Jurisdiction {result.jurisdictionKey}</span>
        <span className="ml-auto font-mono">{result.project.id} → {result.company.id}</span>
      </div>
    </div>
  );
}

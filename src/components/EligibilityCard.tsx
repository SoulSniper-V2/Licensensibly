"use client";
import { EligibilityResult } from "@/lib/types";
import { classificationNeeded } from "@/lib/regulatory-data";
import { SealCheck, Warning, XCircle, CheckCircle, ArrowSquareOut, Clock, ShieldCheck } from "@phosphor-icons/react";

export default function EligibilityCard({ result }: { result: EligibilityResult }) {
  const statusLabel = result.status === "eligible" ? "ELIGIBLE TO BID" : result.status === "conditional" ? "CONDITIONAL" : result.status === "ineligible" ? "NOT ELIGIBLE" : "NEEDS REVIEW";
  const needed = classificationNeeded(result.project.state, result.project.trade, result.project.contractValue);
  const tone = result.status === "eligible" ? "good" : result.status === "conditional" ? "warn" : "bad";

  const headerBg =
    tone==="good" ? "bg-[var(--success-soft)] border-emerald-200 dark:border-emerald-900" :
    tone==="warn" ? "bg-[var(--warn-soft)] border-amber-200 dark:border-amber-900" :
    "bg-[var(--accent-soft)] border-red-200 dark:border-red-900";

  const headerText =
    tone==="good" ? "text-[var(--success)]" :
    tone==="warn" ? "text-[var(--warn)]" :
    "text-[var(--accent)]";

  const StatusIcon = tone==="good" ? SealCheck : tone==="warn" ? Warning : XCircle;

  return (
    <div className="rounded-[24px] border border-[var(--border)] overflow-hidden bg-[var(--surface)] shadow-soft">
      {/* Header — stamp-like */}
      <div className={`px-6 py-5 flex flex-wrap gap-4 items-center justify-between border-b ${headerBg}`}>
        <div className="flex gap-3.5 items-start">
          <span className={`hidden sm:flex h-9 w-9 rounded-full items-center justify-center shrink-0 border ${tone==="good"?"bg-white border-emerald-200 text-[var(--success)]": tone==="warn"?"bg-white border-amber-200 text-[var(--warn)]":"bg-white border-red-200 text-[var(--accent)]"}`}>
            <StatusIcon size={18} weight="fill" />
          </span>
          <div>
            <div className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">BID ELIGIBILITY · DETERMINISTIC ENGINE</div>
            <div className={`text-[18px] font-bold tracking-[-0.02em] mt-0.5 flex items-center gap-2 ${headerText}`}>
              <StatusIcon size={16} weight="fill" className="sm:hidden" />
              {statusLabel}
            </div>
            <div className="mono text-[12px] text-[var(--muted)] mt-1">{result.company.legalName} <span className="text-[var(--muted-2)]">→</span> {result.project.title}</div>
          </div>
        </div>
        <div className="text-left sm:text-right bg-white dark:bg-[var(--surface)] rounded-2xl border border-[var(--border)] px-4 py-3 min-w-[160px]">
          <div className="mono text-[11px] tracking-[0.12em] font-semibold text-[var(--muted)]">EST. READINESS</div>
          <div className="text-[13px] font-bold mt-0.5">{result.estimatedReadiness.label}</div>
          <div className="mono text-[11px] text-[var(--muted)] mt-0.5 flex items-center gap-1.5 sm:justify-end"><Clock size={11}/>{result.project.state} · {needed} · ${result.project.contractValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.85fr] gap-0">
        {/* Left — blockers */}
        <div className="p-6 space-y-5 lg:border-r border-[var(--border)]">
          <div className="flex items-center gap-2">
            <h3 className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">BLOCKERS BEFORE BID</h3>
            <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 mono text-[11px] font-bold ${result.blockers.length ? "bg-[var(--accent)] text-white" : "bg-[var(--success)] text-white"}`}>{result.blockers.length}</span>
          </div>

          {result.blockers.length === 0 ? (
            <div className="rounded-2xl border border-emerald-200 bg-[var(--success-soft)] p-4 flex gap-3">
              <CheckCircle size={18} weight="fill" className="text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-semibold text-[var(--success)]">No blockers — appears eligible</div>
                <div className="mono text-[11px] text-[var(--muted)] mt-1">Verify the local AHJ before submission. This is a conservative heuristic, not legal advice.</div>
              </div>
            </div>
          ) : result.blockers.map(b => (
            <div key={b.requirement.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 hover:border-[var(--border-2)] transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[13px] font-semibold leading-tight">{b.requirement.label}</div>
                <a href={b.requirement.sourceUrl} target="_blank" className="shrink-0 inline-flex items-center gap-1 mono text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--border)] bg-[var(--surface)] rounded-full px-2.5 py-1">
                  Source <ArrowSquareOut size={11} />
                </a>
              </div>
              <div className="mono text-[11px] font-medium text-[var(--ink)] mt-1.5 leading-relaxed">{b.reason}</div>
              <div className="text-[13px] leading-relaxed text-[var(--muted)] mt-2">{b.remediation}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 mono text-[11px] font-medium rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1"><Clock size={11}/>{b.estimatedDays} days</span>
                {b.fee && <span className="mono text-[11px] rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 text-[var(--muted)]">{b.fee}</span>}
                <span className="mono text-[11px] font-medium rounded-full bg-[var(--ink)] text-white dark:bg-white dark:text-black px-2.5 py-1">{b.requirement.authority}</span>
              </div>
            </div>
          ))}

          {result.reciprocityOpportunities.length>0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="mono text-[11px] tracking-[0.12em] font-semibold text-[var(--muted)] flex items-center gap-1.5"><ShieldCheck size={13}/> RECIPROCITY PATHWAY</div>
              <div className="mt-2 space-y-2">
                {result.reciprocityOpportunities.map((r,i)=> (
                  <div key={i} className="text-[13px] leading-relaxed">
                    Use <span className="font-semibold">{r.canUse.state} {r.canUse.classification} ({r.canUse.licenseNumber})</span> to endorse into {r.requirement.label}.
                    <span className="mono text-[11px] text-[var(--muted)]"> — {r.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.warnings.length>0 && (
            <div className="space-y-2">
              <div className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--warn)] flex items-center gap-1.5"><Warning size={12} weight="fill"/> WARNINGS</div>
              {result.warnings.map(w=> (
                <div key={w.requirement.id} className="rounded-2xl border border-amber-200 bg-[var(--warn-soft)] p-3 mono text-[12px] leading-relaxed text-[var(--ink)]">{w.requirement.label}: <span className="text-[var(--muted)]">{w.reason}</span></div>
              ))}
            </div>
          )}
        </div>

        {/* Right — checklist / satisfied / citations */}
        <div className="p-6 space-y-6 bg-[var(--surface-2)]/50 border-t lg:border-t-0 border-[var(--border)]">
          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">CHECKLIST</h4>
            <div className="mt-3 space-y-2">
              {result.checklist.map(item=> (
                <div key={item.id} className="flex gap-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3">
                  <span className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${item.status==="done" ? "bg-[var(--success)]" : item.status==="blocked" ? "bg-[var(--accent)]" : item.status==="in-progress" ? "bg-[var(--warn)]" : "bg-[var(--border-2)]"}`} />
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold leading-tight">{item.title}</div>
                    <div className="mono text-[11px] text-[var(--muted)] mt-0.5">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "No due date"} · <span className="capitalize">{item.status}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">SATISFIED</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.satisfied.length===0 ? <span className="mono text-[11px] text-[var(--muted-2)]">None yet — add credentials to satisfy requirements.</span> : result.satisfied.map(s=> <span key={s.id} className="mono text-[11px] font-medium border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 rounded-full">{s.label}</span>)}
            </div>
          </div>

          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-semibold text-[var(--muted)]">CITATIONS</h4>
            <div className="mt-3 space-y-2">
              {result.citations.map(c=> (
                <a key={c.url} href={c.url} target="_blank" className="block rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3 hover:border-[var(--border-2)] hover:shadow-sm transition-all group">
                  <div className="text-[12px] font-semibold leading-tight group-hover:text-[var(--ink)]">{c.title}</div>
                  <div className="mono text-[11px] text-[var(--muted)] mt-0.5">{c.authority} · {c.lastVerified}</div>
                  <div className="mono text-[11px] text-sky-700 dark:text-sky-300 truncate mt-1 flex items-center gap-1">{c.url} <ArrowSquareOut size={10} className="shrink-0"/></div>
                </a>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3 mono text-[11px] leading-relaxed text-[var(--muted)]">
              Not legal advice. Conservative heuristics from primary sources. Confirm with issuing board before bidding.
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-[var(--surface-2)] border-t border-[var(--border)] mono text-[11px] text-[var(--muted)] flex flex-wrap gap-4">
        <span>{new Date(result.evaluatedAt).toLocaleString()} · {result.jurisdictionKey}</span>
        <span className="ml-auto mono text-[10px] tracking-wide opacity-60">{result.project.id} → {result.company.id}</span>
      </div>
    </div>
  );
}

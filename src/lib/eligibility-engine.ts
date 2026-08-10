import { Blocker, ChecklistItem, CompanyProfile, ProjectInput, EligibilityResult, RegulatoryRequirement, Citation } from "./types";
import { REGULATORY_DB, classificationNeeded } from "./regulatory-data";

// DETERMINISTIC RULES ENGINE — never an LLM. This is the wedge.
// Inputs: CompanyProfile + ProjectInput
// Output: EligibilityResult with citations and gap checklist.
// Contract: LLM may EXPLAIN, but engine DECIDES.

export function evaluateEligibility(company: CompanyProfile, project: ProjectInput): EligibilityResult {
  const state = project.state;
  const allReqs = REGULATORY_DB[state] || [];
  // Filter to trade-relevant + universally required
  const relevant = allReqs.filter(r => {
    if (!r.trade) return true; // universal like SOS, insurance, qualifier
    return r.trade.includes(project.trade);
  });

  const satisfied: RegulatoryRequirement[] = [];
  const blockers: Blocker[] = [];
  const warnings: Blocker[] = [];
  const reciprocityOpportunities: EligibilityResult["reciprocityOpportunities"] = [];

  const now = new Date();
  const value = project.contractValue;

  // Helper: does company have active license for state+trade with sufficient classification?
  function hasSufficientLicense(req: RegulatoryRequirement): { has: boolean; license?: any; reason?: string } {
    if (req.type !== "license") return { has: false };
    const licenses = company.licenses.filter(l => l.state === state && l.status === "active" && (l.trade === project.trade || l.trade === "general"));
    if (licenses.length === 0) return { has: false, reason: `No active ${project.trade} license found for ${state}` };

    // Virginia Class logic: C <30k, B <120k, A unlimited
    // NC: Limited/Intermediate/Unlimited mapping via classificationNeeded heuristic — we compare rank
    const rank = (cls: string) => {
      const s = cls.toLowerCase();
      if (s.includes("unlimited") || s.includes("class a") || s.includes("group 5") || s.includes("h1")) return 100;
      if (s.includes("intermediate") || s.includes("class b") || s.includes("group 3") || s.includes("group 4") || s.includes("h2")) return 50;
      if (s.includes("limited") || s.includes("class c") || s.includes("group 1") || s.includes("group 2") || s.includes("h3")) return 10;
      return 20;
    };
    const neededLabel = classificationNeeded(state, project.trade, value);
    const neededRank = rank(neededLabel);
    const best = licenses.map(l => ({ lic: l, r: rank(l.classification) })).sort((a,b)=>b.r-a.r)[0];
    if (best.r < neededRank) {
      return { has: false, license: best.lic, reason: `Current license "${best.lic.classification}" insufficient for ${neededLabel} at $${value.toLocaleString()}` };
    }
    // Also check expiry within 60 days -> warning, not blocker (handled separately)
    const expiry = new Date(best.lic.expiryDate);
    const daysToExpiry = Math.ceil((expiry.getTime() - now.getTime())/86400000);
    if (daysToExpiry < 0) return { has: false, reason: "License expired" };
    return { has: true, license: best.lic };
  }

  for (const req of relevant) {
    // Handle <$ threshold exemptions
    if (state === "NC" && value < 40000 && req.id.includes("nc-electrical")) {
      satisfied.push({ ...req, description: req.description + " — Exempt: contract value < $40k state threshold (verify local ordinance)." });
      continue;
    }
    if (state === "SC" && value < 5000 && req.id.includes("sc-electrical")) {
      satisfied.push({ ...req, description: req.description + " — Exempt: < $5k SC threshold." });
      continue;
    }

    if (req.type === "license") {
      const res = hasSufficientLicense(req);
      if (res.has) {
        satisfied.push(req);
        // Check expiry warnings
        const lic = res.license;
        const days = Math.ceil((new Date(lic.expiryDate).getTime() - now.getTime())/86400000);
        if (days < 60 && days >=0) {
          warnings.push({
            requirement: req,
            severity: "warning",
            reason: `License ${lic.licenseNumber} expires in ${days} days (${lic.expiryDate}) — renew before bid.`,
            remediation: `File renewal with CE completion via ${req.authority}. Fee ${req.fee || "see board"}.`,
            estimatedDays: 7,
            fee: req.fee,
          });
        }
      } else {
        // Try reciprocity
        const activeOther = company.licenses.find(l => l.status==="active" && req.reciprocity?.fromStates.includes(l.state) && l.trade===project.trade);
        if (activeOther) {
          reciprocityOpportunities.push({ requirement: req, canUse: activeOther, note: req.reciprocity!.note });
          blockers.push({
            requirement: req,
            severity: "blocker",
            reason: res.reason || `Missing ${state} ${project.trade} license.`,
            remediation: `Apply for ${state} license via reciprocity/endorsement using active ${activeOther.state} license ${activeOther.licenseNumber} (${activeOther.classification}). Submit endorsement application + qualifier docs to ${req.authority}.`,
            estimatedDays: req.leadTimeDays.max,
            fee: req.fee,
          });
        } else {
          blockers.push({
            requirement: req,
            severity: "blocker",
            reason: res.reason || `No active ${state} ${project.trade} license held.`,
            remediation: `Obtain ${classificationNeeded(state, project.trade, value)} from ${req.authority}. Steps: qualifier exam → application → net-worth/bond proof. Estimated ${req.leadTimeDays.min}–${req.leadTimeDays.max} days.`,
            estimatedDays: req.leadTimeDays.max,
            fee: req.fee,
          });
        }
      }
    } else if (req.type === "qualifier") {
      const qualifier = company.qualifiers.find(q => q.states.includes(state) && q.trades.includes(project.trade));
      const licenseForState = company.licenses.find(l => l.state===state && l.trade===project.trade && l.status==="active");
      if (qualifier || licenseForState) {
        satisfied.push(req);
      } else {
        blockers.push({
          requirement: req,
          severity: "blocker",
          reason: `No listed Qualified Individual for ${project.trade} in ${state}. Every licensed entity must name a QI.`,
          remediation: `Designate an employee/officer who holds (or will pass) the ${project.trade} exam for ${state}. QI must be W-2 or officer. If qualifier qualifies another entity, file dual-qualifier or replacement.`,
          estimatedDays: 21,
        });
      }
    } else if (req.type === "registration") {
      if (req.id.includes("sos") || req.id.includes("scc")) {
        if (company.foreignQualifications.includes(state) || company.incorporatedStates.includes(state)) {
          satisfied.push(req);
        } else {
          warnings.push({
            requirement: req,
            severity: "warning",
            reason: `Entity not foreign-qualified in ${state}. Cannot legally transact or pull permits as out-of-state entity.`,
            remediation: `File Certificate of Authority with ${req.authority}. Use registered agent in ${state}. ${req.fee || ""}. Typically ${req.leadTimeDays.min}–${req.leadTimeDays.max} days.`,
            estimatedDays: req.leadTimeDays.max,
            fee: req.fee,
          });
          // Escalate to blocker if project is public works or pull permit imminent
          if (project.isPublicWorks) {
            blockers.push({
              requirement: req,
              severity: "blocker",
              reason: `Foreign qualification required before bidding public work in ${state}.`,
              remediation: `File Certificate of Authority with ${req.authority} before bid submission.`,
              estimatedDays: req.leadTimeDays.max,
              fee: req.fee,
            });
          }
        }
      } else {
        // City/county local — treat as warning unless doing work there
        warnings.push({
          requirement: req,
          severity: "warning",
          reason: `Local business/privilege registration may be required by ${project.city} / ${project.county || state}. Needed to pull permits locally.`,
          remediation: `Contact ${req.authority} for business registration / BPOL. Often can be done day-of permit but verify.`,
          estimatedDays: req.leadTimeDays.min,
        });
      }
    } else if (req.type === "insurance") {
      const gl = company.insurance?.generalLiability;
      const hasGL = gl && new Date(gl.expiry).getTime() > now.getTime();
      if (hasGL && company.insurance.workersComp) {
        satisfied.push(req);
      } else {
        warnings.push({
          requirement: req,
          severity: "warning",
          reason: !hasGL ? "General liability expired or missing" : "Workers' comp not indicated (required for ≥3 employees in NC/VA).",
          remediation: "Renew GL policy and obtain ACORD certificate; confirm workers' comp coverage meets state and GC requirements.",
          estimatedDays: 2,
        });
      }
    } else if (req.type === "ce") {
      // Always warning check — CE due at renewal, not pre-bid, but flag if near renewal
      warnings.push({
        requirement: req,
        severity: "info",
        reason: req.description,
        remediation: "Complete CE early to avoid renewal lapses that would block future bids.",
        estimatedDays: 7,
      });
    }
  }

  // Status
  let status: EligibilityResult["status"] = "eligible";
  if (blockers.length >= 2) status = "ineligible";
  else if (blockers.length === 1) status = "conditional";
  else if (warnings.length > 0) status = "conditional";
  if (blockers.some(b=> b.requirement.type==="license")) {
    // single license blocker is at least conditional (can't bid without license)
  }

  // Lead time aggregation: max blocker + 20% buffer
  const totalMin = blockers.length ? Math.max(...blockers.map(b=> b.estimatedDays)) : 0;
  const totalMax = blockers.length ? blockers.reduce((a,b)=> a + b.estimatedDays * 0.6, 0) + totalMin*0.3 : 0;
  const readiness = blockers.length===0 ? { minDays: 0, maxDays: 0, label: "Ready to bid — no blockers" } :
    { minDays: Math.ceil(totalMin*0.5), maxDays: Math.ceil(totalMax), label: `${Math.ceil(totalMin*0.5)}–${Math.ceil(totalMax)} days — ${blockers.length} blocker(s)` };

  // Checklist
  const checklist: ChecklistItem[] = [...blockers, ...warnings].map((b, i) => ({
    id: `chk-${i}-${b.requirement.id}`,
    title: b.requirement.label,
    description: b.remediation,
    requirementId: b.requirement.id,
    status: b.severity==="blocker" ? "todo" as const : "todo" as const,
    dueDate: project.bidDate ? new Date(new Date(project.bidDate).getTime() - b.estimatedDays*86400000).toISOString().slice(0,10) : undefined,
    sourceUrl: b.requirement.sourceUrl,
  }));

  // Citations — the deterministic engine always cites its sources
  const citations: Citation[] = relevant.map(r => ({
    title: r.sourceTitle,
    url: r.sourceUrl,
    authority: r.authority,
    excerpt: r.description.slice(0, 220),
    lastVerified: "2026-08-01",
  }));

  return {
    status,
    project,
    company,
    blockers,
    warnings,
    satisfied,
    reciprocityOpportunities,
    estimatedReadiness: readiness,
    checklist,
    citations: [...new Map(citations.map(c=> [c.url, c])).values()], // dedupe
    evaluatedAt: new Date().toISOString(),
    jurisdictionKey: `${project.state}:${project.city}`,
  };
}

export function readinessColor(status: EligibilityResult["status"]) {
  switch(status) {
    case "eligible": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "conditional": return "text-amber-700 bg-amber-50 border-amber-300";
    case "ineligible": return "text-red-700 bg-red-50 border-red-300";
    default: return "text-slate-700 bg-slate-50 border-slate-200";
  }
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  href: string;
  action: string;
  details: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "company",
    title: "Create Company Profile",
    description: "Add your legal entity, licenses, qualifiers, insurance & foreign qualifications",
    href: "/companies",
    action: "Go to Companies →",
    details: "Licenses by state/trade/classification. Engine reads this on every check. Add unlimited companies.",
  },
  {
    id: "project",
    title: "Add Project / Job Intake",
    description: "Enter address, city/county, trade, scope, contract value, role & dates",
    href: "/check",
    action: "Open Check →",
    details: "Supports NC • SC • VA + county/municipality rules. Value determines classification needed.",
  },
  {
    id: "engine",
    title: "Run Deterministic Eligibility Check",
    description: "Engine evaluates jurisdiction × trade × value × credentials → Eligible / Conditional / Ineligible",
    href: "/check",
    action: "Try Live Demo →",
    details: "No LLM decision. Pure rules from NCBEEC, SC LLR, VA DPOR. Instant on every keystroke.",
  },
  {
    id: "blockers",
    title: "Review Blockers & Reciprocity",
    description: "See exactly what blocks the bid, lead time, fee, authority & source link; find reciprocity paths",
    href: "/check",
    action: "See Blockers →",
    details: "Each blocker has remediation steps, estimated days, and official citation.",
  },
  {
    id: "airesearch",
    title: "Read AINSIDE Research",
    description: "AINSIDE (ag/gemini-3.6-flash-high) streams an explanation with citations — it never decides, only explains",
    href: "/check",
    action: "View AINSIDE →",
    details: "Deterministic fallback if gateway is offline. Not legal advice.",
  },
  {
    id: "checklist",
    title: "Follow Checklist & Calendar",
    description: "Checklist items with due dates + calendar (bid deadlines, renewals, lead times)",
    href: "/calendar",
    action: "Open Calendar →",
    details: "Builds from license renewals, insurance expiry, checklist & bid dates via buildCalendarEvents().",
  },
];

// Helper to get progress — caller passes completed ids
export function getOnboardingProgress(completedIds: string[]) {
  const total = ONBOARDING_STEPS.length;
  const done = completedIds.filter(id => ONBOARDING_STEPS.some(s => s.id === id)).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

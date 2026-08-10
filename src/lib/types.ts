export type Trade = "electrical" | "hvac" | "fire-protection" | "plumbing" | "general";
export type ProjectRole = "general-contractor" | "subcontractor" | "prime";
export type EligibilityStatus = "eligible" | "conditional" | "ineligible" | "needs-review";

export interface CompanyLicense {
  id: string;
  state: string; // NC, SC, VA
  trade: Trade;
  classification: string; // e.g. Limited, Intermediate, Unlimited, Class A
  licenseNumber: string;
  qualifier: string; // person name
  issuedDate: string;
  expiryDate: string;
  status: "active" | "expired" | "pending";
}

export interface CompanyProfile {
  id: string;
  legalName: string;
  dba?: string;
  entityType: "corp" | "llc" | "partnership" | "sole-prop";
  incorporatedStates: string[];
  foreignQualifications: string[]; // states where foreign qualified
  licenses: CompanyLicense[];
  qualifiers: { name: string; trades: Trade[]; states: string[] }[];
  insurance: {
    generalLiability: { amount: number; expiry: string };
    workersComp: boolean;
  };
  bonds: { state: string; amount: number }[];
  registrations: { jurisdiction: string; type: string; expiry: string }[]; // city/county
  createdAt: string;
}

export interface ProjectInput {
  id: string;
  title: string;
  address: string;
  city: string;
  county?: string;
  state: "NC" | "SC" | "VA";
  zip?: string;
  trade: Trade;
  scope: string;
  contractValue: number;
  isPublicWorks?: boolean;
  role: ProjectRole;
  bidDate?: string; // ISO
  estimatedStartDate?: string;
}

export interface RegulatoryRequirement {
  id: string;
  label: string;
  description: string;
  authority: string;
  type: "license" | "registration" | "qualifier" | "insurance" | "bond" | "exam" | "ce" | "document";
  trade?: Trade[];
  threshold?: { minValue?: number; maxValue?: number };
  required: boolean;
  reciprocity?: { fromStates: string[]; note: string };
  leadTimeDays: { min: number; max: number };
  fee?: string;
  sourceUrl: string;
  sourceTitle: string;
}

export interface Blocker {
  requirement: RegulatoryRequirement;
  severity: "blocker" | "warning" | "info";
  reason: string;
  remediation: string;
  estimatedDays: number;
  fee?: string;
}

export interface EligibilityResult {
  status: EligibilityStatus;
  project: ProjectInput;
  company: CompanyProfile;
  blockers: Blocker[];
  warnings: Blocker[];
  satisfied: RegulatoryRequirement[];
  reciprocityOpportunities: { requirement: RegulatoryRequirement; canUse: CompanyLicense; note: string }[];
  estimatedReadiness: { minDays: number; maxDays: number; label: string };
  checklist: ChecklistItem[];
  citations: Citation[];
  evaluatedAt: string;
  jurisdictionKey: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  requirementId: string;
  status: "todo" | "in-progress" | "done" | "blocked";
  dueDate?: string;
  assignee?: string;
  sourceUrl: string;
}

export interface Citation {
  title: string;
  url: string;
  authority: string;
  excerpt: string;
  lastVerified: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "bid-deadline" | "renewal" | "application" | "lead-time";
  projectId?: string;
  licenseId?: string;
}

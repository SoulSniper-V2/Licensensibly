export type ProcessStage = "draft" | "review" | "in_progress" | "approval" | "done";
export type ProcessTemplateId = "license-renewal" | "new-jurisdiction" | "bid-qualification" | "insurance-renewal";

export interface ProcessTemplate {
  id: ProcessTemplateId;
  name: string;
  description: string;
  icon: string;
  avgDays: string;
  steps: { title: string; slaDays: number; owner: string; automation?: string }[];
  source: string; // which BPM tool inspiration
}

export interface ProcessRun {
  id: string;
  templateId: ProcessTemplateId;
  title: string;
  companyId: string;
  stage: ProcessStage;
  owner: string;
  dueDate: string; // ISO
  checklist: { id: string; title: string; done: boolean; required: boolean }[];
  createdAt: string;
  updatedAt: string;
  slaStatus: "on_track" | "at_risk" | "breached";
}

export const PROCESS_TEMPLATES: ProcessTemplate[] = [
  {
    id: "license-renewal",
    name: "License Renewal",
    description: "Replicate Process Street checklist + Kissflow SLA. Every NC/SC/VA trade license renewal with CE, insurance, fee, board submission.",
    icon: "📜",
    avgDays: "12–18d",
    source: "Process Street × Kissflow",
    steps: [
      { title: "Collect CE & insurance", slaDays: 5, owner: "Ops", automation: "Auto-pull expiry from Companies" },
      { title: "Board forms + fee", slaDays: 3, owner: "Compliance" },
      { title: "Submit & confirm", slaDays: 2, owner: "Compliance", automation: "Link to board portal" },
      { title: "Update credential graph", slaDays: 1, owner: "System", automation: "Auto-update license expiry → Calendar" },
    ],
  },
  {
    id: "new-jurisdiction",
    name: "New Jurisdiction Entry",
    description: "Replicate Pipefy kanban + Camunda branching. Intake → foreign qual → license reciprocity → registration for a new state/city.",
    icon: "🗺️",
    avgDays: "18–32d",
    source: "Pipefy × Camunda",
    steps: [
      { title: "Intake & threshold check", slaDays: 2, owner: "BD" },
      { title: "Foreign qualification (SoS)", slaDays: 7, owner: "Legal", automation: "Branch: reciprocity vs new exam" },
      { title: "License / reciprocity file", slaDays: 10, owner: "Compliance" },
      { title: "Local registration & permit-ready", slaDays: 5, owner: "Ops" },
    ],
  },
  {
    id: "bid-qualification",
    name: "Bid Qualification Pack",
    description: "Replicate Monday.com timeline + Process Street approvals. Deterministic eligibility → checklist → bid-ready packet with approvals.",
    icon: "✅",
    avgDays: "3–7d",
    source: "Monday.com × Process Street",
    steps: [
      { title: "Run eligibility engine", slaDays: 1, owner: "Estimator", automation: "Auto-run Check → blockers" },
      { title: "Close blockers", slaDays: 4, owner: "Compliance" },
      { title: "Approval (PM + QI)", slaDays: 1, owner: "Approver", automation: "Dual approval gate" },
      { title: "Export bid packet", slaDays: 1, owner: "System", automation: "PDF packet + citations" },
    ],
  },
  {
    id: "insurance-renewal",
    name: "Insurance Renewal",
    description: "Replicate Kissflow automation + Monday SLA. GL / workers comp renewal → distribute to all active bids.",
    icon: "🛡️",
    avgDays: "7–10d",
    source: "Kissflow × Monday",
    steps: [
      { title: "Quote & bind", slaDays: 5, owner: "Finance" },
      { title: "Distribute certs", slaDays: 2, owner: "Ops", automation: "Auto-push to Companies → Calendar" },
      { title: "Calendar event created", slaDays: 0, owner: "System", automation: "Auto-create renewal event" },
    ],
  },
];

export const MOCK_RUNS: ProcessRun[] = [
  {
    id: "run-1",
    templateId: "license-renewal",
    title: "NC Unlimited Electrical — Piedmont Electric (exp 2027-06-30)",
    companyId: "co-1",
    stage: "in_progress",
    owner: "Maria Santos",
    dueDate: "2026-09-01",
    checklist: [
      { id: "c1", title: "CE 8hr completed", done: true, required: true },
      { id: "c2", title: "GL cert pulled", done: true, required: true },
      { id: "c3", title: "Board fee $180", done: false, required: true },
      { id: "c4", title: "Submit to NC BEEC", done: false, required: true },
    ],
    createdAt: "2026-08-01",
    updatedAt: "2026-08-09",
    slaStatus: "on_track",
  },
  {
    id: "run-2",
    templateId: "new-jurisdiction",
    title: "Expand to VA — Carolina Climate (SC→VA Class A)",
    companyId: "co-2",
    stage: "review",
    owner: "David Kim",
    dueDate: "2026-09-12",
    checklist: [
      { id: "c1", title: "VA SoS foreign qual", done: true, required: true },
      { id: "c2", title: "Reciprocity letter SC→VA", done: false, required: true },
      { id: "c3", title: "Register in Richmond City", done: false, required: false },
    ],
    createdAt: "2026-08-05",
    updatedAt: "2026-08-08",
    slaStatus: "at_risk",
  },
  {
    id: "run-3",
    templateId: "bid-qualification",
    title: "Raleigh Fire Station 23 — bid 2026-09-02",
    companyId: "co-1",
    stage: "approval",
    owner: "Estimator",
    dueDate: "2026-08-30",
    checklist: [
      { id: "c1", title: "Eligibility = conditional (1 blocker)", done: true, required: true },
      { id: "c2", title: "Close: add SC Group ? ", done: false, required: true },
      { id: "c3", title: "QI sign-off", done: false, required: true },
    ],
    createdAt: "2026-08-07",
    updatedAt: "2026-08-09",
    slaStatus: "on_track",
  },
  {
    id: "run-4",
    templateId: "insurance-renewal",
    title: "GL $2M — Tri-State Fire (exp 2027-01-01)",
    companyId: "co-3",
    stage: "draft",
    owner: "Finance",
    dueDate: "2026-12-15",
    checklist: [
      { id: "c1", title: "Request quotes", done: false, required: true },
      { id: "c2", title: "Bind & cert", done: false, required: true },
    ],
    createdAt: "2026-08-09",
    updatedAt: "2026-08-09",
    slaStatus: "on_track",
  },
  {
    id: "run-5",
    templateId: "license-renewal",
    title: "SC HVAC Group 5 — Carolina Climate (exp 2027-10-31)",
    companyId: "co-2",
    stage: "done",
    owner: "David Kim",
    dueDate: "2026-08-01",
    checklist: [{ id: "c1", title: "Submitted", done: true, required: true }],
    createdAt: "2026-07-10",
    updatedAt: "2026-08-02",
    slaStatus: "on_track",
  },
];

export const STAGES: { id: ProcessStage; label: string; hint: string }[] = [
  { id: "draft", label: "Draft", hint: "Template cloned, not started" },
  { id: "review", label: "In Review", hint: "Pipefy-style triage" },
  { id: "in_progress", label: "In Progress", hint: "Active work + SLA" },
  { id: "approval", label: "Approval", hint: "Process St. dual sign-off" },
  { id: "done", label: "Done", hint: "Archived, audit trail closed" },
];

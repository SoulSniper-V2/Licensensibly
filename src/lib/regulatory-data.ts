import { RegulatoryRequirement } from "./types";

// Deterministic rules graph: jurisdiction × trade × project value → eligibility
// Narrow vertical: NC + SC + VA, trades: electrical, hvac, fire-protection
// Sources are real official authorities; fees/lead times are conservative MVP estimates and should be verified before production.

export const REGULATORY_DB: Record<string, RegulatoryRequirement[]> = {
  // ============ NORTH CAROLINA ============
  "NC": [
    {
      id: "nc-electrical-license",
      label: "NC Electrical Contractor License",
      description: "NC requires an electrical license issued by NC State Board of Examiners of Electrical Contractors before bidding/contracting electrical work ≥ $40,000. Classifications: Limited (up to $100k single project), Intermediate (up to $200k), Unlimited (no limit), plus SP classifications.",
      authority: "NC State Board of Examiners of Electrical Contractors (NCBEEC)",
      type: "license",
      trade: ["electrical"],
      required: true,
      reciprocity: { fromStates: ["SC", "VA"], note: "Reciprocal agreements exist with SC and VA for certain classifications; requires examination waiver or endorsement. Verify current agreement before reliance." },
      leadTimeDays: { min: 14, max: 42 },
      fee: "$150–$300 application + exam",
      sourceUrl: "https://www.ncbeec.org/licensing/",
      sourceTitle: "NCBEEC — Electrical Licensing Requirements",
    },
    {
      id: "nc-hvac-license",
      label: "NC HVAC Contractor License (H1/H2/H3)",
      description: "NC State Board of Examiners of Plumbing, Heating & Fire Sprinkler Contractors requires license for HVAC > $40k. H3 (Class I) up to $125k, H2 to $250k, H1 unlimited. Separate qualifier required per entity.",
      authority: "NC State Board of Examiners of Plumbing, Heating & Fire Sprinkler Contractors",
      type: "license",
      trade: ["hvac"],
      required: true,
      reciprocity: { fromStates: ["SC", "VA"], note: "Limited reciprocity — SC Mechanical and VA Tradesman may waive exam portion, not full license." },
      leadTimeDays: { min: 21, max: 56 },
      fee: "$100–$400",
      sourceUrl: "https://www.nclicensing.org/hvac.asp",
      sourceTitle: "NC HVAC Licensing — NCSBEPH&FS",
    },
    {
      id: "nc-fire-sprinkler-license",
      label: "NC Fire Sprinkler Contractor License",
      description: "Fire sprinkler work requires license from NC State Board of Examiners of Plumbing, Heating & Fire Sprinkler Contractors. Annual renewal; qualifier must be employee/officer.",
      authority: "NC State Board of Examiners of Plumbing, Heating & Fire Sprinkler Contractors",
      type: "license",
      trade: ["fire-protection"],
      required: true,
      leadTimeDays: { min: 21, max: 60 },
      fee: "$150–$350",
      sourceUrl: "https://www.nclicensing.org/fire.asp",
      sourceTitle: "NC Fire Sprinkler Licensing",
    },
    {
      id: "nc-qualifier-requirement",
      label: "NC Listed Qualified Individual (QI)",
      description: "Each licensed entity must have a listed Qualified Individual who passed the trade exam and is an employee/officer. QI may only qualify one entity at a time without dual-qualifier filings.",
      authority: "NCBEEC / NCSBEPH&FS",
      type: "qualifier",
      required: true,
      leadTimeDays: { min: 0, max: 30 },
      sourceUrl: "https://www.ncbeec.org/licensing/qualifying-individual/",
      sourceTitle: "NC Qualifier Requirements",
    },
    {
      id: "nc-general-qual",
      label: "NC Secretary of State Foreign Qualification",
      description: "Out-of-state corporation/LLC must obtain Certificate of Authority to transact business in NC before performing work and to pull permits under entity name.",
      authority: "NC Secretary of State — Corporations Division",
      type: "registration",
      required: true,
      leadTimeDays: { min: 5, max: 14 },
      fee: "$250 (corp) / $200 (LLC)",
      sourceUrl: "https://www.sosnc.gov/divisions/business_registration",
      sourceTitle: "NC SOS — Foreign Entity Registration",
    },
    {
      id: "nc-ucs-registration",
      label: "NC Contractor Public Works Registration (if public)",
      description: "For NC public works > $30k, contractor must be licensed and may require additional DOT prequalification or HUB compliance depending on agency.",
      authority: "NC Dept. of Administration / NCUC",
      type: "registration",
      required: false,
      leadTimeDays: { min: 7, max: 21 },
      sourceUrl: "https://ncadmin.nc.gov/businesses/hub",
      sourceTitle: "NC Public Works / HUB Requirements",
    },
    {
      id: "nc-insurance",
      label: "NC Liability & Workers' Comp",
      description: "Active general liability required for license issuance/renewal. Workers' comp required if ≥3 employees (or per GC requirements). Increasingly enforced at permit/Bid.",
      authority: "NC Industrial Commission / NCBEEC",
      type: "insurance",
      required: true,
      leadTimeDays: { min: 1, max: 7 },
      sourceUrl: "https://www.ic.nc.gov/workers-compensation/",
      sourceTitle: "NC Industrial Commission — Workers' Comp",
    },
    {
      id: "nc-ce",
      label: "NC Continuing Education (Annual Renewal)",
      description: "NC electrical/HVAC licenses renew annually (June 30 electrical; Dec 31 HVAC). 4–8 hours CE required annually to renew; lapsed >60 days requires reinstatement.",
      authority: "NCBEEC / NCSBEPH&FS",
      type: "ce",
      required: true,
      leadTimeDays: { min: 1, max: 14 },
      sourceUrl: "https://www.ncbeec.org/continuing-education/",
      sourceTitle: "NCBEEC Continuing Education",
    },
    // City add-on
    {
      id: "nc-charlotte-business-license",
      label: "Charlotte / Mecklenburg Business Registration",
      description: "City of Charlotte and Mecklenburg County may require privilege license / business registration to pull electrical/HVAC permits locally.",
      authority: "City of Charlotte / Mecklenburg County LUESA",
      type: "registration",
      required: false,
      leadTimeDays: { min: 3, max: 14 },
      sourceUrl: "https://www.mecknc.gov/LUESA",
      sourceTitle: "Mecklenburg County — Contractor Registration",
    },
  ],

  // ============ SOUTH CAROLINA ============
  "SC": [
    {
      id: "sc-electrical-mechanical",
      label: "SC Mechanical / Electrical Contractor License (LLR)",
      description: "SC Contractor's Licensing Board (LLR): Electrical contracting requires ME (Mechanical) or Electrical classification. Projects > $5,000 require licensed contractor. Group 1 ($17.5k limited) to Group 5 (unlimited) based on net worth/qualifier.",
      authority: "SC Dept. of Labor, Licensing & Regulation — Contractor's Licensing Board",
      type: "license",
      trade: ["electrical", "hvac"],
      required: true,
      reciprocity: { fromStates: ["NC", "VA", "GA"], note: "Reciprocity with NC, VA via exam waiver for certain groups; still requires SC application." },
      leadTimeDays: { min: 14, max: 45 },
      fee: "$175–$350",
      sourceUrl: "https://llr.sc.gov/clb/",
      sourceTitle: "SC LLR — Contractor's Licensing Board",
    },
    {
      id: "sc-fire-license",
      label: "SC Fire Sprinkler / Fire Protection License",
      description: "SC Office of State Fire Marshal licenses fire sprinkler contractors separately; requires NICET and qualifier.",
      authority: "SC Office of State Fire Marshal",
      type: "license",
      trade: ["fire-protection"],
      required: true,
      leadTimeDays: { min: 21, max: 60 },
      sourceUrl: "https://llr.sc.gov/sfm/",
      sourceTitle: "SC State Fire Marshal — Fire Protection",
    },
    {
      id: "sc-qualifier",
      label: "SC Primary Qualifying Party (PQP)",
      description: "Each entity requires a Primary Qualifying Party who holds required exam classification. PQP must be employee/officer and only qualifies one entity.",
      authority: "SC LLR — Contractor's Licensing Board",
      type: "qualifier",
      required: true,
      leadTimeDays: { min: 0, max: 21 },
      sourceUrl: "https://llr.sc.gov/clb/qualifying-party.aspx",
      sourceTitle: "SC Qualifying Party Requirements",
    },
    {
      id: "sc-sos-registration",
      label: "SC Secretary of State Foreign Registration",
      description: "Foreign entities must register with SC Secretary of State before transacting business.",
      authority: "SC Secretary of State",
      type: "registration",
      required: true,
      leadTimeDays: { min: 3, max: 10 },
      fee: "$110",
      sourceUrl: "https://sos.sc.gov/",
      sourceTitle: "SC Secretary of State — Business Filings",
    },
    {
      id: "sc-city-license",
      label: "SC Municipal Business License (e.g., Charleston, Greenville)",
      description: "Most SC cities/counties require annual municipal business license to perform contracted work and pull permits locally.",
      authority: "City of Charleston / County Business License",
      type: "registration",
      required: false,
      leadTimeDays: { min: 2, max: 10 },
      sourceUrl: "https://www.charleston-sc.gov/Business-License",
      sourceTitle: "City of Charleston — Business License",
    },
    {
      id: "sc-insurance-bond",
      label: "SC General Liability & Surety (if required by municipality)",
      description: "SC does not mandate statewide bond for CLB, but municipalities and GCs commonly require liability/bond. Maintain GL for licensing tiers.",
      authority: "SC LLR / Municipal",
      type: "insurance",
      required: true,
      leadTimeDays: { min: 1, max: 7 },
      sourceUrl: "https://llr.sc.gov/clb/licensure-requirements/",
      sourceTitle: "SC CLB Licensure Requirements",
    },
  ],

  // ============ VIRGINIA ============
  "VA": [
    {
      id: "va-contractor-class",
      label: "VA Contractor License Class A/B/C (DPOR)",
      description: "VA Board for Contractors (DPOR): Class C < $30k single project / < $150k total; Class B < $120k single / < $750k total; Class A unlimited. Electrical/HVAC requires Class with appropriate specialty.",
      authority: "VA Dept. of Professional & Occupational Regulation — Board for Contractors",
      type: "license",
      trade: ["electrical", "hvac", "fire-protection", "general"],
      threshold: { minValue: 0 },
      required: true,
      reciprocity: { fromStates: ["NC", "SC", "WV"], note: "VA has limited reciprocity; NC/SC Virginia contractors may get exam waiver for Class A/B but must still meet net-worth and qualifiers." },
      leadTimeDays: { min: 14, max: 45 },
      fee: "$235 (Class A) / $185 (B) / $235 (C)",
      sourceUrl: "https://www.dpor.virginia.gov/Boards/Contractors/",
      sourceTitle: "VA DPOR — Board for Contractors",
    },
    {
      id: "va-tradesman-electrical",
      label: "VA Tradesman — Journeyman/Master Electrician",
      description: "VA requires tradesman license (Journeyman or Master) for electrical work. Contractor must employ licensed tradesman or hold it via qualifier.",
      authority: "VA DPOR — Board for Contractors / Tradesman",
      type: "license",
      trade: ["electrical"],
      required: true,
      leadTimeDays: { min: 14, max: 45 },
      sourceUrl: "https://www.dpor.virginia.gov/Boards/Tradesman/",
      sourceTitle: "VA DPOR — Tradesman / Electrician",
    },
    {
      id: "va-tradesman-hvac",
      label: "VA Tradesman — HVAC (Master/Journeyman)",
      description: "HVAC work requires DPOR Tradesman HVAC license (Masters for contracting entity).",
      authority: "VA DPOR — Tradesman",
      type: "license",
      trade: ["hvac"],
      required: true,
      leadTimeDays: { min: 14, max: 45 },
      sourceUrl: "https://www.dpor.virginia.gov/Boards/Tradesman/",
      sourceTitle: "VA DPOR — Tradesman HVAC",
    },
    {
      id: "va-qualifier",
      label: "VA Qualified Individual / Responsible Management",
      description: "VA contractor license requires a Qualified Individual (QI) and Responsible Management approved for that specialty; must be employee/officer.",
      authority: "VA DPOR — Board for Contractors",
      type: "qualifier",
      required: true,
      leadTimeDays: { min: 0, max: 21 },
      sourceUrl: "https://www.dpor.virginia.gov/Boards/Contractors/Qualified-Individual/",
      sourceTitle: "VA Qualified Individual Requirements",
    },
    {
      id: "va-scc-registration",
      label: "VA SCC Foreign Entity Registration",
      description: "Out-of-state entities must register with VA State Corporation Commission before transacting business.",
      authority: "VA State Corporation Commission",
      type: "registration",
      required: true,
      leadTimeDays: { min: 7, max: 21 },
      fee: "$100–$300",
      sourceUrl: "https://www.scc.virginia.gov/pages/Business-Entity-Registrations",
      sourceTitle: "VA SCC — Foreign Registration",
    },
    {
      id: "va-local-license",
      label: "VA Local Business License (County/City BPOL)",
      description: "VA counties/cities require BPOL (Business, Professional & Occupational License) to operate and pull permits.",
      authority: "City/County Commissioner of Revenue",
      type: "registration",
      required: false,
      leadTimeDays: { min: 2, max: 10 },
      sourceUrl: "https://www.scc.virginia.gov/",
      sourceTitle: "VA Local BPOL Requirements",
    },
  ],
};

export function getRequirementsFor(state: string, _city?: string, _county?: string): RegulatoryRequirement[] {
  const base = REGULATORY_DB[state] || [];
  // City/county filtering is modeled as always returned; UI can toggle required vs recommended.
  return base;
}

export function classificationNeeded(state: string, trade: string, value: number): string {
  if (state === "NC" && trade === "electrical") {
    if (value <= 40000) return "No state license required for < $40k (verify local)";
    if (value <= 100000) return "NC Limited (up to $100k)";
    if (value <= 200000) return "NC Intermediate (up to $200k)";
    return "NC Unlimited";
  }
  if (state === "NC" && trade === "hvac") {
    if (value <= 40000) return "No state license required for < $40k";
    if (value <= 125000) return "NC H3 — Class I ($125k limit)";
    if (value <= 250000) return "NC H2 — Class II ($250k limit)";
    return "NC H1 — Unlimited";
  }
  if (state === "SC") {
    if (value <= 5000) return "No SC license required (< $5k)";
    if (value <= 50000) return "SC Group 1–2 (Limited)";
    if (value <= 200000) return "SC Group 3–4 (Intermediate)";
    return "SC Group 5 — Unlimited";
  }
  if (state === "VA") {
    if (value < 1000) return "No license (minor)";
    if (value <= 30000) return "VA Class C (< $30k single / $150k total)";
    if (value <= 120000) return "VA Class B (< $120k single / $750k total)";
    return "VA Class A — Unlimited";
  }
  return "Check jurisdiction classification";
}

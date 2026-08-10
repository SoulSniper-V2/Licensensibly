# Gooner — Pre-Bid Compliance OS

> **The wedge: pre-bid, not post-hold.** Gooner answers one question deterministically:  
> **“Can my company legally bid and perform this job, and if not, exactly what must happen first?”**

![NC • SC • VA](https://img.shields.io/badge/jurisdiction-NC_%E2%80%A2_SC_%E2%80%A2_VA-slate) ![Trades: Electrical + HVAC + Fire](https://img.shields.io/badge/trades-electrical%20%E2%80%A2%20HVAC%20%E2%80%A2%20fire-amber) ![Engine: Deterministic](https://img.shields.io/badge/engine-deterministic-emerald) ![Not legal advice](https://img.shields.io/badge/not-legal_advice-red)

Live spec: background is the startup-design skill's Pre-Flight → Research Gate for an **AI-native pre-bid licensing and compliance workflow** for specialty contractors. Harbor Compliance and Copliancy already win renewal-tracking; Gooner owns the **job-level go/no-go** (`jurisdiction × trade × project value × credentials → eligibility`).

---

## What it does (5-thing MVP per spec)

1. **Company compliance profile** — entity, incorporation/foreign-qualification states, licenses (classification + qualifier + expiry), QIs, GL insurance/workers' comp, bonds, city/county registrations.
2. **Project/job intake** — address, city/county/state, trade, scope, contract value, public/private, role, bid & start dates.
3. **Deterministic rules engine** (`src/lib/eligibility-engine.ts`) — `evaluateEligibility(company, project) → EligibilityResult`. LLM never decides; it only extracts/researches/explains. Returns `eligible | conditional | ineligible`, blockers, warnings, satisfied reqs, reciprocity opportunities, checklist with due dates, citations and `estimatedReadiness`.
4. **AI-assisted regulatory research with citations** — every requirement carries `sourceUrl/sourceTitle` to the issuing authority. Engine output always includes deduplicated `citations[]`. Mock summary on `/check` shows this contract.
5. **Compliance gap checklist + calendar** — engine-derived checklist (`ChecklistItem` with `dueDate`, status, `sourceUrl`) and `buildCalendarEvents()` / `eventsByMonth()` for license renewals, insurance, bid deadlines, and application deadlines.

Out of v1: automated government filing.

---

## Architecture

```
/src
  /app
    page.tsx            — Dashboard: wedge explainer + live company×project deterministic preview + stats + pricing teaser
    /check/page.tsx     — Full form + useMemo engine + EligibilityCard; supports ?projectId=&companyId= (Suspense)
    /companies/page.tsx — In-memory CRUD + detail view (licenses, qualifiers, insurance, bonds, registrations)
    /projects/page.tsx  — Filterable feed by state/trade; classificationNeeded() + live badge + link to /check?projectId=&companyId=
    /calendar/page.tsx  — Filterable, color-coded, month-grouped calendar from buildCalendarEvents()
    layout.tsx + globals.css (slate/amber, Geist, Tailwind v4)
  /components
    Navbar.tsx          — NC•SC•VA badge, deterministic banner, responsive nav
    EligibilityCard.tsx — Status header, blockers, reciprocity, warnings, checklist, satisfied, citations
  /lib
    types.ts            — Trade, CompanyProfile, ProjectInput, RegulatoryRequirement, EligibilityResult, Blocker, ChecklistItem, Citation, CalendarEvent
    regulatory-data.ts  — REGULATORY_DB[NC,SC,VA] + classificationNeeded() + getRequirementsFor()
    eligibility-engine.ts — evaluateEligibility() deterministic engine
    calendar.ts         — buildCalendarEvents(), eventsByMonth()
    mock-data.ts        — 3 companies, 4 projects, TRADE_LABEL
```

### Narrow vertical (intentional)

**Commercial electrical + HVAC (+ fire protection) in NC + SC + VA + major municipalities.** Do not go nationwide in v1 — data moat is `jurisdiction×trade×value×credentials→eligibility`, and nationwide on day one kills credibility and ops. Harbor's 22k-requirement benchmark shows the long-tail cost.

### Deterministic contract

```ts
import { evaluateEligibility } from "@/lib/eligibility-engine";
const result: EligibilityResult = evaluateEligibility(company, project);
// result.status ∈ eligible | conditional | ineligible | needs-review
// result.blockers / warnings / satisfied / reciprocityOpportunities
// result.estimatedReadiness {minDays, maxDays, label}
// result.checklist[] + result.citations[] (always)
// Pure function — no LLM in the decision path.
```

---

## Regulatory sources (real authorities, MVP fees/lead times are conservative estimates — verify before filing)

| State | Authority | Link |
|-------|-----------|------|
| NC Electrical | NC State Board of Examiners of Electrical Contractors (NCBEEC) | https://www.ncbeec.org/licensing/ |
| NC HVAC/Fire | NC State Board of Plumbing, Heating & Fire Sprinkler Contractors | https://www.nclicensing.org/ |
| NC SOS | NC Secretary of State — Foreign qualification | https://www.sosnc.gov/divisions/business_registration |
| SC | SC Dept. of Labor, Licensing & Regulation (LLR) — Contractors / Mechanical | https://llr.sc.gov/ |
| VA Contractors | VA DPOR — Board for Contractors | https://www.dpor.virginia.gov/Boards/Contractors/ |
| VA Tradesman | VA DPOR — Tradesman (Electrician / HVAC) | https://www.dpor.virginia.gov/Boards/Tradesman/ |
| VA SCC | VA State Corporation Commission | https://www.scc.virginia.gov/pages/Business-Entity-Registrations |

Threshold heuristics in `classificationNeeded()` mirror real rules: NC <$40k exempt, SC <$5k, VA Class C <$30k / B <$120k / A unlimited. Expiry warnings trigger at <60 days.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 6 routes: /  /check  /companies  /projects  /calendar
npm run lint
```

Requires Node 18+ (Next 16.3, React 19).

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Dashboard — wedge, live engine preview, Research Gate 🟢/🟡, pricing tiers |
| `/check` | Full intake + live results + mock AI summary with citations; deep-linkable via `?projectId=pj-1&companyId=co-2` |
| `/companies` | Profiles & mock CRUD |
| `/projects` | Opportunity feed; filters + live eligibility badge per selected company |
| `/calendar` | Month-grouped, filterable calendar (bid=amber, renewal=red/amber <60d, application=sky) |

---

## Pricing (to validate in discovery — per spec)

- **Solo** $49–79/mo — 1 state, limited projects
- **Growth** $199–299/mo — multi-state, unlimited checks, renewal management
- **Multi-state** $499+/mo — multiple entities, qualifiers, team workflows
- **New-Jurisdiction Intelligence Report** $149–399/report — usage-priced one-click packet for a jurisdiction the company has never operated in

---

## Research Gate & next step

Under the skill's gate: **🟢/🟡 Conditional green light** — Market Green, Problem Green, Timing Green, Competition Yellow (Harbor/Copliancy overlap on tracking, not on pre-bid), Feasibility Green, Data-maintenance Yellow/Red. **Verdict: proceed to customer discovery, not branding/dev beyond MVP.**

Before expanding data coverage, interview **10 commercial HVAC/electrical/fire-protection contractors operating in >1 jurisdiction** with one question (do not pitch):

> “Walk me through the last time you considered taking a project somewhere you hadn't worked before. How did you determine whether you could legally bid and perform it?”

If ≥several independently describe calls to boards, spreadsheets, consultants, missed opportunities, licensing delays, or uncertainty about bidding eligibility → build. If they say their current provider handles it effortlessly → kill/pivot early.

---

## Repo & invite

- **Repo:** https://github.com/SoulSniper-V2/gooner (public)
- **Invite:** `chanatunkohsuwan` (ID 236490829) — `write` invite sent 2026-08-10, pending acceptance (verify with `gh api repos/SoulSniper-V2/gooner/invitations`)
- **Auth:** `SoulSniper-V2` via `gh` keyring

## Disclaimer

> **Not legal advice.** Deterministic rules are conservative heuristics derived from primary government sources. Always confirm with the issuing board and, for filings, with Harbor Compliance/Copliancy or retained counsel before bidding.


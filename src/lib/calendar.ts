import { MOCK_COMPANIES, MOCK_PROJECTS } from "./mock-data";
import { evaluateEligibility } from "./eligibility-engine";
import { CalendarEvent } from "./types";

export function buildCalendarEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // License renewals for all companies
  for (const co of MOCK_COMPANIES) {
    for (const lic of co.licenses) {
      events.push({
        id: `renew-${co.id}-${lic.id}`,
        title: `${co.legalName} — ${lic.state} ${lic.trade} ${lic.classification} renewal (${lic.licenseNumber})`,
        date: lic.expiryDate,
        type: "renewal",
        licenseId: lic.id,
      });
    }
    // Insurance GL expiry as renewal
    events.push({
      id: `ins-${co.id}`,
      title: `${co.legalName} — General Liability insurance renewal ($${co.insurance.generalLiability.amount.toLocaleString()})`,
      date: co.insurance.generalLiability.expiry,
      type: "renewal",
    });
  }

  // Bid deadlines + checklist lead-time requirements
  for (const pj of MOCK_PROJECTS) {
    if (pj.bidDate) {
      events.push({
        id: `bid-${pj.id}`,
        title: `${pj.city}, ${pj.state} — Bid: ${pj.title}`,
        date: pj.bidDate,
        type: "bid-deadline",
        projectId: pj.id,
      });
    }
    // Checklist-derived application deadlines (using first company as representative; user can switch in UI)
    const co = MOCK_COMPANIES[0];
    const result = evaluateEligibility(co, pj);
    for (const chk of result.checklist) {
      if (chk.dueDate) {
        events.push({
          id: `chk-${pj.id}-${chk.id}`,
          title: `${pj.city} — ${chk.title} (for ${pj.title.slice(0,30)})`,
          date: chk.dueDate,
          type: "application",
          projectId: pj.id,
        });
      }
    }
  }

  // Sort chronologically
  events.sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
  return events;
}

export function eventsByMonth(events: CalendarEvent[]) {
  const m = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const key = e.date.slice(0,7); // YYYY-MM
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(e);
  }
  return m;
}

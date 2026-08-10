"use client";
import { useState } from "react";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import { CompanyProfile, CompanyLicense } from "@/lib/types";
import Link from "next/link";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyProfile[]>(MOCK_COMPANIES);
  const [selectedId, setSelectedId] = useState<string>(MOCK_COMPANIES[0].id);
  const selected = companies.find(c=> c.id===selectedId) || companies[0];
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState<Partial<CompanyProfile>>({
    legalName: "", entityType: "llc", incorporatedStates: ["NC"], foreignQualifications: [], licenses: []
  });

  function addCompany() {
    if (!draft.legalName?.trim()) return;
    const id = `co-${Date.now()}`;
    const co: CompanyProfile = {
      id,
      legalName: draft.legalName.trim(),
      entityType: (draft.entityType as any) || "llc",
      incorporatedStates: draft.incorporatedStates || ["NC"],
      foreignQualifications: draft.foreignQualifications || [],
      licenses: [],
      qualifiers: [],
      insurance: { generalLiability: { amount: 1000000, expiry: "2027-12-31" }, workersComp: true },
      bonds: [],
      registrations: [],
      createdAt: new Date().toISOString().slice(0,10),
    };
    setCompanies([...companies, co]);
    setSelectedId(id);
    setShowAdd(false);
    setDraft({ legalName: "", entityType: "llc", incorporatedStates: ["NC"], foreignQualifications: [] });
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black tracking-[-0.02em]">Company Compliance Profiles</h1>
          <p className="text-sm text-zinc-600 mt-1">MVP #1 — The credential graph: <code className="bg-zinc-800 px-1 rounded">jurisdiction × trade × value × credentials → eligibility</code>. Licenses, qualifiers, insurance, foreign qualifications. Engine reads this on every check.</p>
        </div>
        <button onClick={()=> setShowAdd(v=>!v)} className="border bg-white text-black px-5 py-2.5 text-sm font-bold hover:bg-slate-800">+ Add Company</button>
      </div>

      {showAdd && (
        <div className="border bg-white border border-zinc-200 p-5 space-y-3">
          <h3 className="text-sm font-black">New company</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <label className="text-xs font-bold">Legal name<input value={draft.legalName||""} onChange={e=> setDraft({...draft, legalName: e.target.value})} className="mt-1 w-full border border border-zinc-200 px-3 py-2 text-sm" placeholder="Acme Electrical LLC" /></label>
            <label className="text-xs font-bold">Entity type
              <select value={draft.entityType} onChange={e=> setDraft({...draft, entityType: e.target.value as any})} className="mt-1 w-full border border border-zinc-200 px-3 py-2 text-sm">
                <option value="llc">LLC</option><option value="corp">Corp</option><option value="partnership">Partnership</option><option value="sole-prop">Sole prop</option>
              </select>
            </label>
            <label className="text-xs font-bold">Home state(s) comma-separated<input value={(draft.incorporatedStates||[]).join(",")} onChange={e=> setDraft({...draft, incorporatedStates: e.target.value.split(",").map(s=> s.trim().toUpperCase()).filter(Boolean)})} className="mt-1 w-full border border border-zinc-200 px-3 py-2 text-sm" placeholder="NC" /></label>
          </div>
          <label className="text-xs font-bold">Foreign qualifications (comma-separated)<input value={(draft.foreignQualifications||[]).join(",")} onChange={e=> setDraft({...draft, foreignQualifications: e.target.value.split(",").map(s=> s.trim().toUpperCase()).filter(Boolean)})} className="mt-1 w-full border border border-zinc-200 px-3 py-2 text-sm" placeholder="SC, VA" /></label>
          <div className="flex gap-2">
            <button onClick={addCompany} className="border bg-amber-400 text-zinc-900 font-bold px-5 py-2 text-sm">Create</button>
            <button onClick={()=> setShowAdd(false)} className="border bg-zinc-800 px-5 py-2 text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* list */}
        <div className="space-y-3">
          {companies.map(c=> (
            <button key={c.id} onClick={()=> setSelectedId(c.id)} className={`w-full text-left border border p-4 transition ${selectedId===c.id ? "bg-white text-black border-slate-900" : "bg-white border-slate-200 hover:border-slate-300"}`}>
              <div className="text-sm font-bold truncate">{c.legalName}</div>
              <div className={`text-xs mt-1 ${selectedId===c.id ? "text-slate-300" : "text-zinc-500"}`}>{c.entityType.toUpperCase()} • {c.incorporatedStates.join(", ")} {c.foreignQualifications.length ? `→ ${c.foreignQualifications.join(", ")}` : ""}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {c.licenses.map(l=> <span key={l.id} className={`text-[11px] px-2 py-0.5 border font-semibold ${selectedId===c.id ? "bg-white/15 border border-white/20" : "bg-black border border-zinc-200"}`}>{l.state}:{l.classification}</span>)}
                {c.licenses.length===0 && <span className={`text-[11px] ${selectedId===c.id ? "text-slate-300" : "text-slate-400"}`}>No licenses yet — add to test eligibility</span>}
              </div>
              <div className={`text-[11px] mt-2 ${selectedId===c.id ? "text-slate-400" : "text-slate-400"}`}>{c.licenses.length} licenses • QI: {c.qualifiers.map(q=> q.name).join(", ") || "—"}</div>
            </button>
          ))}
          <div className="border bg-amber-50 border border-amber-200 p-4 text-xs leading-relaxed text-amber-900">
            <span className="font-bold">Data moat hint:</span> This profile + the regulatory DB is the proprietary mapping. Harbor has 22k requirements; your edge is wiring them to <em>this company’s live credentials</em> for a job-level answer.
          </div>
        </div>

        {/* detail */}
        <div className="space-y-4">
          <div className="border bg-white border border-zinc-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap justify-between gap-3">
              <div>
                <div className="text-lg font-black">{selected.legalName}</div>
                <div className="text-xs text-zinc-500">{selected.entityType.toUpperCase()} • Created {selected.createdAt} • Incorporated in {selected.incorporatedStates.join(", ")} {selected.foreignQualifications.length ? `• Foreign qualified: ${selected.foreignQualifications.join(", ")}` : "• Not foreign qualified elsewhere"}</div>
              </div>
              <Link href={`/check`} className="border bg-amber-400 text-zinc-900 font-bold px-4 py-2 text-sm h-fit">Check eligibility →</Link>
            </div>

            {/* Licenses */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-black tracking-wide">LICENSES • {selected.licenses.length}</h3>
              {selected.licenses.length ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {selected.licenses.map((l: CompanyLicense)=> {
                    const exp = new Date(l.expiryDate);
                    const daysLeft = Math.ceil((exp.getTime() - Date.now())/86400000);
                    const nearExpiry = daysLeft < 60;
                    return (
                      <div key={l.id} className={`border border p-4 ${nearExpiry ? "bg-amber-50 border-amber-200" : "bg-black border-slate-200"}`}>
                        <div className="text-xs font-bold tracking-wide text-zinc-500">{l.state} • {l.trade.toUpperCase()} • {l.status.toUpperCase()}</div>
                        <div className="text-sm font-black">{l.classification}</div>
                        <div className="text-xs font-mono mt-1">{l.licenseNumber}</div>
                        <div className="text-xs text-zinc-600 mt-1">Qualifier: <span className="font-semibold text-zinc-900">{l.qualifier}</span></div>
                        <div className="text-xs text-zinc-600">Issued {l.issuedDate} • Expires <span className={nearExpiry ? "font-bold text-amber-700" : "font-semibold"}>{l.expiryDate} {nearExpiry ? `(${daysLeft}d)` : ""}</span></div>
                      </div>
                    );
                  })}
                </div>
              ) : <div className="border bg-black border border-dashed border-slate-300 p-6 text-sm text-zinc-500 text-center">No licenses — eligibility engine will block all NC/SC/VA projects &gt; $40k/$5k. Add a license to go conditional/eligible.</div>}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border bg-white border border-zinc-200 p-4">
                  <h4 className="text-xs font-bold tracking-wide text-zinc-500">QUALIFIERS</h4>
                  {selected.qualifiers.length ? selected.qualifiers.map(q=> (
                    <div key={q.name} className="mt-2 text-sm"><span className="font-bold">{q.name}</span> <span className="text-xs text-zinc-500">— {q.trades.join(", ")} • {q.states.join(", ")}</span></div>
                  )) : <div className="text-xs text-zinc-500 mt-2">No qualifiers listed. Each entity needs a QI per board; QI may only qualify one entity at a time.</div>}
                </div>
                <div className="border bg-white border border-zinc-200 p-4">
                  <h4 className="text-xs font-bold tracking-wide text-zinc-500">INSURANCE & BONDS</h4>
                  <div className="text-sm mt-2">GL: <span className="font-bold">${selected.insurance.generalLiability.amount.toLocaleString()}</span> <span className="text-xs text-zinc-500">exp {selected.insurance.generalLiability.expiry}</span></div>
                  <div className="text-xs mt-1">Workers&apos; comp: {selected.insurance.workersComp ? "✓ covered" : "✗ not indicated"}</div>
                  <div className="text-xs mt-2">Bonds: {selected.bonds.length ? selected.bonds.map(b=> `${b.state} $${b.amount.toLocaleString()}`).join(", ") : "— none on file"}</div>
                </div>
              </div>

              <div className="border bg-white border border-zinc-200 p-4">
                <h4 className="text-xs font-bold tracking-wide text-zinc-500">REGISTRATIONS & FOREIGN QUALIFICATIONS</h4>
                <div className="text-sm mt-2">Foreign qualified in: <span className="font-semibold">{selected.foreignQualifications.join(", ") || "— none (out-of-state bids will block on Secretary of State registration)"}</span></div>
                <div className="text-xs text-zinc-600 mt-1">Registrations: {selected.registrations.length ? selected.registrations.map(r=> `${r.jurisdiction} (${r.type} exp ${r.expiry})`).join(" • ") : "— none (local business registration may be needed to pull permits)"}</div>
              </div>
            </div>
          </div>

          <div className="border bg-white text-black p-5">
            <div className="text-xs tracking-[0.14em] font-bold text-amber-300">UPSell PLACEHOLDER — New-Jurisdiction Intelligence Report</div>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">For a state/city the company has never operated in: one-click packet with every license, registration, qualifier exam, insurance, bonding, and lead-time requirement + application links and prefilled forms. <span className="text-zinc-900 font-semibold">Usage-priced $149–$399/report</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

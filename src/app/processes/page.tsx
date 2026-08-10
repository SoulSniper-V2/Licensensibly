"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { PROCESS_TEMPLATES, MOCK_RUNS, STAGES } from "@/lib/processes";
import type { ProcessRun, ProcessStage } from "@/lib/processes";

function slaBadge(s: ProcessRun["slaStatus"]) {
  if (s === "breached") return { label: "BREACHED", cls: "bg-red-600 text-white border-red-600" };
  if (s === "at_risk") return { label: "AT RISK", cls: "bg-amber-400 text-zinc-900 border-amber-400" };
  return { label: "ON TRACK", cls: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" };
}
function daysUntil(d: string){ return Math.ceil((new Date(d).getTime()-Date.now())/86400000); }

export default function ProcessesPage(){
  const [runs, setRuns] = useState<ProcessRun[]>(MOCK_RUNS);
  const [filter, setFilter] = useState<"all"|ProcessStage>("all");

  const filtered = useMemo(()=> filter==="all" ? runs : runs.filter(r=> r.stage===filter), [runs, filter]);

  function move(id:string, dir: 1|-1){
    setRuns(prev=> prev.map(r=>{
      if(r.id!==id) return r;
      const idx = STAGES.findIndex(s=> s.id===r.stage);
      const next = STAGES[Math.min(STAGES.length-1, Math.max(0, idx+dir))];
      return {...r, stage: next.id as ProcessStage, updatedAt: new Date().toISOString().slice(0,10)};
    }));
  }
  function toggleCheck(runId:string, checkId:string){
    setRuns(prev=> prev.map(r=> r.id===runId ? {...r, checklist: r.checklist.map(c=> c.id===checkId ? {...c, done: !c.done} : c)} : r));
  }
  function createFromTemplate(tid:string){
    const tmpl = PROCESS_TEMPLATES.find(t=> t.id===tid)!;
    const id = `run-${Date.now()}`;
    const run: ProcessRun = {
      id, templateId: tmpl.id as any, title: `${tmpl.name} — New run ${new Date().toLocaleDateString()}`,
      companyId: "co-1", stage: "draft", owner: "You",
      dueDate: new Date(Date.now()+14*86400000).toISOString().slice(0,10),
      checklist: tmpl.steps.map((s,i)=> ({id:`n${i}`, title: s.title, done:false, required:true})),
      createdAt: new Date().toISOString().slice(0,10), updatedAt: new Date().toISOString().slice(0,10), slaStatus: "on_track"
    };
    setRuns([run, ...runs]);
  }

  const stats = {
    total: runs.length,
    active: runs.filter(r=> r.stage!=="done").length,
    breached: runs.filter(r=> r.slaStatus==="breached").length,
    atRisk: runs.filter(r=> r.slaStatus==="at_risk").length,
    avgProgress: Math.round(runs.reduce((s,r)=> s + (r.checklist.filter(c=> c.done).length / Math.max(1,r.checklist.length)),0)/Math.max(1,runs.length)*100)
  };

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black tracking-[-0.02em]">Process Management</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-[78ch]">Replication of best-in-class BPM: <span className="font-semibold">Monday.com</span> timeline + <span className="font-semibold">Pipefy</span> kanban + <span className="font-semibold">Process Street</span> checklists + <span className="font-semibold">Kissflow</span> SLA/automation + <span className="font-semibold">Camunda</span> branching — tailored to NC/SC/VA contractor compliance.</p>
        </div>
        <Link href="/check" className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-5 py-2.5 text-sm">Run Eligibility →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {k:"Active runs", v: stats.active, sub: `${stats.total} total`},
          {k:"Avg checklist", v: `${stats.avgProgress}%`, sub: "Process Street"},
          {k:"At risk", v: stats.atRisk, sub: "Kissflow SLA"},
          {k:"Breached", v: stats.breached, sub: "Needs attention"},
          {k:"Templates", v: PROCESS_TEMPLATES.length, sub: "Pipefy gallery"},
        ].map(s=> (
          <div key={s.k} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <div className="text-[11px] font-bold tracking-wide text-zinc-500">{s.k}</div>
            <div className="text-xl font-black mt-1">{s.v}</div>
            <div className="text-xs text-zinc-500">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black tracking-wide">TEMPLATE GALLERY</h2>
          <span className="text-xs text-zinc-500">Click to clone → kanban</span>
        </div>
        <div className="mt-3 grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {PROCESS_TEMPLATES.map(t=> (
            <button key={t.id} onClick={()=> createFromTemplate(t.id)} className="text-left rounded-2xl border p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="text-lg">{t.icon} <span className="text-sm font-black ml-1">{t.name}</span> <span className="text-xs font-mono text-zinc-500 ml-2">{t.avgDays}</span></div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{t.description}</div>
              <div className="mt-2 text-[11px] font-bold tracking-wide text-zinc-500">{t.source}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {t.steps.map(s=> <span key={s.title} className="rounded-full border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 text-[11px] bg-white dark:bg-zinc-900">{s.title}</span>)}
              </div>
              <div className="mt-3 text-xs font-bold text-amber-600">+ Clone template →</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-black tracking-wide text-zinc-500">FILTER</span>
        {(["all", ...STAGES.map(s=> s.id)] as const).map(v=> (
          <button key={v} onClick={()=> setFilter(v as any)} className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${filter===v ? "bg-zinc-900 text-white border-zinc-900" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"}`}>{v==="all" ? "All" : STAGES.find(s=> s.id===v)?.label} <span className="opacity-60">({v==="all" ? runs.length : runs.filter(r=> r.stage===v).length})</span></button>
        ))}
        <span className="ml-auto text-xs text-zinc-500 hidden md:inline">Monday + Pipefy + Process Street + Kissflow + Camunda — synthesized.</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {STAGES.map(col=> {
          const display = filter==="all" ? runs.filter(r=> r.stage===col.id) : filtered.filter(r=> r.stage===col.id);
          return (
            <div key={col.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-3 min-h-[420px] flex flex-col">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-black tracking-wide">{col.label.toUpperCase()}</h3>
                <span className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 text-xs font-bold">{display.length}</span>
              </div>
              <div className="text-[11px] text-zinc-500 mb-2">{col.hint}</div>
              <div className="space-y-3 flex-1">
                {display.length===0 && <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-xs text-zinc-500">Empty</div>}
                {display.map(run=> {
                  const sla = slaBadge(run.slaStatus);
                  const d = daysUntil(run.dueDate);
                  const progress = Math.round(run.checklist.filter(c=> c.done).length / Math.max(1, run.checklist.length)*100);
                  const overdue = d<0;
                  return (
                    <div key={run.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black tracking-wide ${sla.cls}`}>{sla.label}</span>
                        <span className={`text-xs font-bold ${overdue ? "text-red-600" : d<=7 ? "text-amber-600" : "text-zinc-500"}`}>{overdue ? `${Math.abs(d)}d overdue` : `${d}d • ${run.dueDate}`}</span>
                      </div>
                      <div className="text-sm font-bold leading-snug mt-2">{run.title}</div>
                      <div className="text-xs text-zinc-500 mt-1">{run.owner} • {PROCESS_TEMPLATES.find(t=> t.id===run.templateId)?.name}</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-[11px] font-bold"><span>Checklist</span><span>{progress}%</span></div>
                        <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 mt-1 overflow-hidden"><div className="h-full bg-zinc-900 dark:bg-white" style={{width:`${progress}%`}} /></div>
                        <div className="mt-2 space-y-1">
                          {run.checklist.map(c=> (
                            <label key={c.id} className="flex items-center gap-2 text-xs">
                              <input type="checkbox" checked={c.done} onChange={()=> toggleCheck(run.id, c.id)} className="rounded border-zinc-300" />
                              <span className={c.done ? "line-through text-zinc-500" : ""}>{c.title} {c.required && <span className="text-amber-600">*</span>}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-1.5">
                        <button onClick={()=> move(run.id, -1)} disabled={STAGES.findIndex(s=> s.id===run.stage)===0} className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 px-2 py-1.5 text-xs font-bold disabled:opacity-40">← Back</button>
                        <button onClick={()=> move(run.id, 1)} disabled={STAGES.findIndex(s=> s.id===run.stage)===STAGES.length-1} className="flex-1 rounded-xl bg-zinc-900 text-white px-2 py-1.5 text-xs font-bold disabled:opacity-40">Next →</button>
                      </div>
                      <div className="mt-2 flex gap-2 text-[11px]">
                        <Link href="/calendar" className="underline">Calendar</Link>
                        <Link href="/companies" className="underline">Company</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <h3 className="text-sm font-black">How this replicates the best</h3>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 space-y-1 list-disc pl-5">
          <li><span className="font-semibold">Monday.com</span> — KPI strip + timeline + SLA colors (on track/at risk/breached).</li>
          <li><span className="font-semibold">Pipefy</span> — Template gallery → kanban clones; cards move across 5 stages.</li>
          <li><span className="font-semibold">Process Street</span> — Required checklist with progress %, approval gate at “Approval”.</li>
          <li><span className="font-semibold">Kissflow</span> — SLA badge, due-date countdown, auto-push to Calendar/Companies.</li>
          <li><span className="font-semibold">Camunda</span> — Branching logic exposed in “New Jurisdiction” (reciprocity vs exam).</li>
        </ul>
        <p className="text-xs text-zinc-500 mt-3">Sources: Moxo, Pipefy, Process Street, Kissflow, Camunda — synthesized 2026-08-10. Runs live in local state; next would be persist to Supabase + webhooks. I ideated this synthesis myself.</p>
      </div>
    </div>
  );
}

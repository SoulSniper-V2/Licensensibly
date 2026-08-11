"use client";
import { useState, useRef } from "react";
import { X, PaperPlaneRight, Sparkle } from "@phosphor-icons/react";
type Msg = { role: "user" | "assistant"; content: string };
export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "AINSIDE online. Ask about NC/SC/VA licensing, reciprocity, lead times, or paste a job scope. I explain — engine decides." }]);
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  async function send() {
    const q = input.trim(); if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }]; setMsgs(next); setInput(""); setBusy(true);
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json", accept: "text/plain" }, body: JSON.stringify({ messages: next.map(m=>({role:m.role, content:m.content})) }) });
      if (!res.ok) { const j = await res.json().catch(()=>({})); throw new Error(j.error || `AI ${res.status}`); }
      const reader = res.body?.getReader(); let acc=""; setMsgs(m=>[...m, {role:"assistant", content:""}]);
      if (reader) { const dec=new TextDecoder(); while(true){ const {done,value}=await reader.read(); if(done) break; acc+=dec.decode(value,{stream:true}); setMsgs(m=>{ const c=[...m]; c[c.length-1]={role:"assistant", content:acc}; return c; }); listRef.current?.scrollTo(0,99999);} }
      else { acc=await res.text(); setMsgs(m=>{ const c=[...m]; c[c.length-1]={role:"assistant", content:acc}; return c;});}
    } catch(e:any){ setMsgs(m=>[...m, {role:"assistant", content:`[error: ${e?.message||String(e)}]`}]);} finally{ setBusy(false); }
  }
  return (
    <>
      <button onClick={()=>setOpen(v=>!v)} className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold shadow-lift active:scale-[0.98] transition-all ${open ? "bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)]" : "bg-[var(--ink)] text-white dark:bg-white dark:text-black"}`}>
        {open ? <><X size={14} weight="bold"/> Close</> : <><span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse"/> AINSIDE</>}
      </button>
      {open && (
        <div className="fixed bottom-[76px] right-5 z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-lift flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[13px] font-bold tracking-tight flex items-center gap-1.5"><Sparkle size={12} weight="fill" className="text-[var(--muted)]"/> AINSIDE</span>
            <span className="mono text-[10px] bg-[var(--surface)] border border-[var(--border)] rounded-full px-2 py-0.5 text-[var(--muted)]">ag/gemini-3.6-flash-high</span>
            <span className="ml-auto mono text-[10px] tracking-wide text-[var(--muted-2)]">NC SC VA</span>
          </div>
          <div ref={listRef} className="h-[360px] overflow-auto p-3 space-y-3 bg-[var(--surface)]">
            {msgs.map((m,i)=> <div key={i} className={`max-w-[86%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${m.role==="user" ? "ml-auto bg-[var(--ink)] text-white dark:bg-white dark:text-black" : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink)]"}`}>{m.content}</div>)}
            {busy && <div className="mono text-[11px] text-[var(--muted)] animate-pulse flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[var(--muted-2)] animate-pulse"/> Thinking…</div>}
          </div>
          <div className="p-2.5 border-t border-[var(--border)] bg-[var(--surface)] flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask NC/SC/VA scope, reciprocity..." className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-4 py-2.5 text-[13px] placeholder:text-[var(--muted-2)] focus:outline-none focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--ink)]/10" />
            <button onClick={send} disabled={busy||!input.trim()} className="h-10 w-10 rounded-full bg-[var(--ink)] text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-95 transition-transform">
              <PaperPlaneRight size={16} weight="fill" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

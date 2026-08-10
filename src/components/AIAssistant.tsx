"use client";
import { useState, useRef } from "react";
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
      <button onClick={()=>setOpen(v=>!v)} className="fixed bottom-4 right-4 z-50 bg-zinc-900 text-white px-5 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-black">{open ? "× Close AINSIDE" : "◐ AINSIDE"}</button>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white dark:bg-zinc-900 animate-pulse" />
            <span className="text-sm font-bold">AINSIDE</span><span className="mono text-[11px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-2 py-0.5">ag/gemini-3.6-flash-high</span><span className="ml-auto mono text-[11px] text-zinc-500 dark:text-zinc-400">NC SC VA</span>
          </div>
          <div ref={listRef} className="h-[360px] overflow-auto p-3 space-y-3 bg-white dark:bg-zinc-900">
            {msgs.map((m,i)=> <div key={i} className={`max-w-[86%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role==="user" ? "ml-auto bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-800"}`}>{m.content}</div>)}
            {busy && <div className="mono text-xs text-zinc-500 dark:text-zinc-400 animate-pulse">Thinking…</div>}
          </div>
          <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask NC/SC/VA scope, reciprocity..." className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-2 text-sm focus:outline-none focus:border-zinc-300" />
            <button onClick={send} disabled={busy||!input.trim()} className="bg-zinc-900 text-white rounded-full px-4 text-sm font-semibold disabled:opacity-40">Send</button>
          </div>
        </div>
      )}
    </>
  );
}

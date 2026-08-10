"use client";
import { useState, useRef } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "AINSIDE online. Ask about NC/SC/VA licensing, reciprocity, lead times, or paste a job scope. I explain — engine decides." },
  ]);
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "text/plain" },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `AI ${res.status}`);
      }
      const reader = res.body?.getReader();
      let acc = "";
      setMsgs(m => [...m, { role: "assistant", content: "" }]);
      if (reader) {
        const dec = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setMsgs(m => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
          });
          listRef.current?.scrollTo(0, 99999);
        }
      } else {
        acc = await res.text();
        setMsgs(m => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e: any) {
      setMsgs(m => [...m, { role: "assistant", content: `[error: ${e?.message || String(e)} — try again. AINSIDE gateway http://192.168.1.204:20128/v1]` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-4 right-4 z-50 mono text-[11px] tracking-[0.14em] font-bold bg-[#facc15] text-black px-5 py-3 border border-black hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        {open ? "× CLOSE" : "◐ AINSIDE"}
      </button>
      {open && (
        <div className="fixed bottom-[64px] right-4 z-50 w-[380px] max-w-[calc(100vw-24px)] border border-zinc-800 bg-[#09090b] flex flex-col overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="px-4 py-3 border-b border-zinc-800 bg-black flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-500 animate-pulse" />
            <div className="mono text-[11px] tracking-[0.16em] font-black">AINSIDE</div>
            <span className="mono text-[10px] border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-zinc-400">ag/gemini-3.6-flash-high</span>
            <span className="ml-auto mono text-[10px] text-zinc-500">NC SC VA</span>
          </div>
          <div ref={listRef} className="h-[360px] overflow-auto p-3 space-y-3 bg-[#0a0a0b]">
            {msgs.map((m,i)=> (
              <div key={i} className={`max-w-[86%] px-3 py-2 mono text-xs leading-relaxed border ${m.role==="user" ? "ml-auto bg-[#facc15] text-black border-black" : "bg-zinc-900 text-zinc-200 border-zinc-800"}`}>
                {m.content}
              </div>
            ))}
            {busy && <div className="mono text-[11px] text-zinc-500 animate-pulse">AINSIDE thinking<span className="inline-block w-1 h-3 bg-[#facc15] ml-1 align-middle animate-pulse"/></div>}
          </div>
          <div className="p-2 border-t border-zinc-800 bg-black flex gap-2">
            <input value={input} onChange={e=> setInput(e.target.value)} onKeyDown={e=> e.key==="Enter" && send()} placeholder="Ask NC/SC/VA scope, reciprocity, lead time..." className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 mono text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600" />
            <button onClick={send} disabled={busy || !input.trim()} className="mono text-xs font-bold bg-white text-black px-4 disabled:opacity-40 hover:bg-zinc-200">SEND</button>
          </div>
          <div className="px-3 py-1 mono text-[10px] text-zinc-600 border-t border-zinc-800">Streaming via http://192.168.1.204:20128/v1 • Not legal advice</div>
        </div>
      )}
    </>
  );
}

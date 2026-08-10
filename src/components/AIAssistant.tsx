"use client";
import { useState, useRef } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hey — I'm AINSIDE for Gooner. Ask me about NC/SC/VA licensing, reciprocity, lead times, or paste a job scope. I explain; the engine decides." },
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
      setMsgs(m => [...m, { role: "assistant", content: `[error: ${e?.message || String(e)} — try again. Check AINSIDE gateway http://192.168.1.204:20128/v1]` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-slate-900 text-white px-5 py-3 text-sm font-bold shadow-xl hover:bg-black"
        aria-label="Toggle AINSIDE assistant"
      >
        {open ? "× Close AINSIDE" : "◐ AINSIDE"}
      </button>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-sm font-black">AINSIDE</div>
            <span className="text-[11px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-full">ag/gemini-3.6-flash-high</span>
            <span className="ml-auto text-[11px] text-slate-500">NC/SC/VA only</span>
          </div>
          <div ref={listRef} className="h-[360px] overflow-auto p-3 space-y-3 bg-white">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={m.role === "user" ? "max-w-[80%] rounded-2xl bg-slate-900 text-white px-3 py-2 text-sm" : "max-w-[85%] rounded-2xl bg-slate-100 border border-slate-200 px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"}>
                  {m.content || (busy && i === msgs.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-200 flex gap-2 bg-slate-50">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(); }}
              placeholder="Ask: Can we bid $900k electrical in Raleigh with SC license?"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <button onClick={send} disabled={busy || !input.trim()} className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-bold disabled:opacity-40">Send</button>
          </div>
          <div className="px-3 pb-2 text-[11px] text-slate-500 bg-slate-50">Not legal advice. Engine decides; I explain.</div>
        </div>
      )}
    </>
  );
}

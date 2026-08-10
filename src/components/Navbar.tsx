"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "INDEX" },
  { href: "/check", label: "CHECK" },
  { href: "/companies", label: "COMPANIES" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/calendar", label: "CALENDAR" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 h-[64px] flex items-center gap-6">
        {/* logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#facc15] flex items-center justify-center">
            <span className="mono text-[13px] font-black text-black tracking-tighter">G</span>
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-black tracking-[-0.03em]">GOONER</div>
            <div className="mono text-[9px] tracking-[0.2em] text-zinc-500 -mt-1">PRE-BID OS</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 ml-6">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={`mono text-[11px] tracking-[0.14em] px-3 py-1.5 border ${active ? "bg-zinc-100 text-black border-zinc-100" : "border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700"}`}>
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto hidden lg:flex items-center gap-3">
          <div className="mono text-[10px] tracking-[0.14em] text-zinc-500 border border-zinc-800 px-2 py-1">NC • SC • VA</div>
          <div className="mono text-[10px] tracking-[0.14em] text-zinc-500">DETERMINISTIC</div>
          <div className="h-2 w-2 bg-emerald-500 animate-pulse" />
          <Link href="/check" className="mono text-[11px] tracking-[0.14em] font-bold bg-[#facc15] text-black px-4 py-2 hover:bg-yellow-300 transition-colors">RUN CHECK →</Link>
        </div>

        <button onClick={()=> setOpen(v=>!v)} className="md:hidden ml-auto mono text-[11px] tracking-[0.2em] border border-zinc-800 px-3 py-2">{open ? "CLOSE" : "MENU"}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-[#09090b] px-4 py-4 grid gap-2">
          {links.map(l=> <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className={`mono text-xs tracking-[0.14em] px-3 py-3 border ${pathname===l.href ? "bg-zinc-100 text-black" : "border-zinc-800 text-zinc-300"}`}>{l.label}</Link>)}
        </div>
      )}
      <div className="h-[1px] bg-gradient-to-r from-[#facc15] via-transparent to-transparent opacity-60" />
    </header>
  );
}

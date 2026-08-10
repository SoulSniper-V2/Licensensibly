"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/check", label: "Eligibility Check" },
  { href: "/companies", label: "Companies" },
  { href: "/projects", label: "Projects" },
  { href: "/calendar", label: "Calendar" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
      <div className="mx-auto max-w-[1320px] px-6 h-[64px] flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 font-black text-sm">⊕</div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-slate-900 text-[15px]">GOONER</div>
            <div className="text-[10px] tracking-[0.14em] text-slate-500 font-medium uppercase">Bid Compliance OS</div>
          </div>
          <span className="hidden sm:inline-flex ml-2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-1 tracking-wide">NC • SC • VA</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} className={`px-3 py-2 rounded-full text-sm font-medium transition ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-700">Deterministic engine • Not legal advice</span>
          </div>
          <Link href="/check" className="rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm px-4 py-2">New Check →</Link>
        </div>
      </div>
      {/* mobile nav */}
      <div className="md:hidden border-t border-slate-100 bg-white px-3 py-2 flex gap-1 overflow-auto">
        {NAV.map(n => {
          const active = pathname === n.href;
          return <Link key={n.href} href={n.href} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold ${active ? "bg-slate-900 text-white":"bg-slate-100 text-slate-700"}`}>{n.label}</Link>
        })}
      </div>
    </header>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/check", label: "Check" },
  { href: "/companies", label: "Companies" },
  { href: "/projects", label: "Projects" },
  { href: "/calendar", label: "Calendar" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-[1200px] px-6 h-[64px] flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 bg-zinc-900 flex items-center justify-center rounded-md">
            <span className="text-white text-[13px] font-black">G</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight">licensensibly</span>
          <span className="mono text-[10px] tracking-[0.14em] text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-full px-2 py-0.5">NC SC VA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => {
            const active = pathname === l.href;
            return <Link key={l.href} href={l.href} className={`text-sm px-3 py-1.5 rounded-full ${active ? "bg-zinc-900 text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100"}`}>{l.label}</Link>
          })}
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-3">
          <span className="mono text-xs text-zinc-500 dark:text-zinc-400 hidden lg:inline">Ready to bid?</span>
          <ThemeToggle />
          <Link href="/check" className="bg-zinc-900 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-black dark:bg-white dark:bg-zinc-900 dark:text-zinc-900 dark:text-zinc-100">Run check →</Link>
        </div>

        <button onClick={()=> setOpen(v=>!v)} className="md:hidden ml-auto text-sm border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5">{open ? "Close" : "Menu"}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4 grid gap-2">
          {links.map(l=> <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className={`text-sm px-3 py-2.5 rounded-full border ${pathname===l.href ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>{l.label}</Link>)}
        </div>
      )}
    </header>
  );
}

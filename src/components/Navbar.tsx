"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlass, BuildingOffice, FolderOpen, CalendarDots,
  SquaresFour, Gear, X,
} from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/check", label: "Check", icon: MagnifyingGlass },
  { href: "/companies", label: "Companies", icon: BuildingOffice },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/calendar", label: "Calendar", icon: CalendarDots },
  { href: "/processes", label: "Processes", icon: SquaresFour },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // close on route change
  useEffect(()=> { setMobileOpen(false); }, [pathname]);
  // close on outside click / esc
  useEffect(()=>{
    if(!mobileOpen) return;
    const onEsc = (e: KeyboardEvent)=> e.key==="Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onEsc);
    return ()=> window.removeEventListener("keydown", onEsc);
  }, [mobileOpen]);

  return (
    <>
      {/* Floating island — detached, pill-shaped, glass */}
      <header ref={headerRef} className="sticky top-0 z-40 pt-4 px-4 md:px-6 pointer-events-none">
        <div className="mx-auto max-w-[1200px] pointer-events-auto">
          <div className="flex items-center gap-3 bg-[var(--surface)]/90 dark:bg-[#18181B]/90 backdrop-blur-2xl border border-[var(--border)] rounded-full px-2.5 py-2 shadow-soft">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 pl-1.5 pr-1 shrink-0 group">
              <div className="h-8 w-8 rounded-full bg-[var(--ink)] dark:bg-white flex items-center justify-center group-active:scale-[0.96] transition-transform">
                <span className="text-white dark:text-black text-[13px] font-black tracking-tighter">L</span>
              </div>
              <span className="hidden sm:block text-[14px] font-semibold tracking-[-0.02em]">licensensibly</span>
              <span className="hidden lg:inline-flex mono text-[10px] tracking-[0.14em] text-[var(--muted)] border border-[var(--border)] rounded-full px-2 py-0.5">NC · SC · VA</span>
            </Link>

            {/* Center nav — desktop */}
            <nav className="hidden md:flex items-center gap-1 ml-2">
              {NAV.map(it => {
                const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
                const Icon = it.icon;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--ink)] text-white dark:bg-white dark:text-black"
                        : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    <Icon size={14} weight={active ? "fill" : "regular"} />
                    {it.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right */}
            <div className="ml-auto flex items-center gap-1.5">
              <Link href="/settings" className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${pathname==="/settings" ? "bg-[var(--ink)] text-white dark:bg-white dark:text-black" : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"}`}>
                <Gear size={14} /> <span className="hidden lg:inline">Settings</span>
              </Link>
              <div className="hidden sm:block w-px h-5 bg-[var(--border)] mx-1" />
              <ThemeToggle />
              <Link
                href="/check"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] text-white text-[13px] font-semibold px-4 py-1.5 hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all shadow-sm"
              >
                <span className="hidden sm:inline">Run check</span><span className="sm:hidden">Check</span> <span aria-hidden>→</span>
              </Link>
              {/* Mobile hamburger — morph */}
              <button
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={()=> setMobileOpen(v=>!v)}
                className="md:hidden ml-1 h-8 w-8 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--ink)] active:scale-95"
              >
                <span className="relative block h-3 w-3">
                  <span className={`absolute left-0 w-3 h-[1.5px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "top-[5px] rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 w-3 h-[1.5px] bg-current rounded-full transition-all duration-200 ${mobileOpen ? "opacity-0" : "opacity-100 top-[5px]"}`} />
                  <span className={`absolute left-0 w-3 h-[1.5px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet — staggered reveal */}
      <div className={`fixed inset-0 z-30 md:hidden transition-all duration-500 ${mobileOpen ? "visible" : "invisible pointer-events-none"}`}>
        <div onClick={()=> setMobileOpen(false)} className={`absolute inset-0 bg-[var(--ink)]/20 backdrop-blur-[2px] transition-opacity duration-500 ${mobileOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute top-[68px] left-4 right-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-lift overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}>
          <div className="p-2">
            {NAV.map((it,i)=> {
              const Icon = it.icon;
              const active = pathname===it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  style={{ transitionDelay: mobileOpen ? `${60 + i*40}ms` : "0ms" }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-500 ${active ? "bg-[var(--ink)] text-white dark:bg-white dark:text-black" : "text-[var(--ink)] hover:bg-[var(--surface-2)]"} ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                >
                  <Icon size={18} weight={active? "fill":"regular"} /> {it.label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white dark:bg-black" />}
                </Link>
              );
            })}
            <div className="h-px bg-[var(--border)] my-2" />
            <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-500 delay-[260ms] ${pathname==="/settings" ? "bg-[var(--ink)] text-white" : "text-[var(--ink)] hover:bg-[var(--surface-2)]"} ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
              <Gear size={18} /> Settings
            </Link>
          </div>
          <div className="px-4 py-3 bg-[var(--surface-2)] border-t border-[var(--border)] flex items-center justify-between mono text-[11px] text-[var(--muted)]">
            <span>NC · SC · VA · Deterministic</span>
            <button onClick={()=> setMobileOpen(false)} className="inline-flex items-center gap-1 rounded-full bg-[var(--ink)] text-white px-3 py-1.5 text-xs font-semibold"><X size={12} weight="bold"/> Close</button>
          </div>
        </div>
      </div>
    </>
  );
}

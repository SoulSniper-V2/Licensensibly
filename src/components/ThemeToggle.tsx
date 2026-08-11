"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle(){
  const [dark, setDark] = useState(false);
  useEffect(()=>{
    const saved = localStorage.getItem("licensensibly-theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  },[]);
  const toggle=()=>{
    const next=!dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("licensensibly-theme", next?"dark":"light");
  };
  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 mono text-[11px] tracking-[0.06em] font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--border-2)] active:scale-[0.98] transition-all">
      <span className={`h-2 w-2 rounded-full transition-colors ${dark ? "bg-amber-400" : "bg-[var(--ink)]"}`} />
      {dark ? "Light" : "Dark"}
    </button>
  );
}

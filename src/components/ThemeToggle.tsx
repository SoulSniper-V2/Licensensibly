"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle(){
  const [dark, setDark] = useState(false);
  useEffect(()=>{
    const saved = localStorage.getItem("gooner-theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  },[]);
  const toggle=()=>{
    const next=!dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("gooner-theme", next?"dark":"light");
  };
  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="rounded-full border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-white px-3 py-1.5 mono text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
      {dark ? "☀ Light" : "● Dark"}
    </button>
  );
}

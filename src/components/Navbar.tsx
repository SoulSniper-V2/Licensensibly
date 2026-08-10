"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  House, MagnifyingGlass, BuildingOffice, FolderOpen, Calendar,
  Gear, Sun, Moon, SquaresFour, ChartBar, Plus,
} from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";

const menuGroups = [
  {
    label: "File",
    items: [
      { href: "/", label: "Home", icon: House },
      { href: "/check", label: "New check", icon: Plus },
    ],
  },
  {
    label: "View",
    items: [
      { href: "/companies", label: "Companies", icon: BuildingOffice },
      { href: "/projects", label: "Projects", icon: FolderOpen },
      { href: "/calendar", label: "Calendar", icon: Calendar },
      { href: "/processes", label: "Processes", icon: SquaresFour },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/check", label: "Eligibility check", icon: MagnifyingGlass },
      { href: "/settings", label: "Settings", icon: Gear },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 h-[52px] flex items-center gap-2 md:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 bg-zinc-900 flex items-center justify-center rounded-2xl">
            <span className="text-white text-[13px] font-black">G</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight">licensensibly</span>
          <span className="mono text-[10px] tracking-[0.14em] text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-full px-2 py-0.5">NC SC VA</span>
        </Link>

        {/* Canvas-like menubar (desktop) */}
        <nav className="hidden md:flex items-center gap-0.5">
          {menuGroups.map((g) => (
            <div key={g.label} className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === g.label ? null : g.label)}
                onMouseEnter={() => setOpenMenu(g.label)}
                className={`text-sm px-3 py-1.5 rounded-2xl transition-colors ${
                  openMenu === g.label
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {g.label}
              </button>
              {openMenu === g.label && (
                <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-1.5 z-50">
                  {g.items.map((it) => {
                    const Icon = it.icon;
                    const active = pathname === it.href;
                    return (
                      <Link
                        key={it.label}
                        href={it.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm ${
                          active
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-800/60"
                        }`}
                      >
                        <Icon size={16} weight="bold" />
                        {it.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          <span className="mono text-[10px] tracking-[0.14em] text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-full px-2 py-0.5 hidden lg:inline">
            NC SC VA
          </span>
          <ThemeToggle />
          <Link
            href="/check"
            className="bg-zinc-900 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-black dark:bg-white dark:bg-zinc-900 dark:text-zinc-900 transition-colors"
          >
            Run check →
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 grid gap-1">
        {menuGroups.flatMap((g) => g.items).map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href;
          return (
            <Link
              key={it.label}
              href={it.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm ${
                active ? "bg-zinc-100 dark:bg-zinc-800 font-medium" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Icon size={16} weight="bold" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

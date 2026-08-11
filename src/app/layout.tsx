import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIAssistant from "@/components/AIAssistant";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Licensensibly — Pre-Bid Compliance OS",
  description: "Can we legally bid this job? Deterministic eligibility for NC · SC · VA. The compliance OS for specialty contractors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col selection:bg-[var(--accent)] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-[8px] bg-[var(--ink)] dark:bg-white flex items-center justify-center">
                    <span className="text-white dark:text-black text-[11px] font-black tracking-tighter">L</span>
                  </div>
                  <span className="text-[13px] font-semibold tracking-tight">licensensibly</span>
                  <span className="mono text-[10px] tracking-[0.14em] text-[var(--muted)] border border-[var(--border)] rounded-full px-2 py-0.5">NC · SC · VA</span>
                </div>
                <p className="mono text-[11px] leading-relaxed text-[var(--muted)] max-w-[42ch]">Not legal advice. Conservative heuristics from primary government sources. Confirm with the issuing board before bidding.</p>
              </div>
              <div className="flex flex-wrap gap-8 mono text-[11px] leading-relaxed">
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--ink)] tracking-[0.12em]">PRODUCT</div>
                  <div className="space-y-0.5 text-[var(--muted)]">
                    <div><a href="/check" className="hover:text-[var(--ink)] underline decoration-[var(--border)] underline-offset-4">Eligibility check</a></div>
                    <div><a href="/companies" className="hover:text-[var(--ink)] underline decoration-[var(--border)] underline-offset-4">Companies</a></div>
                    <div><a href="/projects" className="hover:text-[var(--ink)] underline decoration-[var(--border)] underline-offset-4">Projects</a></div>
                    <div><a href="/calendar" className="hover:text-[var(--ink)] underline decoration-[var(--border)] underline-offset-4">Calendar</a></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--ink)] tracking-[0.12em]">SYSTEM</div>
                  <div className="space-y-0.5 text-[var(--muted)]">
                    <div>Deterministic engine</div>
                    <div>LLM explains, never decides</div>
                    <div><a href="https://github.com/SoulSniper-V2/Licensensibly" target="_blank" className="hover:text-[var(--ink)] underline decoration-[var(--border)] underline-offset-4">GitHub ↗</a></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap gap-3 mono text-[10px] tracking-[0.08em] text-[var(--muted-2)]">
              <span>© 2026 LICENSENSIBLY</span>
              <span className="hidden sm:inline">·</span>
              <span>Narrow vertical — Electrical · HVAC · Fire Protection</span>
              <span className="ml-auto">Built for estimators, not paperwork.</span>
            </div>
          </div>
        </footer>
        <AIAssistant />
      </body>
    </html>
  );
}

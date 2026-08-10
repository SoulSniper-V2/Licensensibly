import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gooner — Pre-Bid Compliance OS",
  description: "AI-native pre-bid licensing & compliance OS for specialty contractors. Deterministically answers: Can we legally bid this job in NC/SC/VA?",
  openGraph: { title: "Gooner — Pre-Bid Compliance OS", description: "Deterministic bid eligibility for specialty contractors." }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-[1320px] px-6 py-6 text-xs text-slate-500 flex flex-wrap gap-4">
            <span>© 2026 Gooner — Built for the NC/SC/VA narrow vertical. Nationwide expansion is post-PMF.</span>
            <span className="ml-auto">Deterministic engine • LLM explains, never decides • <a className="underline" href="https://github.com/SoulSniper-V2/gooner" target="_blank">GitHub</a></span>
          </div>
        </footer>
      </body>
    </html>
  );
}

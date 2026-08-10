import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIAssistant from "@/components/AIAssistant";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gooner — Pre-Bid Compliance OS",
  description: "AI-native pre-bid licensing & compliance OS for specialty contractors. Deterministically answers: Can we legally bid this job in NC/SC/VA?",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <Navbar />
        <main className="flex-1 bg-white">{children}</main>
        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-[1200px] px-6 py-8 mono text-[11px] tracking-wide text-zinc-500 flex flex-wrap gap-4">
            <span>© 2026 GOONER — NC • SC • VA narrow vertical. Nationwide is post-PMF.</span>
            <span className="ml-auto">Deterministic engine • LLM explains, never decides • <a className="underline hover:text-zinc-900" href="https://github.com/SoulSniper-V2/gooner" target="_blank">GitHub</a></span>
          </div>
        </footer>
        <AIAssistant />
      </body>
    </html>
  );
}

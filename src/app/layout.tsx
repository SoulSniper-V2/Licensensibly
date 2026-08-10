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
  openGraph: { title: "Gooner — Pre-Bid Compliance OS", description: "Deterministic bid eligibility for specialty contractors." }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`} style={{ colorScheme: "dark" }}>
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 bg-[#09090b]">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 text-[11px] mono tracking-wide text-zinc-500 flex flex-wrap gap-4 uppercase">
            <span>© 2026 GOONER — NC • SC • VA NARROW VERTICAL. NATIONWIDE IS POST-PMF.</span>
            <span className="ml-auto">DETERMINISTIC ENGINE • LLM EXPLAINS, NEVER DECIDES • <a className="underline hover:text-zinc-200" href="https://github.com/SoulSniper-V2/gooner" target="_blank">GITHUB</a></span>
          </div>
        </footer>
        <AIAssistant />
      </body>
    </html>
  );
}

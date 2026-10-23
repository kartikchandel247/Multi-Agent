import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuraAgent | Multi-Agent AI Business Manager & Booking System",
  description:
    "Autonomous multi-agent orchestration for enterprise client scheduling, calendar synchronization, policy verification, and live business analytics.",
  keywords: [
    "AI Booking",
    "Multi-Agent AI",
    "Autonomous Business Manager",
    "Smart Calendar",
    "Next.js Booking System",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAFAFA] text-slate-800 font-sans selection:bg-blue-500/20 selection:text-blue-700">
        {children}
      </body>
    </html>
  );
}

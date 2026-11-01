import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DARKSPOT AI — Digital Dark Spot & Information Gap Detection Platform",
  description:
    "AI-assisted platform cross-examining multi-source evidence to detect information gaps, conflicting claims, outdated temporal cycles, and prioritize verification roadmaps. Built for Shinchan Online Hackathon 2026.",
  keywords: [
    "Digital Dark Spot",
    "Information Gap Detection",
    "Evidence Cross-Examination",
    "Contradiction Detection",
    "AI Research Intelligence",
    "Temporal Cycle Verification",
  ],
  authors: [{ name: "DARKSPOT AI Engineering Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Unbounded:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#fafaf8] font-sans text-slate-900 antialiased selection:bg-yellow-300 selection:text-black">
        {children}
      </body>
    </html>
  );
}

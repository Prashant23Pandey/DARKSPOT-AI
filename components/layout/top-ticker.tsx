"use client";

import * as React from "react";

export function TopTicker() {
  const items = [
    "SHINCHAN HACKATHON 2026",
    "DIGITAL DARK SPOT & GAP INTELLIGENCE",
    "EVIDENCE CROSS-EXAMINATION ENGINE ACTIVE",
    "IMPARTIALITY PROTOCOL ENGAGED",
    "DETERMINISTIC ANALYSIS GUARANTEE",
    "TEMPORAL CYCLE RECONCILIATION ACTIVE",
    "ZERO CITATION FABRICATION",
    "SUPABASE RLS DEFENSE COMPLIANT",
  ];

  return (
    <div className="w-full bg-[#f43f5e] text-white border-b-2 border-slate-950 font-display font-extrabold text-[11px] sm:text-xs py-1.5 overflow-hidden whitespace-nowrap select-none shadow-sm z-50">
      <div className="inline-flex animate-marquee gap-8 items-center">
        {items.concat(items).map((text, idx) => (
          <span key={idx} className="inline-flex items-center gap-3 tracking-wider">
            <span>{text}</span>
            <span className="text-[#fde047] text-[10px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

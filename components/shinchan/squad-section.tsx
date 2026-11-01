"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldAlert, GitCompare, CheckCircle2, Search } from "lucide-react";
import { CharacterAvatar, CHARACTER_DATA } from "./character-avatar";

export function SquadSection() {
  const squad = [
    {
      id: "shinchan" as const,
      icon: Search,
      actionHref: "/research/new",
      actionLabel: "Start Investigation",
      badgeColor: "bg-[#ffd84d]",
    },
    {
      id: "kazama" as const,
      icon: Sparkles,
      actionHref: "/evidence/inv-scholarship-renewal",
      actionLabel: "Examine Evidence",
      badgeColor: "bg-[#e0f2fe]",
    },
    {
      id: "bochan" as const,
      icon: ShieldAlert,
      actionHref: "/research/inv-scholarship-renewal",
      actionLabel: "Discover Missing Gaps",
      badgeColor: "bg-[#dcfce7]",
    },
    {
      id: "masao" as const,
      icon: GitCompare,
      actionHref: "/evidence/inv-scholarship-renewal",
      actionLabel: "Identify Conflicts",
      badgeColor: "bg-[#fef3c7]",
    },
    {
      id: "nene" as const,
      icon: CheckCircle2,
      actionHref: "/reports/inv-scholarship-renewal",
      actionLabel: "Verify Checklist",
      badgeColor: "bg-[#fce7f3]",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-slate-900 bg-[#ffd84d] text-slate-950 text-xs font-mono font-bold shadow-[2px_2px_0px_#0f172a]">
          <span className="h-2 w-2 rounded-full bg-[#e85a9b] animate-pulse" />
          Shinchan Online Hackathon 2026 by DEVENGERS
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-950 tracking-tight">
          Meet Your Research Investigation Squad
        </h2>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 font-sans font-medium">
          Every character powers an evidence-grounded research intelligence capability, ensuring your dossiers leave zero critical gaps unanswered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {squad.map((member) => {
          const meta = CHARACTER_DATA[member.id];
          const Icon = member.icon;

          return (
            <div
              key={member.id}
              className="rounded-2xl border-2 border-slate-900 bg-white p-5 flex flex-col justify-between shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <CharacterAvatar character={member.id} size="md" />
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-slate-900 ${member.badgeColor} shadow-[1px_1px_0px_#0f172a]`}>
                    {meta.jpName}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-sm text-slate-950 group-hover:text-[#e85a9b] transition-colors">
                    {meta.name.split(" ")[0]}
                  </h3>
                  <div className="text-[10px] font-mono font-bold text-slate-600 mt-0.5">
                    {meta.role}
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {meta.duty}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  href={member.actionHref}
                  className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-slate-900 hover:text-[#e85a9b] transition-colors"
                >
                  <span>{member.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

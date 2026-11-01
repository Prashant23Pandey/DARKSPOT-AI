"use client";

import * as React from "react";
import { Cpu } from "lucide-react";
import { CharacterAvatar, ShinchanCharacter, CHARACTER_DATA } from "@/components/shinchan/character-avatar";

interface LoadingStateProps {
  topic?: string;
  message?: string;
  character?: ShinchanCharacter;
}

export function LoadingState({
  topic,
  message,
  character = "shinchan",
}: LoadingStateProps) {
  const [activeStep, setActiveStep] = React.useState<number>(0);

  const steps = [
    { character: "shinchan" as const, text: "Preparing your investigation...", badge: "Shinchan • Lead" },
    { character: "kazama" as const, text: "Examining the available evidence...", badge: "Kazama • Evidence" },
    { character: "bochan" as const, text: "Looking for information that may be missing...", badge: "Bo-chan • Dark Spot Scout" },
    { character: "masao" as const, text: "Comparing claims across sources...", badge: "Masao • Conflict Auditor" },
    { character: "nene" as const, text: "Preparing your verification checklist...", badge: "Nene • Planner" },
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [steps.length]);

  const current = steps[activeStep] || steps[0]!;
  const displayChar = character !== "shinchan" ? character : current.character;
  const displayMsg = message || current.text;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] relative overflow-hidden">
      {/* Shinchan Squad Mascot Center */}
      <div className="relative mb-6">
        <CharacterAvatar character={displayChar} size="lg" showBadge />
      </div>

      <div className="space-y-2 max-w-md relative z-10">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-[#ffd84d] border-2 border-slate-900 text-xs font-mono font-bold text-slate-950 shadow-[2px_2px_0px_#0f172a] uppercase">
          <Cpu className="w-3.5 h-3.5 animate-pulse text-[#e85a9b]" />
          <span>{current.badge}</span>
        </div>
        <h4 className="text-xl font-display font-black text-slate-950 tracking-tight transition-all duration-300">
          {displayMsg}
        </h4>
        {topic && (
          <p className="text-xs text-slate-700 font-mono font-bold truncate px-4 py-1.5 rounded-lg bg-slate-50 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            Dossier: &quot;{topic}&quot;
          </p>
        )}
      </div>

      {/* Scanning status step indicators */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left text-xs font-mono font-bold">
        <div className="p-3 rounded-xl border-2 border-slate-900 bg-[#ede9fe] flex items-center gap-2 shadow-[2px_2px_0px_#0f172a]">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-600 animate-pulse" />
          <span className="text-purple-950">Extracting Evidence</span>
        </div>
        <div className="p-3 rounded-xl border-2 border-slate-900 bg-[#fefce8] flex items-center gap-2 shadow-[2px_2px_0px_#0f172a]">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-600 animate-pulse" />
          <span className="text-amber-950">Detecting Conflicts</span>
        </div>
        <div className="p-3 rounded-xl border-2 border-slate-900 bg-[#fff1f2] flex items-center gap-2 shadow-[2px_2px_0px_#0f172a]">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
          <span className="text-rose-950">Auditing Dark Spots</span>
        </div>
      </div>
    </div>
  );
}

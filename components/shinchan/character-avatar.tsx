"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type ShinchanCharacter =
  | "shinchan"
  | "kazama"
  | "nene"
  | "bochan"
  | "masao"
  | "himawari"
  | "shiro";

export interface CharacterMeta {
  name: string;
  jpName: string;
  role: string;
  duty: string;
  color: string; // Tailwind bg
  borderColor: string;
  quote: string;
  avatarSrc: string;
}

export const CHARACTER_DATA: Record<ShinchanCharacter, CharacterMeta> = {
  shinchan: {
    name: "Shinchan (Shinnosuke)",
    jpName: "しんのすけ",
    role: "Lead Investigator & Mascot",
    duty: "Starts research dossiers & follows curiosity to uncover hidden facts.",
    color: "bg-[#ffd84d]",
    borderColor: "border-[#101010]",
    quote: "Ready to investigate what's missing? Let's uncover the truth!",
    avatarSrc: "/assets/shinchan/Sinchan.png",
  },
  kazama: {
    name: "Kazama (Toru)",
    jpName: "風間くん",
    role: "Research Intelligence & Methodology",
    duty: "Analyzes primary source evidence with disciplined academic rigor.",
    color: "bg-[#e0f2fe]",
    borderColor: "border-[#0369a1]",
    quote: "Methodology first! We must verify every claim against primary sources.",
    avatarSrc: "/assets/shinchan/Kazama.png",
  },
  bochan: {
    name: "Bo-chan (Boo)",
    jpName: "ボーちゃん",
    role: "Information Gap Scout",
    duty: "Detects silent omissions, missing criteria, and unanswered institutional questions.",
    color: "bg-[#dcfce7]",
    borderColor: "border-[#15803d]",
    quote: "Something... is missing from this investigation. Look between the lines.",
    avatarSrc: "/assets/shinchan/Bo-chan.png",
  },
  masao: {
    name: "Masao (Sato)",
    jpName: "マサオくん",
    role: "Conflict & Variance Auditor",
    duty: "Cross-checks dates, numbers, and deadlines across sources to flag discrepancies.",
    color: "bg-[#fef3c7]",
    borderColor: "border-[#b45309]",
    quote: "Wait! These two sources say completely different things... let me flag this!",
    avatarSrc: "/assets/shinchan/Masao.png",
  },
  nene: {
    name: "Nene (Sakurada)",
    jpName: "ネネちゃん",
    role: "Verification Assistant",
    duty: "Synthesizes actionable checklists and tracks verification progress.",
    color: "bg-[#fce7f3]",
    borderColor: "border-[#be185d]",
    quote: "Let's organize the verification checklist and get every item signed off!",
    avatarSrc: "/assets/shinchan/Nene.png",
  },
  himawari: {
    name: "Himawari",
    jpName: "ひまわり",
    role: "Celebration & Milestone Scout",
    duty: "Celebrates completed dossiers and successful report exports.",
    color: "bg-[#ffedd5]",
    borderColor: "border-[#c2410c]",
    quote: "Ta-da! High-coverage dossier completed without missing blindspots!",
    avatarSrc: "/assets/shinchan/Sinchan.png",
  },
  shiro: {
    name: "Shiro",
    jpName: "シロ",
    role: "Silent Watchdog & Cache Sentinel",
    duty: "Monitors local deterministic state and preserves evidence provenance.",
    color: "bg-white",
    borderColor: "border-[#101010]",
    quote: "Woof! Deterministic audit trail securely cached in memory.",
    avatarSrc: "/assets/shinchan/decorations/shiro_avatar.png",
  },
};

interface CharacterAvatarProps {
  character: ShinchanCharacter;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showBadge?: boolean;
  className?: string;
}

export function CharacterAvatar({
  character,
  size = "md",
  showBadge = false,
  className = "",
}: CharacterAvatarProps) {
  const meta = CHARACTER_DATA[character];

  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28 sm:w-32 sm:h-32",
  }[size];

  return (
    <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <div
        className={cn(
          sizeClasses,
          "rounded-2xl border-2 border-[#101010] shadow-[2px_2px_0px_#101010] overflow-hidden relative flex items-center justify-center transition-transform hover:-translate-y-0.5 p-1",
          meta.color
        )}
      >
        <Image
          src={meta.avatarSrc}
          alt={meta.name}
          width={128}
          height={128}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showBadge && (
        <span className="absolute -bottom-1 -right-1 bg-[#ffd84d] text-[#101010] border border-[#101010] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shadow-[1px_1px_0px_#101010]">
          DEVENGERS
        </span>
      )}
    </div>
  );
}

interface CharacterCalloutProps {
  character: ShinchanCharacter;
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  variant?: "bubble" | "banner" | "card";
}

export function CharacterCallout({
  character,
  title,
  message,
  actionText,
  onAction,
  className = "",
  variant = "bubble",
}: CharacterCalloutProps) {
  const meta = CHARACTER_DATA[character];

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "rounded-2xl border-2 border-[#101010] bg-white p-4 shadow-[3px_3px_0px_#101010] flex items-center gap-3.5",
          className
        )}
      >
        <CharacterAvatar character={character} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-display font-black text-slate-950">
              {title || meta.name}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
              {meta.role}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-sans font-medium mt-0.5 leading-snug">
            {message}
          </p>
        </div>
        {actionText && (
          <button
            onClick={onAction}
            className="text-xs font-display font-black bg-[#ffd84d] text-slate-950 border-2 border-slate-900 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#0f172a] hover:bg-[#facc15] active:translate-x-0.5 active:translate-y-0.5 shrink-0"
          >
            {actionText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-[#101010] bg-white p-4 sm:p-5 shadow-[4px_4px_0px_#101010] flex flex-col sm:flex-row items-start sm:items-center gap-4",
        className
      )}
    >
      <div className="flex items-center gap-3 shrink-0">
        <CharacterAvatar character={character} size="md" />
        <div className="sm:hidden">
          <div className="font-display font-black text-sm text-slate-950">{title || meta.name}</div>
          <div className="text-[10px] font-mono text-slate-500">{meta.role}</div>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <div className="hidden sm:flex items-center gap-2">
          <span className="font-display font-black text-sm text-slate-950">{title || meta.name}</span>
          <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
            {meta.role}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 font-sans font-medium leading-relaxed">
          &ldquo;{message}&rdquo;
        </p>
      </div>
      {actionText && (
        <button
          onClick={onAction}
          className="text-xs font-display font-black bg-[#ffd84d] text-slate-950 border-2 border-slate-900 px-4 py-2 rounded-xl shadow-[2px_2px_0px_#0f172a] hover:bg-[#facc15] active:translate-x-0.5 active:translate-y-0.5 shrink-0 w-full sm:w-auto"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { HelpCircle, LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterAvatar, ShinchanCharacter } from "@/components/shinchan/character-avatar";

interface EmptyStateProps {
  icon?: LucideIcon;
  character?: ShinchanCharacter;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  presetHints?: Array<{ label: string; onClick: () => void }>;
}

export function EmptyState({
  icon: Icon = Sparkles,
  character = "shinchan",
  title,
  description,
  actionLabel,
  onAction,
  presetHints,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a]">
      {/* Shinchan Character Center */}
      <div className="mb-4">
        <CharacterAvatar character={character} size="lg" showBadge />
      </div>

      <h3 className="text-xl font-display font-black text-slate-950 tracking-tight mb-2">
        {title}
      </h3>
      <p className="max-w-md text-sm text-slate-600 mb-6 leading-relaxed font-medium font-sans">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="yellow" size="sm" className="mb-4">
          {actionLabel}
        </Button>
      )}

      {presetHints && presetHints.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-slate-100 w-full max-w-md">
          <p className="text-xs text-slate-600 font-bold mb-2 flex items-center justify-center gap-1.5 font-display">
            <HelpCircle className="w-3.5 h-3.5 text-[#e85a9b]" />
            Or test with a pre-configured verification benchmark:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {presetHints.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={preset.onClick}
                className="text-xs font-display font-bold px-3 py-1 rounded-lg border-2 border-slate-900 bg-slate-50 text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#cffafe] transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

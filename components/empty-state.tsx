import * as React from "react";
import { AlertCircle, HelpCircle, LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  presetHints?: Array<{ label: string; onClick: () => void }>;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  presetHints,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 backdrop-blur-sm">
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <Icon className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
        {title}
      </h3>
      <p className="max-w-md text-sm text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="cyber" size="sm" className="mb-4">
          {actionLabel}
        </Button>
      )}

      {presetHints && presetHints.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 w-full max-w-md">
          <p className="text-xs text-slate-500 mb-2 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Or test with a pre-configured verification benchmark:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {presetHints.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={preset.onClick}
                className="text-xs px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
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

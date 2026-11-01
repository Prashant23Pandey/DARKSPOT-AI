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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a]">
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fde047] border-2 border-slate-900 text-slate-950 shadow-[3px_3px_0px_#0f172a]">
        <Icon className="h-8 w-8 text-slate-950" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ec4899] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ec4899] border border-slate-900"></span>
        </span>
      </div>

      <h3 className="text-xl font-display font-black text-slate-950 tracking-tight mb-2">
        {title}
      </h3>
      <p className="max-w-md text-sm text-slate-600 mb-6 leading-relaxed font-medium">
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
            <HelpCircle className="w-3.5 h-3.5 text-[#ec4899]" />
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

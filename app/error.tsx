"use client";

import * as React from "react";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error caught by root boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafaf8] text-slate-950 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 border-2 border-slate-900 text-rose-600 shadow-[3px_3px_0px_#0f172a]">
          <AlertTriangle className="h-8 w-8 text-rose-600" />
        </div>

        <h2 className="text-2xl font-display font-black tracking-tight text-slate-950">
          Investigation Exception Caught
        </h2>

        <p className="text-xs sm:text-sm text-rose-950 font-mono bg-rose-50 p-3 rounded-xl border-2 border-rose-300 break-words text-left font-medium">
          {error.message || "An unexpected error disrupted the intelligence pipeline."}
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/dashboard")}
            className="text-xs font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
          >
            <Home className="w-4 h-4 mr-1.5" />
            Reset Console
          </Button>

          <Button
            type="button"
            variant="yellow"
            size="sm"
            onClick={() => reset()}
            className="text-xs font-display font-bold"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

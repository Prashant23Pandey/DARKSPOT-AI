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
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="max-w-md w-full p-8 rounded-2xl border border-rose-500/40 bg-slate-900/80 backdrop-blur-xl text-center space-y-4 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/70 border border-rose-500/30 text-rose-400">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-white">
          Investigation Exception Caught
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 break-words text-left">
          {error.message || "An unexpected error disrupted the intelligence pipeline."}
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="text-xs"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            Reset Console
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => reset()}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

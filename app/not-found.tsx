import Link from "next/link";
import { Radar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="max-w-md w-full p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400">
          <Radar className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          404 — Signal Lost
        </h1>

        <p className="text-sm text-slate-400">
          The requested intelligence report or endpoint does not exist or has been relocated.
        </p>

        <div className="pt-2">
          <Button asChild variant="cyber" size="sm">
            <Link href="/" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Return to Console
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

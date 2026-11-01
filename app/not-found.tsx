import Link from "next/link";
import { Radar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafaf8] text-slate-950 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fde047] border-2 border-slate-900 text-slate-950 shadow-[3px_3px_0px_#0f172a]">
          <Radar className="h-8 w-8 text-slate-950" />
        </div>

        <h1 className="text-3xl font-display font-black tracking-tight text-slate-950">
          404 — Signal Lost
        </h1>

        <p className="text-sm text-slate-600 font-medium">
          The requested intelligence report or endpoint does not exist or has been relocated.
        </p>

        <div className="pt-2">
          <Button asChild variant="yellow" size="sm">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 font-display font-bold">
              <ArrowLeft className="w-4 h-4" />
              Return to Console
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

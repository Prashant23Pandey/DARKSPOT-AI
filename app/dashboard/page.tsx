"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Radar, 
  Plus, 
  ShieldAlert, 
  GitFork, 
  Clock, 
  Search, 
  Star, 
  ArrowUpRight, 
  Activity, 
  Sparkles,
  TrendingUp,
  FileText,
  CheckCircle2,
  Filter,
  Layers,
  Radio
} from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStoredInvestigations, type InvestigationRecord } from "@/lib/store/investigations";
import { PersistenceStatusBanner } from "@/components/dashboard/persistence-status-banner";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [investigations, setInvestigations] = React.useState<InvestigationRecord[]>([]);
  const [filter, setFilter] = React.useState<"all" | "high_risk" | "starred">("all");
  const [search, setSearch] = React.useState(queryParam);

  React.useEffect(() => {
    setInvestigations(getStoredInvestigations());
  }, []);

  React.useEffect(() => {
    if (queryParam) {
      setSearch(queryParam);
    }
  }, [queryParam]);

  // Aggregate Metrics
  const totalDossiers = investigations.length;
  const totalGaps = investigations.reduce((sum, inv) => sum + (inv.result?.metrics?.gapCount || 0), 0);
  const totalConflicts = investigations.reduce((sum, inv) => sum + (inv.result?.metrics?.conflictCount || 0), 0);
  const avgDarkSpotIndex = totalDossiers > 0
    ? Math.round(investigations.reduce((sum, inv) => sum + (inv.result?.metrics?.darkSpotIndex || 0), 0) / totalDossiers)
    : 0;

  // Filtered investigations
  const filtered = investigations.filter((inv) => {
    const matchesSearch = inv.topic.toLowerCase().includes(search.toLowerCase()) ||
      inv.researchQuestion?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "starred") return inv.isStarred;
    if (filter === "high_risk") return (inv.result?.metrics?.darkSpotIndex || 0) >= 70;
    return true;
  });

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        {/* Welcome Section — Neo-Brutalist Light Style */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 sm:p-8 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a]">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fde047] border-2 border-slate-900 text-slate-950 font-black text-[11px] font-mono shadow-[1px_1px_0px_#0f172a] uppercase tracking-wider">
                Shinchan Hackathon 2026
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fce7f3] border-2 border-slate-900 text-[#be185d] font-bold text-[11px] font-mono shadow-[1px_1px_0px_#0f172a]">
                AI Gap Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-950 tracking-tight">
              Investigative <span className="text-[#db2777]">Intelligence</span> Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
              Cross-examine heterogeneous evidence sources to uncover potential information gaps, reconciles conflicting claims, and build deterministic verification roadmaps.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="h-11 px-5 bg-[#fde047] hover:bg-[#facc15] text-slate-950 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] text-xs font-black shrink-0 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Link href="/research/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Launch New Investigation</span>
            </Link>
          </Button>
        </div>

        {/* Persistence Status Banner */}
        <PersistenceStatusBanner />

        {/* 4 Statistics Cards — Colorful Illustrative Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Dossiers */}
          <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 font-mono uppercase">Total Dossiers</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ede9fe] border border-slate-900 text-[#6d28d9] font-black text-[10px] font-mono">
                DOSSIERS
              </span>
            </div>
            <div className="text-4xl font-black text-slate-950 font-display">{totalDossiers}</div>
            <p className="text-[11px] text-slate-500 font-medium">Active multi-source investigations</p>
          </div>

          {/* Card 2: Critical Gaps */}
          <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 font-mono uppercase">Critical Gaps</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ffe4e6] border border-slate-900 text-[#be123c] font-black text-[10px] font-mono">
                OMISSIONS
              </span>
            </div>
            <div className="text-4xl font-black text-[#be123c] font-display">{totalGaps}</div>
            <p className="text-[11px] text-slate-500 font-medium">Unanswered institutional criteria</p>
          </div>

          {/* Card 3: Contradictions */}
          <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 font-mono uppercase">Contradictions</span>
              <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] border border-slate-900 text-[#b45309] font-black text-[10px] font-mono">
                CONFLICTS
              </span>
            </div>
            <div className="text-4xl font-black text-[#b45309] font-display">{totalConflicts}</div>
            <p className="text-[11px] text-slate-500 font-medium">Cross-source variances & date clashes</p>
          </div>

          {/* Card 4: Dark Spot Index */}
          <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 font-mono uppercase">Avg Dark Spot Index</span>
              <span className="px-2 py-0.5 rounded-full bg-[#cffafe] border border-slate-900 text-[#0e7490] font-black text-[10px] font-mono">
                RISK SCORE
              </span>
            </div>
            <div className="text-4xl font-black text-[#0e7490] font-display">{avgDarkSpotIndex}<span className="text-lg font-bold text-slate-400">/100</span></div>
            <p className="text-[11px] text-slate-500 font-medium">Information gap vulnerability benchmark</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] max-w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "all" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              All Investigations ({investigations.length})
            </button>
            <button
              onClick={() => setFilter("high_risk")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "high_risk" ? "bg-[#ffe4e6] text-[#be123c] border border-slate-900 shadow-sm" : "text-slate-600 hover:text-[#be123c]"
              }`}
            >
              High Risk Index
            </button>
            <button
              onClick={() => setFilter("starred")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "starred" ? "bg-[#fef3c7] text-[#b45309] border border-slate-900 shadow-sm" : "text-slate-600 hover:text-[#b45309]"
              }`}
            >
              Starred
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter dossiers..."
              className="h-10 w-full pl-9 pr-4 text-xs font-medium bg-white border-2 border-slate-900 text-slate-900 placeholder:text-slate-400 rounded-xl shadow-[2px_2px_0px_#0f172a] focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Investigation Dossiers Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
            <span>Investigation Dossiers ({filtered.length})</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center p-12 rounded-2xl border-2 border-dashed border-slate-400 bg-white shadow-[3px_3px_0px_#0f172a] space-y-3">
              <Radar className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-bold font-display text-slate-900">No dossiers match your search</div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                Try adjusting your search criteria or create a new investigation to start detecting information gaps.
              </p>
              <Button asChild size="sm" className="bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                <Link href="/research/new">Launch New Dossier</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((inv) => {
                const darkSpotIndex = inv.result?.metrics?.darkSpotIndex || 50;
                return (
                  <div
                    key={inv.id}
                    className="p-6 rounded-2xl border-2 border-slate-900 bg-white hover:shadow-[5px_5px_0px_#0f172a] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-[3px_3px_0px_#0f172a] group"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                          href={`/research/${inv.id}`}
                          className="font-black text-base sm:text-lg text-slate-950 hover:text-[#db2777] font-display transition-colors truncate"
                        >
                          {inv.topic}
                        </Link>
                        {inv.is_demo && (
                          <span className="px-2 py-0.5 rounded-full bg-[#fef08a] border border-slate-900 text-slate-950 font-black text-[10px] font-mono shadow-[1px_1px_0px_#0f172a]">
                            DEMO
                          </span>
                        )}
                        {inv.isStarred && <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />}
                        <span className="text-[11px] font-mono font-semibold text-slate-500">
                          {formatDate(inv.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 font-medium font-sans">
                        {inv.researchQuestion || inv.objective}
                      </p>

                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        {inv.tags?.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-300"
                          >
                            #{t}
                          </span>
                        ))}
                        <span className="text-[11px] font-mono font-bold text-slate-700 bg-[#e0f2fe] px-2 py-0.5 rounded-lg border border-slate-300">
                          {inv.sources.length} Sources Analyzed
                        </span>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-5 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-200">
                      {/* Dark Spot Index badge */}
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Dark Spot Index</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xl font-black font-display ${
                            darkSpotIndex >= 70 ? "text-[#be123c]" : darkSpotIndex >= 40 ? "text-[#b45309]" : "text-[#0e7490]"
                          }`}>
                            {darkSpotIndex}/100
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Button
                          asChild
                          size="sm"
                          className="h-9 px-3.5 text-xs bg-white hover:bg-slate-50 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <Link href={`/evidence/${inv.id}`}>
                            Evidence
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="h-9 px-4 text-xs bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <Link href={`/research/${inv.id}`} className="flex items-center gap-1.5">
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Research Activity Stream (Ticker style like reference screenshot 3) */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 space-y-4 shadow-[3px_3px_0px_#0f172a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#fde047] border border-slate-900 flex items-center justify-center shadow-[1px_1px_0px_#0f172a]">
                <Activity className="w-4 h-4 text-slate-950" />
              </div>
              <h3 className="font-black text-sm font-display text-slate-950">Recent Incident & Research Ticker</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#fde047] border border-slate-900 text-slate-950 font-black text-[9px] font-mono">
                LIVE FEED
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#15803d] flex items-center gap-1.5 bg-[#f0fdf4] px-2.5 py-1 rounded-full border border-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Inference Active
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-sans">
            <div className="flex items-start justify-between p-3 rounded-xl bg-[#f0fdf4] border border-emerald-300 text-slate-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">[EXTRACTION] Ingested 3 multi-page source streams for Higher Education Scholarship Renewal</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">10:44:20</span>
            </div>
            <div className="flex items-start justify-between p-3 rounded-xl bg-[#ffe4e6] border border-rose-300 text-slate-900">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">[OMISSION GAP] Flagged missing annual re-application deadline criteria in student handbook</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">10:43:05</span>
            </div>
            <div className="flex items-start justify-between p-3 rounded-xl bg-[#fef3c7] border border-amber-300 text-slate-900">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">[CONTRADICTION] Flagged numerical tax filing year variance between Portal (2024) and Financial Aid Guide (2025)</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">10:41:12</span>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

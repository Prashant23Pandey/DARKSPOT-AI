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
  Radio,
  FileSearch,
  CheckSquare,
  AlertTriangle,
  Flame
} from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllInvestigations, type InvestigationRecord } from "@/lib/repository";
import { PersistenceStatusBanner } from "@/components/dashboard/persistence-status-banner";
import { formatDate } from "@/lib/utils";
import { CharacterAvatar } from "@/components/shinchan/character-avatar";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [investigations, setInvestigations] = React.useState<InvestigationRecord[]>([]);
  const [filter, setFilter] = React.useState<"all" | "high_risk" | "conflicts" | "gaps" | "starred">("all");
  const [search, setSearch] = React.useState(queryParam);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const list = await getAllInvestigations();
      setInvestigations(list);
      setIsLoading(false);
    }
    loadData();
  }, []);

  React.useEffect(() => {
    if (queryParam) {
      setSearch(queryParam);
    }
  }, [queryParam]);

  // Aggregate Metrics from real investigations
  const totalDossiers = investigations.length;
  const totalSources = investigations.reduce((sum, inv) => sum + (inv.sources?.length || 0), 0);
  const totalGaps = investigations.reduce((sum, inv) => sum + (inv.result?.metrics?.gapCount || 0), 0);
  const totalConflicts = investigations.reduce((sum, inv) => sum + (inv.result?.metrics?.conflictCount || 0), 0);
  const totalOutdated = investigations.reduce((sum, inv) => sum + (inv.result?.metrics?.outdatedCount || 0), 0);
  
  // Verification Tasks Progress
  const totalTasks = investigations.reduce((sum, inv) => sum + (inv.result?.verification_checklist?.length || 0), 0);
  const completedTasks = investigations.reduce(
    (sum, inv) => sum + (inv.result?.verification_checklist?.filter((t: { completed?: boolean; status?: string }) => t.completed || t.status === "verified").length || 0),
    0
  );
  const verificationProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const avgDarkSpotIndex = totalDossiers > 0
    ? Math.round(investigations.reduce((sum, inv) => sum + (inv.result?.metrics?.darkSpotIndex || 0), 0) / totalDossiers)
    : 0;

  // Aggregate Research Coverage Matrix across all active investigations
  const coverageMatrix = React.useMemo(() => {
    let coveredCount = 0;
    let partialCount = 0;
    let missingCount = 0;
    let conflictCount = totalConflicts;
    let needsVerificationCount = totalTasks - completedTasks;

    for (const inv of investigations) {
      if (inv.result?.dimensions && inv.result.dimensions.length > 0) {
        for (const dim of inv.result.dimensions) {
          if (dim.status === "found") coveredCount++;
          else if (dim.status === "partially_found") partialCount++;
          else if (dim.status === "not_found") missingCount++;
        }
      } else {
        // Fallback approximation if dimensions not cached
        const facts = inv.result?.structured_summary?.length || 0;
        const gaps = inv.result?.information_gaps?.length || 0;
        coveredCount += Math.max(1, facts);
        missingCount += gaps;
      }
    }

    return {
      covered: coveredCount,
      partiallyCovered: partialCount,
      missing: missingCount,
      conflicting: conflictCount,
      needsVerification: Math.max(0, needsVerificationCount),
    };
  }, [investigations, totalConflicts, totalTasks, completedTasks]);

  // Filtered investigations
  const filtered = investigations.filter((inv) => {
    const matchesSearch = inv.topic.toLowerCase().includes(search.toLowerCase()) ||
      inv.researchQuestion?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "starred") return inv.isStarred;
    if (filter === "high_risk") return (inv.result?.metrics?.darkSpotIndex || 0) >= 70;
    if (filter === "conflicts") return (inv.result?.metrics?.conflictCount || 0) > 0;
    if (filter === "gaps") return (inv.result?.metrics?.gapCount || 0) > 0;
    return true;
  });

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        {/* Welcome Section — Shinchan Hackathon Edition */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a]">
          <div className="flex items-start sm:items-center gap-4">
            <CharacterAvatar character="shinchan" size="lg" className="hidden sm:inline-flex" />
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffd84d] border-2 border-slate-900 text-slate-950 font-black text-[11px] font-mono shadow-[1px_1px_0px_#0f172a] uppercase tracking-wider">
                  DEVENGERS &bull; Shinchan Hackathon 2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#fce7f3] border-2 border-slate-900 text-[#be185d] font-bold text-[11px] font-mono shadow-[1px_1px_0px_#0f172a]">
                  Evidence Intelligence Console
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-950 tracking-tight">
                Investigative <span className="text-[#e85a9b]">Intelligence</span> Console
              </h1>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans font-medium">
                <strong className="text-slate-950 font-black">Ready to investigate what&apos;s missing?</strong> Cross-examine heterogeneous evidence sources to uncover potential information gaps, reconcile conflicting claims, and build deterministic verification roadmaps.
              </p>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="h-11 px-5 bg-[#ffd84d] hover:bg-[#facc15] text-slate-950 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] text-xs font-black shrink-0 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Link href="/research/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Launch New Investigation</span>
            </Link>
          </Button>
        </div>

        {/* Persistence Status Banner with Real Supabase Verification */}
        <PersistenceStatusBanner />

        {/* 6 Interactive Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Dossiers */}
          <button
            onClick={() => setFilter("all")}
            className={`p-4 rounded-2xl border-2 border-slate-900 bg-white text-left shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 transition-all space-y-1.5 ${
              filter === "all" ? "ring-2 ring-slate-950 bg-slate-50" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 font-mono uppercase">Total Dossiers</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#ede9fe] border border-slate-900 text-[#6d28d9] font-black text-[9px] font-mono">
                DOSSIERS
              </span>
            </div>
            <div className="text-3xl font-black text-slate-950 font-display">{totalDossiers}</div>
            <p className="text-[10px] text-slate-500 font-medium">Active investigations</p>
          </button>

          {/* Card 2: Sources Analyzed */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white text-left shadow-[3px_3px_0px_#0f172a] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 font-mono uppercase">Sources Analyzed</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#e0f2fe] border border-slate-900 text-[#0369a1] font-black text-[9px] font-mono">
                EVIDENCE
              </span>
            </div>
            <div className="text-3xl font-black text-[#0369a1] font-display">{totalSources}</div>
            <p className="text-[10px] text-slate-500 font-medium">URLs & excerpts ingested</p>
          </div>

          {/* Card 3: Critical Gaps */}
          <button
            onClick={() => setFilter("gaps")}
            className={`p-4 rounded-2xl border-2 border-slate-900 bg-white text-left shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 transition-all space-y-1.5 ${
              filter === "gaps" ? "ring-2 ring-[#be123c] bg-[#fff1f2]" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 font-mono uppercase">Information Gaps</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#ffe4e6] border border-slate-900 text-[#be123c] font-black text-[9px] font-mono">
                OMISSIONS
              </span>
            </div>
            <div className="text-3xl font-black text-[#be123c] font-display">{totalGaps}</div>
            <p className="text-[10px] text-slate-500 font-medium">Unanswered criteria</p>
          </button>

          {/* Card 4: Contradictions */}
          <button
            onClick={() => setFilter("conflicts")}
            className={`p-4 rounded-2xl border-2 border-slate-900 bg-white text-left shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 transition-all space-y-1.5 ${
              filter === "conflicts" ? "ring-2 ring-[#b45309] bg-[#fffbeb]" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 font-mono uppercase">Contradictions</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#fef3c7] border border-slate-900 text-[#b45309] font-black text-[9px] font-mono">
                CONFLICTS
              </span>
            </div>
            <div className="text-3xl font-black text-[#b45309] font-display">{totalConflicts}</div>
            <p className="text-[10px] text-slate-500 font-medium">Cross-source variances</p>
          </button>

          {/* Card 5: Potentially Outdated */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white text-left shadow-[3px_3px_0px_#0f172a] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 font-mono uppercase">Temporal Drift</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#ffedd5] border border-slate-900 text-[#c2410c] font-black text-[9px] font-mono">
                STALE
              </span>
            </div>
            <div className="text-3xl font-black text-[#c2410c] font-display">{totalOutdated}</div>
            <p className="text-[10px] text-slate-500 font-medium">Obsolete cycles detected</p>
          </div>

          {/* Card 6: Verification Progress */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white text-left shadow-[3px_3px_0px_#0f172a] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 font-mono uppercase">Verification</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#dcfce7] border border-slate-900 text-[#15803d] font-black text-[9px] font-mono">
                TASKS
              </span>
            </div>
            <div className="text-3xl font-black text-[#15803d] font-display">{verificationProgressPercent}%</div>
            <p className="text-[10px] text-slate-500 font-medium">{completedTasks}/{totalTasks} verified</p>
          </div>
        </div>

        {/* Research Coverage Matrix */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 sm:p-6 shadow-[4px_4px_0px_#0f172a] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-[#ffd84d] border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                <Layers className="w-4 h-4 text-slate-950" />
              </div>
              <h2 className="text-base font-black font-display text-slate-950">
                Research Coverage Matrix
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Cross-Dossier Completeness & Evidence Baseline
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {/* 1. Covered */}
            <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-[#dcfce7]/70 shadow-[2px_2px_0px_#0f172a] space-y-1">
              <div className="text-[11px] font-mono font-black text-[#14532d] uppercase">Covered</div>
              <div className="text-2xl font-black text-[#15803d] font-display">{coverageMatrix.covered}</div>
              <p className="text-[10px] text-slate-600 font-medium">Consensus verified</p>
            </div>

            {/* 2. Partially Covered */}
            <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-[#cffafe]/70 shadow-[2px_2px_0px_#0f172a] space-y-1">
              <div className="text-[11px] font-mono font-black text-[#0e7490] uppercase">Partially Covered</div>
              <div className="text-2xl font-black text-[#0891b2] font-display">{coverageMatrix.partiallyCovered}</div>
              <p className="text-[10px] text-slate-600 font-medium">Fragmented claims</p>
            </div>

            {/* 3. Missing */}
            <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-[#ffe4e6]/70 shadow-[2px_2px_0px_#0f172a] space-y-1">
              <div className="text-[11px] font-mono font-black text-[#be123c] uppercase">Missing From Sources</div>
              <div className="text-2xl font-black text-[#e11d48] font-display">{coverageMatrix.missing}</div>
              <p className="text-[10px] text-slate-600 font-medium">Omitted criteria</p>
            </div>

            {/* 4. Conflicting */}
            <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-[#fef3c7]/70 shadow-[2px_2px_0px_#0f172a] space-y-1">
              <div className="text-[11px] font-mono font-black text-[#b45309] uppercase">Conflicting</div>
              <div className="text-2xl font-black text-[#d97706] font-display">{coverageMatrix.conflicting}</div>
              <p className="text-[10px] text-slate-600 font-medium">Numerical & date clashes</p>
            </div>

            {/* 5. Needs Verification */}
            <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-[#ede9fe]/70 shadow-[2px_2px_0px_#0f172a] space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-mono font-black text-[#6d28d9] uppercase">Needs Verification</div>
              <div className="text-2xl font-black text-[#7c3aed] font-display">{coverageMatrix.needsVerification}</div>
              <p className="text-[10px] text-slate-600 font-medium">Open checklist tasks</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex-wrap max-w-fit">
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
              High Risk
            </button>
            <button
              onClick={() => setFilter("conflicts")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "conflicts" ? "bg-[#fef3c7] text-[#b45309] border border-slate-900 shadow-sm" : "text-slate-600 hover:text-[#b45309]"
              }`}
            >
              Conflicts
            </button>
            <button
              onClick={() => setFilter("gaps")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "gaps" ? "bg-[#fee2e2] text-[#991b1b] border border-slate-900 shadow-sm" : "text-slate-600 hover:text-[#991b1b]"
              }`}
            >
              Gaps
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
                        {inv.tags?.map((t: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right side metrics and actions */}
                    <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-between md:justify-end">
                      <div className="flex items-center gap-3">
                        {/* Gaps count */}
                        <div className="text-center px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
                          <div className="text-[10px] font-mono font-bold text-rose-700">GAPS</div>
                          <div className="text-sm font-black text-rose-900">{inv.result?.metrics?.gapCount || 0}</div>
                        </div>

                        {/* Conflicts count */}
                        <div className="text-center px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
                          <div className="text-[10px] font-mono font-bold text-amber-700">CONFLICTS</div>
                          <div className="text-sm font-black text-amber-900">{inv.result?.metrics?.conflictCount || 0}</div>
                        </div>

                        {/* Dark Spot Index */}
                        <div className="text-center px-3 py-1.5 rounded-xl bg-[#cffafe] border border-cyan-300">
                          <div className="text-[10px] font-mono font-bold text-cyan-900">INDEX</div>
                          <div className="text-sm font-black text-cyan-950">{darkSpotIndex}</div>
                        </div>
                      </div>

                      <Button
                        asChild
                        size="sm"
                        className="h-9 px-4 bg-white hover:bg-slate-100 text-slate-900 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs flex items-center gap-1 group-hover:bg-[#ffd84d]"
                      >
                        <Link href={`/research/${inv.id}`}>
                          <span>Open</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}

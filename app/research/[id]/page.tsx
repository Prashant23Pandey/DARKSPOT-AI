"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Radar, 
  ArrowLeft, 
  ShieldAlert, 
  GitFork, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ExternalLink,
  Activity,
  Share2,
  Calendar,
  Sparkles,
  Download,
  Pencil,
  Check,
  X,
  Trash2
} from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MetricsOverview } from "@/components/dashboard/metrics-overview";
import { GapsView } from "@/components/reports/gaps-view";
import { ConflictsView } from "@/components/evidence/conflicts-view";
import { OutdatedWarningsView } from "@/components/reports/outdated-warnings-view";
import { VerificationChecklistView } from "@/components/reports/verification-checklist-view";
import { FactsSummary } from "@/components/evidence/facts-summary";
import { ExportDossierModal } from "@/components/reports/export-dossier-modal";
import { ResearchCoverageDashboard } from "@/components/reports/research-coverage-dashboard";
import { InformationDimensionMatrix } from "@/components/reports/information-dimension-matrix";
import { ExtractedClaimsTable } from "@/components/evidence/extracted-claims-table";
import { 
  getStoredInvestigations, 
  getInvestigationById, 
  DEFAULT_INVESTIGATIONS,
  type InvestigationRecord 
} from "@/lib/store/investigations";
import { 
  updateInvestigationTitle, 
  updateVerificationTask, 
  deleteInvestigationSafely 
} from "@/lib/repository";
import { formatDate } from "@/lib/utils";

export default function InvestigationWorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const id = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";

  const [investigation, setInvestigation] = useState<InvestigationRecord | null>(() => {
    if (id) {
      const match = DEFAULT_INVESTIGATIONS.find((i) => i.id === id);
      if (match) return match;
    }
    return DEFAULT_INVESTIGATIONS[0] || null;
  });

  const [activeTab, setActiveTab] = useState<string>("gaps");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const inv = getInvestigationById(id);
      if (inv) {
        setInvestigation(inv);
        setEditedTitle(inv.topic);
        return;
      }
    }
    const all = getStoredInvestigations();
    if (all.length > 0 && all[0]) {
      setInvestigation(all[0]);
      setEditedTitle(all[0].topic);
    }
  }, [id]);

  const handleToggleChecklist = async (checkId: string) => {
    if (!investigation) return;
    const target = investigation.result.verification_checklist.find((item) => item.id === checkId);
    if (!target) return;
    const newCompleted = !target.completed;
    const newStatus = newCompleted ? ("verified" as const) : ("pending" as const);

    const updatedChecklist = investigation.result.verification_checklist.map((item) =>
      item.id === checkId ? { ...item, completed: newCompleted, status: newStatus } : item
    );

    const updatedInv: InvestigationRecord = {
      ...investigation,
      result: {
        ...investigation.result,
        verification_checklist: updatedChecklist,
      },
    };

    setInvestigation(updatedInv);
    await updateVerificationTask(investigation.id, checkId, {
      completed: newCompleted,
      status: newStatus,
    });
  };

  const handleUpdateTaskStatus = async (
    checkId: string, 
    status: "pending" | "in_progress" | "verified" | "unable_to_verify"
  ) => {
    if (!investigation) return;
    const updatedChecklist = investigation.result.verification_checklist.map((item) =>
      item.id === checkId ? { ...item, status, completed: status === "verified" } : item
    );

    const updatedInv: InvestigationRecord = {
      ...investigation,
      result: {
        ...investigation.result,
        verification_checklist: updatedChecklist,
      },
    };

    setInvestigation(updatedInv);
    await updateVerificationTask(investigation.id, checkId, {
      status,
      completed: status === "verified",
    });
  };

  const handleSaveTitle = async () => {
    if (!investigation || !editedTitle.trim()) return;
    const newTitle = editedTitle.trim();
    const updated = { ...investigation, topic: newTitle };
    setInvestigation(updated);
    setIsEditingTitle(false);
    await updateInvestigationTitle(investigation.id, newTitle);
  };

  const handleDelete = async () => {
    if (!investigation) return;
    setIsDeleting(true);
    await deleteInvestigationSafely(investigation.id);
    router.push("/dashboard");
  };

  if (!investigation) {
    return (
      <WorkspaceLayout>
        <div className="p-12 text-center space-y-4 bg-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
          <h2 className="text-xl font-black font-display text-slate-950">Investigation Not Found</h2>
          <Button asChild size="sm" className="bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </WorkspaceLayout>
    );
  }

  const { result } = investigation;

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="h-8 px-2.5 text-xs bg-white hover:bg-slate-100 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
            >
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5 text-slate-900" />
                <span>Dashboard</span>
              </Link>
            </Button>
            <span className="text-slate-400 font-bold">/</span>
            <span className="text-xs font-mono font-bold text-slate-600 truncate max-w-xs">
              {investigation.topic}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              asChild
              size="sm"
              className="h-9 px-3.5 text-xs bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Link href={`/reports/${investigation.id}`} className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-950" />
                <span>Executive Report</span>
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="h-9 px-3.5 text-xs bg-white hover:bg-slate-50 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Link href={`/evidence/${investigation.id}`} className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#6d28d9]" />
                <span>Evidence Explorer</span>
              </Link>
            </Button>

            <ExportDossierModal result={result} />

            {deleteConfirm ? (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-9 px-3 text-xs bg-rose-600 hover:bg-rose-700 text-white font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setDeleteConfirm(false)}
                  className="h-9 px-2 text-xs bg-white text-slate-800 font-bold border-2 border-slate-900"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setDeleteConfirm(true)}
                className="h-9 px-2.5 text-xs bg-white hover:bg-rose-50 text-rose-600 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                title="Delete Investigation Dossier"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
              </Button>
            )}
          </div>
        </div>

        {/* Dossier Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#a3e635] text-slate-950 border-2 border-slate-900 font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_#0f172a] uppercase tracking-wider">
                  LIVE_API
                </span>
                <Badge variant="cyan" className="font-mono text-[10px]">
                  DOSSIER: {investigation.id}
                </Badge>
                <span className="text-[11px] font-mono font-bold text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {formatDate(investigation.createdAt)}
                </span>
                <Badge variant="verified" className="text-[10px]">
                  Verified Ingestion
                </Badge>
                {investigation.is_demo && (
                  <Badge variant="yellow" className="text-[10px]">
                    DEMO DOSSIER
                  </Badge>
                )}
              </div>

              {/* Editable Title Header */}
              {isEditingTitle ? (
                <div className="flex items-center gap-2 max-w-2xl py-1">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-black font-display text-slate-950 px-3 py-1.5 border-2 border-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fde047] shadow-[2px_2px_0px_#0f172a]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle();
                      if (e.key === "Escape") {
                        setIsEditingTitle(false);
                        setEditedTitle(investigation.topic);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveTitle}
                    className="h-10 px-3.5 bg-[#a3e635] hover:bg-[#84cc16] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                    title="Save title"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsEditingTitle(false);
                      setEditedTitle(investigation.topic);
                    }}
                    className="h-10 px-3 bg-white hover:bg-slate-100 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 group">
                  <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-950 tracking-tight">
                    {investigation.topic}
                  </h1>
                  <button
                    onClick={() => {
                      setEditedTitle(investigation.topic);
                      setIsEditingTitle(true);
                    }}
                    className="opacity-70 hover:opacity-100 p-1.5 rounded-lg border border-slate-300 hover:border-slate-900 bg-white hover:bg-[#fef08a] transition shadow-[1px_1px_0px_#0f172a]"
                    title="Edit Dossier Title (persists to Supabase / store)"
                  >
                    <Pencil className="w-4 h-4 text-slate-800" />
                  </button>
                </div>
              )}

              {/* Telemetry line in Space Mono (matching user reference) */}
              <div className="text-xs sm:text-sm font-mono text-slate-700 font-medium tracking-tight">
                Ground Station: Digital Dark Spot Engine ({investigation.sources.length} Ingested Streams) (Coverage: {result.metrics.gapCount} Gaps, {result.metrics.conflictCount} Conflicts)
              </div>

              {investigation.researchQuestion && (
                <p className="text-xs sm:text-sm text-slate-800 font-semibold font-sans pt-1">
                  <span className="text-[#db2777] font-mono text-xs uppercase mr-1.5 font-bold">Research Question:</span>
                  {investigation.researchQuestion}
                </p>
              )}

              {investigation.objective && (
                <p className="text-xs text-slate-600 font-medium font-sans">
                  <span className="text-slate-500 font-mono text-xs uppercase mr-1.5 font-bold">Objective:</span>
                  {investigation.objective}
                </p>
              )}

              {/* Italic Contextual Notice in Space Mono (matching user reference) */}
              <div className="pt-2 text-xs font-mono italic text-slate-600">
                Notice: Gap & conflict detections are contextual; does not constitute automatic legal determination.
              </div>
            </div>

            {/* Quick Source Summary Pill */}
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#fef08a] text-xs font-mono space-y-1 shrink-0 min-w-[210px] shadow-[2px_2px_0px_#0f172a]">
              <div className="text-slate-800 text-[10px] font-extrabold uppercase">Evidence Base</div>
              <div className="text-slate-950 font-black text-sm">{investigation.sources.length} Ingested Streams</div>
              <div className="text-slate-700 text-[10px] font-bold">
                {result.metrics.outdatedCount > 0
                  ? `${result.metrics.outdatedCount} Outdated Warnings`
                  : "All cycles active & current"}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 5: Research Coverage & Completeness Dashboard */}
        {result.completeness_report && (
          <ResearchCoverageDashboard
            report={result.completeness_report}
            topic={investigation.topic}
          />
        )}

        {/* Aggregate Metrics Gauges */}
        <MetricsOverview metrics={result.metrics} />

        {/* Findings Panel with Tabs */}
        <div className="space-y-4 pt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex-wrap">
              <TabsTrigger 
                value="gaps" 
                badge={result.detailed_gaps?.length ?? result.information_gaps.length}
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Information Gaps
              </TabsTrigger>
              <TabsTrigger 
                value="matrix" 
                badge={result.dimensions?.length ?? 0}
              >
                <Layers className="w-4 h-4 text-purple-600" />
                Dimension Matrix
              </TabsTrigger>
              <TabsTrigger 
                value="claims" 
                badge={result.extracted_claims?.length ?? 0}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Extracted Claims
              </TabsTrigger>
              <TabsTrigger value="conflicts" badge={result.conflicts.length}>
                <GitFork className="w-4 h-4 text-amber-600" />
                Conflicting Claims
              </TabsTrigger>
              <TabsTrigger value="outdated" badge={result.outdated_warnings.length}>
                <Clock className="w-4 h-4 text-orange-600" />
                Temporal Warnings
              </TabsTrigger>
              <TabsTrigger value="checklist" badge={result.verification_checklist.length}>
                <Activity className="w-4 h-4 text-cyan-600" />
                Verification Roadmap
              </TabsTrigger>
              <TabsTrigger value="facts" badge={result.structured_summary.length}>
                <FileText className="w-4 h-4 text-blue-600" />
                Consensus
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gaps">
              <GapsView 
                gaps={result.information_gaps} 
                detailedGaps={result.detailed_gaps} 
              />
            </TabsContent>

            <TabsContent value="matrix">
              <InformationDimensionMatrix 
                dimensions={result.dimensions || []} 
              />
            </TabsContent>

            <TabsContent value="claims">
              <ExtractedClaimsTable 
                claims={result.extracted_claims || []} 
              />
            </TabsContent>

            <TabsContent value="conflicts">
              <ConflictsView 
                conflicts={result.conflicts} 
                detailedConflicts={result.detailed_conflicts} 
              />
            </TabsContent>

            <TabsContent value="outdated">
              <OutdatedWarningsView 
                warnings={result.outdated_warnings} 
                audits={result.freshness_audits} 
              />
            </TabsContent>

            <TabsContent value="checklist">
              <VerificationChecklistView
                checklist={result.verification_checklist}
                onToggleItem={handleToggleChecklist}
                onUpdateStatus={handleUpdateTaskStatus}
              />
            </TabsContent>

            <TabsContent value="facts">
              <FactsSummary facts={result.structured_summary} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

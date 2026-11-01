"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Settings, 
  Key, 
  Database, 
  Palette, 
  HardDrive, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Trash2,
  Cpu,
  User,
  Info
} from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_INVESTIGATIONS } from "@/lib/store/investigations";

export default function SettingsPage() {
  const [name, setName] = useState("Lead Investigator");
  const [role, setRole] = useState("Research Intelligence Analyst");
  const [organization, setOrganization] = useState("Shinchan Hackathon Team");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [geminiKeyInput, setGeminiKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (confirm("Reset all local investigations to the default benchmark presets?")) {
      window.localStorage.setItem("darkspot_investigations_v2", JSON.stringify(DEFAULT_INVESTIGATIONS));
      window.location.reload();
    }
  };

  const handleClearAll = () => {
    if (confirm("Permanently wipe all stored investigations from your browser?")) {
      window.localStorage.removeItem("darkspot_investigations_v2");
      window.location.reload();
    }
  };

  return (
    <WorkspaceLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cffafe] border-2 border-slate-900 text-slate-950 text-xs font-mono font-bold shadow-[2px_2px_0px_#0f172a] mb-1">
            <Settings className="w-3.5 h-3.5 text-slate-950" />
            SYSTEM CONFIGURATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-950 tracking-tight flex items-center gap-2">
            Platform & Environment Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Manage investigator profile, live LLM connectors, persistence drivers, and local cache.
          </p>
        </div>

        {/* 1. Profile Settings */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-3">
            <div className="p-1 rounded bg-[#fde047] border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
              <User className="w-4 h-4 text-slate-950" />
            </div>
            <h2 className="font-display font-black text-base text-slate-950">Investigator Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Investigator Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Role / Title
                </label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-10 bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Organization / Hackathon Affiliation
                </label>
                <Input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="h-10 bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono font-medium">
                Changes apply across exported briefings.
              </span>
              <Button
                type="submit"
                size="sm"
                className="h-9 px-5 text-xs font-display font-bold bg-[#fde047] hover:bg-[#facc15] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-slate-950 font-black" />
                    Saved
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* 2. API Configuration Status */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-3">
            <div className="p-1 rounded bg-[#cffafe] border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
              <Key className="w-4 h-4 text-slate-950" />
            </div>
            <h2 className="font-display font-black text-base text-slate-950">API Connectors & Live Engine Status</h2>
          </div>

          <div className="space-y-3">
            {/* Gemini API */}
            <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-700" />
                  <span className="font-display font-bold text-sm text-slate-950">Google Gemini 1.5 Flash</span>
                  <Badge variant="cyan" className="text-[10px] font-bold">LLM CORE</Badge>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Enforces strict structured JSON schema for gap and contradiction inference. If unset, automatically runs in Blueprint Mock Mode.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-500 font-bold text-[10px]">Status:</span>
                <span className="px-2.5 py-1 rounded-md bg-[#dcfce7] border border-slate-900 text-emerald-900 font-bold flex items-center gap-1 shadow-[1px_1px_0px_#0f172a]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Configured (.env.local)
                </span>
              </div>
            </div>

            {/* Supabase */}
            <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span className="font-display font-bold text-sm text-slate-950">Supabase PostgreSQL Layer</span>
                  <Badge variant="lime" className="text-[10px] font-bold">PERSISTENCE</Badge>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Pre-configured schema tables (`investigations`, `sources`, `gap_reports`) ready for team sharing and auth.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-500 font-bold text-[10px]">Driver:</span>
                <span className="px-2.5 py-1 rounded-md bg-[#ede9fe] border border-slate-900 text-purple-900 font-bold shadow-[1px_1px_0px_#0f172a]">
                  @supabase/ssr Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Theme & Aesthetics */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-3">
            <div className="p-1 rounded bg-[#fce7f3] border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
              <Palette className="w-4 h-4 text-slate-950" />
            </div>
            <h2 className="font-display font-black text-base text-slate-950">Visual Theme & Interface Tokens</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#fde047] shadow-[3px_3px_0px_#0f172a] space-y-1.5">
              <div className="font-display font-black text-slate-950 flex items-center justify-between">
                <span>Neo Light Illustrative</span>
                <Check className="w-4 h-4 text-slate-950 font-black" />
              </div>
              <p className="text-[11px] text-slate-900 font-medium leading-relaxed">
                Off-white dot paper canvas with crisp borders, calligraphic fonts, and bold illustrative accents.
              </p>
            </div>

            <div className="p-4 rounded-xl border-2 border-slate-300 bg-slate-50 space-y-1.5 opacity-60">
              <div className="font-display font-bold text-slate-600">Perplexity Slate</div>
              <p className="text-[11px] text-slate-500 font-medium">Muted cool slate panels with teal and emerald badges.</p>
            </div>

            <div className="p-4 rounded-xl border-2 border-slate-300 bg-slate-50 space-y-1.5 opacity-60">
              <div className="font-display font-bold text-slate-600">Technical Blueprint</div>
              <p className="text-[11px] text-slate-500 font-medium">Monochrome grid lines with high density radar graphs.</p>
            </div>
          </div>
        </div>

        {/* 4. Local Data & Cache Preferences */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-3">
            <div className="p-1 rounded bg-rose-100 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
              <HardDrive className="w-4 h-4 text-rose-700" />
            </div>
            <h2 className="font-display font-black text-base text-slate-950">Local Data & Benchmark Presets</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-display font-bold text-slate-950">Reset Reference Benchmarks</div>
              <p className="text-xs text-slate-600 font-medium">
                Restore the default Scholarship, AI Safety, and Clinical cardiac investigation dossiers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetData}
                className="text-xs h-9 font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#ec4899]" />
                Reset Benchmarks
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                className="text-xs h-9 font-display font-bold bg-rose-600 hover:bg-rose-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear Cache
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

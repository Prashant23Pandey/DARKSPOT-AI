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
        <div className="border-b border-[#1b1f2e] pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-violet-400" />
            Platform & Environment Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage investigator profile, live LLM connectors, persistence drivers, and local cache.
          </p>
        </div>

        {/* 1. Profile Settings */}
        <div className="p-5 rounded-2xl border border-[#1b1f2e] bg-[#0c0e15] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1a1d28] pb-3">
            <User className="w-4 h-4 text-violet-400" />
            <h2 className="font-bold text-sm text-white">Investigator Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Investigator Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 bg-[#10131d] border-[#1e2333] text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Role / Title
                </label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-9 bg-[#10131d] border-[#1e2333] text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Organization / Hackathon Affiliation
                </label>
                <Input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="h-9 bg-[#10131d] border-[#1e2333] text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Changes apply across exported briefings.
              </span>
              <Button type="submit" size="sm" className="h-8 px-4 text-xs bg-violet-600 hover:bg-violet-500 text-white">
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
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
        <div className="p-5 rounded-2xl border border-[#1b1f2e] bg-[#0c0e15] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1a1d28] pb-3">
            <Key className="w-4 h-4 text-violet-400" />
            <h2 className="font-bold text-sm text-white">API Connectors & Live Engine Status</h2>
          </div>

          <div className="space-y-3">
            {/* Gemini API */}
            <div className="p-4 rounded-xl bg-[#11131e] border border-[#1d2232] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span className="font-bold text-xs text-slate-200">Google Gemini 1.5 Flash</span>
                  <Badge variant="cyan" className="text-[9px]">LLM CORE</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Enforces strict structured JSON schema for gap and contradiction inference. If unset, automatically runs in Blueprint Mock Mode.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400 text-[10px]">Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Configured (.env.local)
                </span>
              </div>
            </div>

            {/* Supabase */}
            <div className="p-4 rounded-xl bg-[#11131e] border border-[#1d2232] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs text-slate-200">Supabase PostgreSQL Layer</span>
                  <Badge variant="verified" className="text-[9px]">PERSISTENCE</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Pre-configured schema tables (`investigations`, `sources`, `gap_reports`) ready for team sharing and auth.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400 text-[10px]">Driver:</span>
                <span className="text-violet-300">@supabase/ssr Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Theme & Aesthetics */}
        <div className="p-5 rounded-2xl border border-[#1b1f2e] bg-[#0c0e15] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1a1d28] pb-3">
            <Palette className="w-4 h-4 text-violet-400" />
            <h2 className="font-bold text-sm text-white">Visual Theme & Interface Tokens</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-violet-500/50 bg-[#121524] space-y-1.5">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Linear Dark</span>
                <Check className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <p className="text-[11px] text-slate-400">Deep obsidian background with subtle violet and electric blue highlights.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#1e2333] bg-[#0d0f17] space-y-1.5 opacity-60">
              <div className="font-bold text-slate-400">Perplexity Slate</div>
              <p className="text-[11px] text-slate-500">Muted cool slate panels with teal and emerald badges.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#1e2333] bg-[#0d0f17] space-y-1.5 opacity-60">
              <div className="font-bold text-slate-400">High Contrast</div>
              <p className="text-[11px] text-slate-500">Maximum visual separation for intensive document auditing.</p>
            </div>
          </div>
        </div>

        {/* 4. Local Data & Cache Preferences */}
        <div className="p-5 rounded-2xl border border-[#1b1f2e] bg-[#0c0e15] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1a1d28] pb-3">
            <HardDrive className="w-4 h-4 text-rose-400" />
            <h2 className="font-bold text-sm text-white">Local Data & Benchmark Presets</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-200">Reset Reference Benchmarks</div>
              <p className="text-xs text-slate-400">
                Restore the default Scholarship, AI Safety, and Clinical cardiac investigation dossiers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetData}
                className="text-xs h-8 border-[#242938]"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1 text-violet-400" />
                Reset Benchmarks
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                className="text-xs h-8"
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

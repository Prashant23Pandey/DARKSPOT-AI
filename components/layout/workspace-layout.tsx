"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { AppHeader } from "./app-header";
import { TopTicker } from "./top-ticker";

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#fafaf8] text-slate-900">
      {/* Top Illustrative Marquee Ticker */}
      <TopTicker />

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-[#fafaf8]">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

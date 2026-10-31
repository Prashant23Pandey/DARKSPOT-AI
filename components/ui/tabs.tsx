"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function Tabs({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={cn("flex flex-col space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] overflow-x-auto max-w-full",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  badge,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  badge?: number | string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used inside Tabs");

  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.onChange(value)}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-150 select-none",
        isActive
          ? "bg-slate-900 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#fde047]"
          : "bg-white text-slate-800 border-2 border-transparent hover:border-slate-300 hover:bg-slate-50",
        className
      )}
    >
      {children}
      {badge !== undefined && (
        <span
          className={cn(
            "ml-1 rounded-full px-2 py-0.5 text-[10px] font-black border leading-tight",
            isActive
              ? "bg-[#f43f5e] text-white border-white"
              : "bg-slate-200 text-slate-800 border-slate-400"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used inside Tabs");

  if (ctx.value !== value) return null;

  return (
    <div
      className={cn(
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in-50 duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

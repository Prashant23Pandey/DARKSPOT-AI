import { LoadingState } from "@/components/loading-state";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <LoadingState message="Initializing Darkspot AI Intelligence Workspace…" />
    </div>
  );
}

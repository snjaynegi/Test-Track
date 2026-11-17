import { useMemo, useState } from "react";
import { Copy, ExternalLink, Eye, PlayCircle, ShieldCheck } from "lucide-react";
import Empty from "@/components/Empty";
import { BugComposer } from "@/components/BugComposer";
import { SectionCard } from "@/components/SectionCard";
import type { BootstrapPayload, BugRecord, EvidenceAsset } from "../../shared/demo-data";
import { canCreateBug } from "../../shared/permissions";

export default function Bugs({ data }: { data: BootstrapPayload }) {
  const [bugItems, setBugItems] = useState<BugRecord[]>(data.bugs);
  const [assets, setAssets] = useState<EvidenceAsset[]>(data.evidence);
  const [filter, setFilter] = useState("ALL");
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const visibleBugs = useMemo(
    () => (filter === "ALL" ? bugItems : bugItems.filter((bug) => bug.status === filter)),
    [bugItems, filter],
  );

  const handleCreateBug = (bug: BugRecord, newAssets: EvidenceAsset[], duplicate: boolean) => {
    setBugItems((current) => [bug, ...current]);
    setAssets((current) => [...newAssets, ...current]);
    setDuplicateWarning(duplicate ? "Potential duplicate detected: matching title and environment already exist for this project." : "Bug record created successfully.");
  };

  const hasProjects = data.projects.length > 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Create Bug Record" eyebrow="Defect Workflow">
        {!hasProjects ? (
          <Empty />
        ) : (
          <>
            {duplicateWarning ? <p className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{duplicateWarning}</p> : null}
            <BugComposer user={data.currentUser} projects={data.projects} modules={data.modules} assignees={data.users} existingBugs={bugItems} onCreateBug={handleCreateBug} />
          </>
        )}
      </SectionCard>

      <div className="space-y-6">
        <SectionCard
          title="Bug Backlog"
          eyebrow="Live Tracking"
          action={
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED"].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          }
        >
          <div className="space-y-4">
            {!visibleBugs.length ? (
              <Empty />
            ) : null}
            {visibleBugs.map((bug) => {
              const linkedAssets = assets.filter((asset) => asset.bugId === bug.id);
              const project = data.projects.find((item) => item.id === bug.projectId);
              return (
                <div key={bug.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{bug.type.replace(/_/g, " ")}</span>
                    <span className="rounded-full bg-rose-400/10 px-3 py-1 text-xs text-rose-100">{bug.severity}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{bug.status}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{project?.name}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-white">{bug.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{bug.description}</p>
                  <p className="mt-3 text-xs text-slate-400">Environment: {bug.environment} • Updated {bug.updatedAt}</p>
                  <div className="mt-4 space-y-2">
                    {linkedAssets.length ? linkedAssets.map((asset) => (
                      <div key={asset.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-slate-200">
                          {asset.kind === "VIDEO" ? <PlayCircle className="h-4 w-4 text-amber-200" /> : <ExternalLink className="h-4 w-4 text-cyan-200" />}
                          <span>{asset.fileName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={asset.shareUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10">
                            Open link
                          </a>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(asset.shareUrl)}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy Link
                          </button>
                        </div>
                      </div>
                    )) : <Empty className="p-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

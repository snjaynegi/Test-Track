import { Plus, Workflow } from "lucide-react";
import type { ModuleNode } from "../../shared/demo-data";

interface ModuleTreeProps {
  projectId: string;
  modules: ModuleNode[];
  onAddNode: (parentId: string | null) => void;
}

export function ModuleTree({ projectId, modules, onAddNode }: ModuleTreeProps) {
  const nodes = modules.filter((node) => node.projectId === projectId);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onAddNode(null)}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
      >
        <Plus className="h-4 w-4" />
        Add root module
      </button>
      <div className="space-y-3">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
            style={{ marginLeft: `${node.depth * 18}px` }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 p-2 text-cyan-200">
                  <Workflow className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{node.name}</p>
                  <p className="text-xs text-slate-400">Level {node.depth + 1}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onAddNode(node.id)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10"
              >
                Add child
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

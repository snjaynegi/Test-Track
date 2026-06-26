import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Empty from "@/components/Empty";
import { ModuleTree } from "@/components/ModuleTree";
import { SectionCard } from "@/components/SectionCard";
import { useAppStore } from "@/hooks/useAppStore";
import { appendLocalModule, upsertLocalProject } from "@/lib/localWorkspace";
import type { BootstrapPayload, ModuleNode } from "../../shared/demo-data";

export default function Projects({ data }: { data: BootstrapPayload }) {
  const { activeProjectId, setActiveProjectId, addProjectId, user } = useAppStore();
  const [moduleNodes, setModuleNodes] = useState<ModuleNode[]>(data.modules);

  const projectId = activeProjectId ?? data.projects[0]?.id ?? null;
  const activeProject = useMemo(
    () => data.projects.find((project) => project.id === projectId) ?? data.projects[0],
    [data.projects, projectId],
  );

  useEffect(() => {
    setModuleNodes(data.modules);
  }, [data.modules]);

  const addProject = () => {
    const name = window.prompt("Enter project name");
    if (!name) {
      return;
    }
    const codeInput = window.prompt("Enter project code (e.g., APP-001)") ?? "";
    const code = codeInput.trim() || name.trim().slice(0, 3).toUpperCase();
    const release = (window.prompt("Enter release version (e.g., 1.0.0)") ?? "1.0.0").trim() || "1.0.0";
    const summary = (window.prompt("Enter project summary") ?? "").trim() || "Project created locally.";

    const project = {
      id: `local-project-${Date.now()}`,
      name: name.trim(),
      code,
      status: "ACTIVE" as const,
      release,
      health: "Watch" as const,
      ownerId: user?.id ?? "local",
      summary,
    };

    upsertLocalProject(project);
    addProjectId(project.id);
  };

  const addNode = (parentId: string | null) => {
    const name = window.prompt("Enter the new module name");
    if (!name || !activeProject) {
      return;
    }

    const parent = moduleNodes.find((node) => node.id === parentId) ?? null;
    const moduleNode: ModuleNode = {
      id: `local-module-${Date.now()}`,
      projectId: activeProject.id,
      parentId,
      name,
      depth: parent ? parent.depth + 1 : 0,
    };
    appendLocalModule(moduleNode);
    setModuleNodes((current) => [...current, moduleNode]);
  };

  if (!activeProject) {
    return (
      <SectionCard
        title="Projects"
        eyebrow="Program Structure"
        action={
          <button
            type="button"
            onClick={addProject}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        }
      >
        <Empty />
      </SectionCard>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <SectionCard
        title="Project Registry"
        eyebrow="Program Structure"
        action={
          <button
            type="button"
            onClick={addProject}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        }
      >
        <div className="space-y-4">
          {data.projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setActiveProjectId(project.id)}
              className={`w-full rounded-[24px] border p-5 text-left transition ${
                project.id === activeProject.id
                  ? "border-cyan-300/40 bg-cyan-300/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{project.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{project.summary}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">{project.code}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-3 py-1 text-slate-300">{project.release}</span>
                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-100">{project.health}</span>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-100">{project.status}</span>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={`${activeProject.name} Module Hierarchy`}
        eyebrow="Nested Module Management"
        action={
          <button type="button" onClick={() => addNode(null)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
            <Plus className="h-4 w-4" />
            Add Module
          </button>
        }
      >
        <ModuleTree projectId={activeProject.id} modules={moduleNodes} onAddNode={addNode} />
      </SectionCard>
    </div>
  );
}

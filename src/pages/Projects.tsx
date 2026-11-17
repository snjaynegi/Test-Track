import { useEffect, useMemo, useState } from "react";
import { FolderPlus, Layers, Plus, X } from "lucide-react";
import Empty from "@/components/Empty";
import { ModuleTree } from "@/components/ModuleTree";
import { SectionCard } from "@/components/SectionCard";
import { useAppStore } from "@/hooks/useAppStore";
import { appendLocalModule, upsertLocalProject } from "@/lib/localWorkspace";
import type { BootstrapPayload, ModuleNode } from "../../shared/demo-data";

export default function Projects({ data }: { data: BootstrapPayload }) {
  const { activeProjectId, setActiveProjectId, addProjectId, user } = useAppStore();
  const [moduleNodes, setModuleNodes] = useState<ModuleNode[]>(data.modules);

  // Add Project Modal State
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCode, setNewProjectCode] = useState("");
  const [newProjectRelease, setNewProjectRelease] = useState("2.0.0");
  const [newProjectSummary, setNewProjectSummary] = useState("");

  // Add Module Modal State
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [moduleParentId, setModuleParentId] = useState<string | null>(null);
  const [newModuleName, setNewModuleName] = useState("");

  const projectId = activeProjectId ?? data.projects[0]?.id ?? null;
  const activeProject = useMemo(
    () => data.projects.find((project) => project.id === projectId) ?? data.projects[0],
    [data.projects, projectId],
  );

  useEffect(() => {
    setModuleNodes(data.modules);
  }, [data.modules]);

  const handleOpenAddProject = () => {
    setNewProjectName("");
    setNewProjectCode("");
    setNewProjectRelease("2.0.0");
    setNewProjectSummary("");
    setIsAddProjectModalOpen(true);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const name = newProjectName.trim();
    const code = newProjectCode.trim() || name.slice(0, 3).toUpperCase();
    const release = newProjectRelease.trim() || "1.0.0";
    const summary = newProjectSummary.trim() || "Project registered locally.";

    const project = {
      id: `local-project-${Date.now()}`,
      name,
      code,
      status: "ACTIVE" as const,
      release,
      health: "Watch" as const,
      ownerId: user?.id ?? "local",
      summary,
    };

    upsertLocalProject(project);
    addProjectId(project.id);
    setIsAddProjectModalOpen(false);
  };

  const handleOpenAddModule = (parentId: string | null) => {
    setModuleParentId(parentId);
    setNewModuleName("");
    setIsAddModuleModalOpen(true);
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim() || !activeProject) return;

    const parent = moduleNodes.find((node) => node.id === moduleParentId) ?? null;
    const moduleNode: ModuleNode = {
      id: `local-module-${Date.now()}`,
      projectId: activeProject.id,
      parentId: moduleParentId,
      name: newModuleName.trim(),
      depth: parent ? parent.depth + 1 : 0,
    };

    appendLocalModule(moduleNode);
    setModuleNodes((current) => [...current, moduleNode]);
    setIsAddModuleModalOpen(false);
  };

  const parentModuleName = useMemo(() => {
    if (!moduleParentId) return null;
    return moduleNodes.find((m) => m.id === moduleParentId)?.name ?? null;
  }, [moduleParentId, moduleNodes]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          title="Project Registry"
          eyebrow="Program Structure"
          action={
            <button
              type="button"
              onClick={handleOpenAddProject}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          }
        >
          {data.projects.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-4">
              {data.projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveProjectId(project.id)}
                  className={`w-full rounded-[24px] border p-5 text-left transition ${
                    project.id === activeProject?.id
                      ? "border-cyan-300/40 bg-cyan-300/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{project.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{project.summary}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 font-mono">
                      {project.code}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-slate-300 font-mono">
                      {project.release}
                    </span>
                    <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-100">
                      {project.health}
                    </span>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-100">
                      {project.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </SectionCard>

        {activeProject ? (
          <SectionCard
            title={`${activeProject.name} Module Hierarchy`}
            eyebrow="Nested Module Management"
            action={
              <button
                type="button"
                onClick={() => handleOpenAddModule(null)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
                Add Module
              </button>
            }
          >
            <ModuleTree projectId={activeProject.id} modules={moduleNodes} onAddNode={handleOpenAddModule} />
          </SectionCard>
        ) : (
          <Empty />
        )}
      </div>

      {/* Modern Dialog Modal: Add Project */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddProjectModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-[32px] border border-cyan-400/20 bg-slate-950 p-6 shadow-2xl z-10 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-cyan-300/10 p-2.5 text-cyan-300">
                  <FolderPlus className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-white">Add New Project</h3>
                  <p className="text-xs text-slate-400">Register a new project for defect tracking and QA suites</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProjectModalOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-medium">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ckret Messenger"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="form-input text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-medium">
                    Project Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CKRET"
                    value={newProjectCode}
                    onChange={(e) => setNewProjectCode(e.target.value)}
                    className="form-input text-sm uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-medium">
                    Release Version
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2.0.0"
                    value={newProjectRelease}
                    onChange={(e) => setNewProjectRelease(e.target.value)}
                    className="form-input text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-medium">
                  Project Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the app or testing scope..."
                  value={newProjectSummary}
                  onChange={(e) => setNewProjectSummary(e.target.value)}
                  className="form-input text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-cyan-300 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 shadow-lg shadow-cyan-300/10"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Dialog Modal: Add Module / Submodule */}
      {isAddModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModuleModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-[32px] border border-cyan-400/20 bg-slate-950 p-6 shadow-2xl z-10 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-cyan-300/10 p-2.5 text-cyan-300">
                  <Layers className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-white">
                    {parentModuleName ? "Add Child Submodule" : "Add Root Module"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {parentModuleName ? `Under parent: ${parentModuleName}` : `For project: ${activeProject?.name}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModuleModalOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-medium">
                  Module Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MOD-11: Offline Storage & Room DB"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="form-input text-sm"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModuleModalOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-cyan-300 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 shadow-lg shadow-cyan-300/10"
                >
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

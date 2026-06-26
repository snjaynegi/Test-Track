import type { ModuleNode, Project } from "../../shared/demo-data";

export interface LocalWorkspace {
  projects: Project[];
  modules: ModuleNode[];
}

const STORAGE_KEY = "bug-tracking-local-workspace";
export const LOCAL_WORKSPACE_EVENT = "bug-tracking-local-workspace-updated";

const emptyWorkspace: LocalWorkspace = { projects: [], modules: [] };

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadLocalWorkspace(): LocalWorkspace {
  if (!canUseStorage()) {
    return emptyWorkspace;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyWorkspace;
    }
    const parsed = JSON.parse(raw) as Partial<LocalWorkspace> | null;
    if (!parsed) {
      return emptyWorkspace;
    }
    return {
      projects: Array.isArray(parsed.projects) ? (parsed.projects as Project[]) : [],
      modules: Array.isArray(parsed.modules) ? (parsed.modules as ModuleNode[]) : [],
    };
  } catch {
    return emptyWorkspace;
  }
}

export function saveLocalWorkspace(workspace: LocalWorkspace) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  window.dispatchEvent(new Event(LOCAL_WORKSPACE_EVENT));
}

export function upsertLocalProject(project: Project) {
  const current = loadLocalWorkspace();
  const nextProjects = current.projects.some((item) => item.id === project.id)
    ? current.projects.map((item) => (item.id === project.id ? project : item))
    : [...current.projects, project];
  const next = { ...current, projects: nextProjects };
  saveLocalWorkspace(next);
  return next;
}

export function appendLocalModule(moduleNode: ModuleNode) {
  const current = loadLocalWorkspace();
  const next = { ...current, modules: [...current.modules, moduleNode] };
  saveLocalWorkspace(next);
  return next;
}

export function mergeWithLocalWorkspace<T extends { projects: Project[]; modules: ModuleNode[] }>(payload: T): T {
  const local = loadLocalWorkspace();
  const byProjectId = new Map<string, Project>();
  for (const item of payload.projects) {
    byProjectId.set(item.id, item);
  }
  for (const item of local.projects) {
    byProjectId.set(item.id, item);
  }

  const byModuleId = new Map<string, ModuleNode>();
  for (const item of payload.modules) {
    byModuleId.set(item.id, item);
  }
  for (const item of local.modules) {
    byModuleId.set(item.id, item);
  }

  return {
    ...payload,
    projects: Array.from(byProjectId.values()),
    modules: Array.from(byModuleId.values()),
  };
}


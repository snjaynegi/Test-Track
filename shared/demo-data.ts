export type UserRole = "REPORTING_MANAGER" | "QA_USER";
export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "ARCHIVED";
export type BugStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "REOPENED";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type EvidenceKind = "SCREENSHOT" | "VIDEO";
export type BugType =
  | "FUNCTIONAL"
  | "SECURITY"
  | "UI_UX"
  | "RESPONSIVE"
  | "PERFORMANCE"
  | "COMPATIBILITY"
  | "ACCESSIBILITY"
  | "INTEGRATION"
  | "DATA_VALIDATION"
  | "OTHER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectIds: string[];
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  status: ProjectStatus;
  release: string;
  health: "Stable" | "Watch" | "Escalated";
  ownerId: string;
  summary: string;
}

export interface ModuleNode {
  id: string;
  projectId: string;
  parentId: string | null;
  name: string;
  depth: number;
}

export interface EvidenceAsset {
  id: string;
  bugId: string;
  kind: EvidenceKind;
  fileName: string;
  shareUrl: string;
  previewUrl: string;
}

export interface BugRecord {
  id: string;
  title: string;
  description: string;
  projectId: string;
  moduleId: string;
  type: BugType;
  severity: Severity;
  priority: Priority;
  environment: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  reporterId: string;
  assignedUserId: string;
  status: BugStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalBugs: number;
  openBugs: number;
  closedBugs: number;
  inProgressBugs: number;
  criticalBugs: number;
}

export interface BootstrapPayload {
  currentUser: User;
  users: User[];
  metrics: DashboardMetrics;
  projects: Project[];
  modules: ModuleNode[];
  bugs: BugRecord[];
  evidence: EvidenceAsset[];
  reportTemplates: Array<{
    id: string;
    name: string;
    formats: string[];
    audience: string;
    status: string;
  }>;
  auditLog: Array<{
    id: string;
    action: string;
    actor: string;
    target: string;
    timestamp: string;
  }>;
  testerPerformance: Array<{
    name: string;
    executed: number;
    bugsRaised: number;
    closureRate: string;
  }>;
  monthlyTrend: Array<{
    name: string;
    tested: number;
    passed: number;
  }>;
  charts: {
    bugsByType: Array<{ name: string; y: number }>;
    bugsByStatus: Array<{ name: string; y: number }>;
    bugsBySeverity: Array<{ name: string; y: number }>;
    bugsByProject: Array<{ name: string; y: number }>;
  };
}
export const users: User[] = [
  {
    id: "demo-manager",
    name: "Reporting Manager",
    email: "manager@demo.local",
    role: "REPORTING_MANAGER",
    projectIds: [],
    avatar: "RM",
  },
  {
    id: "demo-qa",
    name: "QA User",
    email: "qa@demo.local",
    role: "QA_USER",
    projectIds: [],
    avatar: "QA",
  },
];
export const projects: Project[] = [];
export const modules: ModuleNode[] = [];
export const bugs: BugRecord[] = [];
export const evidence: EvidenceAsset[] = [];
export const reportTemplates: BootstrapPayload["reportTemplates"] = [];
export const auditLog: BootstrapPayload["auditLog"] = [];

export function findUser(userId?: string): User | null {
  return users.find((user) => user.id === userId) ?? null;
}

export function getVisibleProjects(userId?: string) {
  const user = findUser(userId);
  if (!user) {
    return [];
  }
  return user.role === "REPORTING_MANAGER"
    ? projects
    : projects.filter((project) => user.projectIds.includes(project.id));
}

export function getVisibleBugs(userId?: string) {
  const visibleProjectIds = new Set(getVisibleProjects(userId).map((project) => project.id));
  return bugs.filter((bug) => visibleProjectIds.has(bug.projectId));
}

export function buildMetrics(userId?: string): DashboardMetrics {
  const visibleBugs = getVisibleBugs(userId);
  return {
    totalBugs: visibleBugs.length,
    openBugs: visibleBugs.filter((bug) => bug.status === "OPEN" || bug.status === "REOPENED").length,
    closedBugs: visibleBugs.filter((bug) => bug.status === "CLOSED").length,
    inProgressBugs: visibleBugs.filter((bug) => bug.status === "IN_PROGRESS").length,
    criticalBugs: visibleBugs.filter((bug) => bug.severity === "CRITICAL").length,
  };
}

export function buildBootstrap(userId?: string): BootstrapPayload {
  const user = findUser(userId);
  if (!user) {
    throw new Error("No configured user session found. Sign in with a valid demo or real account first.");
  }
  const visibleProjects = getVisibleProjects(userId);
  const visibleProjectIds = new Set(visibleProjects.map((project) => project.id));
  const visibleBugs = getVisibleBugs(userId);
  const visibleModules = modules.filter((moduleNode) => visibleProjectIds.has(moduleNode.projectId));
  const visibleEvidence = evidence.filter((asset) => visibleBugs.some((bug) => bug.id === asset.bugId));
  const bugsByType = Object.entries(groupBy(visibleBugs, "type")).map(([name, items]) => ({ name, y: items.length }));
  const bugsByStatus = Object.entries(groupBy(visibleBugs, "status")).map(([name, items]) => ({ name, y: items.length }));
  const bugsBySeverity = Object.entries(groupBy(visibleBugs, "severity")).map(([name, items]) => ({ name, y: items.length }));
  const bugsByProject = visibleProjects.map((project) => ({
    name: project.name,
    y: visibleBugs.filter((bug) => bug.projectId === project.id).length,
  }));

  return {
    currentUser: user,
    users,
    metrics: buildMetrics(userId),
    projects: visibleProjects,
    modules: visibleModules,
    bugs: visibleBugs,
    evidence: visibleEvidence,
    reportTemplates,
    auditLog,
    testerPerformance: [],
    monthlyTrend: [],
    charts: { bugsByType, bugsByStatus, bugsBySeverity, bugsByProject },
  };
}

function groupBy<T>(items: T[], key: keyof T) {
  return items.reduce<Record<string, T[]>>((accumulator, item) => {
    const group = String(item[key]);
    accumulator[group] = accumulator[group] ?? [];
    accumulator[group].push(item);
    return accumulator;
  }, {});
}

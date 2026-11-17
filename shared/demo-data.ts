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

export interface TestCaseRecord {
  id: string;
  moduleId: string;
  moduleName: string;
  feature: string;
  description: string;
  preconditions: string;
  executionSteps: string;
  testData: string;
  expectedResult: string;
  actualResult: string;
  status: "PASS" | "RESOLVED" | "FAIL" | "BLOCKED";
  severity: string;
  executionMode: string;
  targetOsRange: string;
  version: string;
  executedAt: string;
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
  testCases?: TestCaseRecord[];
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
    id: "demo-qa",
    name: "QA Specialist",
    email: "qa@demo.local",
    role: "QA_USER",
    projectIds: ["proj-ckret"],
    avatar: "QA",
  },
];
export const projects: Project[] = [
  {
    id: "proj-ckret",
    name: "Ckret Messenger (Android)",
    code: "CKRET",
    status: "ACTIVE",
    release: "2.0.0",
    health: "Stable",
    ownerId: "demo-qa",
    summary: "Sovereign E2EE Android messaging and WebRTC calling app with 10 core modules.",
  },
];
export const modules: ModuleNode[] = [
  { id: "mod-01", projectId: "proj-ckret", parentId: null, name: "MOD-01: WebRTC Audio & Video Calling Engine", depth: 0 },
  { id: "mod-02", projectId: "proj-ckret", parentId: null, name: "MOD-02: Cross-Network Traversal (STUN + Metered TURN Relay)", depth: 0 },
  { id: "mod-03", projectId: "proj-ckret", parentId: null, name: "MOD-03: Push Notifications & Background FCM Sync (Android 13+)", depth: 0 },
  { id: "mod-04", projectId: "proj-ckret", parentId: null, name: "MOD-04: Ephemeral Status / Stories (24h Expiration & View Receipts)", depth: 0 },
  { id: "mod-05", projectId: "proj-ckret", parentId: null, name: "MOD-05: Screenshot Security & FLAG_SECURE Hardware Privacy Engine", depth: 0 },
  { id: "mod-06", projectId: "proj-ckret", parentId: null, name: "MOD-06: Core Sovereign Messaging & Signal Double Ratchet", depth: 0 },
  { id: "mod-07", projectId: "proj-ckret", parentId: null, name: "MOD-07: Rich Media Streaming (Voice Notes, Video, Documents, Images)", depth: 0 },
  { id: "mod-08", projectId: "proj-ckret", parentId: null, name: "MOD-08: Group Chat Governance, Avatar Sync & In-Chat Policies", depth: 0 },
  { id: "mod-09", projectId: "proj-ckret", parentId: null, name: "MOD-09: 30 Kinetic Avatar Animated Frames & Hardware Render Engine", depth: 0 },
  { id: "mod-10", projectId: "proj-ckret", parentId: null, name: "MOD-10: Security, Cryptography, Key Rotation & Anti-Tamper Shield", depth: 0 },
];
export const bugs: BugRecord[] = [
  {
    id: "BUG-CALL-001",
    title: "Audio & Video calls opened ugly crude prototype stub (ActiveCallScreen) with dummy timer instead of WhatsApp Call UI",
    description: "MainActivity routed AppNavigationState.ActiveCall to ActiveCallScreen.kt (a crude 2-second emulator timer stub with a raw dark box). WebRtcCallManager.startCall() was NEVER invoked.",
    projectId: "proj-ckret",
    moduleId: "mod-01",
    type: "UI_UX",
    severity: "CRITICAL",
    priority: "URGENT",
    environment: "Android 10 - 15 (Pixel 8 Pro, Galaxy S23, Xiaomi 13)",
    stepsToReproduce: "1. Open 1:1 chat\n2. Tap Audio Call or Video Call icon\n3. Observe displayed screen",
    expectedResult: "WhatsApp-styled AudioCallScreen/VideoCallScreen with pulsing circular avatar, live dynamic status, floating PiP, and audio routing sheet.",
    actualResult: "MainActivity routed AppNavigationState.ActiveCall to ActiveCallScreen.kt (a crude 2-second emulator timer stub with a raw dark box). WebRtcCallManager.startCall() was NEVER invoked.",
    reporterId: "demo-qa",
    assignedUserId: "demo-qa",
    status: "RESOLVED",
    createdAt: "2026-11-17T11:00:00Z",
    updatedAt: "2026-11-17T14:30:00Z",
  },
  {
    id: "BUG-NOTIF-002",
    title: "Zero push notifications displayed for incoming messages on Android 13+ (API 33-35)",
    description: "Android 13+ requires android.permission.POST_NOTIFICATIONS to be requested at runtime. The app declared it in Manifest but never requested it at runtime; OS silently dropped all NotificationManager.notify() calls.",
    projectId: "proj-ckret",
    moduleId: "mod-03",
    type: "FUNCTIONAL",
    severity: "HIGH",
    priority: "URGENT",
    environment: "Android 13, 14, 15 (Pixel 7, Galaxy S22, OnePlus 12)",
    stepsToReproduce: "1. Install app on Android 13+ device\n2. Log in and background/kill app\n3. Send message from another device",
    expectedResult: "Heads-up notification pops up within 3s with avatar, expandable thread, and Direct Reply action.",
    actualResult: "No notification ever appeared. Messages only appeared when the app was manually opened.",
    reporterId: "demo-qa",
    assignedUserId: "demo-qa",
    status: "RESOLVED",
    createdAt: "2026-11-17T11:15:00Z",
    updatedAt: "2026-11-17T14:30:00Z",
  },
  {
    id: "BUG-NET-003",
    title: "Audio and video calls failing across different networks (e.g. Airtel 5G mobile data to Jio Fiber Wi-Fi)",
    description: "Two-fold root cause: 1. WebSocket signaling listener was never started on app launch/login (signalingClient.startListening was never called). 2. Backend returned STUN-only servers (relay: false); app discarded Metered TURN relay fallback, making Symmetric NAT traversal impossible.",
    projectId: "proj-ckret",
    moduleId: "mod-02",
    type: "COMPATIBILITY",
    severity: "CRITICAL",
    priority: "URGENT",
    environment: "Cross-Network: Cellular CGNAT to Residential NAT Router",
    stepsToReproduce: "1. Device A connects to 5G mobile data\n2. Device B connects to Wi-Fi\n3. Device A calls Device B",
    expectedResult: "WebRTC establishes P2P or relayed connection within 3.5s; bidirectional audio and video flow cleanly.",
    actualResult: "Call states remained stuck in 'Calling...' or 'Connecting...' before disconnecting with timeout error.",
    reporterId: "demo-qa",
    assignedUserId: "demo-qa",
    status: "RESOLVED",
    createdAt: "2026-11-17T11:30:00Z",
    updatedAt: "2026-11-17T14:30:00Z",
  },
];
export const evidence: EvidenceAsset[] = [
  {
    id: "asset-call-001",
    bugId: "BUG-CALL-001",
    kind: "SCREENSHOT",
    fileName: "DEFECT_BUG-CALL-001_ActiveCallScreen_Mock_Stub.png",
    shareUrl: "/evidence/DEFECT_BUG-CALL-001_ActiveCallScreen_Mock_Stub.png",
    previewUrl: "/evidence/DEFECT_BUG-CALL-001_ActiveCallScreen_Mock_Stub.png",
  },
  {
    id: "asset-notif-002",
    bugId: "BUG-NOTIF-002",
    kind: "SCREENSHOT",
    fileName: "DEFECT_BUG-NOTIF-002_Push_Notification_Suppression.png",
    shareUrl: "/evidence/DEFECT_BUG-NOTIF-002_Push_Notification_Suppression.png",
    previewUrl: "/evidence/DEFECT_BUG-NOTIF-002_Push_Notification_Suppression.png",
  },
  {
    id: "asset-net-003",
    bugId: "BUG-NET-003",
    kind: "SCREENSHOT",
    fileName: "DEFECT_BUG-NET-003_Cross_Network_NAT_Failure.png",
    shareUrl: "/evidence/DEFECT_BUG-NET-003_Cross_Network_NAT_Failure.png",
    previewUrl: "/evidence/DEFECT_BUG-NET-003_Cross_Network_NAT_Failure.png",
  },
];
export const reportTemplates: BootstrapPayload["reportTemplates"] = [];
export const auditLog: BootstrapPayload["auditLog"] = [];

export function findUser(userId?: string): User | null {
  return users.find((user) => user.id === userId) ?? users[0] ?? null;
}

export function getVisibleProjects(userId?: string) {
  const user = findUser(userId);
  if (!user) {
    return [];
  }
  return projects;
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

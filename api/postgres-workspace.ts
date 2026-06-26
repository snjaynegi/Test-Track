import type { BootstrapPayload, BugRecord, EvidenceAsset, ModuleNode, Project, User } from "../shared/demo-data.js";
import { getDb } from "./db.js";

interface DbUserRow {
  id: string;
  name: string;
  email: string;
  role: User["role"];
  avatar: string | null;
  password: string;
  project_ids: string[] | null;
}

interface DbProjectRow {
  id: string;
  name: string;
  code: string;
  status: Project["status"];
  release: string;
  health: Project["health"];
  owner_id: string;
  summary: string;
}

interface DbModuleRow {
  id: string;
  project_id: string;
  parent_id: string | null;
  name: string;
  depth: number;
}

interface DbBugRow {
  id: string;
  title: string;
  description: string;
  project_id: string;
  module_id: string;
  type: BugRecord["type"];
  severity: BugRecord["severity"];
  priority: BugRecord["priority"];
  environment: string;
  steps_to_reproduce: string;
  expected_result: string;
  actual_result: string;
  reporter_id: string;
  assigned_user_id: string;
  status: BugRecord["status"];
  created_at: string;
  updated_at: string;
}

interface DbEvidenceRow {
  id: string;
  bug_id: string;
  kind: EvidenceAsset["kind"];
  file_name: string;
  share_url: string;
  preview_url: string;
}

function requireDb() {
  const db = getDb();
  if (!db) {
    throw new Error("PostgreSQL is not configured. Set DATABASE_URL first.");
  }
  return db;
}

function mapUser(row: DbUserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: row.avatar ?? row.name.slice(0, 2).toUpperCase(),
    projectIds: row.project_ids ?? [],
  };
}

function mapProject(row: DbProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    status: row.status,
    release: row.release,
    health: row.health,
    ownerId: row.owner_id,
    summary: row.summary,
  };
}

function mapModule(row: DbModuleRow): ModuleNode {
  return {
    id: row.id,
    projectId: row.project_id,
    parentId: row.parent_id,
    name: row.name,
    depth: row.depth,
  };
}

function mapBug(row: DbBugRow): BugRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    projectId: row.project_id,
    moduleId: row.module_id,
    type: row.type,
    severity: row.severity,
    priority: row.priority,
    environment: row.environment,
    stepsToReproduce: row.steps_to_reproduce,
    expectedResult: row.expected_result,
    actualResult: row.actual_result,
    reporterId: row.reporter_id,
    assignedUserId: row.assigned_user_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEvidence(row: DbEvidenceRow): EvidenceAsset {
  return {
    id: row.id,
    bugId: row.bug_id,
    kind: row.kind,
    fileName: row.file_name,
    shareUrl: row.share_url,
    previewUrl: row.preview_url,
  };
}

async function fetchUserBase(whereClause: string, value: string) {
  const db = requireDb();
  const result = await db.query<DbUserRow>(
    `
      select
        u.id,
        u.name,
        u.email,
        u.role,
        u.avatar,
        u.password,
        coalesce(array_remove(array_agg(distinct pm.project_id), null), '{}') as project_ids
      from users u
      left join project_members pm on pm.user_id = u.id
      where ${whereClause}
      group by u.id, u.name, u.email, u.role, u.avatar, u.password
      limit 1
    `,
    [value],
  );

  return result.rows[0] ?? null;
}

export async function getDbUserByEmail(email: string) {
  const row = await fetchUserBase("lower(u.email) = lower($1)", email);
  return row ? { user: mapUser(row), password: row.password } : null;
}

export async function getDbUserById(userId: string) {
  const row = await fetchUserBase("u.id = $1", userId);
  return row ? mapUser(row) : null;
}

export async function getDbUsers() {
  const db = requireDb();
  const result = await db.query<DbUserRow>(
    `
      select
        u.id,
        u.name,
        u.email,
        u.role,
        u.avatar,
        u.password,
        coalesce(array_remove(array_agg(distinct pm.project_id), null), '{}') as project_ids
      from users u
      left join project_members pm on pm.user_id = u.id
      group by u.id, u.name, u.email, u.role, u.avatar, u.password
      order by u.name asc
    `,
  );

  return result.rows.map((row) => mapUser(row));
}

async function getVisibleProjectsForUser(user: User) {
  const db = requireDb();
  if (user.role === "REPORTING_MANAGER") {
    const result = await db.query<DbProjectRow>(
      `
        select id, name, code, status, release, health, owner_id, summary
        from projects
        order by name asc
      `,
    );
    return result.rows.map(mapProject);
  }

  const result = await db.query<DbProjectRow>(
    `
      select distinct p.id, p.name, p.code, p.status, p.release, p.health, p.owner_id, p.summary
      from projects p
      left join project_members pm on pm.project_id = p.id
      where p.owner_id = $1 or pm.user_id = $1
      order by p.name asc
    `,
    [user.id],
  );
  return result.rows.map(mapProject);
}

async function getModulesForProjects(projectIds: string[]) {
  if (projectIds.length === 0) {
    return [];
  }
  const db = requireDb();
  const result = await db.query<DbModuleRow>(
    `
      select id, project_id, parent_id, name, depth
      from modules
      where project_id = any($1::text[])
      order by depth asc, name asc
    `,
    [projectIds],
  );
  return result.rows.map(mapModule);
}

async function getBugsForProjects(projectIds: string[]) {
  if (projectIds.length === 0) {
    return [];
  }
  const db = requireDb();
  const result = await db.query<DbBugRow>(
    `
      select
        id,
        title,
        description,
        project_id,
        module_id,
        type,
        severity,
        priority,
        environment,
        steps_to_reproduce,
        expected_result,
        actual_result,
        reporter_id,
        assigned_user_id,
        status,
        created_at::text,
        updated_at::text
      from bugs
      where project_id = any($1::text[])
      order by updated_at desc
    `,
    [projectIds],
  );
  return result.rows.map(mapBug);
}

async function getEvidenceForBugs(bugIds: string[]) {
  if (bugIds.length === 0) {
    return [];
  }
  const db = requireDb();
  const result = await db.query<DbEvidenceRow>(
    `
      select id, bug_id, kind, file_name, share_url, preview_url
      from evidence
      where bug_id = any($1::text[])
      order by id asc
    `,
    [bugIds],
  );
  return result.rows.map(mapEvidence);
}

async function getReportTemplates() {
  const db = requireDb();
  const result = await db.query<{
    id: string;
    name: string;
    formats: string[];
    audience: string;
    status: string;
  }>(
    `
      select id, name, formats, audience, status
      from report_templates
      order by name asc
    `,
  );
  return result.rows;
}

async function getAuditLog() {
  const db = requireDb();
  const result = await db.query<{
    id: string;
    action: string;
    actor: string;
    target: string;
    timestamp: string;
  }>(
    `
      select id, action, actor, target, timestamp::text
      from audit_log
      order by timestamp desc
      limit 50
    `,
  );
  return result.rows;
}

function groupBy<T>(items: T[], key: keyof T) {
  return items.reduce<Record<string, T[]>>((accumulator, item) => {
    const group = String(item[key]);
    accumulator[group] = accumulator[group] ?? [];
    accumulator[group].push(item);
    return accumulator;
  }, {});
}

function buildMetrics(bugs: BugRecord[]) {
  return {
    totalBugs: bugs.length,
    openBugs: bugs.filter((bug) => bug.status === "OPEN" || bug.status === "REOPENED").length,
    closedBugs: bugs.filter((bug) => bug.status === "CLOSED").length,
    inProgressBugs: bugs.filter((bug) => bug.status === "IN_PROGRESS").length,
    criticalBugs: bugs.filter((bug) => bug.severity === "CRITICAL").length,
  };
}

export async function buildBootstrapFromDb(userId: string): Promise<BootstrapPayload> {
  const currentUser = await getDbUserById(userId);
  if (!currentUser) {
    throw new Error("No configured PostgreSQL user session found.");
  }

  const [users, projects, reportTemplates, auditLog] = await Promise.all([
    getDbUsers(),
    getVisibleProjectsForUser(currentUser),
    getReportTemplates(),
    getAuditLog(),
  ]);

  const projectIds = projects.map((project) => project.id);
  const [modules, bugs] = await Promise.all([getModulesForProjects(projectIds), getBugsForProjects(projectIds)]);
  const evidence = await getEvidenceForBugs(bugs.map((bug) => bug.id));

  const bugsByType = Object.entries(groupBy(bugs, "type")).map(([name, items]) => ({ name, y: items.length }));
  const bugsByStatus = Object.entries(groupBy(bugs, "status")).map(([name, items]) => ({ name, y: items.length }));
  const bugsBySeverity = Object.entries(groupBy(bugs, "severity")).map(([name, items]) => ({ name, y: items.length }));
  const bugsByProject = projects.map((project) => ({
    name: project.name,
    y: bugs.filter((bug) => bug.projectId === project.id).length,
  }));

  return {
    currentUser,
    users,
    metrics: buildMetrics(bugs),
    projects,
    modules,
    bugs,
    evidence,
    reportTemplates,
    auditLog,
    testerPerformance: [],
    monthlyTrend: [],
    charts: {
      bugsByType,
      bugsByStatus,
      bugsBySeverity,
      bugsByProject,
    },
  };
}

export async function getDbEvidenceById(assetId: string) {
  const db = requireDb();
  const result = await db.query<DbEvidenceRow>(
    `
      select id, bug_id, kind, file_name, share_url, preview_url
      from evidence
      where id = $1
      limit 1
    `,
    [assetId],
  );

  const asset = result.rows[0];
  return asset ? mapEvidence(asset) : null;
}


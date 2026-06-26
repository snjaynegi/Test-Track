create table if not exists users (
  id text primary key,
  name text not null,
  email text not null unique,
  role text not null check (role in ('REPORTING_MANAGER', 'QA_USER')),
  avatar text,
  password text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  name text not null,
  code text not null unique,
  status text not null check (status in ('ACTIVE', 'ON_HOLD', 'ARCHIVED')),
  release text not null,
  health text not null check (health in ('Stable', 'Watch', 'Escalated')),
  owner_id text not null references users(id) on delete restrict,
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_members (
  project_id text not null references projects(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists modules (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  parent_id text references modules(id) on delete cascade,
  name text not null,
  depth integer not null default 0 check (depth >= 0),
  created_at timestamptz not null default now()
);

create table if not exists bugs (
  id text primary key,
  title text not null,
  description text not null,
  project_id text not null references projects(id) on delete cascade,
  module_id text not null references modules(id) on delete restrict,
  type text not null check (type in ('FUNCTIONAL', 'SECURITY', 'UI_UX', 'RESPONSIVE', 'PERFORMANCE', 'COMPATIBILITY', 'ACCESSIBILITY', 'INTEGRATION', 'DATA_VALIDATION', 'OTHER')),
  severity text not null check (severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  priority text not null check (priority in ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  environment text not null,
  steps_to_reproduce text not null,
  expected_result text not null,
  actual_result text not null,
  reporter_id text not null references users(id) on delete restrict,
  assigned_user_id text not null references users(id) on delete restrict,
  status text not null check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists evidence (
  id text primary key,
  bug_id text not null references bugs(id) on delete cascade,
  kind text not null check (kind in ('SCREENSHOT', 'VIDEO')),
  file_name text not null,
  share_url text not null,
  preview_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists report_templates (
  id text primary key,
  name text not null,
  formats text[] not null default '{}',
  audience text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id text primary key,
  action text not null,
  actor text not null,
  target text not null,
  timestamp timestamptz not null default now()
);

create index if not exists idx_projects_owner_id on projects(owner_id);
create index if not exists idx_project_members_user_id on project_members(user_id);
create index if not exists idx_modules_project_id on modules(project_id);
create index if not exists idx_modules_parent_id on modules(parent_id);
create index if not exists idx_bugs_project_id on bugs(project_id);
create index if not exists idx_bugs_module_id on bugs(module_id);
create index if not exists idx_bugs_reporter_id on bugs(reporter_id);
create index if not exists idx_bugs_assigned_user_id on bugs(assigned_user_id);
create index if not exists idx_bugs_status on bugs(status);
create index if not exists idx_evidence_bug_id on evidence(bug_id);
create index if not exists idx_audit_log_timestamp on audit_log(timestamp desc);

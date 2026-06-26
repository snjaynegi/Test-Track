insert into users (id, name, email, role, avatar, password)
values
  ('demo-manager', 'Reporting Manager', 'manager@demo.local', 'REPORTING_MANAGER', 'RM', 'demo123'),
  ('demo-qa', 'QA User', 'qa@demo.local', 'QA_USER', 'QA', 'demo123')
on conflict (id) do update
set
  name = excluded.name,
  email = excluded.email,
  role = excluded.role,
  avatar = excluded.avatar,
  password = excluded.password;

insert into report_templates (id, name, formats, audience, status)
values
  ('template-exec-summary', 'Executive Summary', array['PDF', 'DOCX', 'XLSX'], 'Leadership', 'ACTIVE'),
  ('template-qa-cycle', 'QA Cycle Report', array['PDF', 'XLSX'], 'QA Team', 'ACTIVE')
on conflict (id) do update
set
  name = excluded.name,
  formats = excluded.formats,
  audience = excluded.audience,
  status = excluded.status;

insert into audit_log (id, action, actor, target, timestamp)
values
  ('seed-log-1', 'Database seeded', 'system', 'initial setup', now())
on conflict (id) do nothing;

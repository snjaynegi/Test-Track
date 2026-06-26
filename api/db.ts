import { Pool } from "pg";

let pool: Pool | null = null;
const requiredTables = ["users", "projects", "project_members", "modules", "bugs", "evidence", "report_templates", "audit_log"];

function buildPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  return new Pool({
    connectionString,
    ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
  });
}

export function isPostgresConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!pool) {
    pool = buildPool();
  }
  return pool;
}

export async function checkDbHealth() {
  const db = getDb();
  if (!db) {
    return {
      configured: false,
      connected: false,
      schemaReady: false,
    };
  }

  await db.query("select 1");
  const tables = await db.query<{ table_name: string }>(
    `
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name = any($1::text[])
    `,
    [requiredTables],
  );

  const availableTables = new Set(tables.rows.map((row) => row.table_name));
  return {
    configured: true,
    connected: true,
    schemaReady: requiredTables.every((tableName) => availableTables.has(tableName)),
  };
}

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const schemaPath = path.join(rootDir, "database", "schema.sql");
const seedPath = path.join(rootDir, "database", "seed.sql");

const args = new Set(process.argv.slice(2));
const runSeed = args.has("--seed");
const seedOnly = args.has("--seed-only");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not configured. Copy .env.example to .env and update the PostgreSQL connection string.");
  process.exit(1);
}

async function loadSql(filePath) {
  return fs.readFile(filePath, "utf8");
}

async function executeSql(client, sql, label) {
  if (!sql.trim()) {
    return;
  }

  await client.query(sql);
  console.log(`${label} completed.`);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  console.log("Connected to PostgreSQL.");

  if (!seedOnly) {
    const schemaSql = await loadSql(schemaPath);
    await executeSql(client, schemaSql, "Schema setup");
  }

  if (runSeed || seedOnly) {
    const seedSql = await loadSql(seedPath);
    await executeSql(client, seedSql, "Seed data");
  }

  console.log("PostgreSQL setup finished successfully.");
} catch (error) {
  console.error("PostgreSQL setup failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}

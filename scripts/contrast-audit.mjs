import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium, firefox, webkit } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHttpOk(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status >= 200 && res.status < 500) {
        return;
      }
    } catch {}
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startClientDev() {
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(npmCmd, ["run", "client:dev", "--", "--port", "5180"], {
    cwd: path.resolve(__dirname, ".."),
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, BROWSER: "none" },
    shell: true,
  });

  let resolvedUrl = null;
  const captureUrl = (chunk) => {
    const text = chunk.toString();
    const match = text.match(/Local:\s+(http:\/\/localhost:\d+\/)/);
    if (match) {
      resolvedUrl = match[1].replace(/\/$/, "");
    }
  };

  child.stdout.on("data", captureUrl);
  child.stderr.on("data", captureUrl);

  return {
    child,
    async getUrl() {
      const start = Date.now();
      while (!resolvedUrl && Date.now() - start < 30000) {
        await wait(250);
      }
      if (!resolvedUrl) {
        throw new Error("Unable to detect Vite dev server URL.");
      }
      await waitForHttpOk(resolvedUrl, 30000);
      return resolvedUrl;
    },
  };
}

function buildSessionState() {
  return {
    state: {
      user: {
        id: "demo-qa",
        name: "QA User",
        email: "qa@demo.local",
        role: "QA_USER",
        projectIds: ["p1"],
        avatar: "QA",
      },
      token: "demo-token-demo-qa",
      activeProjectId: "p1",
    },
    version: 0,
  };
}

function buildBootstrapFixture() {
  const now = new Date().toISOString();
  return {
    currentUser: {
      id: "demo-qa",
      name: "QA User",
      email: "qa@demo.local",
      role: "QA_USER",
      projectIds: ["p1"],
      avatar: "QA",
    },
    users: [
      {
        id: "demo-manager",
        name: "Reporting Manager",
        email: "manager@demo.local",
        role: "REPORTING_MANAGER",
        projectIds: ["p1"],
        avatar: "RM",
      },
      {
        id: "demo-qa",
        name: "QA User",
        email: "qa@demo.local",
        role: "QA_USER",
        projectIds: ["p1"],
        avatar: "QA",
      },
    ],
    metrics: {
      totalBugs: 12,
      openBugs: 4,
      closedBugs: 6,
      inProgressBugs: 2,
      criticalBugs: 1,
    },
    projects: [
      {
        id: "p1",
        name: "Light Mode Contrast Audit",
        code: "LCA-001",
        status: "ACTIVE",
        release: "1.0.0",
        health: "Escalated",
        ownerId: "demo-manager",
        summary: "Fixture project used for accessibility and contrast validation.",
      },
    ],
    modules: [
      { id: "m1", projectId: "p1", parentId: null, name: "Authentication", depth: 0 },
      { id: "m2", projectId: "p1", parentId: "m1", name: "Login Screen", depth: 1 },
    ],
    bugs: [
      {
        id: "b1",
        title: "Light mode badge contrast issue",
        description: "Badge text is too light against its tinted background in light mode.",
        projectId: "p1",
        moduleId: "m2",
        type: "ACCESSIBILITY",
        severity: "CRITICAL",
        priority: "URGENT",
        environment: "Chrome / Windows",
        stepsToReproduce: "Switch to light mode and inspect badges and action buttons.",
        expectedResult: "All labels and icons meet WCAG AA contrast.",
        actualResult: "Some text and icons become hard to read.",
        reporterId: "demo-qa",
        assignedUserId: "demo-manager",
        status: "OPEN",
        createdAt: now,
        updatedAt: now,
      },
    ],
    evidence: [
      {
        id: "e1",
        bugId: "b1",
        kind: "SCREENSHOT",
        fileName: "contrast.png",
        shareUrl: "https://example.invalid/contrast.png",
        previewUrl: "https://example.invalid/contrast.png",
      },
      {
        id: "e2",
        bugId: "b1",
        kind: "VIDEO",
        fileName: "contrast.mp4",
        shareUrl: "https://example.invalid/contrast.mp4",
        previewUrl: "https://example.invalid/contrast.mp4",
      },
    ],
    reportTemplates: [
      { id: "rt1", name: "Executive Summary", formats: ["PDF", "DOCX", "XLSX"], audience: "Leadership", status: "Ready" },
    ],
    auditLog: [{ id: "a1", action: "THEME_TOGGLED", actor: "QA User", target: "Light mode", timestamp: now }],
    testerPerformance: [{ name: "QA User", executed: 45, bugsRaised: 6, closureRate: "71%" }],
    monthlyTrend: [
      { name: "Jan", tested: 12, passed: 10 },
      { name: "Feb", tested: 18, passed: 16 },
      { name: "Mar", tested: 22, passed: 20 },
    ],
    charts: {
      bugsByType: [
        { name: "Accessibility", y: 3 },
        { name: "UI/UX", y: 5 },
        { name: "Functional", y: 4 },
      ],
      bugsByStatus: [
        { name: "Open", y: 4 },
        { name: "In Progress", y: 2 },
        { name: "Closed", y: 6 },
      ],
      bugsBySeverity: [
        { name: "Low", y: 2 },
        { name: "Medium", y: 5 },
        { name: "High", y: 4 },
        { name: "Critical", y: 1 },
      ],
      bugsByProject: [{ name: "LCA-001", y: 12 }],
    },
  };
}

async function runAxeContrast(page, axeSource) {
  await page.addScriptTag({ content: axeSource });
  return await page.evaluate(async () => {
    const results = await window.axe.run(document, {
      runOnly: {
        type: "rule",
        values: ["color-contrast"],
      },
    });
    return results;
  });
}

async function runAudit({ baseUrl, axeSource }) {
  const outDir = path.resolve(__dirname, "..", "reports", "contrast");
  await fs.mkdir(outDir, { recursive: true });

  const browsers = [
    { name: "chromium", launcher: chromium },
    { name: "firefox", launcher: firefox },
    { name: "webkit", launcher: webkit },
  ];

  const viewports = [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 820, height: 1180 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  const authenticatedPaths = ["/dashboard", "/projects", "/bugs", "/reports", "/analytics", "/users"];
  const results = [];
  const bootstrapFixture = buildBootstrapFixture();

  for (const browser of browsers) {
    const instance = await browser.launcher.launch({ headless: true });

    for (const viewport of viewports) {
      const unauthContext = await instance.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      await unauthContext.addInitScript(() => {
        window.localStorage.setItem("theme", "light");
      });

      const unauthPage = await unauthContext.newPage();
      await unauthPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
      await unauthPage.screenshot({
        path: path.join(outDir, `${browser.name}-${viewport.name}-signin.png`),
        fullPage: true,
      });
      const unauthAxe = await runAxeContrast(unauthPage, axeSource);
      results.push({
        browser: browser.name,
        viewport: viewport.name,
        path: "/",
        url: `${baseUrl}/`,
        violations: unauthAxe.violations,
      });
      await unauthContext.close();

      const authContext = await instance.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const sessionState = buildSessionState();
      await authContext.addInitScript((state) => {
        window.localStorage.setItem("theme", "light");
        window.localStorage.setItem("bug-tracking-session", JSON.stringify(state));
      }, sessionState);

      const authPage = await authContext.newPage();
      await authPage.route("**/api/bootstrap**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: bootstrapFixture }),
        });
      });

      for (const appPath of authenticatedPaths) {
        const url = `${baseUrl}${appPath}`;
        await authPage.goto(url, { waitUntil: "networkidle" });
        await authPage.screenshot({
          path: path.join(outDir, `${browser.name}-${viewport.name}-${appPath.replace(/\//g, "")}.png`),
          fullPage: true,
        });
        const axe = await runAxeContrast(authPage, axeSource);
        results.push({
          browser: browser.name,
          viewport: viewport.name,
          path: appPath,
          url,
          violations: axe.violations,
        });
      }

      await authContext.close();
    }

    await instance.close();
  }

  const reportPath = path.resolve(outDir, "contrast-audit.json");
  await fs.writeFile(reportPath, JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), results }, null, 2), "utf8");

  const totalViolations = results.reduce((sum, entry) => sum + entry.violations.length, 0);
  const pagesWithViolations = results.filter((entry) => entry.violations.length > 0).length;

  return { reportPath, totalViolations, pagesWithViolations };
}

async function main() {
  const axePath = require.resolve("axe-core/axe.min.js");
  const axeSource = await fs.readFile(axePath, "utf8");

  const shouldStartServer = process.env.START_SERVER === "1";
  const configuredUrl = process.env.APP_URL;

  let server = null;
  let baseUrl = configuredUrl ?? null;

  if (!baseUrl && shouldStartServer) {
    server = startClientDev();
    baseUrl = await server.getUrl();
  }

  if (!baseUrl) {
    baseUrl = "http://localhost:5173";
  }

  const summary = await runAudit({ baseUrl, axeSource });
  process.stdout.write(`contrast audit complete\\nbaseUrl: ${baseUrl}\\nreport: ${summary.reportPath}\\nviolations: ${summary.totalViolations}\\npagesWithViolations: ${summary.pagesWithViolations}\\n`);

  if (server?.child) {
    server.child.kill("SIGTERM");
  }
}

await main();

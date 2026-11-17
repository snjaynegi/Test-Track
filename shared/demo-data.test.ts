import { describe, expect, it } from "vitest";
import { buildBootstrap, buildMetrics, users } from "./demo-data";

describe("demo user bootstrap state", () => {
  it("exposes QA users only", () => {
    expect(users.length).toBeGreaterThan(0);
    expect(users.every((user) => user.role === "QA_USER")).toBe(true);
  });

  it("returns dashboard metrics for QA user", () => {
    const metrics = buildMetrics("demo-qa");
    expect(metrics.totalBugs).toBeGreaterThanOrEqual(0);
  });

  it("builds a valid bootstrap payload for a QA user", () => {
    const bootstrap = buildBootstrap("demo-qa");
    expect(bootstrap.currentUser.email).toBe("qa@demo.local");
    expect(bootstrap.currentUser.role).toBe("QA_USER");
    expect(bootstrap.projects.length).toBeGreaterThan(0);
  });
});

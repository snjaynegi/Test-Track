import { describe, expect, it } from "vitest";
import { buildBootstrap, buildMetrics, users } from "./demo-data";

describe("demo user bootstrap state", () => {
  it("exposes demo users for both roles", () => {
    expect(users).toHaveLength(2);
    expect(users.map((user) => user.role)).toEqual(["REPORTING_MANAGER", "QA_USER"]);
  });

  it("returns zeroed metrics when no demo bugs exist", () => {
    const metrics = buildMetrics("demo-manager");
    expect(metrics.totalBugs).toBe(0);
    expect(metrics.criticalBugs).toBe(0);
  });

  it("builds an empty bootstrap payload for a valid demo user", () => {
    const bootstrap = buildBootstrap("demo-qa");
    expect(bootstrap.currentUser.email).toBe("qa@demo.local");
    expect(bootstrap.projects).toHaveLength(0);
  });

  it("throws when bootstrap is requested without a configured user", () => {
    expect(() => buildBootstrap("missing-user")).toThrow("No configured user session found.");
  });
});

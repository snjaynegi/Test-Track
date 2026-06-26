import { describe, expect, it } from "vitest";
import { canCreateBug } from "./permissions";

describe("bug creation permissions", () => {
  it("allows QA users to create bug reports", () => {
    expect(canCreateBug("QA_USER")).toBe(true);
  });

  it("prevents reporting managers from creating bug reports", () => {
    expect(canCreateBug("REPORTING_MANAGER")).toBe(false);
  });
});

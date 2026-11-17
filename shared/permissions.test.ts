import { describe, expect, it } from "vitest";
import { canCreateBug } from "./permissions";

describe("bug creation permissions", () => {
  it("allows QA users to create bug reports", () => {
    expect(canCreateBug("QA_USER")).toBe(true);
  });

  it("permits all authenticated QA sessions to report bugs", () => {
    expect(canCreateBug()).toBe(true);
  });
});

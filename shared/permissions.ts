import type { UserRole } from "./demo-data";

export function canCreateBug(role: UserRole) {
  return role === "QA_USER";
}

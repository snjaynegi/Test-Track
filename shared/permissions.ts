import type { UserRole } from "./demo-data";

export function canCreateBug(_role?: UserRole | string) {
  // Portal is dedicated to QA; all authenticated users have bug creation privileges
  return true;
}

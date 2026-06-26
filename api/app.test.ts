import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./app";

describe("demo auth api", () => {
  it("reports database status when postgres is not configured", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.database).toEqual({
      configured: false,
      connected: false,
      schemaReady: false,
    });
  });

  it("allows the reporting manager demo user to sign in", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "manager@demo.local",
      password: "demo123",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.role).toBe("REPORTING_MANAGER");
  });

  it("rejects invalid demo credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "manager@demo.local",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Invalid credentials");
  });

  it("returns an empty bootstrap payload for the qa demo user", async () => {
    const response = await request(app).get("/api/bootstrap").query({ userId: "demo-qa" });
    expect(response.status).toBe(200);
    expect(response.body.data.currentUser.id).toBe("demo-qa");
    expect(response.body.data.projects).toHaveLength(0);
  });
});

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

  it("allows the QA user to sign in and assigns QA_USER role", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "qa@demo.local",
      password: "demo123",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.role).toBe("QA_USER");
  });

  it("rejects invalid demo credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "qa@demo.local",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Invalid credentials");
  });

  it("returns bootstrap payload with project and modules for the qa user", async () => {
    const response = await request(app).get("/api/bootstrap").query({ userId: "demo-qa" });
    expect(response.status).toBe(200);
    expect(response.body.data.currentUser.id).toBe("demo-qa");
    expect(response.body.data.currentUser.role).toBe("QA_USER");
    expect(response.body.data.projects.length).toBeGreaterThan(0);
  });
});

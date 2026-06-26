import { Router, type Request, type Response } from "express";
import { buildBootstrap, users } from "../../shared/demo-data.js";
import { isPostgresConfigured } from "../db.js";
import { buildBootstrapFromDb, getDbUserByEmail } from "../postgres-workspace.js";

const router = Router();

router.post("/register", (_req: Request, res: Response) => {
  res.status(503).json({
    success: false,
    error: "Demo data has been removed. Configure real user registration first.",
  });
});

router.post("/login", (_req: Request, res: Response) => {
  const email = String(_req.body.email ?? "").toLowerCase();
  const password = String(_req.body.password ?? "");

  if (isPostgresConfigured()) {
    void (async () => {
      try {
        const record = await getDbUserByEmail(email);
        if (!record || record.password !== password) {
          res.status(401).json({
            success: false,
            error: "Invalid credentials.",
          });
          return;
        }

        res.status(200).json({
          success: true,
          data: {
            token: `postgres-token-${record.user.id}`,
            user: record.user,
            bootstrap: await buildBootstrapFromDb(record.user.id),
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Unable to sign in with PostgreSQL.",
        });
      }
    })();
    return;
  }

  const matchedUser = users.find((user) => user.email.toLowerCase() === email);

  if (!matchedUser || password !== "demo123") {
    res.status(401).json({
      success: false,
      error: "Invalid credentials. Use one of the demo users with password demo123.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      token: `demo-token-${matchedUser.id}`,
      user: matchedUser,
      bootstrap: buildBootstrap(matchedUser.id),
    },
  });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Session cleared.",
  });
});

export default router;

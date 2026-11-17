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

        const qaUser = {
          ...record.user,
          role: "QA_USER" as const,
        };

        res.status(200).json({
          success: true,
          data: {
            token: `postgres-token-${qaUser.id}`,
            user: qaUser,
            bootstrap: await buildBootstrapFromDb(qaUser.id),
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

  const matchedUser = users.find((user) => user.email.toLowerCase() === email) ?? users[0];

  if (password !== "demo123" && password !== "") {
    res.status(401).json({
      success: false,
      error: "Invalid credentials. Use password demo123 to sign in as QA.",
    });
    return;
  }

  const qaUser = {
    ...matchedUser,
    email: email || matchedUser.email,
    role: "QA_USER" as const,
  };

  res.status(200).json({
    success: true,
    data: {
      token: `demo-token-${qaUser.id}`,
      user: qaUser,
      bootstrap: buildBootstrap(qaUser.id),
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

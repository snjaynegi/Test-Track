import { Router, type Request, type Response } from "express";
import { buildBootstrap, evidence, findUser, users } from "../../shared/demo-data.js";
import { isPostgresConfigured } from "../db.js";
import { buildBootstrapFromDb, getDbEvidenceById, getDbUserById, getDbUsers } from "../postgres-workspace.js";

const router = Router();

router.get("/bootstrap", (req: Request, res: Response) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
  if (isPostgresConfigured()) {
    if (!userId) {
      res.status(400).json({
        success: false,
        error: "userId is required.",
      });
      return;
    }

    void (async () => {
      try {
        res.status(200).json({
          success: true,
          data: await buildBootstrapFromDb(userId),
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          error: error instanceof Error ? error.message : "Workspace data is unavailable.",
        });
      }
    })();
    return;
  }

  try {
    res.status(200).json({
      success: true,
      data: buildBootstrap(userId),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : "Workspace data is unavailable.",
    });
  }
});

router.get("/users", (_req: Request, res: Response) => {
  if (isPostgresConfigured()) {
    void (async () => {
      try {
        res.status(200).json({
          success: true,
          data: await getDbUsers(),
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Unable to load users.",
        });
      }
    })();
    return;
  }

  res.status(200).json({
    success: true,
    data: users,
  });
});

router.get("/media/:assetId/share", (req: Request, res: Response) => {
  if (isPostgresConfigured()) {
    void (async () => {
      try {
        const asset = await getDbEvidenceById(req.params.assetId);
        if (!asset) {
          res.status(404).json({
            success: false,
            error: "Media asset not found.",
          });
          return;
        }

        res.redirect(asset.previewUrl);
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Unable to load media asset.",
        });
      }
    })();
    return;
  }

  const asset = evidence.find((item) => item.id === req.params.assetId);

  if (!asset) {
    res.status(404).json({
      success: false,
      error: "Media asset not found.",
    });
    return;
  }

  res.redirect(asset.previewUrl);
});

router.get("/session/:userId", (req: Request, res: Response) => {
  if (isPostgresConfigured()) {
    void (async () => {
      try {
        const user = await getDbUserById(req.params.userId);
        if (!user) {
          res.status(404).json({
            success: false,
            error: "No configured PostgreSQL user session found.",
          });
          return;
        }

        res.status(200).json({
          success: true,
          data: {
            user,
            bootstrap: await buildBootstrapFromDb(user.id),
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Unable to load session.",
        });
      }
    })();
    return;
  }

  const user = findUser(req.params.userId);
  if (!user) {
    res.status(404).json({
      success: false,
      error: "No configured user session found.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user,
      bootstrap: buildBootstrap(user.id),
    },
  });
});

export default router;

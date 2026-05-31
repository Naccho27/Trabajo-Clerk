import { Router } 
from "express";

import authMiddleware
from "../../auth/middlewares/auth.middleware.js";

import { requireRole } 
from "../../../shared/middlewares/requireRole.js";

import { validate } 
from "../../../shared/middlewares/validate.middleware.js";

import {
  addComment,
  addProgress,
  getReportById,
  getValidatedReports,
  resolveReport,
  updateReportStatus
} from "../controllers/operator.controller.js";

import {
  commentSchema,
  progressSchema,
  updateStatusSchema
} from "../validators/operator.validator.js";

const router = Router();

router.get(
  "/reportes",
  //authMiddleware,
  //requireRole("operator"),
  getValidatedReports
);

router.get(
  "/reportes/:id",
  //authMiddleware,
  //requireRole("operator"),
  getReportById
);

router.patch(
  "/reportes/:id/status",
  //authMiddleware,
  //requireRole("operator"),
  validate(updateStatusSchema),
  updateReportStatus
);

router.patch(
  "/reportes/:id/progreso",
  //authMiddleware,
  //requireRole("operator"),
  validate(progressSchema),
  addProgress
);

router.patch(
  "/reportes/:id/comentario",
  //authMiddleware,
  //requireRole("operator"),
  validate(commentSchema),
  addComment
);

router.patch(
  "/reportes/:id/resolver",
  //authMiddleware,
  //requireRole("operator"),
  resolveReport
);

export default router;
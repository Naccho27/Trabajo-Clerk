import { Router } from "express";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import authMiddleware from "../../auth/middlewares/auth.middleware.js";import {
  addComment,
  addProgress,
  getReportById,
  getValidatedReports,
  getInProgressReports,
  getResolvedReports,
  resolveReport,
  updateReportStatus,
} from "../controllers/operator.controller.js";
import {
  commentSchema,
  progressSchema,
  updateStatusSchema,
} from "../validators/operator.validator.js";

const router = Router();

router.get("/reportes", getValidatedReports);
router.get("/reportes/en-progreso", getInProgressReports);
router.get("/reportes/historial", getResolvedReports);
router.get("/reportes/:id", getReportById);
router.patch("/reportes/:id/status", authMiddleware, validate(updateStatusSchema), updateReportStatus);
router.patch("/reportes/:id/progreso", authMiddleware, validate(progressSchema), addProgress);
router.patch("/reportes/:id/comentario", authMiddleware, validate(commentSchema), addComment); // 👈
router.patch("/reportes/:id/resolver", authMiddleware, resolveReport);

export default router;
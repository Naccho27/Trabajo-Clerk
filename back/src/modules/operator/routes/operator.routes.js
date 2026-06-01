import { Router } from "express";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import {
  addComment,
  addProgress,
  getReportById,
  getValidatedReports,
  getInProgressReports, // 👈 nuevo
  getResolvedReports,   // 👈 nuevo
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
router.get("/reportes/en-progreso", getInProgressReports); // 👈 nuevo
router.get("/reportes/historial", getResolvedReports);     // 👈 nuevo
router.get("/reportes/:id", getReportById);
router.patch("/reportes/:id/status", validate(updateStatusSchema), updateReportStatus);
router.patch("/reportes/:id/progreso", validate(progressSchema), addProgress);
router.patch("/reportes/:id/comentario", validate(commentSchema), addComment);
router.patch("/reportes/:id/resolver", resolveReport);

export default router;
import { Router } from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  sincronizarUsuario,
  obtenerUsuarioActual, // 👇 nuevo
} from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/sync",
  authMiddleware,
  sincronizarUsuario
);

// 👇 nuevo
router.use(clerkMiddleware());
router.get(
  "/me",
  requireAuth(),
  obtenerUsuarioActual
);

export default router;
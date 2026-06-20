import { Router } from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import {
  sincronizarUsuario,
  obtenerUsuarioActual,
} from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/sync",
  sincronizarUsuario
);

router.use(clerkMiddleware());
router.get(
  "/me",
  requireAuth(),
  obtenerUsuarioActual
);

export default router;
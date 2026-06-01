import { Router }
from "express";

import authMiddleware
from "../middlewares/auth.middleware.js";

import { requireAuth } from "@clerk/express";

import {
  sincronizarUsuario,
  obtenerMiPerfil
} from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/sync",
  requireAuth(),
  sincronizarUsuario
);

router.get(
  "/me",
  authMiddleware,
  obtenerMiPerfil
);

export default router;
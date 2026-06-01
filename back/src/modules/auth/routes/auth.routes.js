import { Router }
from "express";

import authMiddleware
from "../middlewares/auth.middleware.js";

import {
  sincronizarUsuario
} from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/sync",
  authMiddleware,
  sincronizarUsuario
);

export default router;
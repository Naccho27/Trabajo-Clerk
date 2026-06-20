import { Router }
from "express";
console.log(
  "ADMIN ANALYTICS ROUTES CARGADAS"
);
import {
  clerkMiddleware,
  requireAuth
}
from "@clerk/express";

import {
  obtenerResumenCiudad
}
from "../controllers/analytics.controller.js";

const router =
  Router();

router.use(
  clerkMiddleware()
);

router.get(
  "/resumen",
  requireAuth(),
  obtenerResumenCiudad
);

export default router;
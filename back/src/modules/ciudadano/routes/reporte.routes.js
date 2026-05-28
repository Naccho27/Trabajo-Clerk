import { Router } from "express";

import { clerkMiddleware, requireAuth } from "@clerk/express";

import {
  crearReporte,
  obtenerReportesPublicos,
  obtenerReportePorId,
  obtenerMisReportes,
  obtenerMisReportesActivos,
  obtenerHistorial,
  actualizarReporte,
  eliminarReporte,
} from "../controllers/reporte.controller.js";

import { validate } from "../../../shared/middlewares/validate.middleware.js";

import {
  crearReporteSchema,
  actualizarReporteSchema,
} from "../../../shared/validators/reporte.validator.js";

import { upload } from "../../../shared/middlewares/upload.middleware.js";

const router = Router();



/*
|--------------------------------------------------------------------------
| Públicas
|--------------------------------------------------------------------------
*/

router.get(
  "/publicos",
  obtenerReportesPublicos
);



/*
|--------------------------------------------------------------------------
| Middleware Clerk
|--------------------------------------------------------------------------
*/

router.use(clerkMiddleware());



/*
|--------------------------------------------------------------------------
| Privadas
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAuth(),
  upload.array("archivos", 3),
  crearReporte,
);

router.get(
  "/mis-reportes",
  requireAuth(),
  obtenerMisReportes
);

router.get(
  "/activos",
  requireAuth(),
  obtenerMisReportesActivos
);

router.get(
  "/historial",
  requireAuth(),
  obtenerHistorial
);

router.put(
  "/:id",

  requireAuth(),

  validate(actualizarReporteSchema),

  actualizarReporte
);

router.delete(
  "/:id",
  requireAuth(),
  eliminarReporte
);



/*
|--------------------------------------------------------------------------
| Detalle
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  obtenerReportePorId
);

export default router;
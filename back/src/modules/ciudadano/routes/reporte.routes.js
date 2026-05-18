import { Router }
from "express";

import {
  clerkMiddleware,
  requireAuth
}
from "@clerk/express";

import {

  crearReporte,

  obtenerReportesPublicos,

  obtenerReportePorId,

  obtenerMisReportes,

  obtenerMisReportesActivos,

  obtenerHistorial,

  actualizarReporte,

  eliminarReporte

}
from "../controllers/reporte.controller.js";

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
  crearReporte
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
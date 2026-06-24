import { Router } from "express";

import {
  obtenerPendientes,
  obtenerReportesSupervisor,
  aprobarReporte,
  rechazarReporte,
  cambiarCategoria,
  cambiarPrioridad,
  cambiarEstado,
  obtenerDetalleReporte,

} from "../controllers/supervisor.controller.js";

import { requireRole }
from "../../../shared/middlewares/requireRole.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

router.use(
  requireRole(
    "supervisor",
    "admin"
  )
);

/*
|--------------------------------------------------------------------------
| Obtener todos con filtros
|--------------------------------------------------------------------------
*/

router.get(
  "/reportes",
  obtenerReportesSupervisor
);

/*
|--------------------------------------------------------------------------
| Detalle reporte
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  obtenerDetalleReporte
);

/*
|--------------------------------------------------------------------------
| Pendientes
|--------------------------------------------------------------------------
*/

router.get(
  "/pendientes",
  obtenerPendientes
);

/*
|--------------------------------------------------------------------------
| Aprobar
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/aprobar",
  aprobarReporte
);

/*
|--------------------------------------------------------------------------
| Rechazar
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/rechazar",
  rechazarReporte
);

/*
|--------------------------------------------------------------------------
| Cambiar categoría
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/categoria",
  cambiarCategoria
);

/*
|--------------------------------------------------------------------------
| Cambiar prioridad
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/prioridad",
  cambiarPrioridad
);

/*
|--------------------------------------------------------------------------
| Cambiar estado
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/estado",
  cambiarEstado
);

export default router;
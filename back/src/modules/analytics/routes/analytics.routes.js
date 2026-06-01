import { Router } from "express";

import {

  reportesPorCategoria,

  reportesPorEstado,

  reportesPorPrioridad,

  porcentajeResueltos,

  tiempoPromedioResolucion,

  reportesPorFecha,

  reportesPorBarrio,

  reportesPorSupervisor,

  mapaCalor,
} from "../controllers/analytics.controller.js";

const router = Router();

/*
|------------------------------------------------------------------
| Analytics
|------------------------------------------------------------------
*/

router.get(
  "/categorias",
  reportesPorCategoria
);

router.get(
  "/estados",
  reportesPorEstado
);

router.get(
  "/prioridades",
  reportesPorPrioridad
);

router.get(
  "/resueltos",
  porcentajeResueltos
);

router.get(
  "/tiempo-promedio",
  tiempoPromedioResolucion
);

router.get(
  "/por-fecha",
  reportesPorFecha
);

router.get(
  "/barrios",
  reportesPorBarrio
);

router.get(
  "/supervisores",
  reportesPorSupervisor
);

router.get(
  "/mapa-calor",
  mapaCalor
);

export default router;
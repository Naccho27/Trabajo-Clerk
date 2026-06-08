import { Router } from "express";

import {
  getDashboard,
  getFactReportes,
  getDimCategorias,
  getDimEstados,
  getDimPrioridades,
  getDimFechas,
  getEstadisticas,
  getDimUsuarios,
  getDimUbicaciones,
} from "../controllers/public.controller.js";

const router = Router();

router.get("/dashboard", getDashboard);

router.get("/fact-reportes", getFactReportes);

router.get("/dim-categorias", getDimCategorias);

router.get("/dim-estados", getDimEstados);

router.get("/dim-prioridades", getDimPrioridades);

router.get("/dim-fechas", getDimFechas);

router.get("/estadisticas", getEstadisticas);

router.get("/dim-usuarios", getDimUsuarios);

router.get("/dim-ubicaciones", getDimUbicaciones);

export default router;

import { Router } from "express";

import {
  clerkMiddleware,
  requireAuth,
} from "@clerk/express";

import {
  obtenerMisNotificaciones,
  marcarComoLeida,
  contarNoLeidas,
marcarTodasLeidas,
} from "../controllers/notificacion.controller.js";

const router = Router();

router.use(clerkMiddleware());

router.use(requireAuth());

/*
|---------------------------------------------------------
| Obtener notificaciones
|---------------------------------------------------------
*/

router.get(
  "/",
  obtenerMisNotificaciones
);

/*
|---------------------------------------------------------
| Marcar como leída
|---------------------------------------------------------
*/

router.patch(
  "/:id/leida",
  marcarComoLeida
);

export default router;

/*
|------------------------------------------------------------------
| Contar no leídas
|------------------------------------------------------------------
*/

router.get(
  "/no-leidas",
  contarNoLeidas
);

/*
|------------------------------------------------------------------
| Marcar todas como leídas
|------------------------------------------------------------------
*/

router.patch(
  "/marcar-todas",
  marcarTodasLeidas
);
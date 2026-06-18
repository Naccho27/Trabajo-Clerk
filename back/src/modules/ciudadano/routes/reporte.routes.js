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
import { crearReporteSchema } from "../../../shared/validators/reporte.validator.js";
import { upload } from "../../../shared/middlewares/upload.middleware.js";
import { classifyIncident, normalizeIncident, detectDuplicateIncident, prioritizeIncident } from "../../../shared/services/ai.service.js";

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
  upload.array("archivos", 6),
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

/*
|--------------------------------------------------------------------------
| Actualizar — con upload para manejar imágenes nuevas
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireAuth(),
  upload.array("archivos", 3), // 👈 agregado
  actualizarReporte,           // 👈 sacado el validator
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
//Pruebas IA
router.get(
  "/test-ai",
  async (req, res) => {

    const resultado =
      await classifyIncident(
        "Hay un pozo enorme en la calle"
      );

    res.json(resultado);

  }
);
router.get(
  "/test-normalize",
  async (req, res) => {

    const resultado =
      await normalizeIncident(

        "ay un poso muy grande en la eskina y los autos casi se rompen"

      );

    res.json({
      texto: resultado
    });

  }
);
router.get(
  "/test-duplicado",
  async (req, res) => {

    const resultado =
      await detectDuplicateIncident(

        {
          titulo:
            "Bache enorme",

          descripcion:
            "Hay un pozo muy grande en la esquina"
        },

        {
          titulo:
            "Pozo en la calle",

          descripcion:
            "Existe un bache profundo en la misma esquina"
        }

      );

    res.json(resultado);

  }
);

router.get(
  "/test-prioridad",
  async (req, res) => {

    const resultado =
      await prioritizeIncident({

        titulo:
          "Pozo enorme frente a escuela",

        descripcion:
          "Hay un bache profundo que provoca accidentes y los autos deben esquivarlo",

        categoria:
          "baches"

      });

    res.json(resultado);

  }
);

//Fin de Pruebas IA
router.get(
  "/:id",
  obtenerReportePorId
);


export default router;
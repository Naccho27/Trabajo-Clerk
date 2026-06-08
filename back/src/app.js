import express from "express";
import cors from "cors";

import {
  clerkMiddleware
} from "@clerk/express";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

import authRoutes
from "./modules/auth/routes/auth.routes.js";

import reporteRoutes
from "./modules/ciudadano/routes/reporte.routes.js";

import supervisorRoutes
from "./modules/supervisor/routes/supervisor.routes.js";

import operatorRoutes
from "./modules/operator/routes/operator.routes.js";

import adminRoutes
from "./modules/admin/routes/admin.routes.js";

import analyticsRoutes
from "./modules/analytics/routes/analytics.routes.js";

import notificacionRoutes
from "./modules/notificaciones/routes/notificacion.routes.js";

import publicRoutes
from "./modules/public/routes/public.routes.js";

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

import errorHandler
from "./shared/middlewares/error.middleware.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Global Middlewares
|--------------------------------------------------------------------------
*/

app.use(cors());

app.use(express.json());

app.use(clerkMiddleware());

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/reportes",
  reporteRoutes
);

app.use(
  "/api/supervisor",
  supervisorRoutes
);

app.use(
  "/api/operator",
  operatorRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/notificaciones",
  notificacionRoutes
);

app.use(
  "/api/public",
  publicRoutes
);

/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

  res.json({
    ok: true,
    mensaje:
      "API UrbanLog funcionando 🚀"
  });

});

app.get("/api/test", (req, res) => {

  res.json({
    ok: true,
    mensaje:
      "Test funcionando"
  });

});

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {

  res.status(404).json({

    ok: false,

    mensaje:
      "Ruta no encontrada"

  });

});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;
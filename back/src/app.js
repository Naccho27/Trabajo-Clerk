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


import adminAnalyticsRoutes
from "./modules/adminAnalytics/routes/analytics.routes.js";

import notificacionRoutes
from "./modules/notificaciones/routes/notificacion.routes.js";



const app = express();



/*
|--------------------------------------------------------------------------
| Middlewares
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
  "/api/adminAnalytics",
  adminAnalyticsRoutes
);

app.use(
  "/api/notificaciones",
  notificacionRoutes
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

export default app;
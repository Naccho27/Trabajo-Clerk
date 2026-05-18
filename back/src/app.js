import express from "express";

import cors from "cors";

import {
  clerkMiddleware
}
from "@clerk/express";

import authRoutes
from "./modules/auth/routes/auth.routes.js";

import reporteRoutes
from "./modules/ciudadano/routes/reporte.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(clerkMiddleware());



app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/reportes",
  reporteRoutes
);



app.get("/", (req, res) => {

  res.json({
    ok: true,
    mensaje:
      "API UrbanLog funcionando 🚀"
  });
});

export default app;
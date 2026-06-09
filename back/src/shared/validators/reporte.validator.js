import { z } from "zod";

import {
  CATEGORIAS_INCIDENTES
} from "../constants/categorias.js";

/*
|--------------------------------------------------------------------------
| Base
|--------------------------------------------------------------------------
*/

const reporteBaseSchema = {

  titulo: z
    .string()
    .min(5)
    .max(100),

  descripcion: z
    .string()
    .min(10)
    .max(1000),

  categoria: z.enum(
    CATEGORIAS_INCIDENTES
  ),

  ubicacion: z.object({

    direccion: z
      .string()
      .min(3),

    lat: z.coerce.number(),

    lng: z.coerce.number(),

  }),

};

/*
|--------------------------------------------------------------------------
| Crear
|--------------------------------------------------------------------------
*/

export const crearReporteSchema =
  z.object(reporteBaseSchema);

/*
|--------------------------------------------------------------------------
| Actualizar
|--------------------------------------------------------------------------
*/

export const actualizarReporteSchema =
  z.object(reporteBaseSchema)
    .partial();
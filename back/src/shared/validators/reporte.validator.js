import { z } from "zod";

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

  categoria: z.string().min(1),

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
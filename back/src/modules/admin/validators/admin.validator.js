import { z } from "zod";

export const roleSchema =
  z.object({

    rol: z.enum([
      "ciudadano",
      "supervisor",
      "operador",
      "admin"
    ])

  });
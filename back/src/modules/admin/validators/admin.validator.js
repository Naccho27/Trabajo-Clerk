import { z } from "zod";

export const addRoleSchema = z.object({

  rol: z.enum([
    "ciudadano",
    "supervisor",
    "operador",
    "admin"
  ])

});

export const removeRoleSchema = z.object({

  rol: z.enum([
    "ciudadano",
    "supervisor",
    "operador",
    "admin"
  ])

});
import { z } from "zod";

export const updateStatusSchema =
  z.object({

    status: z.enum([
      "open",
      "validated",
      "in_progress",
      "resolved",
      "rejected"
    ])

  });

export const progressSchema =
  z.object({

    descripcion:
      z.string().min(3)

  });

export const commentSchema =
  z.object({

    texto:
      z.string().min(3)

  });
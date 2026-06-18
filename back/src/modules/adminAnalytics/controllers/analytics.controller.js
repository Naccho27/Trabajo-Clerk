import {
  obtenerResumenCiudadService
}
from "../services/analytics.service.js";

export const obtenerResumenCiudad =
  async (req, res) => {

    try {

      const resumen =
        await obtenerResumenCiudadService();

      res.json({

        ok: true,

        resumen

      });

    } catch (error) {

      res.status(500).json({

        ok: false,

        mensaje:
          error.message

      });

    }

  };
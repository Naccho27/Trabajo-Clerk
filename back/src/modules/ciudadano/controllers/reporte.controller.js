import Usuario from "../models/Usuario.js";

import {
  crearReporteService,
  obtenerMisReportesService,
  obtenerReportePorIdService,
  actualizarReporteService,
  eliminarReporteService,
  obtenerMisReportesActivosService,
  obtenerHistorialService,
  obtenerReportesPublicosService,
} from "../services/reporte.service.js";

export const crearReporte =
  async (req, res) => {
    try {

      const auth = req.auth();

      let usuario = null;

      if (auth?.userId) {

        usuario =
          await Usuario.findOne({
            clerkId:
              auth.userId
          });

      }

      console.log("USUARIO ENCONTRADO:");
      console.log(usuario);

      const nuevoReporte =
        await crearReporteService({
          ...req.body,

          usuarioId:
            usuario?._id || null,

          modoAnonimo:
            !usuario
        });

      res.status(201).json({
        ok: true,
        reporte: nuevoReporte
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        ok: false,
        mensaje: error.message
      });

    }
  };

export const obtenerReportesPublicos = async (req, res) => {
  try {
    const reportes = await obtenerReportesPublicosService();

    res.json({
      ok: true,
      reportes,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

export const obtenerReportePorId = async (req, res) => {
  try {
    const reporte = await obtenerReportePorIdService(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        ok: false,
        mensaje: "Reporte no encontrado",
      });
    }

    res.json({
      ok: true,
      reporte,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

export const obtenerMisReportes = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      clerkId: req.auth.userId,
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado",
      });
    }

    const reportes = await obtenerMisReportesService(usuario._id);

    res.json({
      ok: true,
      reportes,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

export const obtenerMisReportesActivos = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      clerkId: req.auth.userId,
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado",
      });
    }

    const reportes = await obtenerMisReportesActivosService(usuario._id);

    res.json({
      ok: true,
      reportes,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

export const obtenerHistorial = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      clerkId: req.auth.userId,
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado",
      });
    }

    const historial = await obtenerHistorialService(usuario._id);

    res.json({
      ok: true,
      historial,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

export const actualizarReporte = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      clerkId: req.auth.userId,
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado",
      });
    }

    const reporte = await obtenerReportePorIdService(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        ok: false,
        mensaje: "Reporte no encontrado",
      });
    }

    if (reporte.usuarioId?.toString() !== usuario._id.toString()) {
      return res.status(403).json({
        ok: false,
        mensaje: "No autorizado",
      });
    }

    if (reporte.estado !== "open") {
      return res.status(400).json({
        ok: false,
        mensaje: "Solo se pueden editar reportes pendientes",
      });
    }

    const actualizado = await actualizarReporteService(req.params.id, req.body);

    res.json({
      ok: true,
      reporte: actualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

export const eliminarReporte = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      clerkId: req.auth.userId,
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado",
      });
    }

    const reporte = await obtenerReportePorIdService(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        ok: false,
        mensaje: "Reporte no encontrado",
      });
    }

    if (reporte.usuarioId?.toString() !== usuario._id.toString()) {
      return res.status(403).json({
        ok: false,
        mensaje: "No autorizado",
      });
    }

    if (reporte.estado !== "open") {
      return res.status(400).json({
        ok: false,
        mensaje: "Solo se pueden eliminar reportes pendientes",
      });
    }

    await eliminarReporteService(req.params.id);

    res.json({
      ok: true,
      mensaje: "Reporte eliminado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: error.message,
    });
  }
};

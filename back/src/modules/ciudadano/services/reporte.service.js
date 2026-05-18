import Reporte
from "../models/Reporte.js";

export const crearReporteService =
  async (datos) => {

    const nuevoReporte =
      new Reporte(datos);

    return await nuevoReporte.save();
};

export const obtenerMisReportesService =
  async (usuarioId) => {

    return await Reporte.find({
      usuarioId
    })
    .sort({
      createdAt: -1
    });
};

export const obtenerReportePorIdService =
  async (id) => {

    return await Reporte.findById(id);
};

export const actualizarReporteService =
  async (id, datos) => {

    return await Reporte.findByIdAndUpdate(
      id,
      datos,
      { new: true }
    );
};

export const eliminarReporteService =
  async (id) => {

    return await Reporte.findByIdAndDelete(id);
};

export const obtenerMisReportesActivosService =
  async (usuarioId) => {

    return await Reporte.find({
      usuarioId,

      estado: {
        $nin: [
          "resolved",
          "rejected"
        ]
      }
    });
};

export const obtenerHistorialService =
  async (usuarioId) => {

    return await Reporte.find({
      usuarioId,

      estado: {
        $in: [
          "resolved",
          "rejected"
        ]
      }
    })
    .sort({
      createdAt: -1
    });
};

export const obtenerReportesPublicosService =
  async () => {

    return await Reporte.find()
      .sort({
        createdAt: -1
      });
};
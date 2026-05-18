export const obtenerMisReportesActivosService =
  async (usuarioId) => {
    return await Reporte.find({
      usuarioId,

      estado: {
        $in: [
          "open",
          "validated",
          "in_progress"
        ]
      }
    }).sort({
      createdAt: -1
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
    }).sort({
      updatedAt: -1
    });
  };
import Reporte from "../models/Reporte.js";

/*
|--------------------------------------------------------------------------
| Crear reporte
|--------------------------------------------------------------------------
*/

export const crearReporteService = async (datos) => {
  const incidenteExistente = await buscarIncidenteSimilarService(
    datos.categoria,

    datos.ubicacion?.lat,

    datos.ubicacion?.lng,
  );

  /*
    |--------------------------------------------------------------------------
    | Existe incidente similar
    |--------------------------------------------------------------------------
    */

  if (incidenteExistente) {
    incidenteExistente.cantidadReportesRelacionados += 1;

    incidenteExistente.ultimoReporteRelacionado = new Date();

    if (
      datos.usuarioId &&
      !incidenteExistente.usuariosRelacionados.some(
        (id) => id.toString() === datos.usuarioId.toString(),
      )
    ) {
      incidenteExistente.usuariosRelacionados.push(datos.usuarioId);
    }

    incidenteExistente.prioridad = calcularPrioridadPorCantidad(
      incidenteExistente.cantidadReportesRelacionados,
    );

    incidenteExistente.historial.push({
      accion: "reporte_relacionado",

      valorNuevo: String(incidenteExistente.cantidadReportesRelacionados),

      realizadoPor: datos.usuarioId,
    });

    await incidenteExistente.save();

    return {
      esDuplicado: true,
      reportePrincipal: incidenteExistente,
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Nuevo incidente
    |--------------------------------------------------------------------------
    */

  const nuevoReporte = new Reporte({
    ...datos,

    cantidadReportesRelacionados: 1,

    usuariosRelacionados: datos.usuarioId ? [datos.usuarioId] : [],

    ultimoReporteRelacionado: new Date(),

    historialEstados: [
      {
        estado: "open",

        fechaInicio: new Date(),

        usuarioId: datos.usuarioId,
      },
    ],

    historial: [
      {
        accion: "creacion",

        valorNuevo: "open",

        realizadoPor: datos.usuarioId,
      },
    ],
  });

  return await nuevoReporte.save();
};

/*
|--------------------------------------------------------------------------
| Obtener reportes
|--------------------------------------------------------------------------
*/

export const obtenerMisReportesService = async (usuarioId) => {
  return await Reporte.find({
    usuarioId,
  }).sort({
    createdAt: -1,
  });
};

export const obtenerReportePorIdService = async (id) => {
  return await Reporte.findById(id);
};

export const actualizarReporteService = async (id, datos) => {
  return await Reporte.findByIdAndUpdate(id, datos, { new: true });
};

export const eliminarReporteService = async (id) => {
  return await Reporte.findByIdAndDelete(id);
};

export const obtenerMisReportesActivosService = async (usuarioId) => {
  return await Reporte.find({
    usuarioId,

    estado: {
      $in: ["open", "in_progress"],
    },
  }).sort({
    createdAt: -1,
  });
};

export const obtenerHistorialService = async (usuarioId) => {
  return await Reporte.find({
    usuarioId,

    estado: {
      $in: ["resolved", "rejected"],
    },
  }).sort({
    updatedAt: -1,
  });
};

export const obtenerReportesPublicosService = async () => {
  return await Reporte.find().sort({
    createdAt: -1,
  });
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const calcularPrioridadPorCantidad = (cantidad) => {
  if (cantidad >= 20) return "critical";

  if (cantidad >= 10) return "high";

  if (cantidad >= 5) return "medium";

  return "low";
};

export const buscarIncidenteSimilarService = async (categoria, lat, lng) => {
  const reportes = await Reporte.find({
    categoria,

    estado: {
      $nin: ["resolved", "rejected"],
    },
  });

  return reportes.find((reporte) => {
    if (!reporte.ubicacion?.lat || !reporte.ubicacion?.lng) {
      return false;
    }

    const diferenciaLat = Math.abs(reporte.ubicacion.lat - lat);

    const diferenciaLng = Math.abs(reporte.ubicacion.lng - lng);

    return diferenciaLat < 0.00045 && diferenciaLng < 0.00045;
  });
};

import Reporte from "../../ciudadano/models/Reporte.js";

import Comentario from "../../ciudadano/models/Comentario.js";

/*
|--------------------------------------------------------------
| Obtener reportes validados
|--------------------------------------------------------------
*/

export const getValidatedReportsService =
  async () => {

    return await Reporte.find({
      estado: "in_progress"
    })
      .populate("usuarioId")
      .populate("supervisorId")
      .sort({ createdAt: -1 });

  };

/*
|--------------------------------------------------------------
| Obtener reporte por ID
|--------------------------------------------------------------
*/

export const getReportByIdService =
  async (reporteId) => {

    const reporte =
      await Reporte.findById(reporteId)
        .populate("usuarioId")
        .populate("supervisorId");

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );

    }

    const comentarios =
      await Comentario.find({
        reporteId: reporteId
      }).populate("usuarioId");

    return {

      reporte,

      comentarios,

      historialEstados:
        reporte.historialEstados,

      historial:
        reporte.historial

    };

  };

/*
|--------------------------------------------------------------
| Cambiar estado reporte
|--------------------------------------------------------------
*/

export const updateReportStatusService =
  async (
    reporteId,
    nuevoEstado,
    usuarioId
  ) => {

    const reporte =
      await Reporte.findById(reporteId);

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );

    }

    const estadoAnterior =
      reporte.estado;

    /*
    |----------------------------------------------------------
    | Historial estados
    |----------------------------------------------------------
    */

    reporte.historialEstados.push({

      estado:
        nuevoEstado,

      usuarioId,

      comentario:
        `Estado cambiado a ${nuevoEstado}`

    });

    /*
    |----------------------------------------------------------
    | Historial acciones
    |----------------------------------------------------------
    */

    reporte.historial.push({

      accion:
        "Cambio de estado",

      valorAnterior:
        estadoAnterior,

      valorNuevo:
        nuevoEstado,

      realizadoPor:
        usuarioId

    });

    /*
    |----------------------------------------------------------
    | Actualizar estado
    |----------------------------------------------------------
    */

    reporte.estado =
      nuevoEstado;

    await reporte.save();

    return reporte;

  };

/*
|--------------------------------------------------------------
| Agregar progreso
|--------------------------------------------------------------
*/

export const addProgressService =
  async (
    reporteId,
    descripcion,
    usuarioId
  ) => {

    const reporte =
      await Reporte.findById(reporteId);

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );

    }

    reporte.historial.push({

      accion:
        "Actualización progreso",

      valorAnterior:
        "",

      valorNuevo:
        descripcion,

      realizadoPor:
        usuarioId

    });

    await reporte.save();

    return reporte;

  };

/*
|--------------------------------------------------------------
| Agregar comentario
|--------------------------------------------------------------
*/

export const addCommentService =
  async (
    reporteId,
    texto,
    usuarioId
  ) => {

    const reporte =
      await Reporte.findById(reporteId);

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );

    }

    const comentario =
      await Comentario.create({

        reporteId:
          reporteId,

        usuarioId,

        mensaje:
          texto

      });

    return comentario;

  };

/*
|--------------------------------------------------------------
| Resolver reporte
|--------------------------------------------------------------
*/

export const resolveReportService =
  async (
    reporteId,
    usuarioId
  ) => {

    const reporte =
      await Reporte.findById(reporteId);

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );

    }

    const estadoAnterior =
      reporte.estado;

    /*
    |----------------------------------------------------------
    | Cambiar estado
    |----------------------------------------------------------
    */

    reporte.estado =
      "resolved";

    /*
    |----------------------------------------------------------
    | Fecha resolución
    |----------------------------------------------------------
    */

    reporte.fechaResolucion =
      new Date();

    /*
    |----------------------------------------------------------
    | Historial estados
    |----------------------------------------------------------
    */

    reporte.historialEstados.push({

      estado:
        "resolved",

      usuarioId,

      comentario:
        "Reporte resuelto"

    });

    /*
    |----------------------------------------------------------
    | Historial acciones
    |----------------------------------------------------------
    */

    reporte.historial.push({

      accion:
        "Resolución",

      valorAnterior:
        estadoAnterior,

      valorNuevo:
        "resolved",

      realizadoPor:
        usuarioId

    });

    await reporte.save();

    return reporte;

  };
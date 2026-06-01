import Reporte
from "../../ciudadano/models/Reporte.js";

import {
  crearNotificacionService
}
from "../../notificaciones/services/notificacion.service.js";

import {

  agregarHistorial,

  cerrarEstadoAnterior,

  agregarNuevoEstado,

} from "../utils/historial.utils.js";

/*
|--------------------------------------------------------------------------
| Obtener reportes con filtros
|--------------------------------------------------------------------------
*/

export const obtenerReportesSupervisorService =
  async (filtros) => {

    const query = {};

    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    if (filtros.estado) {

      query.estado =
        filtros.estado;
    }

    /*
    |--------------------------------------------------------------------------
    | Categoría
    |--------------------------------------------------------------------------
    */

    if (filtros.categoria) {

      query.categoria =
        filtros.categoria;
    }

    /*
    |--------------------------------------------------------------------------
    | Prioridad
    |--------------------------------------------------------------------------
    */

    if (filtros.prioridad) {

      query.prioridad =
        filtros.prioridad;
    }

    /*
    |--------------------------------------------------------------------------
    | Fechas
    |--------------------------------------------------------------------------
    */

    if (
      filtros.fechaDesde ||
      filtros.fechaHasta
    ) {

      query.createdAt = {};

      if (filtros.fechaDesde) {

        query.createdAt.$gte =
          new Date(filtros.fechaDesde);
      }

      if (filtros.fechaHasta) {

        query.createdAt.$lte =
          new Date(filtros.fechaHasta);
      }
    }

    return await Reporte.find(query)

      .populate(
        "usuarioId",
        "nombreUsuario email"
      )

      .sort({
        createdAt: -1
      });
  };

  /*
|--------------------------------------------------------------------------
| Obtener detalle reporte
|--------------------------------------------------------------------------
*/

export const obtenerDetalleReporteService =
  async (reporteId) => {

    const reporte =
      await Reporte.findById(
        reporteId
      )

      .populate(
        "usuarioId",
        "nombreUsuario email imagenPerfil"
      )

      .populate(
        "supervisorId",
        "nombreUsuario email"
      )

      .populate(
        "historial.realizadoPor",
        "nombreUsuario"
      )

      .populate(
        "historialEstados.usuarioId",
        "nombreUsuario"
      )

      .populate(
        "validacionSupervisor.validadoPor",
        "nombreUsuario"
      );

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );
    }

    return reporte;
  };

/*
|--------------------------------------------------------------------------
| Obtener pendientes
|--------------------------------------------------------------------------
*/

export const obtenerPendientesService =
  async () => {

    return await Reporte.find({

      estado: "open",

    })

    .populate(
      "usuarioId",
      "nombreUsuario email"
    )

    .sort({
      createdAt: -1
    });
  };

/*
|--------------------------------------------------------------------------
| Aprobar reporte
|--------------------------------------------------------------------------
*/

export const aprobarReporteService =
  async (
    reporteId,
    supervisorId
  ) => {

    const reporte =
      await Reporte.findById(
        reporteId
      );

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );
    }

    const estadoAnterior =
      reporte.estado;

    /*
    |--------------------------------------------------------------------------
    | Historial estados
    |--------------------------------------------------------------------------
    */

    cerrarEstadoAnterior(
      reporte
    );

    agregarNuevoEstado(

      reporte,

      "in_progress",

      supervisorId
    );

    /*
    |--------------------------------------------------------------------------
    | Historial acciones
    |--------------------------------------------------------------------------
    */

    agregarHistorial(
      reporte,
      {
        accion: "aprobacion",

        valorAnterior:
          estadoAnterior,

        valorNuevo:
          "in_progress",

        realizadoPor:
          supervisorId,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Actualizar reporte
    |--------------------------------------------------------------------------
    */

    reporte.estado =
      "in_progress";

    reporte.validacionSupervisor =
      {

        ...reporte.validacionSupervisor,

        validadoPor:
          supervisorId,

        fechaValidacion:
          new Date(),

        contenidoValido:
          true,
      };

    await reporte.save();

    return reporte;
  };

/*
|--------------------------------------------------------------------------
| Rechazar reporte
|--------------------------------------------------------------------------
*/

export const rechazarReporteService =
  async (
    reporteId,
    supervisorId,
    motivo
  ) => {

    const reporte =
      await Reporte.findById(
        reporteId
      );

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );
    }

    const estadoAnterior =
      reporte.estado;

    /*
    |--------------------------------------------------------------------------
    | Historial estados
    |--------------------------------------------------------------------------
    */

    cerrarEstadoAnterior(
      reporte
    );

    agregarNuevoEstado(

      reporte,

      "rejected",

      supervisorId
    );

    /*
    |--------------------------------------------------------------------------
    | Historial acciones
    |--------------------------------------------------------------------------
    */

    agregarHistorial(
      reporte,
      {
        accion: "rechazo",

        valorAnterior:
          estadoAnterior,

        valorNuevo:
          "rejected",

        realizadoPor:
          supervisorId,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Actualizar reporte
    |--------------------------------------------------------------------------
    */

    reporte.estado =
      "rejected";

    reporte.validacionSupervisor =
      {

        ...reporte.validacionSupervisor,

        validadoPor:
          supervisorId,

        fechaValidacion:
          new Date(),

        motivoRechazo:
          motivo,

        contenidoValido:
          false,
      };

    await reporte.save();

    return reporte;
  };

/*
|--------------------------------------------------------------------------
| Cambiar categoría
|--------------------------------------------------------------------------
*/

export const cambiarCategoriaService =
  async (
    reporteId,
    categoria,
    supervisorId
  ) => {

    const reporte =
      await Reporte.findById(
        reporteId
      );

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );
    }

    const categoriaAnterior =
      reporte.categoria;

    agregarHistorial(
      reporte,
      {
        accion: "categoria",

        valorAnterior:
          categoriaAnterior,

        valorNuevo:
          categoria,

        realizadoPor:
          supervisorId,
      }
    );

    reporte.categoria =
      categoria;

    await reporte.save();

    return reporte;
  };

/*
|--------------------------------------------------------------------------
| Cambiar prioridad
|--------------------------------------------------------------------------
*/

export const cambiarPrioridadService =
  async (
    reporteId,
    prioridad,
    supervisorId
  ) => {

    const reporte =
      await Reporte.findById(
        reporteId
      );

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );
    }

    const prioridadAnterior =
      reporte.prioridad;

    agregarHistorial(
      reporte,
      {
        accion: "prioridad",

        valorAnterior:
          prioridadAnterior,

        valorNuevo:
          prioridad,

        realizadoPor:
          supervisorId,
      }
    );

    reporte.prioridad =
      prioridad;

    await reporte.save();

    return reporte;
  };

/*
|--------------------------------------------------------------------------
| Cambiar estado
|--------------------------------------------------------------------------
*/

export const cambiarEstadoService =
  async (
    reporteId,
    estado,
    supervisorId
  ) => {

    const reporte =
      await Reporte.findById(
        reporteId
      );

    if (!reporte) {

      throw new Error(
        "Reporte no encontrado"
      );
    }

    const estadoAnterior =
      reporte.estado;

    /*
    |--------------------------------------------------------------------------
    | Historial estados
    |--------------------------------------------------------------------------
    */

    cerrarEstadoAnterior(
      reporte
    );

    agregarNuevoEstado(

      reporte,

      estado,

      supervisorId
    );

    /*
    |--------------------------------------------------------------------------
    | Historial acciones
    |--------------------------------------------------------------------------
    */

    agregarHistorial(
      reporte,
      {
        accion: "estado",

        valorAnterior:
          estadoAnterior,

        valorNuevo:
          estado,

        realizadoPor:
          supervisorId,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Actualizar reporte
    |--------------------------------------------------------------------------
    */

    reporte.estado =
      estado;

    await reporte.save();

    return reporte;
  };
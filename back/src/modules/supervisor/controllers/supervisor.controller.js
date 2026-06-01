import {

  obtenerPendientesService,

  obtenerReportesSupervisorService,

  aprobarReporteService,

  rechazarReporteService,

  cambiarCategoriaService,
  
  cambiarPrioridadService,

  cambiarEstadoService,

  obtenerDetalleReporteService,

} from "../services/supervisor.service.js";

/*
|--------------------------------------------------------------------------
| Obtener todos con filtros
|--------------------------------------------------------------------------
*/

export const obtenerReportesSupervisor =
  async (req, res) => {

    try {

      const filtros = {

        estado: req.query.estado,

        categoria: req.query.categoria,

        prioridad: req.query.prioridad,

        fechaDesde: req.query.fechaDesde,

        fechaHasta: req.query.fechaHasta,
      };

      const reportes =
        await obtenerReportesSupervisorService(
          filtros
        );

      res.json({
        ok: true,
        total: reportes.length,
        reportes,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| Obtener detalle reporte
|--------------------------------------------------------------------------
*/

export const obtenerDetalleReporte =
  async (req, res) => {

    try {

      const reporte =
        await obtenerDetalleReporteService(
          req.params.id
        );

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

/*
|--------------------------------------------------------------------------
| Pendientes
|--------------------------------------------------------------------------
*/

export const obtenerPendientes =
  async (req, res) => {

    try {

      const reportes =
        await obtenerPendientesService();

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

/*
|--------------------------------------------------------------------------
| Aprobar
|--------------------------------------------------------------------------
*/

export const aprobarReporte =
  async (req, res) => {

    try {

      const reporte =
       await aprobarReporteService(
  req.params.id,
  req.usuario._id
);

      res.json({
        ok: true,
        reporte,
      });

      /*
|------------------------------------------------------------------
| Notificación usuario
|------------------------------------------------------------------
*/

if (reporte.usuarioId) {

  await crearNotificacionService({

    usuarioId:
      reporte.usuarioId,

    titulo:
      "Reporte aprobado",

    mensaje:
      "Tu reporte fue validado y será revisado por el municipio.",

    tipo:
      "estado",

    reporteId:
      reporte._id,
  });
}
    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| Rechazar
|--------------------------------------------------------------------------
*/

export const rechazarReporte =
  async (req, res) => {

    try {

      const {
        motivo
      } = req.body;

      const reporte =
        await rechazarReporteService(
  req.params.id,
  req.usuario._id,
  motivo
);

      res.json({
        ok: true,
        reporte,
      });
/*
|------------------------------------------------------------------
| Notificación usuario
|------------------------------------------------------------------
*/

if (reporte.usuarioId) {

  await crearNotificacionService({

    usuarioId:
      reporte.usuarioId,

    titulo:
      "Reporte rechazado",

    mensaje:
      `Motivo: ${motivo}`,

    tipo:
      "estado",

    reporteId:
      reporte._id,
  });
}
    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| Cambiar categoría
|--------------------------------------------------------------------------
*/

export const cambiarCategoria =
  async (req, res) => {

    try {

      const reporte =
        await cambiarCategoriaService(
  req.params.id,
  req.body.categoria,
  req.usuario._id
);

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

/*
|--------------------------------------------------------------------------
| Cambiar prioridad
|--------------------------------------------------------------------------
*/

export const cambiarPrioridad =
  async (req, res) => {

    try {

      const reporte =
        await cambiarPrioridadService(
  req.params.id,
  req.body.prioridad,
  req.usuario._id
);

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

/*
|--------------------------------------------------------------------------
| Cambiar estado
|--------------------------------------------------------------------------
*/

export const cambiarEstado =
  async (req, res) => {

    try {

      const reporte =
        await cambiarEstadoService(
  req.params.id,
  req.body.estado,
  req.usuario._id
);

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
import {

  reportesPorCategoriaService,

  reportesPorEstadoService,

  reportesPorPrioridadService,

  porcentajeResueltosService,

  tiempoPromedioResolucionService,

  reportesPorFechaService,

  reportesPorBarrioService,

  reportesPorSupervisorService,

  mapaCalorService,
} from "../services/analytics.service.js";

/*
|------------------------------------------------------------------
| Categorías
|------------------------------------------------------------------
*/

export const reportesPorCategoria =
  async (req, res) => {

    try {

      const data =
        await reportesPorCategoriaService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

/*
|------------------------------------------------------------------
| Estados
|------------------------------------------------------------------
*/

export const reportesPorEstado =
  async (req, res) => {

    try {

      const data =
        await reportesPorEstadoService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

/*
|------------------------------------------------------------------
| Prioridad
|------------------------------------------------------------------
*/

export const reportesPorPrioridad =
  async (req, res) => {

    try {

      const data =
        await reportesPorPrioridadService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

/*
|------------------------------------------------------------------
| % Resueltos
|------------------------------------------------------------------
*/

export const porcentajeResueltos =
  async (req, res) => {

    try {

      const data =
        await porcentajeResueltosService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

/*
|------------------------------------------------------------------
| Tiempo promedio
|------------------------------------------------------------------
*/

export const tiempoPromedioResolucion =
  async (req, res) => {

    try {

      const data =
        await tiempoPromedioResolucionService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

  /*
|------------------------------------------------------------------
| Reportes por fecha
|------------------------------------------------------------------
*/

export const reportesPorFecha =
  async (req, res) => {

    try {

      const data =
        await reportesPorFechaService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

  /*
|------------------------------------------------------------------
| Reportes por barrio
|------------------------------------------------------------------
*/

export const reportesPorBarrio =
  async (req, res) => {

    try {

      const data =
        await reportesPorBarrioService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

  /*
|------------------------------------------------------------------
| Reportes por supervisor
|------------------------------------------------------------------
*/

export const reportesPorSupervisor =
  async (req, res) => {

    try {

      const data =
        await reportesPorSupervisorService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

  /*
|------------------------------------------------------------------
| Mapa calor
|------------------------------------------------------------------
*/

export const mapaCalor =
  async (req, res) => {

    try {

      const data =
        await mapaCalorService();

      res.json({
        ok: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };
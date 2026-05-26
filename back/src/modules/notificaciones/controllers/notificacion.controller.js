import {

  obtenerMisNotificacionesService,

  marcarComoLeidaService,

  contarNoLeidasService,

  marcarTodasLeidasService,

} from "../services/notificacion.service.js";

/*
|---------------------------------------------------------
| Obtener mis notificaciones
|---------------------------------------------------------
*/

export const obtenerMisNotificaciones =
  async (req, res) => {

    try {

      const usuarioId =
        req.usuario._id;

      const notificaciones =
        await obtenerMisNotificacionesService(
          usuarioId
        );

      res.json({
        ok: true,
        notificaciones,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

/*
|---------------------------------------------------------
| Marcar como leída
|---------------------------------------------------------
*/

export const marcarComoLeida =
  async (req, res) => {

    try {

      const notificacion =
        await marcarComoLeidaService(
          req.params.id
        );

      res.json({
        ok: true,
        notificacion,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };

  /*
|------------------------------------------------------------------
| Contar no leídas
|------------------------------------------------------------------
*/

export const contarNoLeidas =
  async (req, res) => {

    try {

      const total =
        await contarNoLeidasService(
          req.usuario._id
        );

      res.json({
        ok: true,
        total,
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
| Marcar todas como leídas
|------------------------------------------------------------------
*/

export const marcarTodasLeidas =
  async (req, res) => {

    try {

      await marcarTodasLeidasService(
        req.usuario._id
      );

      res.json({
        ok: true,
        mensaje:
          "Notificaciones actualizadas",
      });

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };
import Notificacion
from "../models/Notificacion.js";

export const crearNotificacionService =
  async (datos) => {

    const nueva =
      new Notificacion(datos);

    return await nueva.save();
  };

export const obtenerMisNotificacionesService =
  async (usuarioId) => {

    return await Notificacion.find({
      usuarioId,
    })

    .sort({
      createdAt: -1
    });
  };

export const marcarComoLeidaService =
  async (id) => {

    return await Notificacion.findByIdAndUpdate(

      id,

      {
        leida: true,
      },

      {
        new: true,
      }
    );
  };

  /*
|------------------------------------------------------------------
| Contar no leídas
|------------------------------------------------------------------
*/

export const contarNoLeidasService =
  async (usuarioId) => {

    return await Notificacion.countDocuments({

      usuarioId,

      leida: false,
    });
  };

/*
|------------------------------------------------------------------
| Marcar todas como leídas
|------------------------------------------------------------------
*/

export const marcarTodasLeidasService =
  async (usuarioId) => {

    return await Notificacion.updateMany(

      {
        usuarioId,
        leida: false,
      },

      {
        leida: true,
      }
    );
  };
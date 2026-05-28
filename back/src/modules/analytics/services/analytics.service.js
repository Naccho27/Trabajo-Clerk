import Reporte from "../../ciudadano/models/Reporte.js";

/*
|------------------------------------------------------------------
| Reportes por categoría
|------------------------------------------------------------------
*/

export const reportesPorCategoriaService =
  async () => {

    return await Reporte.aggregate([
      {
        $group: {
          _id: "$categoria",

          cantidad: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          cantidad: -1,
        },
      },
    ]);
  };

/*
|------------------------------------------------------------------
| Reportes por estado
|------------------------------------------------------------------
*/

export const reportesPorEstadoService =
  async () => {

    return await Reporte.aggregate([
      {
        $group: {
          _id: "$estado",

          cantidad: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          cantidad: -1,
        },
      },
    ]);
  };

/*
|------------------------------------------------------------------
| Reportes por prioridad
|------------------------------------------------------------------
*/

export const reportesPorPrioridadService =
  async () => {

    return await Reporte.aggregate([
      {
        $group: {
          _id: "$prioridad",

          cantidad: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          cantidad: -1,
        },
      },
    ]);
  };

/*
|------------------------------------------------------------------
| Reportes resueltos %
|------------------------------------------------------------------
*/

export const porcentajeResueltosService =
  async () => {

    const total =
      await Reporte.countDocuments();

    const resueltos =
      await Reporte.countDocuments({
        estado: "resolved",
      });

    const porcentaje =
      total === 0
        ? 0
        : (resueltos / total) * 100;

    return {
      total,

      resueltos,

      porcentaje:
        porcentaje.toFixed(2),
    };
  };

/*
|------------------------------------------------------------------
| Tiempo promedio resolución
|------------------------------------------------------------------
*/

export const tiempoPromedioResolucionService =
  async () => {

    const resultado =
      await Reporte.aggregate([
        {
          $match: {
            tiempoResolucionHoras: {
              $ne: null,
            },
          },
        },

        {
          $group: {
            _id: null,

            promedio: {
              $avg:
                "$tiempoResolucionHoras",
            },
          },
        },
      ]);

    return resultado[0] || {
      promedio: 0,
    };
  };

  export const reportesPorFechaService =
  async () => {

    return await Reporte.aggregate([

      {
        $group: {

          _id: {
            $dateToString: {
              format: "%Y-%m-%d",

              date: "$createdAt",
            },
          },

          cantidad: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  };

  /*
|------------------------------------------------------------------
| Reportes por barrio
|------------------------------------------------------------------
*/

export const reportesPorBarrioService =
  async () => {

    return await Reporte.aggregate([

      {
        $match: {
          "ubicacion.barrio": {
            $nin: [null, ""]
          }
        }
      },

      {
        $group: {
          _id: "$ubicacion.barrio",

          cantidad: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          cantidad: -1
        }
      }

    ]);
  };

  /*
|------------------------------------------------------------------
| Reportes por supervisor
|------------------------------------------------------------------
*/

export const reportesPorSupervisorService =
  async () => {

    return await Reporte.aggregate([

      {
        $match: {
          supervisorId: {
            $ne: null,
          },
        },
      },

      {
        $lookup: {

          from: "usuarios",

          localField:
            "supervisorId",

          foreignField:
            "_id",

          as: "supervisor",
        },
      },

      {
        $unwind:
          "$supervisor",
      },

      {
        $group: {

          _id:
            "$supervisor.nombreUsuario",

          cantidad: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          cantidad: -1,
        },
      },
    ]);
  };

  /*
|------------------------------------------------------------------
| Mapa calor
|------------------------------------------------------------------
*/

export const mapaCalorService =
  async () => {

    return await Reporte.find(

      {},

      {
        "ubicacion.lat": 1,

        "ubicacion.lng": 1,

        categoria: 1,

        prioridad: 1,
      }
    );
  };
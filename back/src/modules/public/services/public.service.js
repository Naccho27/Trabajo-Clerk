import Reporte from "../../ciudadano/models/Reporte.js";

import Usuario from "../../ciudadano/models/Usuario.js";

import { CATEGORIAS_INCIDENTES } from "../../../shared/constants/categorias.js";

export const getDashboardService = async () => {
  const totalReportes = await Reporte.countDocuments();

  const abiertos = await Reporte.countDocuments({
    estado: "open",
  });

  const enProceso = await Reporte.countDocuments({
    estado: "in_progress",
  });

  const resueltos = await Reporte.countDocuments({
    estado: "resolved",
  });

  const rechazados = await Reporte.countDocuments({
    estado: "rejected",
  });

  return {
    totalReportes,

    abiertos,

    enProceso,

    resueltos,

    rechazados,
  };
};

export const getFactReportesService =
async () => {

  const reportes =
    await Reporte.find()
      .select(
        `
        _id
        usuarioId
        supervisorId
        categoria
        estado
        prioridad
        ubicacion
        createdAt
        esDuplicado
        modoAnonimo
        tiempoResolucionHoras
        `
      );

  return reportes.map(
    (reporte) => ({

      idReporte:
        reporte._id,

      idUsuario:
        reporte.usuarioId || null,

      idSupervisor:
        reporte.supervisorId || null,

      fecha:
        reporte.createdAt,

      categoria:
        reporte.categoria,

      estado:
        reporte.estado,

      prioridad:
        reporte.prioridad,

      barrio:
        reporte.ubicacion?.barrio || "",

      ciudad:
        reporte.ubicacion?.ciudad || "",

      provincia:
        reporte.ubicacion?.provincia || "",

      pais:
        reporte.ubicacion?.pais || "",

      latitud:
        reporte.ubicacion?.lat || null,

      longitud:
        reporte.ubicacion?.lng || null,

      esDuplicado:
        reporte.esDuplicado,

      modoAnonimo:
        reporte.modoAnonimo,

      tiempoResolucionHoras:
        reporte.tiempoResolucionHoras

    })
  );

};

export const getDimCategoriasService = async () => {
  return CATEGORIAS_INCIDENTES.map((categoria, index) => ({
    id: index + 1,

    nombre: categoria,
  }));
};

export const getDimEstadosService = async () => {
  return [
    {
      id: 1,
      nombre: "open",
    },

    {
      id: 2,
      nombre: "in_progress",
    },

    {
      id: 3,
      nombre: "resolved",
    },

    {
      id: 4,
      nombre: "rejected",
    },
  ];
};

export const getDimPrioridadesService = async () => {
  return [
    {
      id: 1,
      nombre: "low",
    },

    {
      id: 2,
      nombre: "medium",
    },

    {
      id: 3,
      nombre: "high",
    },

    {
      id: 4,
      nombre: "critical",
    },
  ];
};

export const getDimFechasService = async () => {
  const reportes = await Reporte.find().select("createdAt");

  const fechasUnicas = [
    ...new Set(reportes.map((r) => r.createdAt.toISOString().split("T")[0])),
  ];

  return fechasUnicas.map((fechaString) => {
    const fecha = new Date(fechaString);

    return {
      fecha: fechaString,

      anio: fecha.getFullYear(),

      mes: fecha.getMonth() + 1,

      dia: fecha.getDate(),

      trimestre: Math.ceil((fecha.getMonth() + 1) / 3),
    };
  });
};

export const getDimUsuariosService =
async () => {

  const usuarios =
    await Usuario.find()
      .select(
        "_id nombreUsuario email roles activo createdAt"
      );

  return usuarios.map(
    (usuario) => ({

      id:
        usuario._id,

      nombreUsuario:
        usuario.nombreUsuario,

      email:
        usuario.email,

      rolPrincipal:
        usuario.roles?.[0] || "",

      cantidadRoles:
        usuario.roles?.length || 0,

      activo:
        usuario.activo,

      fechaRegistro:
        usuario.createdAt

    })
  );

};

export const getDimUbicacionesService =
async () => {

  const reportes =
    await Reporte.find()
      .select("ubicacion");

  const ubicacionesUnicas =
    new Map();

  reportes.forEach((reporte) => {

    const key =
      `${reporte.ubicacion?.barrio}-${reporte.ubicacion?.ciudad}-${reporte.ubicacion?.provincia}`;

    if (!ubicacionesUnicas.has(key)) {

      ubicacionesUnicas.set(
        key,
        {
          id:
            key,

          barrio:
            reporte.ubicacion?.barrio || "",

          ciudad:
            reporte.ubicacion?.ciudad || "",

          provincia:
            reporte.ubicacion?.provincia || "",

          pais:
            reporte.ubicacion?.pais || "",

          latitud:
            reporte.ubicacion?.lat || null,

          longitud:
            reporte.ubicacion?.lng || null
        }
      );

    }

  });

  return [
    ...ubicacionesUnicas.values()
  ];

};

export const getEstadisticasService =
async () => {

  const totalReportes =
    await Reporte.countDocuments();

  const abiertos =
    await Reporte.countDocuments({
      estado: "open"
    });

  const enProceso =
    await Reporte.countDocuments({
      estado: "in_progress"
    });

  const resueltos =
    await Reporte.countDocuments({
      estado: "resolved"
    });

  const rechazados =
    await Reporte.countDocuments({
      estado: "rejected"
    });

  const porcentajeResueltos =
    totalReportes > 0

      ? Number(
          (
            (resueltos * 100)
            / totalReportes
          ).toFixed(2)
        )

      : 0;

  const porCategoria =
    await Reporte.aggregate([

      {
        $group: {

          _id: "$categoria",

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

  const porPrioridad =
    await Reporte.aggregate([

      {
        $group: {

          _id: "$prioridad",

          cantidad: {
            $sum: 1
          }

        }
      }

    ]);

  const porEstado =
    await Reporte.aggregate([

      {
        $group: {

          _id: "$estado",

          cantidad: {
            $sum: 1
          }

        }
      }

    ]);

  const topBarrios =
    await Reporte.aggregate([

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
      },

      {
        $limit: 5
      }

    ]);

  const promedioResolucion =
    await Reporte.aggregate([

      {
        $match: {

          tiempoResolucionHoras: {
            $ne: null
          }

        }
      },

      {
        $group: {

          _id: null,

          promedio: {
            $avg: "$tiempoResolucionHoras"
          }

        }
      }

    ]);

  const reportesPorMes =
    await Reporte.aggregate([

      {
        $group: {

          _id: {

            anio: {
              $year: "$createdAt"
            },

            mes: {
              $month: "$createdAt"
            }

          },

          cantidad: {
            $sum: 1
          }

        }
      },

      {
        $sort: {

          "_id.anio": 1,

          "_id.mes": 1

        }
      }

    ]);

  const reportesPorUsuario =
    await Reporte.aggregate([

      {
        $group: {

          _id: "$usuarioId",

          cantidad: {
            $sum: 1
          }

        }
      },

      {
        $sort: {
          cantidad: -1
        }
      },

      {
        $limit: 10
      }

    ]);

  return {

    totalReportes,

    abiertos,

    enProceso,

    resueltos,

    rechazados,

    porcentajeResueltos,

    tiempoPromedioResolucionHoras:

      promedioResolucion.length > 0

        ? Number(
            promedioResolucion[0]
              .promedio
              .toFixed(2)
          )

        : 0,

    porCategoria,

    porPrioridad,

    porEstado,

    topBarrios,

    reportesPorMes,

    reportesPorUsuario

  };

};
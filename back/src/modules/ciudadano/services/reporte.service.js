import Reporte from "../models/Reporte.js";

import {
  classifyIncident,
  normalizeIncident,
  detectDuplicateIncident,
  prioritizeIncident
}
  from "../../../shared/services/ai.service.js";

/*
|------------------------------------------------------------------
| Calcular distancia entre Reportes
|------------------------------------------------------------------
*/

const calcularDistanciaMetros =
  (
    lat1,
    lng1,
    lat2,
    lng2
  ) => {

    const R = 6371000;

    const dLat =
      (lat2 - lat1)
      * Math.PI / 180;

    const dLng =
      (lng2 - lng1)
      * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) *
      Math.sin(dLat / 2)
      +
      Math.cos(lat1 * Math.PI / 180)
      *
      Math.cos(lat2 * Math.PI / 180)
      *
      Math.sin(dLng / 2)
      *
      Math.sin(dLng / 2);

    const c =
      2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;

  };

/*
|------------------------------------------------------------------
| Crear reporte
|------------------------------------------------------------------
*/

export const crearReporteService =
  async (datos) => {

    let categoriaIA = null;
    let scoreCategoriaIA = 0;
    let prioridadIA = "medium";
    let scorePrioridadIA = 0;

    let descripcionNormalizada = datos.descripcion;
    let tituloNormalizado = datos.titulo;
    let categoriaFinal = datos.categoria;

    try {

      descripcionNormalizada = await normalizeIncident(datos.descripcion);
      tituloNormalizado = await normalizeIncident(datos.titulo);

      const clasificacion = await classifyIncident(
        `${tituloNormalizado} ${descripcionNormalizada}`
      );

      categoriaIA = clasificacion.categoria;
      scoreCategoriaIA = clasificacion.confianza;

      if (categoriaIA && scoreCategoriaIA >= 0.8) {
        categoriaFinal = categoriaIA;
      }

      const prioridadCalculada = await prioritizeIncident({
        titulo: tituloNormalizado,
        descripcion: descripcionNormalizada,
        categoria: categoriaFinal,
      });

      prioridadIA = prioridadCalculada.prioridad;
      scorePrioridadIA = prioridadCalculada.confianza;

    } catch (error) {
      console.error("Error IA:", error.message);
    }

    /*
    |--------------------------------------------------------
    | Buscar reportes candidatos
    |--------------------------------------------------------
    */

    const reportesRecientes = await Reporte.find({
      esDuplicado: false,
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      estado: { $ne: "rejected" }
    });

    const candidatos = reportesRecientes.filter(reporte => {
      if (!reporte.ubicacion?.lat || !reporte.ubicacion?.lng) return false;
      if (!datos.ubicacion?.lat || !datos.ubicacion?.lng) return false;

      const distancia = calcularDistanciaMetros(
        datos.ubicacion.lat,
        datos.ubicacion.lng,
        reporte.ubicacion.lat,
        reporte.ubicacion.lng
      );

      return distancia <= 50;
    });

    /*
    |--------------------------------------------------------
    | Verificación IA de duplicados
    |--------------------------------------------------------
    */

    for (const candidato of candidatos) {
      try {

        // 👇 bloquear si es el mismo usuario
        if (candidato.usuarioId?.toString() === datos.usuarioId?.toString()) {
          return {
            duplicado: true,
            reporteOriginal: candidato._id,
            confianza: 1,
            mensaje: "Ya tenés un reporte similar en esta zona",
          };
        }

        if (
          candidato.categoriaIA &&
          categoriaIA &&
          candidato.categoriaIA !== categoriaIA
        ) {
          continue;
        }

        const resultado = await detectDuplicateIncident(
          {
            titulo: tituloNormalizado,
            descripcion: descripcionNormalizada,
            categoria: categoriaIA
          },
          {
            titulo: candidato.titulo,
            descripcion: candidato.descripcion,
            categoria: candidato.categoriaIA
          }
        );

        if (resultado.duplicado) {
          candidato.scoreDuplicadoIA = resultado.confianza || 0;

          const usuarioYaConfirmo = candidato.usuariosConfirmaron?.some(
            id => id.toString() === datos.usuarioId?.toString()
          );

          if (!usuarioYaConfirmo) {
            candidato.cantidadConfirmaciones += 1;
            candidato.usuariosConfirmaron.push(datos.usuarioId);
          }

          await candidato.save();

          return {
            duplicado: true,
            reporteOriginal: candidato._id,
            confianza: resultado.confianza || 0
          };
        }

      } catch (error) {
        console.error("Error verificando duplicado:", error.message);
      }
    }

    /*
    |--------------------------------------------------------
    | Crear reporte nuevo
    |--------------------------------------------------------
    */

    const nuevoReporte = new Reporte({
      ...datos,
      titulo: tituloNormalizado,
      descripcion: descripcionNormalizada,
      categoria: categoriaFinal,
      categoriaIA,
      scoreCategoriaIA,
      prioridad: prioridadIA,
      prioridadIA,
      scorePrioridadIA,
      esDuplicado: false,
      reporteDuplicadoDe: null,
      cantidadConfirmaciones: 1,
      usuariosConfirmaron: datos.usuarioId ? [datos.usuarioId] : [],
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
|------------------------------------------------------------------
| Mis reportes
|------------------------------------------------------------------
*/

export const obtenerMisReportesService =
  async (usuarioId) => {

    return await Reporte.find({
      usuarioId,
    }).sort({
      createdAt: -1,
    });

  };

/*
|------------------------------------------------------------------
| Obtener reporte por ID
|------------------------------------------------------------------
*/

export const obtenerReportePorIdService =
  async (id) => {

    return await Reporte.findById(id).populate("usuarioId", "nombreUsuario imagenPerfil roles");

  };

/*
|------------------------------------------------------------------
| Actualizar reporte
|------------------------------------------------------------------
*/

export const actualizarReporteService =
  async (id, datos) => {

    return await Reporte.findByIdAndUpdate(
      id,
      datos,
      { new: true }
    );

  };

/*
|------------------------------------------------------------------
| Eliminar reporte
|------------------------------------------------------------------
*/

export const eliminarReporteService =
  async (id) => {

    return await Reporte.findByIdAndDelete(id);

  };

/*
|------------------------------------------------------------------
| Reportes activos
|------------------------------------------------------------------
*/

export const obtenerMisReportesActivosService =
  async (usuarioId) => {

    return await Reporte.find({

      usuarioId,

      estado: {
        $in: [
          "open",
          "in_progress"
        ],
      },

    }).sort({
      createdAt: -1,
    });

  };

/*
|------------------------------------------------------------------
| Historial
|------------------------------------------------------------------
*/

export const obtenerHistorialService =
  async (usuarioId) => {

    return await Reporte.find({

      usuarioId,

      estado: {
        $in: [
          "resolved",
          "rejected"
        ],
      },

    }).sort({
      updatedAt: -1,
    });

  };

/*
|------------------------------------------------------------------
| Reportes públicos
|------------------------------------------------------------------
*/

export const obtenerReportesPublicosService =
  async () => {

    return await Reporte.find()
      .sort({
        createdAt: -1,
      });

  };
import Reporte
from "../../ciudadano/models/Reporte.js";

import {
  generateCityInsights
}
from "../../../shared/services/ai.service.js";

export const obtenerResumenCiudadService =
  async () => {

    const reportes =
      await Reporte.find();

    const totalReportes =
      reportes.length;

    const categorias = {};

    reportes.forEach(
      reporte => {

        const categoria =
          reporte.categoriaIA
          || reporte.categoria;

        categorias[categoria] =
          (categorias[categoria] || 0)
          + 1;

      }
    );

    const reportesCriticos =
      reportes.filter(
        r =>
          r.prioridad === "critical"
      ).length;

    const reportesAltos =
      reportes.filter(
        r =>
          r.prioridad === "high"
      ).length;

    const reportesDuplicados =
      reportes.filter(
        r =>
          r.esDuplicado
      ).length;

    const reportesResueltos =
      reportes.filter(
        r =>
          r.estado === "resolved"
      ).length;

    const reportesPendientes =
      reportes.filter(
        r =>
          r.estado !== "resolved"
      ).length;

    const estadisticas = {

      totalReportes,

      categorias,

      reportesCriticos,

      reportesAltos,

      reportesDuplicados,

      reportesResueltos,

      reportesPendientes

    };

    const resumenIA =
      await generateCityInsights(
        estadisticas
      );

    return {

      estadisticas,

      resumenIA

    };

  };
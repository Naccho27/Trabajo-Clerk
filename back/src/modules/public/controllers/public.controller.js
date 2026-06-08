import {
  getDashboardService,
  getFactReportesService,
  getDimCategoriasService,
  getDimEstadosService,
  getDimPrioridadesService,
  getDimFechasService,
  getEstadisticasService,
  getDimUsuariosService,
  getDimUbicacionesService,
} from "../services/public.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await getDashboardService();

    res.status(200).json({
      ok: true,

      dashboard,
    });
  } catch (error) {
    next(error);
  }
};

export const getFactReportes = async (req, res, next) => {
  try {
    const data = await getFactReportesService();

    res.status(200).json({
      ok: true,

      total: data.length,

      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getDimCategorias = async (req, res, next) => {
  try {
    const data = await getDimCategoriasService();

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getDimEstados = async (req, res, next) => {
  try {
    const data = await getDimEstadosService();

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getDimPrioridades = async (req, res, next) => {
  try {
    const data = await getDimPrioridadesService();

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getDimFechas = async (req, res, next) => {
  try {
    const data = await getDimFechasService();

    res.status(200).json({
      ok: true,

      total: data.length,

      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getEstadisticas = async (req, res, next) => {
  try {
    const data = await getEstadisticasService();

    res.status(200).json({
      ok: true,

      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getDimUsuarios =
async (req,res,next) => {

  try {

    const data =
      await getDimUsuariosService();

    res.status(200).json({
      ok:true,
      data
    });

  } catch(error){

    next(error);

  }

};

export const getDimUbicaciones =
async (req,res,next) => {

  try {

    const data =
      await getDimUbicacionesService();

    res.status(200).json({
      ok:true,
      data
    });

  } catch(error){

    next(error);

  }

};
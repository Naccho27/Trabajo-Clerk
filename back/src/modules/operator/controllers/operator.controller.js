import {
  addCommentService,
  addProgressService,
  getReportByIdService,
  getValidatedReportsService,
  getInProgressReportsService,
  getResolvedReportsService,
  resolveReportService,
  updateReportStatusService,
} from "../services/operator.service.js";

export const getValidatedReports = async (req, res, next) => {
  try {
    const reportes = await getValidatedReportsService();
    res.status(200).json({ ok: true, reportes });
  } catch (error) {
    next(error);
  }
};

export const getInProgressReports = async (req, res, next) => {
  try {
    const reportes = await getInProgressReportsService();
    res.status(200).json({ ok: true, reportes });
  } catch (error) {
    next(error);
  }
};

export const getResolvedReports = async (req, res, next) => {
  try {
    const reportes = await getResolvedReportsService();
    res.status(200).json({ ok: true, reportes });
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const data = await getReportByIdService(req.params.id);
    res.status(200).json({ ok: true, ...data });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const mongoId = req.user._id;
    const reporte = await updateReportStatusService(req.params.id, req.body.status, mongoId);
    res.status(200).json({ ok: true, reporte });
  } catch (error) {
    next(error);
  }
};

export const addProgress = async (req, res, next) => {
  try {
    const mongoId = req.user._id;
    const reporte = await addProgressService(req.params.id, req.body.descripcion, mongoId);
    res.status(200).json({ ok: true, reporte });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const mongoId = req.user._id;
    const comentario = await addCommentService(req.params.id, req.body.texto, mongoId);
    res.status(200).json({ ok: true, comentario });
  } catch (error) {
    next(error);
  }
};

export const resolveReport = async (req, res, next) => {
  try {
    const mongoId = req.user._id;
    const reporte = await resolveReportService(req.params.id, mongoId);
    res.status(200).json({ ok: true, reporte });
  } catch (error) {
    next(error);
  }
};
import {
  addCommentService,
  addProgressService,
  getReportByIdService,
  getValidatedReportsService,
  getInProgressReportsService, // 👈 nuevo
  getResolvedReportsService,   // 👈 nuevo
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

// 👈 nuevo
export const getInProgressReports = async (req, res, next) => {
  try {
    const reportes = await getInProgressReportsService();
    res.status(200).json({ ok: true, reportes });
  } catch (error) {
    next(error);
  }
};

// 👈 nuevo
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
    const reporte = await updateReportStatusService(
      req.params.id,
      req.body.status,
      "6a0a4f45d82a7c52ac02c2db"
    );
    res.status(200).json({ ok: true, reporte });
  } catch (error) {
    next(error);
  }
};

export const addProgress = async (req, res, next) => {
  try {
    const reporte = await addProgressService(
      req.params.id,
      req.body.descripcion,
      "6a0a4f45d82a7c52ac02c2db"
    );
    res.status(200).json({ ok: true, reporte });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const comentario = await addCommentService(
      req.params.id,
      req.body.texto,
      "6a0a4f45d82a7c52ac02c2db"
    );
    res.status(200).json({ ok: true, comentario });
  } catch (error) {
    next(error);
  }
};

export const resolveReport = async (req, res, next) => {
  try {
    const reporte = await resolveReportService(
      req.params.id,
      "6a0a4f45d82a7c52ac02c2db"
    );
    res.status(200).json({ ok: true, reporte });
  } catch (error) {
    next(error);
  }
};
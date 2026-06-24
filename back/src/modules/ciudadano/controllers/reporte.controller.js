import Usuario from "../models/Usuario.js";
import Comentario from "../models/Comentario.js"; // 👈 nuevo import

import {
  crearReporteService,
  obtenerMisReportesService,
  obtenerReportePorIdService,
  actualizarReporteService,
  eliminarReporteService,
  obtenerMisReportesActivosService,
  obtenerHistorialService,
  obtenerReportesPublicosService,
} from "../services/reporte.service.js";

import { subirArchivoCloudinary } from "../../../shared/utils/cloudinaryUpload.js";

/*
|--------------------------------------------------------------------------
| Crear reporte
|--------------------------------------------------------------------------
*/

export const crearReporte = async (req, res) => {
  try {
    console.log("ENTRO A CREAR REPORTE");
    console.log(req.body);
    console.log(req.files);

    const auth = req.auth();
    let usuario = null;

    if (auth?.userId) {
      usuario = await Usuario.findOne({ clerkId: auth.userId });
    }

    let imagenes = [];
    let videos = [];

    if (req.files && req.files.length > 0) {
      for (const archivo of req.files) {
        const resultado = await subirArchivoCloudinary(archivo, "urbanlog/reportes");
        if (resultado.resource_type === "video") {
          videos.push(resultado.url);
        } else {
          imagenes.push(resultado.url);
        }
      }
    }

    const nuevoReporte = await crearReporteService({
      ...req.body,
      imagenes,
      videos,
      usuarioId: usuario?._id || null,
      modoAnonimo: !usuario,
    });

        if (nuevoReporte.duplicado) {
      return res.status(200).json({
        ok: true,
        duplicado: true,
        reporteOriginal: nuevoReporte.reporteOriginal,
        confianza: nuevoReporte.confianza,
        mensaje: nuevoReporte.mensaje,
      });
    }
    
    res.status(201).json({ ok: true, reporte: nuevoReporte });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Públicos
|--------------------------------------------------------------------------
*/

export const obtenerReportesPublicos = async (req, res) => {
  try {
    const reportes = await obtenerReportesPublicosService();
    res.json({ ok: true, reportes });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Obtener por ID — 👇 ahora incluye comentarios
|--------------------------------------------------------------------------
*/

export const obtenerReportePorId = async (req, res) => {
  try {
    const reporte = await obtenerReportePorIdService(req.params.id);

    if (!reporte) {
      return res.status(404).json({ ok: false, mensaje: "Reporte no encontrado" });
    }

    // 👇 traer comentarios públicos del reporte
    const comentarios = await Comentario.find({ reporteId: req.params.id })
      .populate("usuarioId", "nombreUsuario imagenPerfil rol")
      .sort({ createdAt: 1 });

    res.json({ ok: true, reporte, comentarios });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Mis reportes
|--------------------------------------------------------------------------
*/

export const obtenerMisReportes = async (req, res) => {
  try {
    const auth = req.auth();
    const usuario = await Usuario.findOne({ clerkId: auth.userId });

    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    const reportes = await obtenerMisReportesService(usuario._id);
    res.json({ ok: true, reportes });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Reportes activos
|--------------------------------------------------------------------------
*/

export const obtenerMisReportesActivos = async (req, res) => {
  try {
    const auth = req.auth();
    const usuario = await Usuario.findOne({ clerkId: auth.userId });

    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    const reportes = await obtenerMisReportesActivosService(usuario._id);
    res.json({ ok: true, reportes });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Historial
|--------------------------------------------------------------------------
*/

export const obtenerHistorial = async (req, res) => {
  try {
    const auth = req.auth();
    const usuario = await Usuario.findOne({ clerkId: auth.userId });

    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    const historial = await obtenerHistorialService(usuario._id);
    res.json({ ok: true, historial });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Actualizar
|--------------------------------------------------------------------------
*/

export const actualizarReporte = async (req, res) => {
  try {
    const auth = req.auth();
    const usuario = await Usuario.findOne({ clerkId: auth.userId });
    const reporte = await obtenerReportePorIdService(req.params.id);

    if (!reporte) {
      return res.status(404).json({ ok: false, mensaje: "Reporte no encontrado" });
    }

    if (reporte.usuarioId?._id?.toString() !== usuario._id.toString()) {
      return res.status(403).json({ ok: false, mensaje: "No autorizado" });
    }

    if (reporte.estado !== "open") {
      return res.status(400).json({ ok: false, mensaje: "Solo se pueden editar reportes pendientes" });
    }

    let imagenesExistentes = [];
    if (req.body.imagenesExistentes) {
      imagenesExistentes = Array.isArray(req.body.imagenesExistentes)
        ? req.body.imagenesExistentes
        : [req.body.imagenesExistentes];
    }

    let imagenesNuevas = [];
    if (req.files && req.files.length > 0) {
      for (const archivo of req.files) {
        const resultado = await subirArchivoCloudinary(archivo, "urbanlog/reportes");
        if (resultado.resource_type !== "video") {
          imagenesNuevas.push(resultado.url);
        }
      }
    }

    const imagenes = [...imagenesExistentes, ...imagenesNuevas];

    const actualizado = await actualizarReporteService(req.params.id, {
      titulo: req.body.titulo,
      categoria: req.body.categoria,
      descripcion: req.body.descripcion,
      imagenes,
    });

    res.json({ ok: true, reporte: actualizado });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Eliminar
|--------------------------------------------------------------------------
*/

export const eliminarReporte = async (req, res) => {
  try {
    const auth = req.auth();
    const usuario = await Usuario.findOne({ clerkId: auth.userId });
    const reporte = await obtenerReportePorIdService(req.params.id);

    if (!reporte) {
      return res.status(404).json({ ok: false, mensaje: "Reporte no encontrado" });
    }

    if (reporte.usuarioId?._id?.toString() !== usuario._id.toString()) {
      return res.status(403).json({ ok: false, mensaje: "No autorizado" });
    }

    if (reporte.estado !== "open") {
      return res.status(400).json({ ok: false, mensaje: "Solo se pueden eliminar reportes pendientes" });
    }

    await eliminarReporteService(req.params.id);
    res.json({ ok: true, mensaje: "Reporte eliminado" });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};
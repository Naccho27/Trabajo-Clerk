import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";

const API_URL = import.meta.env.VITE_API_URL;

const ESTADO_BADGE = {
  validated:   { bg: "bg-purple-100", text: "text-purple-800", label: "Validado" },
  in_progress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En progreso" },
  resolved:    { bg: "bg-green-100",  text: "text-green-800",  label: "Resuelto" },
  rejected:    { bg: "bg-red-100",    text: "text-red-700",    label: "Rechazado" },
};

const PRIORIDAD_BADGE = {
  low:      { bg: "bg-gray-100",   text: "text-gray-600",   label: "Baja" },
  medium:   { bg: "bg-blue-100",   text: "text-blue-800",   label: "Media" },
  high:     { bg: "bg-amber-100",  text: "text-amber-800",  label: "Alta" },
  critical: { bg: "bg-red-100",    text: "text-red-700",    label: "Crítica" },
};

function Badge({ config }) {
  if (!config) return null;
  return (
    <span className={`${config.bg} ${config.text} text-xs font-medium px-3 py-1 rounded-full`}>
      {config.label}
    </span>
  );
}

export default function OperadorReporteDetail({ reporte, onClose, onActualizar }) {
  const [comentario, setComentario]           = useState("");
  const [loadingComentario, setLoadingComentario] = useState(false);
  const [loadingEstado, setLoadingEstado]     = useState(false);
  const [loadingResolver, setLoadingResolver] = useState(false);
  const [error, setError]                     = useState("");
  const [closing, setClosing]                 = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    setLoadingEstado(true);
    setError("");
    try {
      await axios.patch(
        `${API_URL}/operator/reportes/${reporte._id}/status`,
        { status: nuevoEstado }
      );
      onActualizar();
      handleClose();
    } catch (err) {
      setError("Error al cambiar estado");
      console.error(err);
    } finally {
      setLoadingEstado(false);
    }
  };

  const handleAgregarComentario = async () => {
    if (!comentario.trim()) return;
    setLoadingComentario(true);
    setError("");
    try {
      await axios.patch(
        `${API_URL}/operator/reportes/${reporte._id}/comentario`,
        { texto: comentario }
      );
      setComentario("");
      onActualizar();
    } catch (err) {
      setError("Error al agregar comentario");
      console.error(err);
    } finally {
      setLoadingComentario(false);
    }
  };

  const handleResolver = async () => {
    setLoadingResolver(true);
    setError("");
    try {
      await axios.patch(`${API_URL}/operator/reportes/${reporte._id}/resolver`);
      onActualizar();
      handleClose();
    } catch (err) {
      setError("Error al resolver reporte");
      console.error(err);
    } finally {
      setLoadingResolver(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] bg-black/40 flex items-center justify-center px-4"
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-3xl p-6 pb-8 w-full max-w-md max-h-[85vh] overflow-y-auto ${closing ? "slide-down" : "slide-up"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={icons[reporte.categoria]} className="w-9 h-9" alt={reporte.categoria} />
            <div>
              <p className="text-xs text-gray-400 capitalize">{reporte.categoria}</p>
              <p className="text-base font-semibold text-gray-800">{reporte.titulo}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        {/* Ubicación */}
        <p className="text-xs text-gray-400 mb-3">
          📍 {reporte.ubicacion?.direccion}
          {reporte.ubicacion?.ciudad &&
            reporte.ubicacion.ciudad !== reporte.ubicacion.direccion
            ? `, ${reporte.ubicacion.ciudad}`
            : ""}
        </p>

        {/* Badges */}
        <div className="flex gap-2 mb-4">
          <Badge config={PRIORIDAD_BADGE[reporte.prioridad]} />
          <Badge config={ESTADO_BADGE[reporte.estado]} />
        </div>

        <hr className="mb-4" />

        {/* Descripción */}
        <p className="text-xs text-gray-400 font-medium mb-1">Descripción</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{reporte.descripcion}</p>

        {/* Imágenes */}
        {reporte.imagenes?.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-medium mb-2">Fotos</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {reporte.imagenes.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`foto-${i + 1}`}
                  className="w-full h-28 object-cover rounded-xl border border-gray-100"
                />
              ))}
            </div>
          </>
        )}

        <hr className="mb-4" />

        {/* Acciones — solo si no está resuelto ni rechazado */}
        {reporte.estado !== "resolved" && reporte.estado !== "rejected" && (
          <>
            {/* Poner en progreso */}
            {reporte.estado === "validated" && (
              <>
                <p className="text-xs text-gray-400 font-medium mb-2">Cambiar estado</p>
                <button
                  onClick={() => handleCambiarEstado("in_progress")}
                  disabled={loadingEstado}
                  className="w-full py-2 rounded-full text-xs font-semibold border border-yellow-300 text-yellow-700 hover:bg-yellow-50 disabled:opacity-60 mb-4"
                >
                  {loadingEstado ? "..." : "Poner en progreso"}
                </button>
              </>
            )}

            {/* Comentar */}
            <p className="text-xs text-gray-400 font-medium mb-2">Comentar</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribí un comentario público..."
                className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm outline-none focus:border-blue-400"
              />
              <button
                onClick={handleAgregarComentario}
                disabled={loadingComentario}
                className="px-3 py-1.5 rounded-full text-white text-xs font-semibold disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
              >
                {loadingComentario ? "..." : "Enviar"}
              </button>
            </div>

            {/* Rechazar */}
            <button
              onClick={() => handleCambiarEstado("rejected")}
              disabled={loadingEstado}
              className="w-full py-2 rounded-full text-red-500 font-semibold border border-red-300 hover:bg-red-50 disabled:opacity-60 mb-2"
            >
              {loadingEstado ? "..." : "Rechazar reporte"}
            </button>

            {/* Resolver — solo si está en progreso */}
            {reporte.estado === "in_progress" && (
              <button
                onClick={handleResolver}
                disabled={loadingResolver}
                className="w-full py-2 rounded-full text-white font-semibold disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
              >
                {loadingResolver ? "Resolviendo..." : "Marcar como Resuelto"}
              </button>
            )}
          </>
        )}

        {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
      </div>
    </div>,
    document.body
  );
}
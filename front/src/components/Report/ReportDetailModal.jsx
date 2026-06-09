import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";
import ProfileModal from "../Profile/ProfileModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const PRIORIDAD_BADGE = {
  low:      { bg: "bg-gray-100",   text: "text-gray-600",   label: "Baja" },
  medium:   { bg: "bg-blue-100",   text: "text-blue-800",   label: "Media" },
  high:     { bg: "bg-amber-100",  text: "text-amber-800",  label: "Alta" },
  critical: { bg: "bg-red-100",    text: "text-red-700",    label: "Crítica" },
};

const ESTADO_BADGE = {
  open:        { bg: "bg-gray-100",   text: "text-gray-600",   label: "Pendiente" },
  in_progress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En progreso" },
  resolved:    { bg: "bg-green-100",  text: "text-green-800",  label: "Resuelto" },
  rejected:    { bg: "bg-red-100",    text: "text-red-700",    label: "Rechazado" },
};

function Badge({ config }) {
  if (!config) return null;
  return (
    <span className={`${config.bg} ${config.text} text-xs font-medium px-3 py-1 rounded-full`}>
      {config.label}
    </span>
  );
}

export default function ReportDetailModal({ reporteId, onClose }) {
  const { getToken } = useAuth();
  const [reporte, setReporte] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [showAutorPerfil, setShowAutorPerfil] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = await getToken({ template: "backend" });
        const { data } = await axios.get(`${API_URL}/reportes/${reporteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReporte(data.reporte ?? data);
        setComentarios(data.comentarios || []);
      } catch (err) {
        console.error("Error cargando reporte:", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [reporteId]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] bg-black/40 flex items-center justify-center px-4"
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-3xl p-6 pb-8 w-full max-w-md max-h-[80vh] overflow-y-auto ${closing ? "slide-down" : "slide-up"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-gray-400">Cargando reporte...</p>
          </div>
        ) : !reporte ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-red-400">No se pudo cargar el reporte.</p>
          </div>
        ) : (
          <>
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
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400">Latitud</p>
                <p className="text-sm font-medium text-gray-700">
                  {reporte.ubicacion?.lat?.toFixed(5)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400">Longitud</p>
                <p className="text-sm font-medium text-gray-700">
                  {reporte.ubicacion?.lng?.toFixed(5)}
                </p>
              </div>
            </div>

            {/* Dirección */}
            {reporte.ubicacion?.direccion && (
              <p className="text-xs text-gray-400 mb-4">
                📍 {reporte.ubicacion.direccion}
                {reporte.ubicacion.ciudad &&
                  reporte.ubicacion.ciudad !== reporte.ubicacion.direccion
                  ? `, ${reporte.ubicacion.ciudad}`
                  : ""}
              </p>
            )}

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <Badge config={PRIORIDAD_BADGE[reporte.prioridad]} />
              <Badge config={ESTADO_BADGE[reporte.estado]} />
            </div>

            <hr className="mb-4" />

            {/* Descripción */}
            <p className="text-xs text-gray-400 font-medium mb-1">Descripción</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {reporte.descripcion}
            </p>

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

            {/* Videos */}
            {reporte.videos?.length > 0 && (
              <>
                <p className="text-xs text-gray-400 font-medium mb-2">Videos</p>
                <div className="flex flex-col gap-2 mb-4">
                  {reporte.videos.map((url, i) => (
                    <video
                      key={i}
                      src={url}
                      controls
                      className="w-full rounded-xl border border-gray-100"
                      style={{ maxHeight: "200px" }}
                    />
                  ))}
                </div>
              </>
            )}

            <hr className="mb-4" />

            {/* Autor */}
            {reporte.modoAnonimo || !reporte.usuarioId ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Anónimo</p>
                  <p className="text-xs text-gray-400">
                    {new Date(reporte.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {reporte.usuarioId.imagenPerfil ? (
                    <img src={reporte.usuarioId.imagenPerfil} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                      {reporte.usuarioId.nombreUsuario?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">{reporte.usuarioId.nombreUsuario}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {reporte.usuarioId.rol} ·{" "}
                      {new Date(reporte.createdAt).toLocaleDateString("es-AR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAutorPerfil(true)}
                  className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 hover:bg-gray-50"
                >
                  Ver perfil
                </button>
              </div>
            )}

            {/* Comentarios del operador */}
            {comentarios.length > 0 && (
              <>
                <hr className="mb-4 mt-4" />
                <p className="text-xs text-gray-400 font-medium mb-3">Comentarios</p>
                <div className="flex flex-col gap-3">
                  {comentarios.map((c, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                          {c.usuarioId?.nombreUsuario?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <p className="text-xs font-medium text-gray-700">
                          {c.usuarioId?.nombreUsuario ?? "Operador"}
                        </p>
                        <p className="text-xs text-gray-400 ml-auto">
                          {new Date(c.createdAt).toLocaleDateString("es-AR", {
                            day: "numeric", month: "short",
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{c.mensaje}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {showAutorPerfil && reporte.usuarioId && (
              <ProfileModal
                usuarioExterno={reporte.usuarioId}
                onClose={() => setShowAutorPerfil(false)}
              />
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
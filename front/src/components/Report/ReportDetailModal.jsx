import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";
import { useCategorias } from "../../context/CategoriasContext.jsx";
import ProfileModal from "../Profile/ProfileModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const PRIORIDAD_BADGE = {
  low:      { bg: "bg-gray-100 dark:bg-gray-700",   text: "text-gray-600 dark:text-gray-300",   label: "Baja" },
  medium:   { bg: "bg-blue-100 dark:bg-blue-900",   text: "text-blue-800 dark:text-blue-200",   label: "Media" },
  high:     { bg: "bg-amber-100 dark:bg-amber-900", text: "text-amber-800 dark:text-amber-200", label: "Alta" },
  critical: { bg: "bg-red-100 dark:bg-red-900",     text: "text-red-700 dark:text-red-300",     label: "Crítica" },
};

const ESTADO_BADGE = {
  open:        { bg: "bg-gray-100 dark:bg-gray-700",     text: "text-gray-600 dark:text-gray-300",     label: "Pendiente" },
  in_progress: { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-800 dark:text-yellow-200", label: "En progreso" },
  resolved:    { bg: "bg-green-100 dark:bg-green-900",   text: "text-green-800 dark:text-green-200",   label: "Resuelto" },
  rejected:    { bg: "bg-red-100 dark:bg-red-900",       text: "text-red-700 dark:text-red-300",       label: "Rechazado" },
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
  const { categorias } = useCategorias();
  const [reporte, setReporte] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [showAutorPerfil, setShowAutorPerfil] = useState(false);

  const getIconoCategoria = (nombre) =>
    categorias.find(c => c.nombre === nombre)?.imagen || icons[nombre] || icons.todos;

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
        className={`bg-white dark:bg-gray-900 rounded-3xl p-6 pb-8 w-full max-w-md max-h-[80vh] overflow-y-auto ${closing ? "slide-down" : "slide-up"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-gray-400 dark:text-gray-500">Cargando reporte...</p>
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
                <img src={getIconoCategoria(reporte.categoria)} className="w-9 h-9" alt={reporte.categoria} />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{reporte.categoria}</p>
                  <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{reporte.titulo}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400 dark:text-gray-500">Latitud</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {reporte.ubicacion?.lat?.toFixed(5)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400 dark:text-gray-500">Longitud</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {reporte.ubicacion?.lng?.toFixed(5)}
                </p>
              </div>
            </div>

            {/* Dirección */}
            {reporte.ubicacion?.direccion && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                📍 {reporte.ubicacion.direccion}
                {reporte.ubicacion.ciudad &&
                  reporte.ubicacion.ciudad !== reporte.ubicacion.direccion
                  ? `, ${reporte.ubicacion.ciudad}`
                  : ""}
              </p>
            )}

            {/* Badges */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <Badge config={PRIORIDAD_BADGE[reporte.prioridad]} />
              <Badge config={ESTADO_BADGE[reporte.estado]} />
            </div>

            {/* Confirmaciones */}
            {reporte.cantidadConfirmaciones > 1 && (
              <div className="mb-3">
                <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 text-xs font-medium px-3 py-1 rounded-full">
                  {reporte.cantidadConfirmaciones} personas confirmaron este problema
                </span>
              </div>
            )}

            {reporte.categoriaIA && reporte.categoriaIA !== reporte.categoria && (
              <div className="mb-4"></div>
            )}

            <hr className="mb-4 dark:border-gray-700" />

            {/* Descripción */}
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">Descripción</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {reporte.descripcion}
            </p>

            {/* Imágenes */}
            {reporte.imagenes?.length > 0 && (
              <>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-2">Fotos</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {reporte.imagenes.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`foto-${i + 1}`}
                      className="w-full h-28 object-cover rounded-xl border border-gray-100 dark:border-gray-700"
                    />
                  ))}
                </div>
              </>
            )}

            {/* Videos */}
            {reporte.videos?.length > 0 && (
              <>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-2">Videos</p>
                <div className="flex flex-col gap-2 mb-4">
                  {reporte.videos.map((url, i) => (
                    <video
                      key={i}
                      src={url}
                      controls
                      className="w-full rounded-xl border border-gray-100 dark:border-gray-700"
                      style={{ maxHeight: "200px" }}
                    />
                  ))}
                </div>
              </>
            )}

            <hr className="mb-4 dark:border-gray-700" />

            {/* Autor */}
            {reporte.modoAnonimo || !reporte.usuarioId ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Anónimo</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
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
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-300">
                      {reporte.usuarioId.nombreUsuario?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{reporte.usuarioId.nombreUsuario}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                      {reporte.usuarioId.rol} ·{" "}
                      {new Date(reporte.createdAt).toLocaleDateString("es-AR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAutorPerfil(true)}
                  className="text-xs border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Ver perfil
                </button>
              </div>
            )}

            {/* Comentarios */}
            {comentarios.length > 0 && (
              <>
                <hr className="mb-4 mt-4 dark:border-gray-700" />
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-3">Comentarios</p>
                <div className="flex flex-col gap-3">
                  {comentarios.map((c, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        {c.usuarioId?.imagenPerfil ? (
                          <img
                            src={c.usuarioId.imagenPerfil}
                            className="w-6 h-6 rounded-full object-cover"
                            alt={c.usuarioId.nombreUsuario}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-300">
                            {c.usuarioId?.nombreUsuario?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {c.usuarioId?.nombreUsuario ?? "Operador"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                          {new Date(c.createdAt).toLocaleDateString("es-AR", {
                            day: "numeric", month: "short",
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{c.mensaje}</p>
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
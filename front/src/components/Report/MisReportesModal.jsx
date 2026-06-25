import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";
import { useCategorias } from "../../context/CategoriasContext.jsx";
import ReportDetailModal from "../Report/ReportDetailModal.jsx";
import EditReportModal from "../Report/EditReportModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const ESTADO_BADGE = {
  open:        { bg: "bg-gray-100",   text: "text-gray-600",   label: "Pendiente" },
  in_progress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En progreso" },
};

export default function MisReportesModal({ onClose }) {
  const { getToken } = useAuth();
  const { categorias } = useCategorias();
  const [reportes, setReportes]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [closing, setClosing]               = useState(false);
  const [selectedReporteId, setSelectedReporteId] = useState(null);
  const [editReporte, setEditReporte]       = useState(null);
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [eliminando, setEliminando]         = useState(false);

  const getIcono = (nombre) => {
    const cat = categorias.find(c => c.nombre === nombre);
    return cat?.imagen || icons[nombre] || icons.todos;
  };

  const cargar = async () => {
    try {
      const token = await getToken({ template: "backend" });
      const { data } = await axios.get(`${API_URL}/reportes/activos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportes(data.reportes || []);
    } catch (err) {
      console.error("Error cargando reportes activos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleEliminar = async (id) => {
    setEliminando(true);
    try {
      const token = await getToken({ template: "backend" });
      await axios.delete(`${API_URL}/reportes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfirmEliminar(null);
      cargar();
    } catch (err) {
      console.error("Error eliminando reporte:", err);
    } finally {
      setEliminando(false);
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  return (
    <div className="fixed inset-0 z-[1001] bg-black/40" onClick={handleClose}>
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-t-3xl p-6 pb-20 max-h-[85vh] overflow-y-auto w-full max-w-2xl ${closing ? "slide-down" : "slide-up"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-blue-500 font-semibold">Activos</p>
            <p className="text-lg font-bold">Mis Reportes</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <hr className="mb-4" />

        {loading ? (
          <p className="text-sm text-gray-400 text-center">Cargando...</p>
        ) : reportes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">No tenés reportes activos</p>
        ) : (
          <div className="flex flex-col gap-1">
            {reportes.map((reporte) => {
              const badge = ESTADO_BADGE[reporte.estado];
              const esPendiente = reporte.estado === "open";
              return (
                <div key={reporte._id} className="flex flex-col py-2 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={getIcono(reporte.categoria)} className="w-8 h-8" alt={reporte.categoria} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{reporte.titulo}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {badge && (
                            <span className={`${badge.bg} ${badge.text} text-xs px-2 py-0.5 rounded-full`}>
                              {badge.label}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(reporte.createdAt).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReporteId(reporte._id)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs"
                    >
                      →
                    </button>
                  </div>

                  {esPendiente && (
                    <div className="flex gap-2 mt-2 ml-11">
                      <button
                        onClick={() => setEditReporte(reporte)}
                        className="text-xs border border-blue-200 text-blue-500 rounded-full px-3 py-1 hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmEliminar(reporte._id)}
                        className="text-xs border border-red-200 text-red-400 rounded-full px-3 py-1 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {confirmEliminar && (
          <div className="fixed inset-0 z-[1004] bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <p className="text-base font-semibold text-gray-800 mb-2">¿Eliminar reporte?</p>
              <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmEliminar(null)}
                  className="flex-1 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEliminar(confirmEliminar)}
                  disabled={eliminando}
                  className="flex-1 py-2 rounded-full text-white text-sm font-semibold disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
                >
                  {eliminando ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedReporteId && (
          <ReportDetailModal
            reporteId={selectedReporteId}
            onClose={() => setSelectedReporteId(null)}
          />
        )}

        {editReporte && (
          <EditReportModal
            reporte={editReporte}
            onClose={() => setEditReporte(null)}
            onSuccess={() => { setEditReporte(null); cargar(); }}
          />
        )}
      </div>
    </div>
  );
}
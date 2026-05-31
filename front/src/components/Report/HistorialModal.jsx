import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";
import ReportDetailModal from "../Report/ReportDetailModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

// reemplazá el objeto ESTADO_BADGE
const ESTADO_BADGE = {
  open:        { bg: "bg-gray-100",   text: "text-gray-600",   label: "Pendiente" },
  in_progress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En progreso" },
  resolved:    { bg: "bg-green-100",  text: "text-green-800",  label: "Resuelto" },
  rejected:    { bg: "bg-red-100",    text: "text-red-700",    label: "Rechazado" },
};

export default function HistorialModal({ onClose }) {
  const { getToken } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [selectedReporteId, setSelectedReporteId] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = await getToken({ template: "backend" });
        const { data } = await axios.get(`${API_URL}/reportes/historial`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportes(data.historial || []);
      } catch (err) {
        console.error("Error cargando historial:", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

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
            <p className="text-xs text-gray-400 font-semibold">Concluidos</p>
            <p className="text-lg font-bold">Historial</p>
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
          <p className="text-sm text-gray-400 text-center">No tenés reportes concluidos</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reportes.map((reporte) => {
              const badge = ESTADO_BADGE[reporte.estado];
              return (
                <div
                  key={reporte._id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <img src={icons[reporte.categoria]} className="w-8 h-8" alt={reporte.categoria} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{reporte.titulo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {badge && (
                          <span className={`${badge.bg} ${badge.text} text-xs px-2 py-0.5 rounded-full`}>
                            {badge.label}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(reporte.updatedAt).toLocaleDateString("es-AR")}
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
              );
            })}
          </div>
        )}

        {selectedReporteId && (
          <ReportDetailModal
            reporteId={selectedReporteId}
            onClose={() => setSelectedReporteId(null)}
          />
        )}
      </div>
    </div>
  );
}
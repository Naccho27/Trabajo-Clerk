import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import Header from "../components/Navbar/Header";
import OperadorReporteCard from "../components/Report/OperadorReporteCard.jsx";
import OperadorReporteDetail from "../components/Report/OperadorReporteDetail.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const TABS = [
  { id: "en_progreso", label: "En progreso" },
  { id: "historial",   label: "Historial" },
];

export default function OperadorPage() {
  const { getToken } = useAuth();
  const [tabActiva, setTabActiva] = useState("en_progreso");
  const [validados, setValidados]   = useState([]);
  const [enProgreso, setEnProgreso] = useState([]);
  const [historial, setHistorial]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedReporte, setSelectedReporte] = useState(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const token = await getToken({ template: "backend" });
      const headers = { Authorization: `Bearer ${token}` };

      const [resVal, resProg, resHist] = await Promise.all([
        axios.get(`${API_URL}/operator/reportes`, { headers }),
        axios.get(`${API_URL}/operator/reportes/en-progreso`, { headers }),
        axios.get(`${API_URL}/operator/reportes/historial`, { headers }),
      ]);

      setValidados(resVal.data.reportes   || []);
      setEnProgreso(resProg.data.reportes || []);
      setHistorial(resHist.data.reportes  || []);
    } catch (err) {
      console.error("Error cargando reportes operador:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const reportesActivos =
    tabActiva === "en_progreso"
      ? [...validados, ...enProgreso]
      : historial;

  const countEnProgreso = validados.length + enProgreso.length;

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto pt-16 px-4 pb-6">

        <div className="flex items-center justify-center my-4">
          <span
            className="text-sm font-semibold px-5 py-1.5 rounded-full text-white"
            style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
          >
            Incidentes validados
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          {TABS.map((tab) => {
            const count =
              tab.id === "en_progreso" ? countEnProgreso :
              tab.id === "historial"   ? historial.length : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`flex-1 py-2 rounded-full text-xs font-semibold border transition-all ${
                  tabActiva === tab.id
                    ? "text-white border-transparent"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
                style={tabActiva === tab.id
                  ? { background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }
                  : {}
                }
              >
                {tab.label}{count > 0 && ` (${count})`}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-gray-400">Cargando incidentes...</p>
          </div>
        ) : reportesActivos.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-gray-400">No hay incidentes en esta sección</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reportesActivos.map((reporte) => (
              <OperadorReporteCard
                key={reporte._id}
                reporte={reporte}
                onClick={() => setSelectedReporte(reporte)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedReporte && (
        <OperadorReporteDetail
          reporte={selectedReporte}
          onClose={() => setSelectedReporte(null)}
          onActualizar={() => {
            setSelectedReporte(null);
            cargar();
          }}
        />
      )}
    </div>
  );
}
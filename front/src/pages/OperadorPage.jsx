import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import ReporteCard from "../components/Report/ReporteCard.jsx";
import OperadorReporteDetail from "../components/Report/OperadorReporteDetail.jsx";
import PanelLayout from "../components/Panel/PanelLayout.jsx";
import DashboardSaludo from "../components/Panel/DashboardSaludo.jsx";
import BarrasCategoria from "../components/Panel/BarrasCategoria.jsx";
import StatCard from "../components/Panel/StatCard.jsx";
import ActividadReciente from "../components/Panel/ActividadReciente.jsx";
import BuscadorInput from "../components/Panel/BuscadorInput.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const ESTADO_CONFIG = {
  in_progress: { label: "En progreso", color: "#BA7517" },
  resolved:    { label: "Resuelto",    color: "#378ADD" },
  rejected:    { label: "Rechazado",   color: "#E24B4A" },
};

function Dashboard({ enProgreso, historial, user }) {
  const resueltos  = historial.filter(r => r.estado === "resolved");
  const rechazados = historial.filter(r => r.estado === "rejected");

  const statCards = [
    { label: "En progreso", value: enProgreso.length, color: "#BA7517", bg: "#BA751715", delay: "0ms" },
    { label: "Resueltos",   value: resueltos.length,  color: "#378ADD", bg: "#378ADD15", delay: "100ms" },
    { label: "Rechazados",  value: rechazados.length, color: "#E24B4A", bg: "#E24B4A15", delay: "200ms" },
  ];

  const ultimosReportes = [...enProgreso, ...resueltos, ...rechazados]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <DashboardSaludo user={user} rol="Operador" />
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarrasCategoria
          reportes={[...enProgreso, ...historial]}
          titulo="Reportes por categoría"
          delay="300ms"
        />
        <ActividadReciente
          reportes={ultimosReportes}
          estadoConfig={ESTADO_CONFIG}
          delay="400ms"
        />
      </div>
    </div>
  );
}

export default function OperadorPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [validados, setValidados]     = useState([]);
  const [enProgreso, setEnProgreso]   = useState([]);
  const [historial, setHistorial]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [busqueda, setBusqueda]       = useState("");
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

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

  const handleVerDetalle = async (reporteId) => {
    setLoadingDetalle(true);
    try {
      const token = await getToken({ template: "backend" });
      const { data } = await axios.get(
        `${API_URL}/operator/reportes/${reporteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedReporte(data.reporte);
      setComentarios(data.comentarios || []);
    } catch (err) {
      console.error("Error al cargar detalle:", err);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleCerrar = () => { setSelectedReporte(null); setComentarios([]); };

  const handleActualizar = async () => {
    if (selectedReporte) await handleVerDetalle(selectedReporte._id);
    cargar();
  };

  const handleVistaChange = (id) => {
    setBusqueda("");
    setVistaActiva(id);
  };

  useEffect(() => { cargar(); }, []);

  const countEnProgreso = validados.length + enProgreso.length;

  const reportesLista = vistaActiva === "en_progreso"
    ? [...validados, ...enProgreso]
    : historial;

  const reportesFiltrados = reportesLista.filter((r) =>
    r.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const sidebarItems = [
    { id: "dashboard",   label: "Dashboard",   count: 0 },
    { id: "en_progreso", label: "En progreso", count: countEnProgreso },
    { id: "historial",   label: "Historial",   count: historial.length },
  ];

  return (
    <>
      <PanelLayout
        sidebarTitle="Panel Operador"
        sidebarItems={sidebarItems}
        vistaActiva={vistaActiva}
        onVistaChange={handleVistaChange}
        loading={loading}
      >
        {vistaActiva === "dashboard" ? (
          <Dashboard enProgreso={enProgreso} historial={historial} user={user} />
        ) : (
          <div className="flex flex-col gap-3">
            <BuscadorInput
              value={busqueda}
              onChange={setBusqueda}
              placeholder="Buscar incidente..."
            />
            {reportesFiltrados.length === 0 ? (
              <div className="flex items-center justify-center h-40"
                style={{ animation: "fadeInUp 0.4s ease-out" }}>
                <p className="text-sm text-gray-400">No hay incidentes en esta sección</p>
              </div>
            ) : reportesFiltrados.map((reporte, i) => (
              <ReporteCard
                key={reporte._id}
                reporte={reporte}
                onClick={() => handleVerDetalle(reporte._id)}
                mostrarEstado={vistaActiva === "historial"}
                delay={`${i * 60}ms`}
              />
            ))}
          </div>
        )}
      </PanelLayout>

      {loadingDetalle && (
        <div className="fixed inset-0 z-[1002] bg-black/20 flex items-center justify-center">
          <p className="text-white text-sm font-medium">Cargando...</p>
        </div>
      )}

      {selectedReporte && (
        <OperadorReporteDetail
          reporte={selectedReporte}
          comentarios={comentarios}
          onClose={handleCerrar}
          onActualizar={handleActualizar}
        />
      )}
    </>
  );
}
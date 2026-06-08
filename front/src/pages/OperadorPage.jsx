import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import Header from "../components/Navbar/Header";
import OperadorReporteCard from "../components/Report/OperadorReporteCard.jsx";
import OperadorReporteDetail from "../components/Report/OperadorReporteDetail.jsx";
import { icons } from "../assets/icons/icons.js";

const API_URL = import.meta.env.VITE_API_URL;

const CATEGORIA_COLORS = {
  baches:     "#378ADD",
  residuos:   "#639922",
  alumbrado:  "#BA7517",
  semaforo:   "#7F77DD",
  inundacion: "#D4537E",
};

const CATEGORIAS = ["baches", "residuos", "alumbrado", "semaforo", "inundacion"];
const CATEGORIA_LABELS = {
  baches: "Baches", residuos: "Residuos", alumbrado: "Alumbrado",
  semaforo: "Semáforo", inundacion: "Inundación",
};

const SIDEBAR_ITEMS = [
  { id: "dashboard",   label: "Dashboard" },
  { id: "en_progreso", label: "En progreso" },
  { id: "historial",   label: "Historial" },
];

function Dashboard({ enProgreso, historial, user }) {
  const resueltos  = historial.filter(r => r.estado === "resolved");
  const rechazados = historial.filter(r => r.estado === "rejected");
  const todos = [...enProgreso, ...historial];

  const dataCategoria = CATEGORIAS.map(cat => ({
    name: cat, label: CATEGORIA_LABELS[cat],
    total: todos.filter(r => r.categoria === cat).length,
  }));
  const maxCategoria = Math.max(...dataCategoria.map(d => d.total), 1);

  const ultimosReportes = [...enProgreso, ...resueltos, ...rechazados]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  const estadoConfig = {
    in_progress: { label: "En progreso", color: "#BA7517" },
    resolved:    { label: "Resuelto",    color: "#378ADD" },
    rejected:    { label: "Rechazado",   color: "#E24B4A" },
  };

  const statCards = [
    { label: "En progreso", value: enProgreso.length, color: "#BA7517", bg: "#BA751715", delay: "0ms" },
    { label: "Resueltos",   value: resueltos.length,  color: "#378ADD", bg: "#378ADD15", delay: "100ms" },
    { label: "Rechazados",  value: rechazados.length, color: "#E24B4A", bg: "#E24B4A15", delay: "200ms" },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Saludo */}
      <div className="flex items-center justify-center py-10 md:py-20">
        <h1
          className="text-4xl md:text-7xl font-bold text-center"
          style={{ animation: "fadeInDown 0.6s ease-out" }}
        >
          ¡Hola,{" "}
          <span style={{
            background: "linear-gradient(135deg, #ff3b3b, #3b3bff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {user?.firstName || user?.username || "Operador"}
          </span>
          !
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-100 p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3 shadow-sm"
            style={{
              background: card.bg,
              animation: `fadeInUp 0.5s ease-out ${card.delay} both`,
            }}
          >
            <p className="text-3xl md:text-5xl font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs md:text-sm text-gray-500 font-medium text-center">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Dos paneles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Barras por categoría */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          style={{ animation: "fadeInUp 0.5s ease-out 300ms both" }}
        >
          <p className="text-sm font-medium text-gray-700 mb-4">Reportes por categoría</p>
          <div className="flex flex-col gap-3">
            {dataCategoria.map((item) => {
              const pct = Math.round((item.total / maxCategoria) * 100);
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <img src={icons[item.name]} className="w-5 h-5 shrink-0" alt={item.label} />
                  <span className="text-xs text-gray-500 w-20 shrink-0">{item.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: CATEGORIA_COLORS[item.name],
                        transition: "width 1s ease-out"
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-4 text-right shrink-0">{item.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actividad reciente */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          style={{ animation: "fadeInUp 0.5s ease-out 400ms both" }}
        >
          <p className="text-sm font-medium text-gray-700 mb-4">Actividad reciente</p>
          <div className="flex flex-col divide-y divide-gray-50">
            {ultimosReportes.length === 0 ? (
              <p className="text-sm text-gray-400">No hay actividad aún</p>
            ) : (
              ultimosReportes.map(r => {
                const est = estadoConfig[r.estado] || { label: r.estado, color: "#999" };
                return (
                  <div key={r._id} className="flex items-center gap-3 py-2.5">
                    <img src={icons[r.categoria]} className="w-5 h-5 shrink-0" alt={r.categoria} />
                    <span className="text-sm text-gray-700 flex-1 truncate">{r.titulo}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                      style={{ background: `${est.color}15`, color: est.color }}
                    >
                      {est.label}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 w-10 text-right">
                      {new Date(r.updatedAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
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

  const handleCerrar = () => {
    setSelectedReporte(null);
    setComentarios([]);
  };

  const handleActualizar = async () => {
    if (selectedReporte) await handleVerDetalle(selectedReporte._id);
    cargar();
  };

  useEffect(() => { cargar(); }, []);

  const countEnProgreso = validados.length + enProgreso.length;
  const reportesLista = vistaActiva === "en_progreso"
    ? [...validados, ...enProgreso]
    : historial;

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden pt-[56px]">

        {/* Sidebar — solo desktop */}
        <div className="hidden md:flex w-52 bg-white border-r border-gray-100 flex-col py-6 px-3 shrink-0">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest px-3 mb-3">Panel Operador</p>
          {SIDEBAR_ITEMS.map((item) => {
            const count =
              item.id === "en_progreso" ? countEnProgreso :
              item.id === "historial"   ? historial.length : null;
            return (
              <button
                key={item.id}
                onClick={() => setVistaActiva(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                  vistaActiva === item.id ? "text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
                style={vistaActiva === item.id
                  ? { background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }
                  : {}}
              >
                <span className="flex-1 text-left">{item.label}</span>
                {count !== null && count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    vistaActiva === item.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-400">Cargando...</p>
            </div>
          ) : vistaActiva === "dashboard" ? (
            <Dashboard enProgreso={enProgreso} historial={historial} user={user} />
          ) : (
            <div className="flex flex-col gap-3">
              <p
                className="text-sm font-medium text-gray-500 mb-2"
                style={{ animation: "fadeInDown 0.4s ease-out" }}
              >
                {vistaActiva === "en_progreso" ? "Incidentes activos" : "Historial de incidentes"}
              </p>
              {reportesLista.length === 0 ? (
                <div
                  className="flex items-center justify-center h-40"
                  style={{ animation: "fadeInUp 0.4s ease-out" }}
                >
                  <p className="text-sm text-gray-400">No hay incidentes en esta sección</p>
                </div>
              ) : (
                reportesLista.map((reporte, i) => (
                  <div
                    key={reporte._id}
                    style={{ animation: `fadeInUp 0.4s ease-out ${i * 60}ms both` }}
                  >
                    <OperadorReporteCard
                      reporte={reporte}
                      onClick={() => handleVerDetalle(reporte._id)}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navbar mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white shadow-lg border-t border-gray-100">
        <div className="flex items-center justify-around px-4 py-4">
          {SIDEBAR_ITEMS.map((item) => {
            const count =
              item.id === "en_progreso" ? countEnProgreso :
              item.id === "historial"   ? historial.length : null;
            const isActive = vistaActiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setVistaActiva(item.id)}
                className="flex flex-col items-center gap-1 relative px-3"
              >
                {count !== null && count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)", fontSize: "10px" }}
                  >
                    {count}
                  </span>
                )}
                <span
                  className={`text-sm font-semibold ${isActive ? "" : "text-gray-400"}`}
                  style={isActive ? {
                    background: "linear-gradient(135deg, #ff3b3b, #3b3bff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  } : {}}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
    </div>
  );
}
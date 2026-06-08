import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { icons } from "../assets/icons/icons.js";
import PanelLayout from "../components/Panel/PanelLayout.jsx";
import DashboardSaludo from "../components/Panel/DashboardSaludo.jsx";
import BarrasCategoria from "../components/Panel/BarrasCategoria.jsx";
import StatCard from "../components/Panel/StatCard.jsx";
import ActividadReciente from "../components/Panel/ActividadReciente.jsx";
import ReporteHeader from "../components/Report/ReporteHeader.jsx";
import {
  obtenerReportesPendientes,
  aprobarReporte,
  rechazarReporte,
  cambiarCategoria,
  cambiarPrioridad,
  obtenerDetalleReporte,
} from "../services/supervisorService";

const CATEGORIAS = ["baches", "inundacion", "alumbrado", "semaforo", "residuos"];
const PRIORIDADES = ["low", "medium", "high", "critical"];

const PRIORIDAD_CONFIG = {
  low:      { label: "Baja",    color: "#888780", bg: "#88878015" },
  medium:   { label: "Media",   color: "#378ADD", bg: "#378ADD15" },
  high:     { label: "Alta",    color: "#BA7517", bg: "#BA751715" },
  critical: { label: "Crítica", color: "#E24B4A", bg: "#E24B4A15" },
};

function Dashboard({ reportes, user }) {
  const statCards = PRIORIDADES.map((p, i) => ({
    label: PRIORIDAD_CONFIG[p].label,
    value: reportes.filter(r => r.prioridad === p).length,
    color: PRIORIDAD_CONFIG[p].color,
    bg:    PRIORIDAD_CONFIG[p].bg,
    delay: `${i * 100}ms`,
  }));

  const recientes = [...reportes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <DashboardSaludo user={user} rol="Supervisor" />
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarrasCategoria reportes={reportes} titulo="Pendientes por categoría" delay="400ms" />
        <ActividadReciente
          reportes={recientes}
          estadoConfig={PRIORIDAD_CONFIG}
          titulo="Reportes recientes"
          delay="500ms"
        />
      </div>
    </div>
  );
}

export default function SupervisorPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [reportes, setReportes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarPrioridades, setMostrarPrioridades] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarReportes(); }, []);

  const cargarReportes = async () => {
    try {
      const token = await getToken({ template: "backend" });
      const data = await obtenerReportesPendientes(token);
      setReportes(data.reportes || []);
    } catch (error) {
      console.log("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = async (reporte) => {
    try {
      const token = await getToken({ template: "backend" });
      const data = await obtenerDetalleReporte(reporte._id, token);
      setDetalle(data.reporte);
      setMostrarCategorias(false);
      setMostrarPrioridades(false);
    } catch (error) {
      console.log("Error cargando detalle:", error);
    }
  };

  const handleAprobar = async () => {
    try {
      const token = await getToken({ template: "backend" });
      await aprobarReporte(detalle._id, token);
      setDetalle(null); cargarReportes();
    } catch (error) { console.log("Error aprobando:", error); }
  };

  const handleRechazar = async () => {
    try {
      const token = await getToken({ template: "backend" });
      await rechazarReporte(detalle._id, "Rechazado por supervisor", token);
      setDetalle(null); cargarReportes();
    } catch (error) { console.log("Error rechazando:", error); }
  };

  const handleCambiarCategoria = async (categoria) => {
    try {
      const token = await getToken({ template: "backend" });
      const data = await cambiarCategoria(detalle._id, categoria, token);
      setDetalle(data.reporte); setMostrarCategorias(false);
    } catch (error) { console.log("Error cambiando categoría:", error); }
  };

  const handleCambiarPrioridad = async (prioridad) => {
    try {
      const token = await getToken({ template: "backend" });
      const data = await cambiarPrioridad(detalle._id, prioridad, token);
      setDetalle(data.reporte); setMostrarPrioridades(false);
    } catch (error) { console.log("Error cambiando prioridad:", error); }
  };

  const reportesFiltrados = reportes.filter((r) =>
    r.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const sidebarItems = [
    { id: "dashboard",  label: "Dashboard",  count: 0 },
    { id: "pendientes", label: "Pendientes", count: reportes.length },
  ];

  if (detalle) {
    return (
      <PanelLayout
        sidebarTitle="Panel Supervisor"
        sidebarItems={sidebarItems}
        vistaActiva={vistaActiva}
        onVistaChange={(id) => { setDetalle(null); setVistaActiva(id); }}
        loading={false}
      >
        <div className="max-w-lg mx-auto flex flex-col gap-4"
          style={{ animation: "fadeInUp 0.4s ease-out" }}>

          <button onClick={() => setDetalle(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            style={{ animation: "fadeInDown 0.4s ease-out" }}>
            ← Volver
          </button>

          <ReporteHeader reporte={detalle} />

          <div className="flex gap-2 relative">
            <button onClick={() => { setMostrarPrioridades(false); setMostrarCategorias(!mostrarCategorias); }}
              className="flex-1 border border-gray-200 rounded-full py-2 text-sm text-gray-600 hover:bg-gray-50">
              Cambiar categoría
            </button>
            <button onClick={() => { setMostrarCategorias(false); setMostrarPrioridades(!mostrarPrioridades); }}
              className="flex-1 border border-gray-200 rounded-full py-2 text-sm text-gray-600 hover:bg-gray-50">
              Cambiar prioridad
            </button>
            {mostrarCategorias && (
              <div className="absolute top-12 left-0 z-10 bg-white rounded-2xl shadow-lg p-3 grid grid-cols-3 gap-2 w-64">
                {CATEGORIAS.map((cat) => (
                  <button key={cat} onClick={() => handleCambiarCategoria(cat)}
                    className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-xl">
                    <img src={icons[cat]} className="w-8 h-8" alt={cat} />
                    <span className="text-xs capitalize text-gray-600">{cat}</span>
                  </button>
                ))}
              </div>
            )}
            {mostrarPrioridades && (
              <div className="absolute top-12 right-0 z-10 bg-white rounded-2xl shadow-lg p-3 grid grid-cols-2 gap-2 w-48">
                {PRIORIDADES.map((p) => (
                  <button key={p} onClick={() => handleCambiarPrioridad(p)}
                    className="border border-gray-200 rounded-xl py-2 px-3 text-xs capitalize hover:bg-gray-50 text-gray-600">
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium mb-2">Descripción</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{detalle.descripcion}</p>
            {detalle.imagenes?.length > 0 && (
              <>
                <p className="text-xs text-gray-400 font-medium mb-2">Fotos</p>
                <div className="grid grid-cols-2 gap-2">
                  {detalle.imagenes.map((img, i) => (
                    <img key={i} src={img} alt={`imagen-${i}`}
                      className="w-full h-28 object-cover rounded-xl border border-gray-100" />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handleRechazar}
              className="flex-1 py-3 rounded-full text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors">
              Rechazar
            </button>
            <button onClick={handleAprobar}
              className="flex-1 py-3 rounded-full text-white text-sm font-semibold bg-green-500 hover:bg-green-600 transition-colors">
              Aceptar
            </button>
          </div>
        </div>
      </PanelLayout>
    );
  }

  return (
    <PanelLayout
      sidebarTitle="Panel Supervisor"
      sidebarItems={sidebarItems}
      vistaActiva={vistaActiva}
      onVistaChange={setVistaActiva}
      loading={loading}
    >
      {vistaActiva === "dashboard" ? (
        <Dashboard reportes={reportes} user={user} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white max-w-md"
            style={{ animation: "fadeInDown 0.4s ease-out" }}>
            <span className="text-gray-400 text-sm">🔍</span>
            <input type="text" placeholder="Buscar reporte..."
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              className="outline-none text-sm w-full bg-transparent" />
          </div>

          {reportesFiltrados.length === 0 ? (
            <div className="flex items-center justify-center h-40"
              style={{ animation: "fadeInUp 0.4s ease-out" }}>
              <p className="text-sm text-gray-400">No hay incidentes pendientes</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reportesFiltrados.map((reporte, i) => (
                <div key={reporte._id} onClick={() => verDetalle(reporte)}
                  className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ animation: `fadeInUp 0.4s ease-out ${i * 60}ms both` }}>
                  <img src={icons[reporte.categoria]} className="w-9 h-9" alt={reporte.categoria} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{reporte.titulo}</p>
                    <p className="text-xs text-gray-400 capitalize">{reporte.categoria}</p>
                    <p className="text-xs text-gray-400">{reporte.ubicacion?.direccion}</p>
                  </div>
                  {PRIORIDAD_CONFIG[reporte.prioridad] && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                      style={{ background: PRIORIDAD_CONFIG[reporte.prioridad].bg, color: PRIORIDAD_CONFIG[reporte.prioridad].color }}>
                      {PRIORIDAD_CONFIG[reporte.prioridad].label}
                    </span>
                  )}
                  <span className="text-gray-300 text-sm shrink-0">→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PanelLayout>
  );
}
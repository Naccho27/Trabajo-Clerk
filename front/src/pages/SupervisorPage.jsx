import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { icons } from "../assets/icons/icons.js";
import BuscadorInput from "../components/Panel/BuscadorInput.jsx";
import FiltrosTabla from "../components/Panel/FiltrosTabla.jsx";
import PanelLayout from "../components/Panel/PanelLayout.jsx";
import DashboardSaludo from "../components/Panel/DashboardSaludo.jsx";
import BarrasCategoria from "../components/Panel/BarrasCategoria.jsx";
import StatCard from "../components/Panel/StatCard.jsx";
import ActividadReciente from "../components/Panel/ActividadReciente.jsx";
import PageHeader from "../components/Panel/PageHeader.jsx";
import { useCategorias } from "../context/CategoriasContext.jsx";
import {
  obtenerReportesPendientes,
  aprobarReporte,
  rechazarReporte,
  cambiarCategoria,
  cambiarPrioridad,
} from "../services/supervisorService";

const PRIORIDADES = ["low", "medium", "high", "critical"];

const PRIORIDAD_CONFIG = {
  low: { label: "Baja", color: "#888780", bg: "#88878015" },
  medium: { label: "Media", color: "#378ADD", bg: "#378ADD15" },
  high: { label: "Alta", color: "#BA7517", bg: "#BA751715" },
  critical: { label: "Crítica", color: "#E24B4A", bg: "#E24B4A15" },
};

const ORDEN_PRIORIDAD = { critical: 0, high: 1, medium: 2, low: 3 };

const FILTROS_INICIAL = { categoria: "", prioridad: "", estado: "", fechaDesde: "", fechaHasta: "" };

const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });

function Dashboard({ reportes, user }) {
  const statCards = PRIORIDADES.map((p, i) => ({
    label: PRIORIDAD_CONFIG[p].label,
    value: reportes.filter(r => r.prioridad === p).length,
    color: PRIORIDAD_CONFIG[p].color,
    bg: PRIORIDAD_CONFIG[p].bg,
    delay: `${i * 100}ms`,
  }));

  const recientes = [...reportes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <DashboardSaludo user={user} rol="Supervisor" />
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarrasCategoria reportes={reportes} titulo="Pendientes por categoría" delay="400ms" />
        <ActividadReciente reportes={recientes} estadoConfig={PRIORIDAD_CONFIG} titulo="Reportes recientes" delay="500ms" />
      </div>
    </div>
  );
}

function FilaExpandible({ reporte, onAprobar, onRechazar, onCambiarCategoria, onCambiarPrioridad, index }) {
  const [expandido, setExpandido] = useState(false);
  const [mostrarCats, setMostrarCats] = useState(false);
  const [mostrarPrios, setMostrarPrios] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { categorias } = useCategorias();
  const prioridad = PRIORIDAD_CONFIG[reporte.prioridad];

  const getIconoCategoria = (nombre) =>
    categorias.find(c => c.nombre === nombre)?.imagen || icons[nombre];

  return (
    <>
      <tr
        className={`cursor-pointer hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} ${expandido ? "bg-blue-50/30" : ""}`}
        style={{ animation: `fadeInUp 0.3s ease-out ${index * 40}ms both` }}
        onClick={() => { setExpandido(!expandido); setMostrarCats(false); setMostrarPrios(false); }}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={getIconoCategoria(reporte.categoria)} className="w-7 h-7 shrink-0" alt={reporte.categoria} />
            <span className="font-medium text-gray-800">{reporte.titulo}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-gray-500 text-xs">{reporte.ubicacion?.direccion ?? "Sin dirección"}</td>
        <td className="px-4 py-3 capitalize text-gray-500">{reporte.categoria}</td>
        <td className="px-4 py-3">
          {prioridad && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: prioridad.bg, color: prioridad.color }}>
              {prioridad.label}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-gray-400 text-xs">{formatearFecha(reporte.createdAt)}</td>
        <td className="px-4 py-3">
          <span className={`text-gray-400 transition-transform inline-block ${expandido ? "rotate-90" : ""}`}>→</span>
        </td>
      </tr>

      {expandido && (
        <tr className="bg-blue-50/20">
          <td colSpan={6} className="px-6 py-4">
            <div className="flex flex-col gap-4" style={{ animation: "fadeInUp 0.3s ease-out" }}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-medium mb-1">Descripción</p>
                  <p className="text-sm text-gray-700">{reporte.descripcion}</p>
                </div>

                {reporte.usuarioId && (
                  <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
                    {(reporte.usuarioId.imagenPerfil || reporte.usuarioId.clerkImageUrl) && !imgError ? (
                      <img
                        src={reporte.usuarioId.imagenPerfil || reporte.usuarioId.clerkImageUrl}
                        className="w-8 h-8 rounded-full object-cover"
                        alt="usuario"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                        {reporte.usuarioId.nombreUsuario?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-700">{reporte.usuarioId.nombreUsuario}</p>
                      <p className="text-xs text-gray-400 capitalize">
                        {reporte.usuarioId.roles?.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {reporte.imagenes?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {reporte.imagenes.map((img, i) => (
                    <img key={i} src={img} alt={`img-${i}`}
                      className="h-24 w-36 object-cover rounded-xl border border-gray-100" />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMostrarCats(!mostrarCats); setMostrarPrios(false); }}
                    className="border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Categoría: <span className="capitalize font-medium">{reporte.categoria}</span> ▾
                  </button>
                  {mostrarCats && (
                    <div className="absolute top-9 left-0 z-[100] bg-white rounded-2xl shadow-lg p-3 grid grid-cols-3 gap-2 w-56"
                      onClick={(e) => e.stopPropagation()}>
                      {categorias.map((cat) => (
                        <button key={cat._id}
                          onClick={() => { onCambiarCategoria(reporte._id, cat.nombre); setMostrarCats(false); }}
                          className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-xl">
                          <img src={cat.imagen || icons[cat.nombre]} className="w-7 h-7" alt={cat.nombre} />
                          <span className="text-xs capitalize text-gray-600">{cat.nombre}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMostrarPrios(!mostrarPrios); setMostrarCats(false); }}
                    className="border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Prioridad: <span className="font-medium" style={{ color: prioridad?.color }}>{prioridad?.label}</span> ▾
                  </button>
                  {mostrarPrios && (
                    <div className="absolute top-9 left-0 z-[100] bg-white rounded-2xl shadow-lg p-3 grid grid-cols-2 gap-2 w-44"
                      onClick={(e) => e.stopPropagation()}>
                      {PRIORIDADES.map((p) => {
                        const cfg = PRIORIDAD_CONFIG[p];
                        return (
                          <button key={p}
                            onClick={() => { onCambiarPrioridad(reporte._id, p); setMostrarPrios(false); }}
                            className="rounded-xl py-1.5 px-3 text-xs font-medium hover:opacity-80"
                            style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="ml-auto flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onRechazar(reporte._id); }}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAprobar(reporte._id); }}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors"
                  >
                    Aprobar
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function SupervisorPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [reportes, setReportes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_INICIAL);
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

  const handleAprobar = async (id) => {
    try {
      const token = await getToken({ template: "backend" });
      await aprobarReporte(id, token);
      cargarReportes();
    } catch (error) { console.log("Error aprobando:", error); }
  };

  const handleRechazar = async (id) => {
    try {
      const token = await getToken({ template: "backend" });
      await rechazarReporte(id, "Rechazado por supervisor", token);
      cargarReportes();
    } catch (error) { console.log("Error rechazando:", error); }
  };

  const handleCambiarCategoria = async (id, categoria) => {
    try {
      const token = await getToken({ template: "backend" });
      await cambiarCategoria(id, categoria, token);
      cargarReportes();
    } catch (error) { console.log("Error cambiando categoría:", error); }
  };

  const handleCambiarPrioridad = async (id, prioridad) => {
    try {
      const token = await getToken({ template: "backend" });
      await cambiarPrioridad(id, prioridad, token);
      cargarReportes();
    } catch (error) { console.log("Error cambiando prioridad:", error); }
  };

  const reportesFiltrados = reportes.filter((r) => {
    const textMatch = r.titulo?.toLowerCase().includes(busqueda.toLowerCase())
      || r.ubicacion?.direccion?.toLowerCase().includes(busqueda.toLowerCase());
    const catMatch = !filtros.categoria || r.categoria === filtros.categoria;
    const prioMatch = !filtros.prioridad || r.prioridad === filtros.prioridad;
    const fecha = new Date(r.createdAt);
    const desdeMatch = !filtros.fechaDesde || fecha >= new Date(filtros.fechaDesde);
    const hastaMatch = !filtros.fechaHasta || fecha <= new Date(filtros.fechaHasta + "T23:59:59");
    return textMatch && catMatch && prioMatch && desdeMatch && hastaMatch;
  }).sort((a, b) => ORDEN_PRIORIDAD[a.prioridad] - ORDEN_PRIORIDAD[b.prioridad]);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", count: 0 },
    { id: "pendientes", label: "Pendientes", count: reportes.length },
  ];

  return (
    <PanelLayout
      sidebarTitle="Panel Supervisor"
      sidebarItems={sidebarItems}
      vistaActiva={vistaActiva}
      onVistaChange={(id) => { setBusqueda(""); setFiltros(FILTROS_INICIAL); setVistaActiva(id); }}
      loading={loading}
    >
      {vistaActiva === "dashboard" ? (
        <Dashboard reportes={reportes} user={user} />
      ) : (
        <div className="flex flex-col gap-4">
          <PageHeader
            titulo="Reportes pendientes"
            subtitulo="Revisá y aprobá los incidentes reportados por los ciudadanos"
          />
          <BuscadorInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por reporte o calle..." />
          <FiltrosTabla filtros={filtros} onChange={setFiltros} mostrarEstado={false} />
          {reportesFiltrados.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-gray-400">No hay incidentes pendientes</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-visible">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Reporte</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Ubicación</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Categoría</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Prioridad</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Fecha</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {reportesFiltrados.map((reporte, i) => (
                    <FilaExpandible
                      key={reporte._id}
                      reporte={reporte}
                      index={i}
                      onAprobar={handleAprobar}
                      onRechazar={handleRechazar}
                      onCambiarCategoria={handleCambiarCategoria}
                      onCambiarPrioridad={handleCambiarPrioridad}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </PanelLayout>
  );
}
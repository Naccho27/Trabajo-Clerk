import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import Header from "../components/Navbar/Header";
import { icons } from "../assets/icons/icons.js";
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

const CATEGORIA_COLORS = {
  baches:     "#378ADD",
  residuos:   "#639922",
  alumbrado:  "#BA7517",
  semaforo:   "#7F77DD",
  inundacion: "#D4537E",
};

const CATEGORIA_LABELS = {
  baches: "Baches", residuos: "Residuos", alumbrado: "Alumbrado",
  semaforo: "Semáforo", inundacion: "Inundación",
};

const PRIORIDAD_CONFIG = {
  low:      { label: "Baja",    color: "#888780", bg: "#88878015" },
  medium:   { label: "Media",   color: "#378ADD", bg: "#378ADD15" },
  high:     { label: "Alta",    color: "#BA7517", bg: "#BA751715" },
  critical: { label: "Crítica", color: "#E24B4A", bg: "#E24B4A15" },
};

const SIDEBAR_ITEMS = [
  { id: "dashboard",  label: "Dashboard" },
  { id: "pendientes", label: "Pendientes" },
];

function Dashboard({ reportes, user }) {
  const porCategoria = CATEGORIAS.map(cat => ({
    name: cat,
    label: CATEGORIA_LABELS[cat],
    total: reportes.filter(r => r.categoria === cat).length,
  }));
  const maxCategoria = Math.max(...porCategoria.map(d => d.total), 1);

  const porPrioridad = PRIORIDADES.map((p, i) => ({
    name: p,
    label: PRIORIDAD_CONFIG[p].label,
    color: PRIORIDAD_CONFIG[p].color,
    bg: PRIORIDAD_CONFIG[p].bg,
    total: reportes.filter(r => r.prioridad === p).length,
    delay: `${i * 100}ms`,
  }));

  const recientes = [...reportes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

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
            {user?.firstName || user?.username || "Supervisor"}
          </span>
          !
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {porPrioridad.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl border border-gray-100 p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3 shadow-sm"
            style={{
              background: p.bg,
              animation: `fadeInUp 0.5s ease-out ${p.delay} both`,
            }}
          >
            <p className="text-3xl md:text-5xl font-bold" style={{ color: p.color }}>{p.total}</p>
            <p className="text-xs md:text-sm text-gray-500 font-medium text-center">{p.label}</p>
          </div>
        ))}
      </div>

      {/* Dos paneles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Barras por categoría */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          style={{ animation: "fadeInUp 0.5s ease-out 400ms both" }}
        >
          <p className="text-sm font-medium text-gray-700 mb-4">Pendientes por categoría</p>
          <div className="flex flex-col gap-3">
            {porCategoria.map((item) => {
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

        {/* Reportes recientes */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          style={{ animation: "fadeInUp 0.5s ease-out 500ms both" }}
        >
          <p className="text-sm font-medium text-gray-700 mb-4">Reportes recientes</p>
          <div className="flex flex-col divide-y divide-gray-50">
            {recientes.length === 0 ? (
              <p className="text-sm text-gray-400">No hay reportes pendientes</p>
            ) : (
              recientes.map(r => {
                const prior = PRIORIDAD_CONFIG[r.prioridad] || { label: r.prioridad, color: "#999", bg: "#99999915" };
                return (
                  <div key={r._id} className="flex items-center gap-3 py-2.5">
                    <img src={icons[r.categoria]} className="w-5 h-5 shrink-0" alt={r.categoria} />
                    <span className="text-sm text-gray-700 flex-1 truncate">{r.titulo}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                      style={{ background: prior.bg, color: prior.color }}
                    >
                      {prior.label}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 w-10 text-right">
                      {new Date(r.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
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

export default function SupervisorPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [reportes, setReportes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
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
      setMostrarPerfil(false);
    } catch (error) {
      console.log("Error cargando detalle:", error);
    }
  };

  const handleAprobar = async () => {
    try {
      const token = await getToken({ template: "backend" });
      await aprobarReporte(detalle._id, token);
      setDetalle(null);
      cargarReportes();
    } catch (error) {
      console.log("Error aprobando:", error);
    }
  };

  const handleRechazar = async () => {
    try {
      const token = await getToken({ template: "backend" });
      await rechazarReporte(detalle._id, "Rechazado por supervisor", token);
      setDetalle(null);
      cargarReportes();
    } catch (error) {
      console.log("Error rechazando:", error);
    }
  };

  const handleCambiarCategoria = async (categoria) => {
    try {
      const token = await getToken({ template: "backend" });
      const data = await cambiarCategoria(detalle._id, categoria, token);
      setDetalle(data.reporte);
      setMostrarCategorias(false);
    } catch (error) {
      console.log("Error cambiando categoría:", error);
    }
  };

  const handleCambiarPrioridad = async (prioridad) => {
    try {
      const token = await getToken({ template: "backend" });
      const data = await cambiarPrioridad(detalle._id, prioridad, token);
      setDetalle(data.reporte);
      setMostrarPrioridades(false);
    } catch (error) {
      console.log("Error cambiando prioridad:", error);
    }
  };

  const reportesFiltrados = reportes.filter((r) =>
    r.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // VISTA DETALLE
  if (detalle) {
    return (
      <div className="w-screen h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex flex-1 overflow-hidden pt-[56px]">
          <div className="hidden md:flex w-52 bg-white border-r border-gray-100 flex-col py-6 px-3 shrink-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest px-3 mb-3">Panel Supervisor</p>
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setDetalle(null); setVistaActiva(item.id); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 text-gray-500 hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <button
              onClick={() => setDetalle(null)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
              style={{ animation: "fadeInDown 0.4s ease-out" }}
            >
              ← Volver
            </button>

            <div className="max-w-lg mx-auto flex flex-col gap-4" style={{ animation: "fadeInUp 0.4s ease-out" }}>
              <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
                <img src={icons[detalle.categoria]} className="w-10 h-10" alt={detalle.categoria} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{detalle.titulo}</p>
                  <p className="text-xs text-gray-400 capitalize">{detalle.categoria}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {PRIORIDAD_CONFIG[detalle.prioridad] && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: PRIORIDAD_CONFIG[detalle.prioridad].bg,
                          color: PRIORIDAD_CONFIG[detalle.prioridad].color
                        }}
                      >
                        {PRIORIDAD_CONFIG[detalle.prioridad].label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={detalle.usuarioId?.imagenPerfil || "https://via.placeholder.com/40"}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    alt="perfil"
                    onClick={() => setMostrarPerfil(!mostrarPerfil)}
                  />
                  {mostrarPerfil && (
                    <div className="absolute top-12 right-0 z-10 bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center gap-2 w-48">
                      <img src={detalle.usuarioId?.imagenPerfil || "https://via.placeholder.com/60"} className="w-16 h-16 rounded-full object-cover" alt="perfil" />
                      <p className="font-semibold text-sm text-gray-800">{detalle.usuarioId?.nombreUsuario || "Usuario"}</p>
                      <p className="text-xs text-gray-400">{detalle.usuarioId?.email || ""}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 relative">
                <button
                  onClick={() => { setMostrarPrioridades(false); setMostrarCategorias(!mostrarCategorias); }}
                  className="flex-1 border border-gray-200 rounded-full py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cambiar categoría
                </button>
                <button
                  onClick={() => { setMostrarCategorias(false); setMostrarPrioridades(!mostrarPrioridades); }}
                  className="flex-1 border border-gray-200 rounded-full py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cambiar prioridad
                </button>
                {mostrarCategorias && (
                  <div className="absolute top-12 left-0 z-10 bg-white rounded-2xl shadow-lg p-3 grid grid-cols-3 gap-2 w-64">
                    {CATEGORIAS.map((cat) => (
                      <button key={cat} onClick={() => handleCambiarCategoria(cat)} className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-xl">
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
                        <img key={i} src={img} alt={`imagen-${i}`} className="w-full h-28 object-cover rounded-xl border border-gray-100" />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={handleRechazar} className="flex-1 py-3 rounded-full text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors">
                  Rechazar
                </button>
                <button onClick={handleAprobar} className="flex-1 py-3 rounded-full text-white text-sm font-semibold bg-green-500 hover:bg-green-600 transition-colors">
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden pt-[56px]">

        {/* Sidebar desktop */}
        <div className="hidden md:flex w-52 bg-white border-r border-gray-100 flex-col py-6 px-3 shrink-0">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest px-3 mb-3">Panel Supervisor</p>
          {SIDEBAR_ITEMS.map((item) => {
            const count = item.id === "pendientes" ? reportes.length : null;
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
            <Dashboard reportes={reportes} user={user} />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white max-w-md"
                style={{ animation: "fadeInDown 0.4s ease-out" }}
              >
                <span className="text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar reporte..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="outline-none text-sm w-full bg-transparent"
                />
              </div>

              {reportesFiltrados.length === 0 ? (
                <div className="flex items-center justify-center h-40" style={{ animation: "fadeInUp 0.4s ease-out" }}>
                  <p className="text-sm text-gray-400">No hay incidentes pendientes</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {reportesFiltrados.map((reporte, i) => (
                    <div
                      key={reporte._id}
                      onClick={() => verDetalle(reporte)}
                      className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ animation: `fadeInUp 0.4s ease-out ${i * 60}ms both` }}
                    >
                      <img src={icons[reporte.categoria]} className="w-9 h-9" alt={reporte.categoria} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{reporte.titulo}</p>
                        <p className="text-xs text-gray-400 capitalize">{reporte.categoria}</p>
                        <p className="text-xs text-gray-400">{reporte.ubicacion?.direccion}</p>
                      </div>
                      {PRIORIDAD_CONFIG[reporte.prioridad] && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                          style={{
                            background: PRIORIDAD_CONFIG[reporte.prioridad].bg,
                            color: PRIORIDAD_CONFIG[reporte.prioridad].color
                          }}
                        >
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
        </div>
      </div>

      {/* Navbar mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white shadow-lg border-t border-gray-100">
        <div className="flex items-center justify-around px-4 py-4">
          {SIDEBAR_ITEMS.map((item) => {
            const count = item.id === "pendientes" ? reportes.length : null;
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
    </div>
  );
}
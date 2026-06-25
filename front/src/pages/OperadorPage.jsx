import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { icons } from "../assets/icons/icons.js";
import PanelLayout from "../components/Panel/PanelLayout.jsx";
import DashboardSaludo from "../components/Panel/DashboardSaludo.jsx";
import BarrasCategoria from "../components/Panel/BarrasCategoria.jsx";
import StatCard from "../components/Panel/StatCard.jsx";
import ActividadReciente from "../components/Panel/ActividadReciente.jsx";
import BuscadorInput from "../components/Panel/BuscadorInput.jsx";
import FiltrosTabla from "../components/Panel/FiltrosTabla.jsx";
import PageHeader from "../components/Panel/PageHeader.jsx";
import { useCategorias } from "../context/CategoriasContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const ESTADO_CONFIG = {
  validated: { label: "Validado", color: "#7F77DD" },
  in_progress: { label: "En progreso", color: "#BA7517" },
  resolved: { label: "Resuelto", color: "#378ADD" },
  rejected: { label: "Rechazado", color: "#E24B4A" },
};

const PRIORIDAD_CONFIG = {
  low: { label: "Baja", color: "#888780", bg: "#88878015" },
  medium: { label: "Media", color: "#378ADD", bg: "#378ADD15" },
  high: { label: "Alta", color: "#BA7517", bg: "#BA751715" },
  critical: { label: "Crítica", color: "#E24B4A", bg: "#E24B4A15" },
};

const FILTROS_INICIAL = { categoria: "", prioridad: "", estado: "", fechaDesde: "", fechaHasta: "" };

const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });

function Dashboard({ enProgreso, historial, user }) {
  const resueltos = historial.filter(r => r.estado === "resolved");
  const rechazados = historial.filter(r => r.estado === "rejected");

  const statCards = [
    { label: "En progreso", value: enProgreso.length, color: "#BA7517", bg: "#BA751715", delay: "0ms" },
    { label: "Resueltos", value: resueltos.length, color: "#378ADD", bg: "#378ADD15", delay: "100ms" },
    { label: "Rechazados", value: rechazados.length, color: "#E24B4A", bg: "#E24B4A15", delay: "200ms" },
  ];

  const ultimosReportes = [...enProgreso, ...resueltos, ...rechazados]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <DashboardSaludo user={user} rol="Operador" />
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarrasCategoria reportes={[...enProgreso, ...historial]} titulo="Reportes por categoría" delay="300ms" />
        <ActividadReciente reportes={ultimosReportes} estadoConfig={ESTADO_CONFIG} delay="400ms" />
      </div>
    </div>
  );
}

function FilaOperador({ reporte, index, onActualizar, getToken }) {
  const [expandido, setExpandido] = useState(false);
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [loadingCom, setLoadingCom] = useState(false);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [cargado, setCargado] = useState(false);
  const { categorias } = useCategorias();
  const getIconoCategoria = (nombre) =>
    categorias.find(c => c.nombre === nombre)?.imagen || icons[nombre];

  const prioridad = PRIORIDAD_CONFIG[reporte.prioridad];
  const estado = ESTADO_CONFIG[reporte.estado];

  const cargarComentarios = async () => {
    if (cargado) return;
    try {
      const token = await getToken({ template: "backend" });
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/operator/reportes/${reporte._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComentarios(data.comentarios || []);
      setCargado(true);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
    }
  };

  const handleExpandir = () => {
    setExpandido(!expandido);
    if (!expandido) cargarComentarios();
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    setLoadingAcc(true);
    try {
      const token = await getToken({ template: "backend" });
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/operator/reportes/${reporte._id}/status`,
        { status: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onActualizar();
    } catch (err) { console.error(err); }
    finally { setLoadingAcc(false); }
  };

  const handleResolver = async () => {
    setLoadingAcc(true);
    try {
      const token = await getToken({ template: "backend" });
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/operator/reportes/${reporte._id}/resolver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onActualizar();
    } catch (err) { console.error(err); }
    finally { setLoadingAcc(false); }
  };

  const handleComentar = async () => {
    if (!comentario.trim()) return;
    setLoadingCom(true);
    try {
      const token = await getToken({ template: "backend" });
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/operator/reportes/${reporte._id}/comentario`,
        { texto: comentario },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComentario("");
      // 👇 forzar recarga directamente sin depender del estado cargado
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/operator/reportes/${reporte._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComentarios(data.comentarios || []);
    } catch (err) { console.error(err); }
    finally { setLoadingCom(false); }
  };

  return (
    <>
      <tr
        className={`cursor-pointer hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} ${expandido ? "bg-blue-50/30" : ""}`}
        style={{ animation: `fadeInUp 0.3s ease-out ${index * 40}ms both` }}
        onClick={handleExpandir}
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
        <td className="px-4 py-3">
          {estado && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${estado.color}15`, color: estado.color }}>
              {estado.label}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-gray-400 text-xs">{formatearFecha(reporte.updatedAt)}</td>
        <td className="px-4 py-3">
          <span className={`text-gray-400 transition-transform inline-block ${expandido ? "rotate-90" : ""}`}>→</span>
        </td>
      </tr>

      {expandido && (
        <tr className="bg-blue-50/20">
          <td colSpan={7} className="px-6 py-4">
            <div className="flex flex-col gap-4" style={{ animation: "fadeInUp 0.3s ease-out" }}>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Descripción</p>
                <p className="text-sm text-gray-700">{reporte.descripcion}</p>
              </div>

              {reporte.imagenes?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {reporte.imagenes.map((img, i) => (
                    <img key={i} src={img} alt={`img-${i}`}
                      className="h-24 w-36 object-cover rounded-xl border border-gray-100" />
                  ))}
                </div>
              )}

              {comentarios.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-400 font-medium">Comentarios</p>
                  {comentarios.map((c, i) => (
                    <div key={i} className="bg-white rounded-xl px-4 py-2.5 flex items-start gap-3 shadow-sm">
                      {c.usuarioId?.imagenPerfil ? (
                        <img
                          src={c.usuarioId.imagenPerfil}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                          alt={c.usuarioId.nombreUsuario}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600 shrink-0">
                          {c.usuarioId?.nombreUsuario?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700">{c.usuarioId?.nombreUsuario ?? "Operador"}</p>
                        <p className="text-sm text-gray-600">{c.mensaje}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(c.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {reporte.estado !== "resolved" && reporte.estado !== "rejected" && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribí un comentario público..."
                    className="flex-1 border border-gray-200 rounded-full px-4 py-1.5 text-sm outline-none focus:border-blue-400"
                    onKeyDown={(e) => e.key === "Enter" && handleComentar()}
                  />
                  <button
                    onClick={handleComentar}
                    disabled={loadingCom}
                    className="px-4 py-1.5 rounded-full text-white text-xs font-semibold disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
                  >
                    {loadingCom ? "..." : "Comentar"}
                  </button>
                </div>
              )}

              {reporte.estado !== "resolved" && reporte.estado !== "rejected" && (
                <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                  {reporte.estado === "validated" && (
                    <button
                      onClick={() => handleCambiarEstado("in_progress")}
                      disabled={loadingAcc}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold border border-yellow-300 text-yellow-700 hover:bg-yellow-50 disabled:opacity-60"
                    >
                      Poner en progreso
                    </button>
                  )}
                  {reporte.estado === "in_progress" && (
                    <button
                      onClick={handleResolver}
                      disabled={loadingAcc}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold text-white disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
                    >
                      {loadingAcc ? "..." : "Marcar resuelto"}
                    </button>
                  )}
                  <button
                    onClick={() => handleCambiarEstado("rejected")}
                    disabled={loadingAcc}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-60"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function OperadorPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [validados, setValidados] = useState([]);
  const [enProgreso, setEnProgreso] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_INICIAL);

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
      setValidados(resVal.data.reportes || []);
      setEnProgreso(resProg.data.reportes || []);
      setHistorial(resHist.data.reportes || []);
    } catch (err) {
      console.error("Error cargando reportes operador:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVistaChange = (id) => {
    setBusqueda("");
    setFiltros(FILTROS_INICIAL);
    setVistaActiva(id);
  };

  useEffect(() => { cargar(); }, []);

  const countEnProgreso = validados.length + enProgreso.length;

  const reportesLista = vistaActiva === "en_progreso"
    ? [...validados, ...enProgreso]
    : historial;

  const reportesFiltrados = reportesLista.filter((r) => {
    const textMatch = r.titulo?.toLowerCase().includes(busqueda.toLowerCase())
      || r.categoria?.toLowerCase().includes(busqueda.toLowerCase())
      || r.ubicacion?.direccion?.toLowerCase().includes(busqueda.toLowerCase()); const catMatch = !filtros.categoria || r.categoria === filtros.categoria;
    const prioMatch = !filtros.prioridad || r.prioridad === filtros.prioridad;
    const estadoMatch = !filtros.estado || r.estado === filtros.estado;
    const fecha = new Date(r.updatedAt);
    const desdeMatch = !filtros.fechaDesde || fecha >= new Date(filtros.fechaDesde);
    const hastaMatch = !filtros.fechaHasta || fecha <= new Date(filtros.fechaHasta + "T23:59:59");
    return textMatch && catMatch && prioMatch && estadoMatch && desdeMatch && hastaMatch;
  });

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", count: 0 },
    { id: "en_progreso", label: "En progreso", count: countEnProgreso },
    { id: "historial", label: "Historial", count: historial.length },
  ];

  return (
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
          <PageHeader
            titulo={vistaActiva === "en_progreso" ? "Incidentes en progreso" : "Historial de incidentes"}
            subtitulo={vistaActiva === "en_progreso"
              ? "Reportes que estás gestionando actualmente"
              : "Reportes resueltos o rechazados"}
          />
          <BuscadorInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por reporte o calle..." />
          <FiltrosTabla filtros={filtros} onChange={setFiltros} mostrarEstado={true} />
          {reportesFiltrados.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-gray-400">No hay incidentes en esta sección</p>
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
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Fecha</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {reportesFiltrados.map((reporte, i) => (
                    <FilaOperador
                      key={reporte._id}
                      reporte={reporte}
                      index={i}
                      onActualizar={cargar}
                      getToken={getToken}
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
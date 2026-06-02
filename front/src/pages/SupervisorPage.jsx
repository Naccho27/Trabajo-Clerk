import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
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

const PRIORIDAD_BADGE = {
  low:      { bg: "bg-gray-100",   text: "text-gray-600",   label: "Baja" },
  medium:   { bg: "bg-blue-100",   text: "text-blue-800",   label: "Media" },
  high:     { bg: "bg-amber-100",  text: "text-amber-800",  label: "Alta" },
  critical: { bg: "bg-red-100",    text: "text-red-700",    label: "Crítica" },
};

export default function SupervisorPage() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const { getToken } = useAuth();
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
        <div className="flex-1 flex justify-center overflow-hidden">
          <div className="w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pt-16 px-4 pb-6 flex flex-col gap-4">

              {/* Botón volver */}
              <button
                onClick={() => setDetalle(null)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                ← Volver
              </button>

              {/* Info reporte */}
              <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
                <img src={icons[detalle.categoria]} className="w-10 h-10" alt={detalle.categoria} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{detalle.titulo}</p>
                  <p className="text-xs text-gray-400 capitalize">{detalle.categoria}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {PRIORIDAD_BADGE[detalle.prioridad] && (
                      <span className={`${PRIORIDAD_BADGE[detalle.prioridad].bg} ${PRIORIDAD_BADGE[detalle.prioridad].text} text-xs px-2 py-0.5 rounded-full`}>
                        {PRIORIDAD_BADGE[detalle.prioridad].label}
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
      <img
        src={detalle.usuarioId?.imagenPerfil || "https://via.placeholder.com/60"}
        className="w-16 h-16 rounded-full object-cover"
        alt="perfil"
      />
      <p className="font-semibold text-sm text-gray-800">{detalle.usuarioId?.nombreUsuario || "Usuario"}</p>
      <p className="text-xs text-gray-400">{detalle.usuarioId?.email || ""}</p>
    </div>
  )}
</div>
              </div>

              {/* Botones cambiar categoria/prioridad */}
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

              {/* Descripción */}
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

              {/* Botones aceptar/rechazar */}
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
          </div>
        </div>
      </div>
    );
  }

  // VISTA LISTA
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-md flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pt-16 px-4 pb-6">

            {/* Buscador */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white my-4">
              <span className="text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Buscar reporte..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="outline-none text-sm w-full bg-transparent"
              />
            </div>

            {/* Título */}
            <div className="flex items-center justify-center mb-4">
              <span
                className="text-sm font-semibold px-5 py-1.5 rounded-full text-white"
                style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
              >
                Incidentes a Revisión
              </span>
            </div>

            {/* Lista */}
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-sm text-gray-400">Cargando incidentes...</p>
              </div>
            ) : reportesFiltrados.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-sm text-gray-400">No hay incidentes pendientes</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reportesFiltrados.map((reporte) => (
  <div
    key={reporte._id}
    onClick={() => verDetalle(reporte)}
    className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
    <img src={icons[reporte.categoria]} className="w-9 h-9" alt={reporte.categoria} />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-800">{reporte.titulo}</p>
      <p className="text-xs text-gray-400 capitalize">{reporte.categoria} · {reporte.prioridad}</p>
      <p className="text-xs text-gray-400">
        {reporte.ubicacion?.direccion || `${reporte.ubicacion?.lat?.toFixed(4)}, ${reporte.ubicacion?.lng?.toFixed(4)}`}
      </p>
    </div>
    <span className="text-gray-300 text-sm">→</span>
  </div>
))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
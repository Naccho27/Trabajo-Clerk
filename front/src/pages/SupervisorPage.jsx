import { useState, useEffect } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { obtenerReportesPendientes, aprobarReporte, rechazarReporte, cambiarCategoria, cambiarPrioridad, obtenerDetalleReporte } from "../services/supervisorService";

const CATEGORIAS = ["baches", "inundacion", "alumbrado", "semaforo", "residuos"];
const PRIORIDADES = ["low", "medium", "high", "critical"];

const ICONOS = {
  baches: "⚠️",
  inundacion: "🌊",
  alumbrado: "💡",
  semaforo: "🚦",
  residuos: "🗑️",
  todos: "📍",
};

export default function SupervisorPage() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarPrioridades, setMostrarPrioridades] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    cargarReportes();
    verificarRol();
  }, []);

  const verificarRol = async () => {
    try {
      const token = await getToken({ template: "backend" });
      const response = await axios.post(
        "http://localhost:3000/api/auth/sync",
        {
          clerkId: user?.id,
          nombreUsuario: user?.username || user?.firstName || "Usuario",
          email: user?.primaryEmailAddress?.emailAddress || "sin-email@example.com",
          imagenPerfil: user?.imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEsAdmin(response.data.usuario.rol === "admin");
    } catch (error) {
      console.log("Error verificando rol:", error);
    }
  };

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

  const Header = ({ mostrarVolver = false }) => (
    <div className="bg-white px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-3">
        {mostrarVolver && (
          <button
            onClick={() => setDetalle(null)}
            className="text-gray-500 hover:text-blue-500 transition-colors text-xl">
            ←
          </button>
        )}
        <h1 className="text-xl font-bold">Urban<span className="text-blue-500">Log</span></h1>
      </div>
      <div className="flex items-center gap-4">
        {/* BOTON ADMIN - solo visible para admins */}
        {esAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
            ⚙️ Admin
          </button>
        )}
        <button
          onClick={() => navigate("/mapa")}
          className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors">
          🗺️ Ver mapa
        </button>
        <button
          onClick={() => signOut(() => window.location.href = "/login")}
          className="text-sm text-gray-600 flex items-center gap-1 hover:text-red-500 transition-colors">
          Cerrar Sesion 🔓
        </button>
      </div>
    </div>
  );

  // VISTA DETALLE
  if (detalle) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header mostrarVolver={true} />

        <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3 relative">
            <span className="text-3xl">{ICONOS[detalle.categoria] || "📍"}</span>
            <div className="flex-1 text-sm">
              <p className="font-semibold">{detalle.titulo || detalle.direccion || "Sin título"}</p>
              <p className="text-gray-500">
                Altitud: {detalle.ubicacion?.lat?.toFixed(4) || "x"} | Longitud: {detalle.ubicacion?.lng?.toFixed(4) || "x"}
              </p>
              <p className="text-gray-500">{detalle.categoria} | Prioridad: {detalle.prioridad || "x"}</p>
            </div>

            <img
              src={detalle.usuarioId?.imagenPerfil || "https://via.placeholder.com/40"}
              alt="perfil"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={() => {
                setMostrarCategorias(false);
                setMostrarPrioridades(false);
                setMostrarPerfil(!mostrarPerfil);
              }}
            />

            {mostrarPerfil && (
              <div className="absolute top-14 right-4 z-10 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center gap-2 w-48">
                <img
                  src={detalle.usuarioId?.imagenPerfil || "https://via.placeholder.com/60"}
                  alt="perfil"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <p className="font-semibold text-sm">{detalle.usuarioId?.nombreUsuario || "Usuario"}</p>
                <p className="text-xs text-gray-400">{detalle.usuarioId?.email || ""}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 relative">
            <button
              onClick={() => { setMostrarPrioridades(false); setMostrarPerfil(false); setMostrarCategorias(!mostrarCategorias); }}
              className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Cambiar categoría
            </button>
            <button
              onClick={() => { setMostrarCategorias(false); setMostrarPerfil(false); setMostrarPrioridades(!mostrarPrioridades); }}
              className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Cambiar prioridad
            </button>

            {mostrarCategorias && (
              <div className="absolute top-12 left-0 z-10 bg-white rounded-xl shadow-lg p-3 grid grid-cols-2 gap-3 w-56">
                {CATEGORIAS.map((cat) => (
                  <button key={cat} onClick={() => handleCambiarCategoria(cat)}
                    className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg">
                    <span className="text-2xl">{ICONOS[cat]}</span>
                    <span className="text-xs capitalize">{cat}</span>
                  </button>
                ))}
              </div>
            )}

            {mostrarPrioridades && (
              <div className="absolute top-12 right-0 z-10 bg-white rounded-xl shadow-lg p-3 grid grid-cols-2 gap-2 w-48">
                {PRIORIDADES.map((p) => (
                  <button key={p} onClick={() => handleCambiarPrioridad(p)}
                    className="border border-gray-300 rounded-lg py-2 px-3 text-sm capitalize hover:bg-gray-100">
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-2xl font-light text-center mb-3">Descripcion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {detalle.imagenes?.length > 0 ? (
                detalle.imagenes.map((img, i) => (
                  <img key={i} src={img} alt={`imagen-${i}`}
                    className="w-full rounded-lg object-cover max-h-48" />
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm col-span-2">Sin imágenes</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleRechazar}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-full transition-colors">
              RECHAZAR
            </button>
            <button onClick={handleAprobar}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition-colors">
              ACEPTAR
            </button>
          </div>
        </div>

        <div className="border-t bg-white flex justify-around py-3">
          <button onClick={() => setDetalle(null)} className="text-2xl">🕐</button>
          <button className="text-2xl">👤</button>
        </div>
      </div>
    );
  }

  // VISTA LISTA
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header mostrarVolver={false} />

      <div className="px-6 py-2 bg-white border-b">
        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar Registro..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex justify-center my-3">
        <span className="border border-pink-400 text-pink-500 rounded-full px-4 py-1 text-sm">
          Incidentes a Revision
        </span>
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col gap-2 px-4 pb-20">
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Cargando reportes...</p>
        ) : reportesFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No hay reportes pendientes</p>
        ) : (
          reportesFiltrados.map((reporte) => (
            <div key={reporte._id}
              className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
              <span className="text-3xl">{ICONOS[reporte.categoria] || "📍"}</span>
              <div className="flex-1 text-sm">
                <p className="font-medium">{reporte.titulo || reporte.direccion || "Sin título"}</p>
                <p className="text-gray-400">
                  Altitud: {reporte.ubicacion?.lat?.toFixed(4) || "x"} | Longitud: {reporte.ubicacion?.lng?.toFixed(4) || "x"}
                </p>
                <p className="text-gray-400">Tipo: {reporte.categoria || "x"} &nbsp; Prioridad: {reporte.prioridad || "x"}</p>
              </div>
              <button onClick={() => verDetalle(reporte)}
                className="text-xl text-gray-400 hover:text-blue-500">➡️</button>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white flex justify-around py-3">
        <button className="text-2xl">🕐</button>
        <button className="text-2xl">👤</button>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarios, bloquearUsuario, desbloquearUsuario } from "../services/adminService";
import { obtenerReportesPublicos } from "../services/reporteService";
import axios from "axios";

const ROLES = ["ciudadano", "supervisor", "operador", "admin"];

const ROL_COLORES = {
  ciudadano: "bg-gray-100 text-gray-600",
  supervisor: "bg-purple-100 text-purple-600",
  operador: "bg-green-100 text-green-600",
  admin: "bg-red-100 text-red-600",
};

const ICONOS = {
  baches: "⚠️",
  inundacion: "🌊",
  alumbrado: "💡",
  semaforo: "🚦",
  residuos: "🗑️",
};

export default function AdminPage() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [cambiandoRol, setCambiandoRol] = useState(null);
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [reportesUsuario, setReportesUsuario] = useState([]);
  const [loadingReportes, setLoadingReportes] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const token = await getToken({ template: "backend" });
      const data = await obtenerUsuarios(token);
      setUsuarios(data.usuarios || []);
    } catch (error) {
      console.log("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBloquear = async (id) => {
    try {
      const token = await getToken({ template: "backend" });
      await bloquearUsuario(id, token);
      cargarUsuarios();
    } catch (error) {
      console.log("Error bloqueando:", error);
    }
  };

  const handleDesbloquear = async (id) => {
    try {
      const token = await getToken({ template: "backend" });
      await desbloquearUsuario(id, token);
      cargarUsuarios();
    } catch (error) {
      console.log("Error desbloqueando:", error);
    }
  };

  const handleCambiarRol = async (id, nuevoRol) => {
    try {
      const token = await getToken({ template: "backend" });
      await axios.patch(
        `http://localhost:3000/api/admin/users/${id}/role`,
        { rol: nuevoRol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCambiandoRol(null);
      cargarUsuarios();
    } catch (error) {
      console.log("Error cambiando rol:", error);
    }
  };

  const verPerfil = async (usuario) => {
    setPerfilUsuario(usuario);
    setLoadingReportes(true);
    try {
      const data = await obtenerReportesPublicos();
      const reportes = (data.reportes || data || []).filter(
        (r) => r.usuarioId?.toString() === usuario._id?.toString()
      );
      setReportesUsuario(reportes);
    } catch (error) {
      console.log("Error cargando reportes:", error);
      setReportesUsuario([]);
    } finally {
      setLoadingReportes(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombreUsuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // VISTA PERFIL
  if (perfilUsuario) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">

        {/* HEADER */}
        <div className="bg-white px-6 py-3 flex items-center justify-between shadow">
          <div className="flex items-center gap-3">
            <button onClick={() => setPerfilUsuario(null)}
              className="text-gray-500 hover:text-blue-500 transition-colors text-xl">
              ←
            </button>
            <h1 className="text-xl font-bold">Urban<span className="text-blue-500">Log</span></h1>
          </div>
          <button onClick={() => signOut(() => window.location.href = "/login")}
            className="text-sm text-gray-600 hover:text-red-500 transition-colors">
            Cerrar Sesion 🔓
          </button>
        </div>

        {/* PERFIL */}
        <div className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <img
              src={perfilUsuario.imagenPerfil || "https://via.placeholder.com/60"}
              alt="perfil"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-lg">{perfilUsuario.nombreUsuario}</p>
              <p className="text-gray-400 text-sm">{perfilUsuario.email}</p>
              <div className="flex gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROL_COLORES[perfilUsuario.rol]}`}>
                  {perfilUsuario.rol}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${perfilUsuario.activo ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                  {perfilUsuario.activo ? "🟢 Activo" : "🔴 Bloqueado"}
                </span>
              </div>
            </div>
          </div>

          {/* REPORTES */}
          <div className="flex justify-center">
            <span className="border border-pink-400 text-pink-500 rounded-full px-4 py-1 text-sm">
              Reportes del usuario
            </span>
          </div>

          {loadingReportes ? (
            <p className="text-center text-gray-400">Cargando reportes...</p>
          ) : reportesUsuario.length === 0 ? (
            <p className="text-center text-gray-400">Este usuario no tiene reportes</p>
          ) : (
            reportesUsuario.map((reporte) => (
              <div key={reporte._id} className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">{ICONOS[reporte.categoria] || "📍"}</span>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{reporte.titulo || "Sin título"}</p>
                  <p className="text-gray-400">Tipo: {reporte.categoria || "x"} | Prioridad: {reporte.prioridad || "x"}</p>
                  <p className="text-gray-400">Estado: {reporte.estado || "x"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // VISTA LISTA
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* HEADER */}
      <div className="bg-white px-6 py-3 flex items-center justify-between shadow">
        <h1 className="text-xl font-bold">Urban<span className="text-blue-500">Log</span></h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/mapa")}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors">
            🗺️ Mapa
          </button>
          <button onClick={() => navigate("/supervisor")}
            className="text-sm text-purple-500 hover:text-purple-700 font-medium transition-colors">
            👀 Supervisor
          </button>
          <button onClick={() => navigate("/operador")}
            className="text-sm text-green-500 hover:text-green-700 font-medium transition-colors">
            🛠️ Operador
          </button>
          <button onClick={() => signOut(() => window.location.href = "/login")}
            className="text-sm text-gray-600 hover:text-red-500 transition-colors">
            Cerrar Sesion 🔓
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="px-6 py-2 bg-white border-b">
        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* TITULO */}
      <div className="flex justify-center my-3">
        <span className="border border-red-400 text-red-500 rounded-full px-4 py-1 text-sm">
          Panel Administrador
        </span>
      </div>

      {/* LISTA USUARIOS */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 px-4 pb-20">
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Cargando usuarios...</p>
        ) : usuariosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No hay usuarios</p>
        ) : (
          usuariosFiltrados.map((usuario) => (
            <div key={usuario._id} className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3 relative">

              {/* FOTO - al tocar muestra el perfil */}
              <img
                src={usuario.imagenPerfil || "https://via.placeholder.com/40"}
                alt="perfil"
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => verPerfil(usuario)}
              />

              {/* INFO */}
              <div className="flex-1 text-sm">
                <p className="font-semibold">{usuario.nombreUsuario}</p>
                <p className="text-gray-400">{usuario.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROL_COLORES[usuario.rol] || "bg-gray-100 text-gray-600"}`}>
                    {usuario.rol}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${usuario.activo ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {usuario.activo ? "🟢 Activo" : "🔴 Bloqueado"}
                  </span>
                </div>
              </div>

              {/* ACCIONES */}
              <div className="flex flex-col gap-1 items-end">
                <button
                  onClick={() => setCambiandoRol(cambiandoRol === usuario._id ? null : usuario._id)}
                  className="text-xs border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors">
                  Cambiar rol
                </button>
                {usuario.activo ? (
                  <button onClick={() => handleBloquear(usuario._id)}
                    className="text-xs border border-red-300 text-red-500 rounded-full px-3 py-1 hover:bg-red-50 transition-colors">
                    Bloquear
                  </button>
                ) : (
                  <button onClick={() => handleDesbloquear(usuario._id)}
                    className="text-xs border border-green-300 text-green-500 rounded-full px-3 py-1 hover:bg-green-50 transition-colors">
                    Desbloquear
                  </button>
                )}
              </div>

              {/* POPUP CAMBIAR ROL */}
              {cambiandoRol === usuario._id && (
                <div className="absolute top-16 right-4 z-10 bg-white rounded-xl shadow-lg p-3 flex flex-col gap-2 w-36">
                  {ROLES.map((r) => (
                    <button key={r} onClick={() => handleCambiarRol(usuario._id, r)}
                      className={`text-xs px-3 py-1.5 rounded-full text-left hover:opacity-80 transition-opacity ${ROL_COLORES[r] || "bg-gray-100 text-gray-600"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
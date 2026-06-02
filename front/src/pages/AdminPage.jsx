import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import Header from "../components/Navbar/Header";
import { obtenerUsuarios, bloquearUsuario, desbloquearUsuario } from "../services/adminService";
import { obtenerReportesPublicos } from "../services/reporteService";
import { icons } from "../assets/icons/icons.js";
import axios from "axios";

const ROLES = ["ciudadano", "supervisor", "operador", "admin"];

const ROL_COLORES = {
  ciudadano: "bg-gray-100 text-gray-600",
  supervisor: "bg-purple-100 text-purple-600",
  operador: "bg-green-100 text-green-600",
  admin: "bg-red-100 text-red-600",
};


export default function AdminPage() {
  const { getToken } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [cambiandoRol, setCambiandoRol] = useState(null);
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [reportesUsuario, setReportesUsuario] = useState([]);
  const [loadingReportes, setLoadingReportes] = useState(false);

  useEffect(() => { cargarUsuarios(); }, []);

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
        `${import.meta.env.VITE_API_URL}  /admin/users/${id}/role`,
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
      <div className="w-screen h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex justify-center overflow-hidden">
          <div className="w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pt-16 px-4 pb-6 flex flex-col gap-4">

              <button
                onClick={() => setPerfilUsuario(null)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                ← Volver
              </button>

              {/* Card perfil */}
              <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <img
                  src={perfilUsuario.imagenPerfil || "https://via.placeholder.com/60"}
                  alt="perfil"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{perfilUsuario.nombreUsuario}</p>
                  <p className="text-xs text-gray-400">{perfilUsuario.email}</p>
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

              {/* Título reportes */}
              <div className="flex items-center justify-center">
                <span
                  className="text-sm font-semibold px-5 py-1.5 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
                >
                  Reportes del usuario
                </span>
              </div>

              {loadingReportes ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-sm text-gray-400">Cargando reportes...</p>
                </div>
              ) : reportesUsuario.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-sm text-gray-400">Este usuario no tiene reportes</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {reportesUsuario.map((reporte) => (
                    <div key={reporte._id} className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3">
                      <img src={icons[reporte.categoria]} className="w-9 h-9" alt={reporte.categoria} />                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{reporte.titulo || "Sin título"}</p>
                        <p className="text-xs text-gray-400 capitalize">{reporte.categoria} · {reporte.prioridad}</p>
                        <p className="text-xs text-gray-400">Estado: {reporte.estado}</p>
                      </div>
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
                placeholder="Buscar usuario..."
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
                Panel Administrador
              </span>
            </div>

            {/* Lista */}
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-sm text-gray-400">Cargando usuarios...</p>
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-sm text-gray-400">No hay usuarios</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {usuariosFiltrados.map((usuario) => (
                  <div key={usuario._id} className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3 relative">

                    <img
                      src={usuario.imagenPerfil || "https://via.placeholder.com/40"}
                      alt="perfil"
                      className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => verPerfil(usuario)}
                    />

                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-800">{usuario.nombreUsuario}</p>
                      <p className="text-xs text-gray-400">{usuario.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROL_COLORES[usuario.rol] || "bg-gray-100 text-gray-600"}`}>
                          {usuario.rol}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${usuario.activo ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                          {usuario.activo ? "🟢 Activo" : "🔴 Bloqueado"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 items-end">
                      <button
                        onClick={() => setCambiandoRol(cambiandoRol === usuario._id ? null : usuario._id)}
                        className="text-xs border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors text-gray-600"
                      >
                        Cambiar rol
                      </button>
                      {usuario.activo ? (
                        <button onClick={() => handleBloquear(usuario._id)}
                          className="text-xs border border-red-200 text-red-500 rounded-full px-3 py-1 hover:bg-red-50 transition-colors">
                          Bloquear
                        </button>
                      ) : (
                        <button onClick={() => handleDesbloquear(usuario._id)}
                          className="text-xs border border-green-200 text-green-500 rounded-full px-3 py-1 hover:bg-green-50 transition-colors">
                          Desbloquear
                        </button>
                      )}
                    </div>

                    {/* Popup cambiar rol */}
                    {cambiandoRol === usuario._id && (
                      <div className="absolute top-16 right-4 z-10 bg-white rounded-2xl shadow-lg p-3 flex flex-col gap-2 w-36">
                        {ROLES.map((r) => (
                          <button key={r} onClick={() => handleCambiarRol(usuario._id, r)}
                            className={`text-xs px-3 py-1.5 rounded-full text-left hover:opacity-80 transition-opacity font-medium ${ROL_COLORES[r]}`}>
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
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
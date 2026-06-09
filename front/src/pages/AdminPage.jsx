import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarios, bloquearUsuario, desbloquearUsuario } from "../services/adminService";
import { obtenerReportesPublicos } from "../services/reporteService";
import { obtenerReportesPorEstado, obtenerReportesPorCategoria, obtenerReportesPorPrioridad, obtenerPorcentajeResueltos, obtenerTiempoPromedio } from "../services/analyticsService";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const ROLES = ["ciudadano", "supervisor", "operador", "admin"];

const ROL_COLORES = {
  ciudadano: "bg-gray-100 text-gray-600",
  supervisor: "bg-purple-100 text-purple-600",
  operador: "bg-green-100 text-green-600",
  admin: "bg-red-100 text-red-600",
};

const ESTADO_COLORES = {
  open: "bg-blue-100 text-blue-600",
  in_progress: "bg-yellow-100 text-yellow-600",
  resolved: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-600",
};

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "usuarios", label: "Usuarios", icon: "👥" },
  { key: "crear", label: "Crear usuario", icon: "➕" },
];

export default function AdminPage() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState("dashboard");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [cambiandoRol, setCambiandoRol] = useState(null);
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [reportesUsuario, setReportesUsuario] = useState([]);
  const [loadingReportes, setLoadingReportes] = useState(false);

  const [estadoData, setEstadoData] = useState([]);
  const [categoriaData, setCategoriaData] = useState([]);
  const [prioridadData, setPrioridadData] = useState([]);
  const [porcentaje, setPorcentaje] = useState(null);
  const [tiempoPromedio, setTiempoPromedio] = useState(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({ nombreUsuario: "", email: "", password: "", rol: "ciudadano" });
  const [creandoUsuario, setCreandoUsuario] = useState(false);
  const [errorCrear, setErrorCrear] = useState("");
  const [exitoCrear, setExitoCrear] = useState("");

  useEffect(() => { cargarTodo(); }, []);

  const cargarTodo = async () => {
    await Promise.all([cargarUsuarios(), cargarAnalytics()]);
  };

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

  const cargarAnalytics = async () => {
    try {
      const [estados, categorias, prioridades, resueltos, tiempo] = await Promise.all([
        obtenerReportesPorEstado(),
        obtenerReportesPorCategoria(),
        obtenerReportesPorPrioridad(),
        obtenerPorcentajeResueltos(),
        obtenerTiempoPromedio(),
      ]);
      setEstadoData(estados.data || []);
      setCategoriaData(categorias.data || []);
      setPrioridadData(prioridades.data || []);
      setPorcentaje(resueltos.data);
      setTiempoPromedio(tiempo.data);
    } catch (error) {
      console.log("Error cargando analytics:", error);
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
        `${API_URL}/admin/users/${id}/role`,
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

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setCreandoUsuario(true);
    setErrorCrear("");
    setExitoCrear("");
    try {
      const token = await getToken({ template: "backend" });
      await axios.post(
        `${API_URL}/admin/users`,
        nuevoUsuario,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExitoCrear("Usuario creado correctamente.");
      setNuevoUsuario({ nombreUsuario: "", email: "", password: "", rol: "ciudadano" });
      cargarUsuarios();
    } catch (error) {
      setErrorCrear(error.response?.data?.mensaje || "Error al crear usuario");
    } finally {
      setCreandoUsuario(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombreUsuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // VISTA PERFIL
  if (perfilUsuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Topbar signOut={signOut} navigate={navigate} />
        <div className="flex flex-1 pt-14">
          <Sidebar seccion={seccion} setSeccion={(s) => { setSeccion(s); setPerfilUsuario(null); }} />
          <div className="flex-1 ml-56 px-8 py-6 flex flex-col gap-4">
            <button onClick={() => setPerfilUsuario(null)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 w-fit">
              ← Volver
            </button>
            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6">
              <img src={perfilUsuario.imagenPerfil || "https://via.placeholder.com/60"}
                alt="perfil" className="w-16 h-16 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-lg text-gray-800">{perfilUsuario.nombreUsuario}</p>
                <p className="text-sm text-gray-400">{perfilUsuario.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROL_COLORES[perfilUsuario.rol]}`}>
                    {perfilUsuario.rol}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${perfilUsuario.activo ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {perfilUsuario.activo ? "🟢 Activo" : "🔴 Bloqueado"}
                  </span>
                </div>
              </div>
            </div>

            <p className="font-semibold text-gray-700">Reportes del usuario ({reportesUsuario.length})</p>

            {loadingReportes ? (
              <p className="text-gray-400 text-sm">Cargando reportes...</p>
            ) : reportesUsuario.length === 0 ? (
              <p className="text-gray-400 text-sm">Este usuario no tiene reportes</p>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Título</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Categoría</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Prioridad</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportesUsuario.map((r, i) => (
                      <tr key={r._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 text-gray-700">{r.titulo || "Sin título"}</td>
                        <td className="px-4 py-3 capitalize text-gray-500">{r.categoria}</td>
                        <td className="px-4 py-3 capitalize text-gray-500">{r.prioridad}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORES[r.estado] || "bg-gray-100 text-gray-600"}`}>
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar signOut={signOut} navigate={navigate} />
      <div className="flex flex-1 pt-14">

        {/* SIDEBAR */}
        <Sidebar seccion={seccion} setSeccion={setSeccion} />

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 ml-56 px-8 py-6">

          {/* DASHBOARD */}
          {seccion === "dashboard" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <p className="text-sm text-gray-400 mb-1">Total usuarios</p>
                  <p className="text-3xl font-bold text-gray-800">{usuarios.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <p className="text-sm text-gray-400 mb-1">% Resueltos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {porcentaje != null ? `${Number(porcentaje?.porcentaje ?? porcentaje).toFixed(1)}%` : "—"}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <p className="text-sm text-gray-400 mb-1">Tiempo promedio resolución</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {tiempoPromedio != null ? `${Number(tiempoPromedio?.promedioDias ?? tiempoPromedio).toFixed(1)} días` : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-700">Por estado</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-gray-400 font-medium">Estado</th>
                        <th className="text-right px-4 py-2 text-gray-400 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estadoData.map((e, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORES[e._id] || "bg-gray-100 text-gray-600"}`}>
                              {e._id}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-700">{e.cantidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-700">Por categoría</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-gray-400 font-medium">Categoría</th>
                        <th className="text-right px-4 py-2 text-gray-400 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriaData.map((c, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2 capitalize text-gray-600">{c._id}</td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-700">{c.cantidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-700">Por prioridad</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-gray-400 font-medium">Prioridad</th>
                        <th className="text-right px-4 py-2 text-gray-400 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prioridadData.map((p, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2 capitalize text-gray-600">{p._id}</td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-700">{p.cantidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* USUARIOS */}
          {seccion === "usuarios" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white w-full max-w-sm">
                <span className="text-gray-400 text-sm">🔍</span>
                <input type="text" placeholder="Buscar usuario..."
                  value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  className="outline-none text-sm w-full bg-transparent" />
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Usuario</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Rol</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-400">Cargando...</td></tr>
                    ) : usuariosFiltrados.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-400">No hay usuarios</td></tr>
                    ) : (
                      usuariosFiltrados.map((usuario, i) => (
                        <tr key={usuario._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <img src={usuario.imagenPerfil || "https://via.placeholder.com/32"}
                                alt="perfil"
                                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80"
                                onClick={() => verPerfil(usuario)} />
                              <span className="font-medium text-gray-800">{usuario.nombreUsuario}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{usuario.email}</td>
                          <td className="px-4 py-3">
                            <div className="relative">
                              <button onClick={() => setCambiandoRol(cambiandoRol === usuario._id ? null : usuario._id)}
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROL_COLORES[usuario.rol]} hover:opacity-80`}>
                                {usuario.rol} ▾
                              </button>
                              {cambiandoRol === usuario._id && (
                                <div className="absolute top-6 left-0 z-10 bg-white rounded-xl shadow-lg p-2 flex flex-col gap-1 w-32">
                                  {ROLES.map((r) => (
                                    <button key={r} onClick={() => handleCambiarRol(usuario._id, r)}
                                      className={`text-xs px-3 py-1.5 rounded-full text-left hover:opacity-80 font-medium ${ROL_COLORES[r]}`}>
                                      {r}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${usuario.activo ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                              {usuario.activo ? "🟢 Activo" : "🔴 Bloqueado"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {usuario.activo ? (
                              <button onClick={() => handleBloquear(usuario._id)}
                                className="text-xs border border-red-200 text-red-500 rounded-full px-3 py-1 hover:bg-red-50">
                                Bloquear
                              </button>
                            ) : (
                              <button onClick={() => handleDesbloquear(usuario._id)}
                                className="text-xs border border-green-200 text-green-500 rounded-full px-3 py-1 hover:bg-green-50">
                                Desbloquear
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CREAR USUARIO */}
          {seccion === "crear" && (
            <div className="max-w-md">
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                <p className="font-semibold text-gray-700 text-lg">Crear nuevo usuario</p>
                {errorCrear && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-2">{errorCrear}</p>}
                {exitoCrear && <p className="text-green-600 text-sm bg-green-50 rounded-lg p-2">{exitoCrear}</p>}
                <div className="flex flex-col gap-3">
                  <input type="text" placeholder="Nombre de usuario"
                    value={nuevoUsuario.nombreUsuario}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombreUsuario: e.target.value })}
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400" />
                  <input type="email" placeholder="Email"
                    value={nuevoUsuario.email}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400" />
                  <input type="password" placeholder="Contraseña"
                    value={nuevoUsuario.password}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400" />
                  <select value={nuevoUsuario.rol}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 bg-white">
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button onClick={handleCrearUsuario} disabled={creandoUsuario}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full py-2 text-sm transition-colors disabled:opacity-60">
                    {creandoUsuario ? "Creando..." : "Crear usuario"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Topbar({ signOut, navigate }) {
  const location = window.location.pathname;

  const btnStyle = (path) => {
    const isActive = location === path;
    return {
      background: isActive ? "linear-gradient(to bottom right, #ff4444, #e91e8c, #9c27b0, #3b82f6)" : "transparent",
    };
  };

  const btnClass = (path) => {
    const isActive = location === path;
    return `text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
      isActive ? "text-white" : "text-gray-500 hover:bg-gray-100"
    }`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm h-14">
      <h1 className="text-xl font-bold">Urban<span className="text-blue-500">Log</span></h1>
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/admin")} className={btnClass("/admin")} style={btnStyle("/admin")}>
          Admin
        </button>
        <button onClick={() => navigate("/supervisor")} className={btnClass("/supervisor")} style={btnStyle("/supervisor")}>
          Supervisor
        </button>
        <button onClick={() => navigate("/operador")} className={btnClass("/operador")} style={btnStyle("/operador")}>
          Operador
        </button>
        <button onClick={() => navigate("/mapa")} className={btnClass("/mapa")} style={btnStyle("/mapa")}>
          Mapa
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button onClick={() => signOut(() => window.location.href = "/login")}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors">
          Cerrar Sesion 🔓
        </button>
      </div>
    </div>
  );
}

function Sidebar({ seccion, setSeccion }) {
  return (
    <div className="fixed top-14 left-0 bottom-0 w-56 bg-white border-r border-gray-100 flex flex-col py-4 px-3 z-40">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Panel</p>
      {NAV_ITEMS.map((item) => (
        <button key={item.key} onClick={() => setSeccion(item.key)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left mb-1 ${seccion === item.key ? "text-white" : "text-gray-600 hover:bg-gray-100"}`}
          style={seccion === item.key ? { background: "linear-gradient(to bottom right, #ff4444, #e91e8c, #9c27b0, #3b82f6)" } : {}}>
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
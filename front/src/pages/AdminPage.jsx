import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Navbar/Header";
import DashboardSaludo from "../components/Panel/DashboardSaludo.jsx";
import PageHeader from "../components/Panel/PageHeader.jsx";
import BuscadorInput from "../components/Panel/BuscadorInput.jsx";
import { obtenerUsuarios, bloquearUsuario, desbloquearUsuario } from "../services/adminService";
import { obtenerReportesPublicos } from "../services/reporteService";
import { obtenerReportesPorEstado, obtenerReportesPorCategoria, obtenerReportesPorPrioridad, obtenerPorcentajeResueltos, obtenerTiempoPromedio } from "../services/analyticsService";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ROLES = ["ciudadano", "supervisor", "operador", "admin"];

const ROL_COLORES = {
  ciudadano:  "bg-gray-100 text-gray-600",
  supervisor: "bg-purple-100 text-purple-600",
  operador:   "bg-green-100 text-green-600",
  admin:      "bg-red-100 text-red-600",
};

const ESTADO_COLORES = {
  open:        "bg-blue-100 text-blue-600",
  in_progress: "bg-yellow-100 text-yellow-600",
  resolved:    "bg-green-100 text-green-600",
  rejected:    "bg-red-100 text-red-600",
};

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "usuarios",  label: "Usuarios" },
];

const selectClass = "border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 bg-white outline-none focus:border-blue-400 cursor-pointer";

function Sidebar({ seccion, setSeccion }) {
  return (
    <div className="fixed top-[56px] left-0 bottom-0 w-52 bg-white border-r border-gray-100 flex flex-col py-4 px-3 z-40">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Panel Admin</p>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => setSeccion(item.key)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left mb-1 ${
            seccion === item.key ? "text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
          style={seccion === item.key
            ? { background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }
            : {}}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function ModalCrearUsuario({ onClose, onSuccess }) {
  const { getToken } = useAuth();
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombreUsuario: "", email: "", password: "", rol: "ciudadano" });
  const [creandoUsuario, setCreandoUsuario] = useState(false);
  const [errorCrear, setErrorCrear] = useState("");

  const handleCrear = async () => {
    setCreandoUsuario(true);
    setErrorCrear("");
    try {
      const token = await getToken({ template: "backend" });
      await axios.post(
        `${API_URL}/admin/users`,
        nuevoUsuario,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (error) {
      setErrorCrear(error.response?.data?.mensaje || "Error al crear usuario");
    } finally {
      setCreandoUsuario(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4"
        style={{ animation: "fadeInUp 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-800 text-lg">Nuevo usuario</p>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
            ✕
          </button>
        </div>

        {errorCrear && <p className="text-red-500 text-sm bg-red-50 rounded-xl p-3">{errorCrear}</p>}

        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Nombre de usuario"
            value={nuevoUsuario.nombreUsuario}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombreUsuario: e.target.value })}
            className="border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
          <input type="email" placeholder="Email"
            value={nuevoUsuario.email}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
            className="border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
          <input type="password" placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            className="border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
          <select value={nuevoUsuario.rol}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
            className="border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-blue-400 bg-white">
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleCrear} disabled={creandoUsuario}
            className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}>
            {creandoUsuario ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState("dashboard");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtrosUsuarios, setFiltrosUsuarios] = useState({ rol: "", activo: "" });
  const [cambiandoRol, setCambiandoRol] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [reportesUsuario, setReportesUsuario] = useState([]);
  const [loadingReportes, setLoadingReportes] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const [estadoData, setEstadoData] = useState([]);
  const [categoriaData, setCategoriaData] = useState([]);
  const [prioridadData, setPrioridadData] = useState([]);
  const [porcentaje, setPorcentaje] = useState(null);
  const [tiempoPromedio, setTiempoPromedio] = useState(null);

  useEffect(() => { cargarTodo(); }, []);

  useEffect(() => {
    const handleClickFuera = () => setCambiandoRol(null);
    document.addEventListener("click", handleClickFuera);
    return () => document.removeEventListener("click", handleClickFuera);
  }, []);

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
    } catch (error) { console.log("Error bloqueando:", error); }
  };

  const handleDesbloquear = async (id) => {
    try {
      const token = await getToken({ template: "backend" });
      await desbloquearUsuario(id, token);
      cargarUsuarios();
    } catch (error) { console.log("Error desbloqueando:", error); }
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
    } catch (error) { console.log("Error cambiando rol:", error); }
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

  const usuariosFiltrados = usuarios.filter((u) => {
    const textMatch = u.nombreUsuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase());
    const rolMatch = !filtrosUsuarios.rol || u.rol === filtrosUsuarios.rol;
    const activoMatch = filtrosUsuarios.activo === "" ||
      (filtrosUsuarios.activo === "activo" ? u.activo === true : u.activo === false);
    return textMatch && rolMatch && activoMatch;
  });

  // VISTA PERFIL
  if (perfilUsuario) {
    return (
      <div className="w-screen h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex flex-1 overflow-hidden pt-[56px]">
          <Sidebar seccion={seccion} setSeccion={(s) => { setSeccion(s); setPerfilUsuario(null); }} />
          <div className="flex-1 ml-52 overflow-y-auto px-8 py-6 flex flex-col gap-4"
            style={{ animation: "fadeInUp 0.4s ease-out" }}>
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
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <Header />

      {mostrarModalCrear && (
        <ModalCrearUsuario
          onClose={() => setMostrarModalCrear(false)}
          onSuccess={cargarUsuarios}
        />
      )}

      {cambiandoRol && (
        <div
          className="fixed z-[9999] bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1 w-32"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          {ROLES.map((r) => (
            <button key={r} onClick={() => handleCambiarRol(cambiandoRol, r)}
              className={`text-xs px-3 py-1.5 rounded-full text-left hover:opacity-80 font-medium ${ROL_COLORES[r]}`}>
              {r}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden pt-[56px]">
        <Sidebar seccion={seccion} setSeccion={setSeccion} />

        <div className="flex-1 ml-52 overflow-y-auto px-8 py-6">

          {/* DASHBOARD */}
          {seccion === "dashboard" && (
            <div className="flex flex-col gap-6">
              <DashboardSaludo user={user} rol="Admin" />
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total usuarios",             value: usuarios.length, color: "text-gray-800", delay: "0ms" },
                  { label: "% Resueltos",                value: porcentaje != null ? `${Number(porcentaje?.porcentaje ?? porcentaje).toFixed(1)}%` : "—", color: "text-green-600", delay: "100ms" },
                  { label: "Tiempo promedio resolución", value: tiempoPromedio != null ? `${Number(tiempoPromedio?.promedioDias ?? tiempoPromedio).toFixed(1)} días` : "—", color: "text-blue-600", delay: "200ms" },
                ].map((card) => (
                  <div key={card.label} className="bg-white rounded-2xl shadow-sm p-5"
                    style={{ animation: `fadeInUp 0.5s ease-out ${card.delay} both` }}>
                    <p className="text-sm text-gray-400 mb-1">{card.label}</p>
                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { titulo: "Por estado",    data: estadoData,    colorFn: (e) => ESTADO_COLORES[e._id], delay: "300ms" },
                  { titulo: "Por categoría", data: categoriaData, colorFn: null, delay: "400ms" },
                  { titulo: "Por prioridad", data: prioridadData, colorFn: null, delay: "500ms" },
                ].map(({ titulo, data, colorFn, delay }) => (
                  <div key={titulo} className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    style={{ animation: `fadeInUp 0.5s ease-out ${delay} both` }}>
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-700">{titulo}</p>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-2 text-gray-400 font-medium">Nombre</th>
                          <th className="text-right px-4 py-2 text-gray-400 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2">
                              {colorFn ? (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorFn(item) || "bg-gray-100 text-gray-600"}`}>
                                  {item._id}
                                </span>
                              ) : (
                                <span className="capitalize text-gray-600">{item._id}</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-gray-700">{item.cantidad}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USUARIOS */}
          {seccion === "usuarios" && (
            <div className="flex flex-col gap-4" style={{ animation: "fadeInUp 0.4s ease-out" }}>

              {/* Header con botón */}
              <div className="flex items-start justify-between">
                <PageHeader
                  titulo="Usuarios"
                  subtitulo="Gestioná los roles y el acceso de los usuarios del sistema"
                />
                <button
                  onClick={() => setMostrarModalCrear(true)}
                  className="text-white text-sm font-semibold px-4 py-2 rounded-full shrink-0"
                  style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
                >
                  + Nuevo usuario
                </button>
              </div>

              {/* Filtros */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <BuscadorInput
                    value={busqueda}
                    onChange={setBusqueda}
                    placeholder="Buscar usuario..."
                  />
                </div>
                <select
                  value={filtrosUsuarios.rol}
                  onChange={(e) => setFiltrosUsuarios({ ...filtrosUsuarios, rol: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Todos los roles</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
                <select
                  value={filtrosUsuarios.activo}
                  onChange={(e) => setFiltrosUsuarios({ ...filtrosUsuarios, activo: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
                {(filtrosUsuarios.rol || filtrosUsuarios.activo || busqueda) && (
                  <button
                    onClick={() => { setFiltrosUsuarios({ rol: "", activo: "" }); setBusqueda(""); }}
                    className="text-xs text-red-400 hover:text-red-600 px-2"
                  >
                    Limpiar filtros ✕
                  </button>
                )}
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
                    ) : usuariosFiltrados.map((usuario, i) => (
                      <tr key={usuario._id}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        style={{ animation: `fadeInUp 0.3s ease-out ${i * 40}ms both` }}>
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setDropdownPos({ top: rect.bottom + 4, left: rect.left });
                              setCambiandoRol(cambiandoRol === usuario._id ? null : usuario._id);
                            }}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROL_COLORES[usuario.rol]} hover:opacity-80`}
                          >
                            {usuario.rol} ▾
                          </button>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
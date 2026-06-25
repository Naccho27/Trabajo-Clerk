import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";
import { useCategorias } from "../../context/CategoriasContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfileModal({ onClose, usuarioExterno = null }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [usuarioBD, setUsuarioBD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  const esPerfilPropio = !usuarioExterno;

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = await getToken({ template: "backend" });

        if (esPerfilPropio) {
          const { data: dataUsuario } = await axios.get(
            `${API_URL}/auth/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUsuarioBD(dataUsuario.usuario);

          const { data } = await axios.get(
            `${API_URL}/reportes/mis-reportes`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReportes(data.reportes || []);
        } else {
          const { data } = await axios.get(`${API_URL}/reportes/publicos`);
          const suyos = (data.reportes || []).filter(
            (r) => r.usuarioId?.toString() === usuarioExterno._id?.toString()
          );
          setReportes(suyos);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [usuarioExterno?._id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  const nombre = esPerfilPropio
    ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
    : usuarioExterno.nombreUsuario;

  const email = esPerfilPropio
    ? user?.primaryEmailAddress?.emailAddress
    : null;

  const imagenUrl = esPerfilPropio
    ? user?.imageUrl
    : usuarioExterno.imagenPerfil;

  const roles = esPerfilPropio
    ? (usuarioBD?.roles ?? [])
    : (usuarioExterno.roles ?? (usuarioExterno.rol ? [usuarioExterno.rol] : []));

  const { categorias } = useCategorias();
  const getIconCategoria = (nombre) => {
    const cat = categorias.find((c) => c.nombre === nombre);
    return cat?.imagen || icons[nombre] || icons.todos;
  };

  return (
    <div className="fixed inset-0 z-[1002] bg-black/40" onClick={handleClose}>
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-20 max-h-[85vh] overflow-y-auto w-full max-w-2xl ${closing ? "slide-down" : "slide-up"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-pink-500 font-semibold">Perfil</p>
            <p className="text-lg font-bold dark:text-white">{nombre}</p>
            {email && <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>}
          </div>
          {imagenUrl ? (
            <img src={imagenUrl} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-semibold text-blue-600 dark:text-blue-300">
              {nombre?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>

        <hr className="mb-3 dark:border-gray-700" />
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Roles:</span>
          {roles.length === 0 ? (
            <span className="text-sm text-gray-400 dark:text-gray-500">...</span>
          ) : roles.map((r) => (
            <span
              key={r}
              className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {r}
            </span>
          ))}
        </div>
        <hr className="mb-3 dark:border-gray-700" />
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          <span className="font-semibold">Cantidad Reportes:</span>{" "}
          {loading ? "..." : reportes.length}
        </p>
        <hr className="mb-3 dark:border-gray-700" />

        {loading ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Cargando reportes...</p>
        ) : reportes.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">No tiene reportes aún</p>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {reportes.map((reporte) => (
              <div key={reporte._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={getIconCategoria(reporte.categoria)} className="w-8 h-8" alt={reporte.categoria} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{reporte.titulo}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
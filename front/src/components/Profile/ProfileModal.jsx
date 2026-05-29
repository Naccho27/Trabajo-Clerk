import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfileModal({ onClose, usuarioExterno = null }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  const esPerfliPropio = !usuarioExterno;

  useEffect(() => {
    const cargarReportes = async () => {
      try {
        const token = await getToken({ template: "backend" });

        if (esPerfliPropio) {
          // perfil propio — endpoint privado
          const { data } = await axios.get(
            `${API_URL}/reportes/mis-reportes`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReportes(data.reportes || []);
        } else {
          // perfil ajeno — filtramos desde públicos
          const { data } = await axios.get(`${API_URL}/reportes/publicos`);
          const suyos = (data.reportes || []).filter(
            (r) => r.usuarioId?.toString() === usuarioExterno._id?.toString()
          );
          setReportes(suyos);
        }
      } catch (error) {
        console.error("Error cargando reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarReportes();
  }, [usuarioExterno?._id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  // datos a mostrar según si es propio o ajeno
  const nombre = esPerfliPropio
    ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
    : usuarioExterno.nombreUsuario;

  const email = esPerfliPropio
    ? user?.primaryEmailAddress?.emailAddress
    : null;

  const imagenUrl = esPerfliPropio
    ? user?.imageUrl
    : usuarioExterno.imagenPerfil;

  const rol = esPerfliPropio ? "ciudadano" : usuarioExterno.rol;

  return (
    <div className="fixed inset-0 z-[1002] bg-black/40" onClick={handleClose}>
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-t-3xl p-6 pb-20 max-h-[85vh] overflow-y-auto w-full max-w-2xl ${closing ? "slide-down" : "slide-up"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-pink-500 font-semibold">Perfil</p>
            <p className="text-lg font-bold">{nombre}</p>
            {email && <p className="text-sm text-gray-500">{email}</p>}
          </div>
          {imagenUrl ? (
            <img src={imagenUrl} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-600">
              {nombre?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>

        <hr className="mb-3" />
        <p className="text-sm text-gray-700 mb-3">
          <span className="font-semibold">Rol:</span> {rol}
        </p>
        <hr className="mb-3" />
        <p className="text-sm text-gray-700 mb-4">
          <span className="font-semibold">Cantidad Reportes:</span>{" "}
          {loading ? "..." : reportes.length}
        </p>
        <hr className="mb-3" />

        {loading ? (
          <p className="text-sm text-gray-400 text-center">Cargando reportes...</p>
        ) : reportes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">No tiene reportes aún</p>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {reportes.map((reporte) => (
              <div key={reporte._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={icons[reporte.categoria]} className="w-8 h-8" />
                  <span className="text-sm text-gray-700">{reporte.titulo}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
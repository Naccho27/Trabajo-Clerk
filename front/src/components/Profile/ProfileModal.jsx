import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfileModal({ onClose }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const cargarMisReportes = async () => {
      try {
        const token = await getToken({ template: "backend" });
        const response = await axios.get(
          `${API_URL}/reportes/mis-reportes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReportes(response.data.reportes || []);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarMisReportes();
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  return (
    <div className="fixed inset-0 z-[1001] bg-black/40" onClick={handleClose}>
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-t-3xl p-6 pb-20 max-h-[85vh] overflow-y-auto w-full max-w-2xl ${closing ? "slide-down" : "slide-up"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-pink-500 font-semibold">Perfil</p>
            <p className="text-lg font-bold">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          {user?.imageUrl ? (
            <img src={user.imageUrl} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white">👤</div>
          )}
        </div>

        <hr className="mb-3" />
        <p className="text-sm text-gray-700 mb-3"><span className="font-semibold">Rol:</span> ciudadano</p>
        <hr className="mb-3" />
        <p className="text-sm text-gray-700 mb-4"><span className="font-semibold">Cantidad Reportes:</span> {loading ? "..." : reportes.length}</p>
        <hr className="mb-3" />

        {loading ? (
          <p className="text-sm text-gray-400 text-center">Cargando reportes...</p>
        ) : reportes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">No tenés reportes aún</p>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {reportes.map((reporte) => (
              <div key={reporte._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={icons[reporte.categoria]} className="w-8 h-8" />
                  <span className="text-sm text-gray-700">{reporte.titulo}</span>
                </div>
                <button className="border border-red-400 rounded-full w-8 h-8 flex items-center justify-center text-red-400 text-xs">
                  •••
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
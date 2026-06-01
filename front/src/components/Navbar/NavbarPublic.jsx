import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCIONES = {
  historial:   "ver tu historial",
  misReportes: "ver tus reportes",
  perfil:      "ver tu perfil",
  crear:       "crear un reporte",
};

export default function NavbarPublic() {
  const [toast, setToast] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const navigate = useNavigate();

  const handleRestringido = (accion) => {
    setToast(accion);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
    setTimeout(() => setToast(null), 4500);
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="absolute top-32 left-0 right-0 z-[1100] flex justify-center px-4">
          <div
            className={`bg-gray-900 text-white text-sm px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 max-w-sm transition-all duration-500 ${
              toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            <span>Necesitás una cuenta para {ACCIONES[toast]}</span>
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-semibold underline whitespace-nowrap"
            >
              Registrarse
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-[1000] flex justify-center">
        <div className="bg-white shadow-lg rounded-t-3xl flex items-center justify-around px-4 py-3 w-full max-w-4xl">
          <button className="flex flex-col items-center gap-1">
            <span className="text-xl">🗺️</span>
            <span className="text-xs text-blue-500 font-semibold">Mapa</span>
          </button>

          <button
            onClick={() => handleRestringido("historial")}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-xl">🕐</span>
            <span className="text-xs text-gray-500">Historial</span>
          </button>

          <button
            onClick={() => handleRestringido("crear")}
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg -mt-6"
            style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
          >
            <span className="text-white text-4xl leading-none mb-1">+</span>
          </button>

          <button
            onClick={() => handleRestringido("misReportes")}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-xl">📋</span>
            <span className="text-xs text-gray-500">Mis Reportes</span>
          </button>

          <button
            onClick={() => handleRestringido("perfil")}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-xl">👤</span>
            <span className="text-xs text-gray-500">Perfil</span>
          </button>
        </div>
      </div>
    </>
  );
}
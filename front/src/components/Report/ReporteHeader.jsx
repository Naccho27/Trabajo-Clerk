import { useState } from "react";
import { icons } from "../../assets/icons/icons.js";

const PRIORIDAD_CONFIG = {
  low:      { label: "Baja",    color: "#888780", bg: "#88878015" },
  medium:   { label: "Media",   color: "#378ADD", bg: "#378ADD15" },
  high:     { label: "Alta",    color: "#BA7517", bg: "#BA751715" },
  critical: { label: "Crítica", color: "#E24B4A", bg: "#E24B4A15" },
};

export default function ReporteHeader({ reporte }) {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const prior = PRIORIDAD_CONFIG[reporte.prioridad];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
      <img src={icons[reporte.categoria]} className="w-10 h-10" alt={reporte.categoria} />
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{reporte.titulo}</p>
        <p className="text-xs text-gray-400 capitalize">{reporte.categoria}</p>
        {prior && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block"
            style={{ background: prior.bg, color: prior.color }}
          >
            {prior.label}
          </span>
        )}
      </div>
      <div className="relative">
        <img
          src={reporte.usuarioId?.imagenPerfil || "https://via.placeholder.com/40"}
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          alt="perfil"
          onClick={() => setMostrarPerfil(!mostrarPerfil)}
        />
        {mostrarPerfil && (
          <div className="absolute top-12 right-0 z-10 bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center gap-2 w-48">
            <img
              src={reporte.usuarioId?.imagenPerfil || "https://via.placeholder.com/60"}
              className="w-16 h-16 rounded-full object-cover"
              alt="perfil"
            />
            <p className="font-semibold text-sm text-gray-800">{reporte.usuarioId?.nombreUsuario || "Usuario"}</p>
            <p className="text-xs text-gray-400">{reporte.usuarioId?.email || ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}
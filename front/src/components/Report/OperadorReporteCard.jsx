import { icons } from "../../assets/icons/icons.js";

const ESTADO_BADGE = {
  validated:   { bg: "bg-purple-100", text: "text-purple-800", label: "Validado" },
  in_progress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En progreso" },
  resolved:    { bg: "bg-green-100",  text: "text-green-800",  label: "Resuelto" },
};

const PRIORIDAD_COLOR = {
  low:      "text-gray-400",
  medium:   "text-blue-500",
  high:     "text-amber-500",
  critical: "text-red-500",
};

export default function OperadorReporteCard({ reporte, onClick }) {
  const badge = ESTADO_BADGE[reporte.estado];
  const prioridadColor = PRIORIDAD_COLOR[reporte.prioridad] ?? "text-gray-400";

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3">
        <img src={icons[reporte.categoria]} className="w-9 h-9" alt={reporte.categoria} />
        <div>
          <p className="text-sm font-semibold text-gray-800">{reporte.titulo}</p>
          <p className="text-xs text-gray-400">
            {reporte.ubicacion?.direccion ?? "Sin dirección"} · {reporte.ubicacion?.ciudad}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {badge && (
              <span className={`${badge.bg} ${badge.text} text-xs px-2 py-0.5 rounded-full`}>
                {badge.label}
              </span>
            )}
            <span className={`text-xs font-medium ${prioridadColor}`}>
              {reporte.prioridad}
            </span>
          </div>
        </div>
      </div>
      <button
        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs"
      >
        →
      </button>
    </div>
  );
}
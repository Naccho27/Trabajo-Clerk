import { icons } from "../../assets/icons/icons.js";

const ESTADO_BADGE = {
  validated:   { bg: "bg-purple-100", text: "text-purple-800", label: "Validado" },
  in_progress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En progreso" },
  resolved:    { bg: "bg-green-100",  text: "text-green-800",  label: "Resuelto" },
  rejected:    { bg: "bg-red-100",    text: "text-red-700",    label: "Rechazado" },
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
      className="flex items-center justify-between bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4">
        <img src={icons[reporte.categoria]} className="w-12 h-12" alt={reporte.categoria} />
        <div>
          <p className="text-base font-semibold text-gray-800 mb-0.5">{reporte.titulo}</p>
          <p className="text-sm text-gray-400 mb-2">
            {reporte.ubicacion?.direccion ?? "Sin dirección"} · {reporte.ubicacion?.ciudad}
          </p>
          <div className="flex items-center gap-2">
            {badge && (
              <span className={`${badge.bg} ${badge.text} text-xs px-3 py-1 rounded-full font-medium`}>
                {badge.label}
              </span>
            )}
            <span className={`text-xs font-medium ${prioridadColor}`}>
              {reporte.prioridad}
            </span>
            {(reporte.estado === "resolved" || reporte.estado === "rejected") && (
              <span className="text-xs text-gray-400">
                {new Date(reporte.fechaResolucion || reporte.updatedAt).toLocaleDateString("es-AR")}
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
        →
      </button>
    </div>
  );
}
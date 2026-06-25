import { icons } from "../../assets/icons/icons.js";
import { useCategorias } from "../../context/CategoriasContext.jsx";

const ESTADO_BADGE = {
  validated:   { bg: "bg-purple-100 dark:bg-purple-900", text: "text-purple-800 dark:text-purple-200", label: "Validado" },
  in_progress: { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-800 dark:text-yellow-200", label: "En progreso" },
  resolved:    { bg: "bg-green-100 dark:bg-green-900",   text: "text-green-800 dark:text-green-200",   label: "Resuelto" },
  rejected:    { bg: "bg-red-100 dark:bg-red-900",       text: "text-red-700 dark:text-red-300",       label: "Rechazado" },
};

const PRIORIDAD_COLOR = {
  low:      "text-gray-400 dark:text-gray-500",
  medium:   "text-blue-500 dark:text-blue-400",
  high:     "text-amber-500 dark:text-amber-400",
  critical: "text-red-500 dark:text-red-400",
};

export default function OperadorReporteCard({ reporte, onClick }) {
  const { categorias } = useCategorias();
  const badge = ESTADO_BADGE[reporte.estado];
  const prioridadColor = PRIORIDAD_COLOR[reporte.prioridad] ?? "text-gray-400 dark:text-gray-500";

  const getIcono = (nombre) => {
    const cat = categorias.find(c => c.nombre === nombre);
    return cat?.imagen || icons[nombre] || icons.todos;
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3">
        <img src={getIcono(reporte.categoria)} className="w-9 h-9" alt={reporte.categoria} />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{reporte.titulo}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
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
            {(reporte.estado === "resolved" || reporte.estado === "rejected") && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(reporte.fechaResolucion || reporte.updatedAt).toLocaleDateString("es-AR")}
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs">
        →
      </button>
    </div>
  );
}
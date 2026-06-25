import { icons } from "../../assets/icons/icons.js";
import { useCategorias } from "../../context/CategoriasContext.jsx";

const ESTADO_CONFIG = {
  validated:   { bg: "bg-purple-100", text: "text-purple-800", label: "Validado" },
  in_progress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En progreso" },
  resolved:    { bg: "bg-green-100",  text: "text-green-800",  label: "Resuelto" },
  rejected:    { bg: "bg-red-100",    text: "text-red-700",    label: "Rechazado" },
};

const PRIORIDAD_CONFIG = {
  low:      { label: "Baja",    color: "#888780", bg: "#88878015" },
  medium:   { label: "Media",   color: "#378ADD", bg: "#378ADD15" },
  high:     { label: "Alta",    color: "#BA7517", bg: "#BA751715" },
  critical: { label: "Crítica", color: "#E24B4A", bg: "#E24B4A15" },
};

export default function ReporteCard({ reporte, onClick, mostrarEstado = true, delay = "0ms" }) {
  const { categorias } = useCategorias();
  const estado = ESTADO_CONFIG[reporte.estado];
  const prioridad = PRIORIDAD_CONFIG[reporte.prioridad];

  const getIcono = (nombre) => {
    const cat = categorias.find(c => c.nombre === nombre);
    return cat?.imagen || icons[nombre] || icons.todos;
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
      style={{ animation: `fadeInUp 0.4s ease-out ${delay} both` }}
    >
      <div className="flex items-center gap-4">
        <img src={getIcono(reporte.categoria)} className="w-12 h-12" alt={reporte.categoria} />
        <div>
          <p className="text-base font-semibold text-gray-800 mb-0.5">{reporte.titulo}</p>
          <p className="text-sm text-gray-400 mb-2">
            {reporte.ubicacion?.direccion ?? "Sin dirección"} · {reporte.ubicacion?.ciudad}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {mostrarEstado && estado && (
              <span className={`${estado.bg} ${estado.text} text-xs px-3 py-1 rounded-full font-medium`}>
                {estado.label}
              </span>
            )}
            {prioridad && (
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: prioridad.bg, color: prioridad.color }}
              >
                {prioridad.label}
              </span>
            )}
            {(reporte.estado === "resolved" || reporte.estado === "rejected") && (
              <span className="text-xs text-gray-400">
                {new Date(reporte.fechaResolucion || reporte.updatedAt).toLocaleDateString("es-AR")}
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 shrink-0">
        →
      </button>
    </div>
  );
}
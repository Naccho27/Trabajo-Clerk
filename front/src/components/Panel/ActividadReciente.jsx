import { icons } from "../../assets/icons/icons.js";
import { useCategorias } from "../../context/CategoriasContext.jsx";

export default function ActividadReciente({ reportes, estadoConfig, delay = "400ms" }) {
  const { categorias } = useCategorias();

  const getIcono = (nombre) => {
    const cat = categorias.find(c => c.nombre === nombre);
    return cat?.imagen || icons[nombre] || icons.todos;
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm"
      style={{ animation: `fadeInUp 0.5s ease-out ${delay} both` }}
    >
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Actividad reciente</p>
      <div className="flex flex-col divide-y divide-gray-50 dark:divide-gray-800">
        {reportes.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No hay actividad aún</p>
        ) : reportes.map(r => {
          const est = estadoConfig[r.estado] || { label: r.estado, color: "#999" };
          return (
            <div key={r._id} className="flex items-center gap-3 py-2.5">
              <img src={getIcono(r.categoria)} className="w-5 h-5 shrink-0" alt={r.categoria} />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{r.titulo}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                style={{ background: `${est.color}15`, color: est.color }}
              >
                {est.label}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-10 text-right">
                {new Date(r.updatedAt || r.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const CATEGORIAS = ["baches", "residuos", "alumbrado", "semaforo", "inundacion"];
const PRIORIDADES = ["low", "medium", "high", "critical"];

const PRIORIDAD_LABELS = {
  low: "Baja", medium: "Media", high: "Alta", critical: "Crítica",
};

const ESTADO_LABELS = {
  validated: "Validado", in_progress: "En progreso",
  resolved: "Resuelto", rejected: "Rechazado",
};

export default function FiltrosTabla({ filtros, onChange, mostrarEstado = false }) {
  const set = (key, val) => onChange({ ...filtros, [key]: val });

  const selectClass = "border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 outline-none focus:border-blue-400 cursor-pointer";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select value={filtros.categoria} onChange={(e) => set("categoria", e.target.value)} className={selectClass}>
        <option value="">Todas las categorías</option>
        {CATEGORIAS.map((c) => (
          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
        ))}
      </select>

      <select value={filtros.prioridad} onChange={(e) => set("prioridad", e.target.value)} className={selectClass}>
        <option value="">Todas las prioridades</option>
        {PRIORIDADES.map((p) => (
          <option key={p} value={p}>{PRIORIDAD_LABELS[p]}</option>
        ))}
      </select>

      <div className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 bg-white dark:bg-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Desde</span>
        <input
          type="date"
          value={filtros.fechaDesde}
          onChange={(e) => set("fechaDesde", e.target.value)}
          className="text-xs text-gray-600 dark:text-gray-300 outline-none bg-transparent cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 bg-white dark:bg-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Hasta</span>
        <input
          type="date"
          value={filtros.fechaHasta}
          onChange={(e) => set("fechaHasta", e.target.value)}
          className="text-xs text-gray-600 dark:text-gray-300 outline-none bg-transparent cursor-pointer"
        />
      </div>

      {(filtros.categoria || filtros.prioridad || filtros.estado || filtros.fechaDesde || filtros.fechaHasta) && (
        <button
          onClick={() => onChange({ categoria: "", prioridad: "", estado: "", fechaDesde: "", fechaHasta: "" })}
          className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 px-2"
        >
          Limpiar filtros ✕
        </button>
      )}
    </div>
  );
}
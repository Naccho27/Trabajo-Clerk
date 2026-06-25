import { icons } from "../../assets/icons/icons.js";

const CATEGORIA_COLORS = {
  baches:     "#378ADD",
  residuos:   "#639922",
  alumbrado:  "#BA7517",
  semaforo:   "#7F77DD",
  inundacion: "#D4537E",
};

const CATEGORIA_LABELS = {
  baches: "Baches", residuos: "Residuos", alumbrado: "Alumbrado",
  semaforo: "Semáforo", inundacion: "Inundación",
};

const CATEGORIAS = ["baches", "residuos", "alumbrado", "semaforo", "inundacion"];

export default function BarrasCategoria({ reportes, titulo = "Reportes por categoría", delay = "300ms" }) {
  const data = CATEGORIAS.map(cat => ({
    name: cat,
    label: CATEGORIA_LABELS[cat],
    total: reportes.filter(r => r.categoria === cat).length,
  }));
  const max = Math.max(...data.map(d => d.total), 1);

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm"
      style={{ animation: `fadeInUp 0.5s ease-out ${delay} both` }}
    >
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">{titulo}</p>
      <div className="flex flex-col gap-3">
        {data.map((item) => {
          const pct = Math.round((item.total / max) * 100);
          return (
            <div key={item.name} className="flex items-center gap-3">
              <img src={icons[item.name]} className="w-5 h-5 shrink-0" alt={item.label} />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-20 shrink-0">{item.label}</span>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: CATEGORIA_COLORS[item.name],
                    transition: "width 1s ease-out"
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-4 text-right shrink-0">{item.total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
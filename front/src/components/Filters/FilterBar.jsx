import { icons } from "../../assets/icons/icons.js";

const categorias = [
  { id: "todos", label: "Todos", icon: icons.todos },
  { id: "baches", label: "Bache", icon: icons.baches },
  { id: "residuos", label: "Residuos", icon: icons.residuos },
  { id: "alumbrado", label: "Alumbrado", icon: icons.alumbrado },
  { id: "semaforo", label: "Semáforo", icon: icons.semaforo },
  { id: "inundacion", label: "Inundación", icon: icons.inundacion },
];

export default function FilterBar({ filtroActivo, onFiltroChange }) {
  return (
    <div className="absolute bottom-20 left-4 right-4 z-[1000] bg-white shadow-lg rounded-3xl flex items-center justify-around px-2 py-3 overflow-x-auto">
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFiltroChange(cat.id)}
          className={`flex flex-col items-center gap-1 min-w-[50px] ${
            filtroActivo === cat.id ? "opacity-100" : "opacity-50"
          }`}
        >
          <img src={cat.icon} alt={cat.label} className="w-8 h-8" />
          <span className="text-xs text-gray-600">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
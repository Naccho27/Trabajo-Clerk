import { icons } from "../../assets/icons/icons.js";

const categorias = [
  { id: "todos", label: "Todos", icon: icons.todos },
  { id: "baches", label: "Bache", icon: icons.baches },
  { id: "residuos", label: "Residuos", icon: icons.residuos },
  { id: "alumbrado", label: "Alumbrado", icon: icons.alumbrado },
  { id: "semaforo", label: "Semáforo", icon: icons.semaforo },
  { id: "inundacion", label: "Inundación", icon: icons.inundacion },
];

export default function BottomBar({ filtroActivo, onFiltroChange }) {
  return (
    <>
      {/* Barra de filtros */}
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

      {/* Navbar inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white shadow-lg rounded-t-3xl flex items-center justify-around px-4 py-3">
        <button className="flex flex-col items-center gap-1">
          <span className="text-xl">🗺️</span>
          <span className="text-xs text-blue-500 font-semibold">Mapa</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <span className="text-xl">🕐</span>
          <span className="text-xs text-gray-500">Historial</span>
        </button>

        <button
          className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg -mt-6"
          style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
        >
          <span className="text-white text-4xl leading-none mb-1">+</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <span className="text-xl">📋</span>
          <span className="text-xs text-gray-500">Mis Reportes</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <span className="text-xl">👤</span>
          <span className="text-xs text-gray-500">Perfil</span>
        </button>
      </div>
    </>
  );
}
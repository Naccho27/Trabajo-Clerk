import { icons } from "../../assets/icons/icons.js";
import { useCategorias } from "../../context/CategoriasContext.jsx";

export default function FilterBar({ filtroActivo, onFiltroChange }) {
  const { categorias, loading } = useCategorias();

  if (loading) return null;

  const opciones = [
    { id: "todos", label: "Todos", icon: icons.todos },
    ...categorias.map((cat) => ({
      id: cat.nombre,
      label: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1),
      icon: cat.imagen || icons.todos,
    })),
  ];

  return (
    <div className="absolute bottom-20 left-0 right-0 z-[1000] flex justify-center px-4">
      <div className="bg-white shadow-lg rounded-3xl flex items-center justify-around px-2 py-3 overflow-x-auto w-full max-w-2xl">
        {opciones.map((cat) => (
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
    </div>
  );
}
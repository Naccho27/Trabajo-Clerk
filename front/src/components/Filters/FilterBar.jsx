import { useState } from "react";
import { icons } from "../../assets/icons/icons.js";
import { useCategorias } from "../../context/CategoriasContext.jsx";

const VISIBLES = 4;

export default function FilterBar({ filtroActivo, onFiltroChange }) {
  const { categorias, loading } = useCategorias();
  const [mostrarMas, setMostrarMas] = useState(false);

  if (loading) return null;

  const opciones = [
    { id: "todos", label: "Todos", icon: icons.todos },
    ...categorias.map((cat) => ({
      id: cat.nombre,
      label: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1),
      icon: cat.imagen || icons.todos,
    })),
  ];

  const visibles = opciones.slice(0, VISIBLES);
  const extras = opciones.slice(VISIBLES);

  const handleSeleccionar = (id) => {
    onFiltroChange(id);
    setMostrarMas(false);
  };

  return (
    <div className="absolute bottom-24 left-0 right-0 z-[400] flex justify-center px-4">
      <div className="relative w-full max-w-md md:max-w-2xl">

        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-3xl flex items-center justify-around px-2 py-3 w-full border border-gray-100 dark:border-gray-800">
          {visibles.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSeleccionar(cat.id)}
              className={`flex flex-col items-center gap-1 min-w-[50px] transition-opacity ${
                filtroActivo === cat.id ? "opacity-100" : "opacity-50"
              }`}
            >
              <img src={cat.icon} alt={cat.label} className="w-8 h-8" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{cat.label}</span>
            </button>
          ))}

          {extras.length > 0 && (
            <button
              onClick={() => setMostrarMas(!mostrarMas)}
              className="flex flex-col items-center gap-1 min-w-[50px] opacity-70"
            >
              <span className="text-2xl dark:text-gray-300">⋯</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Más</span>
            </button>
          )}
        </div>

        {mostrarMas && extras.length > 0 && (
          <div
            className="absolute bottom-full mb-2 right-0 z-[2000] bg-white dark:bg-gray-800 shadow-xl rounded-2xl w-64 py-3 px-2 grid grid-cols-3 gap-2 border border-gray-100 dark:border-gray-700"
            style={{ animation: "fadeInUp 0.2s ease-out" }}
          >
            {extras.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSeleccionar(cat.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-opacity hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  filtroActivo === cat.id ? "opacity-100" : "opacity-60"
                }`}
              >
                <img src={cat.icon} alt={cat.label} className="w-8 h-8" />
                <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{cat.label}</span>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
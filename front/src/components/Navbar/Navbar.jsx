export default function Navbar() {
  return (
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
  );
}
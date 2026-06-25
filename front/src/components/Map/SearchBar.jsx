import { useState } from "react";
import { useMap } from "react-leaflet";

function FlyToLocation({ position, onDone }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 18, { animate: true, duration: 1.5 });
    onDone();
  }
  return null;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setNotFound(false);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", Villa Maria, Cordoba, Argentina")}&format=json&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        setNotFound(true);
        setTimeout(() => setNotFound(false), 3000);
      }
    } catch (error) {
      console.error("Error buscando:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {position && (
        <FlyToLocation
          position={position}
          onDone={() => setPosition(null)}
        />
      )}
      <form
        onSubmit={handleSearch}
        className="absolute top-20 left-0 right-0 z-[400] flex flex-col items-center px-4 gap-2"
      >
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md px-4 py-2 w-full max-w-2xl gap-2 border border-transparent dark:border-gray-700">
          <span className="text-gray-400 dark:text-gray-500"></span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar dirección o barrio..."
            className="flex-1 outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="text-blue-500 dark:text-blue-400 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "..." : "Ir"}
          </button>
        </div>

        {notFound && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs px-4 py-2 rounded-full shadow">
            No se encontró esa dirección
          </div>
        )}
      </form>
    </>
  );
}
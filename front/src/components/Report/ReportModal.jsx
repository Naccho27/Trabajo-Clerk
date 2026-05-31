import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_IMAGENES = 6;

const categorias = [
  { id: "baches", label: "Bache", icon: icons.baches },
  { id: "residuos", label: "Residuos", icon: icons.residuos },
  { id: "alumbrado", label: "Alumbrado", icon: icons.alumbrado },
  { id: "semaforo", label: "Semáforo", icon: icons.semaforo },
  { id: "inundacion", label: "Inundación", icon: icons.inundacion },
];

export default function ReportModal({ ubicacion, onClose, onSuccess }) {
  const { getToken } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState([]); // 👈 array en vez de una sola
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [direccion, setDireccion] = useState("Villa María");
  const [ciudad, setCiudad] = useState("Villa María");
  const [barrio, setBarrio] = useState("");

  useEffect(() => {
    const resolverDireccion = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${ubicacion.lat}&lon=${ubicacion.lng}&format=json`
        );
        const data = await response.json();

        const calle = data.address?.road;
        const numero = data.address?.house_number;
        if (calle) {
          setDireccion(numero ? `${calle} ${numero}` : calle);
        }

        const ciudadResuelta =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          "Villa María";
        setCiudad(ciudadResuelta);

        const barrioResuelto =
          data.address?.suburb ||
          data.address?.neighbourhood ||
          "";
        setBarrio(barrioResuelto);
      } catch (err) {
        console.error("Error resolviendo dirección:", err);
      }
    };
    resolverDireccion();
  }, [ubicacion.lat, ubicacion.lng]);

  const handleAgregarImagenes = (e) => {
    const nuevas = Array.from(e.target.files);
    setImagenes((prev) => {
      const combinadas = [...prev, ...nuevas];
      if (combinadas.length > MAX_IMAGENES) {
        setError(`Máximo ${MAX_IMAGENES} fotos`);
        return combinadas.slice(0, MAX_IMAGENES);
      }
      setError("");
      return combinadas;
    });
    // reset input para permitir agregar la misma foto de nuevo si se eliminó
    e.target.value = null;
  };

  const handleEliminarImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !categoria || !descripcion) {
      return setError("Completá todos los campos obligatorios");
    }

    setLoading(true);
    setError("");

    try {
      const token = await getToken({ template: "backend" });
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("categoria", categoria);
      formData.append("descripcion", descripcion);
      formData.append("ubicacion[lat]", ubicacion.lat);
      formData.append("ubicacion[lng]", ubicacion.lng);
      formData.append("ubicacion[direccion]", direccion);
      formData.append("ubicacion[ciudad]", ciudad);
      formData.append("ubicacion[barrio]", barrio);
      formData.append("ubicacion[provincia]", "Córdoba");
      formData.append("ubicacion[pais]", "Argentina");
      imagenes.forEach((img) => formData.append("archivos", img)); // 👈 todas las imágenes

      await axios.post(`${API_URL}/reportes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Response:", error.response);
      console.log("Data:", JSON.stringify(error.response?.data, null, 2));
      console.error("Status:", error.response?.status);
      setError("Error al crear el reporte, intentá de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1001] bg-black/40" onClick={onClose}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-t-3xl p-6 pb-10 w-full max-w-2xl slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Nuevo Reporte</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Título */}
          <input
            type="text"
            placeholder="Título del reporte"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
          />

          {/* Categoría */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoria(cat.id)}
                className={`flex flex-col items-center gap-1 min-w-[55px] p-2 rounded-xl border transition-all ${
                  categoria === cat.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <img src={cat.icon} className="w-7 h-7" />
                <span className="text-xs text-gray-600">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Descripción */}
          <textarea
            placeholder="Descripción del problema..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="border border-gray-300 rounded-2xl px-4 py-2 text-sm outline-none focus:border-blue-500 resize-none"
          />

          {/* Imágenes */}
          <div className="flex flex-col gap-2">
            {/* previews */}
            {imagenes.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {imagenes.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-20 object-cover rounded-xl border border-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleEliminarImagen(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* botón agregar — solo si no llegó al máximo */}
            {imagenes.length < MAX_IMAGENES && (
              <label className="cursor-pointer border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 text-center">
                {imagenes.length === 0
                  ? "Agregar fotos o videos (opcional)"
                  : `Agregar más (${imagenes.length}/${MAX_IMAGENES})`}
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleAgregarImagenes}
                />
              </label>
            )}
          </div>

          {/* Ubicación resuelta */}
          <p className="text-xs text-gray-400">
            📍 {direccion}{barrio ? `, ${barrio}` : ""}, {ciudad}
          </p>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full text-white font-semibold disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
          >
            {loading ? "Enviando..." : "Enviar Reporte"}
          </button>

        </form>
      </div>
    </div>
  );
}
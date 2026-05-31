import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { icons } from "../../assets/icons/icons.js";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_IMAGENES = 3;

const categorias = [
  { id: "baches",     label: "Bache",      icon: icons.baches },
  { id: "residuos",   label: "Residuos",   icon: icons.residuos },
  { id: "alumbrado",  label: "Alumbrado",  icon: icons.alumbrado },
  { id: "semaforo",   label: "Semáforo",   icon: icons.semaforo },
  { id: "inundacion", label: "Inundación", icon: icons.inundacion },
];

export default function EditReportModal({ reporte, onClose, onSuccess }) {
  const { getToken } = useAuth();
  const [titulo, setTitulo]           = useState(reporte.titulo);
  const [categoria, setCategoria]     = useState(reporte.categoria);
  const [descripcion, setDescripcion] = useState(reporte.descripcion);
  const [imagenesExistentes, setImagenesExistentes] = useState(reporte.imagenes || []);
  const [imagenesNuevas, setImagenesNuevas]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const totalImagenes = imagenesExistentes.length + imagenesNuevas.length;

  const handleAgregarImagenes = (e) => {
    const nuevas = Array.from(e.target.files);
    setImagenesNuevas((prev) => {
      const combinadas = [...prev, ...nuevas];
      if (imagenesExistentes.length + combinadas.length > MAX_IMAGENES) {
        setError(`Máximo ${MAX_IMAGENES} fotos`);
        return combinadas.slice(0, MAX_IMAGENES - imagenesExistentes.length);
      }
      setError("");
      return combinadas;
    });
    e.target.value = null;
  };

  const handleEliminarExistente = (index) => {
    setImagenesExistentes((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const handleEliminarNueva = (index) => {
    setImagenesNuevas((prev) => prev.filter((_, i) => i !== index));
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

      // imágenes existentes que el usuario conserva
      imagenesExistentes.forEach((url) =>
        formData.append("imagenesExistentes", url)
      );

      // imágenes nuevas
      imagenesNuevas.forEach((img) =>
        formData.append("archivos", img)
      );

      await axios.put(
        `${API_URL}/reportes/${reporte._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Response data:", err.response?.data);
      setError("Error al editar el reporte, intentá de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1003] bg-black/40" onClick={onClose}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-t-3xl p-6 pb-10 w-full max-w-2xl slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Editar Reporte</h2>

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

          {/* Imágenes existentes */}
          {imagenesExistentes.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-400">Fotos actuales</p>
              <div className="grid grid-cols-3 gap-2">
                {imagenesExistentes.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      className="w-full h-20 object-cover rounded-xl border border-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleEliminarExistente(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Imágenes nuevas */}
          {imagenesNuevas.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-400">Fotos nuevas</p>
              <div className="grid grid-cols-3 gap-2">
                {imagenesNuevas.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-20 object-cover rounded-xl border border-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleEliminarNueva(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón agregar fotos */}
          {totalImagenes < MAX_IMAGENES && (
            <label className="cursor-pointer border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 text-center">
              {totalImagenes === 0
                ? "Agregar fotos (opcional)"
                : `Agregar más (${totalImagenes}/${MAX_IMAGENES})`}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleAgregarImagenes}
              />
            </label>
          )}

          {/* Ubicación — no editable */}
          <p className="text-xs text-gray-400">
            📍 {reporte.ubicacion?.direccion}, {reporte.ubicacion?.ciudad}
          </p>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full text-white font-semibold disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>

        </form>
      </div>
    </div>
  );
}
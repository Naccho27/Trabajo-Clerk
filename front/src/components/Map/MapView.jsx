// src/components/Map/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import ReportModal from "../Report/ReportModal.jsx";
import ReportDetailModal from "../Report/ReportDetailModal.jsx";
import { icons } from "../../assets/icons/icons.js";

const API_URL = import.meta.env.VITE_API_URL;

const iconos = {
  baches: new L.Icon({ iconUrl: icons.baches, iconSize: [35, 35] }),
  residuos: new L.Icon({ iconUrl: icons.residuos, iconSize: [35, 35] }),
  alumbrado: new L.Icon({ iconUrl: icons.alumbrado, iconSize: [35, 35] }),
  semaforo: new L.Icon({ iconUrl: icons.semaforo, iconSize: [35, 35] }),
  inundacion: new L.Icon({ iconUrl: icons.inundacion, iconSize: [35, 35] }),
  todos: new L.Icon({ iconUrl: icons.todos, iconSize: [35, 35] }),
};

const VILLA_MARIA = [-32.4149, -63.2386];

function ClickHandler({ modoCrear, onMapClick }) {
  useMapEvents({
    click(e) {
      if (modoCrear) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

export default function MapView({ filtro = "todos", modoCrear, onCancelarCrear }) {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReporteId, setSelectedReporteId] = useState(null); // 👈 nuevo

  const cargarReportes = async () => {
    try {
      const response = await axios.get(`${API_URL}/reportes/publicos`);
      setReportes(response.data.reportes || []);
    } catch (error) {
      console.log("ERROR REPORTES:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarReportes(); }, []);

  const handleMapClick = (ubicacion) => {
    setUbicacionSeleccionada(ubicacion);
    setShowReportModal(true);
  };

  const handleReportSuccess = () => {
    setUbicacionSeleccionada(null);
    setShowReportModal(false);
    onCancelarCrear();
    cargarReportes();
  };

  const handleCloseModal = () => {
    setUbicacionSeleccionada(null);
    setShowReportModal(false);
    onCancelarCrear();
  };

  const reportesFiltrados =
    filtro === "todos"
      ? reportes
      : reportes.filter((r) => r.categoria === filtro);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <>
      {modoCrear && !showReportModal && (
        <div className="absolute top-32 left-0 right-0 z-[1000] flex justify-center px-4">
          <div className="bg-blue-500 text-white text-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
            <span>Tocá el mapa para marcar la ubicación</span>
            <button onClick={onCancelarCrear} className="text-white font-bold">✕</button>
          </div>
        </div>
      )}

      {showReportModal && ubicacionSeleccionada && (
        <ReportModal
          ubicacion={ubicacionSeleccionada}
          onClose={handleCloseModal}
          onSuccess={handleReportSuccess}
        />
      )}

      {/* 👇 modal de detalle */}
      {selectedReporteId && (
        <ReportDetailModal
          reporteId={selectedReporteId}
          onClose={() => setSelectedReporteId(null)}
        />
      )}

      <MapContainer
        center={VILLA_MARIA}
        zoom={14}
        minZoom={13}
        maxZoom={18}
        maxBounds={[[-32.55, -63.45], [-32.28, -63.10]]}
        maxBoundsViscosity={1.0}
        className="w-full h-full"
        style={{ cursor: modoCrear ? "crosshair" : "grab" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <ClickHandler modoCrear={modoCrear} onMapClick={handleMapClick} />
        <SearchBar />

        {reportesFiltrados
          .filter(
            (r) =>
              typeof r.ubicacion?.lat === "number" &&
              typeof r.ubicacion?.lng === "number"
          )
          .map((reporte) => (
            <Marker
              key={reporte._id}
              position={[reporte.ubicacion.lat, reporte.ubicacion.lng]}
              icon={iconos[reporte.categoria] || iconos["todos"]}
            >
              <Popup minWidth={200}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <img src={icons[reporte.categoria]} className="w-6 h-6" alt={reporte.categoria} />
                    <span className="text-xs text-gray-400 capitalize">{reporte.categoria}</span>
                  </div>
                  <h3 className="font-bold text-sm leading-tight">{reporte.titulo}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(reporte.createdAt).toLocaleDateString("es-AR")}
                  </span>
                  <button
                    onClick={() => setSelectedReporteId(reporte._id)}
                    className="mt-1 w-full py-1.5 rounded-full text-white text-xs font-semibold"
                    style={{ background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }}
                  >
                    Ver detalle
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </>
  );
}
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { reports } from "../../data/reports";
import { icons } from "../../assets/icons/icons.js";

const iconos = {
  baches: new L.Icon({ iconUrl: icons.baches, iconSize: [35, 35] }),
  residuos: new L.Icon({ iconUrl: icons.residuos, iconSize: [35, 35] }),
  alumbrado: new L.Icon({ iconUrl: icons.alumbrado, iconSize: [35, 35] }),
  semaforo: new L.Icon({ iconUrl: icons.semaforo, iconSize: [35, 35] }),
  inundacion: new L.Icon({ iconUrl: icons.inundacion, iconSize: [35, 35] }),
  todos: new L.Icon({ iconUrl: icons.todos, iconSize: [35, 35] }),
};

const VILLA_MARIA = [-32.4149, -63.2386];

export default function MapView({ filtro = "todos" }) {
  const reportesFiltrados =
    filtro === "todos"
      ? reports
      : reports.filter((r) => r.categoria === filtro);

  return (
    <MapContainer center={VILLA_MARIA} zoom={14} className="w-full h-full">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {reportesFiltrados.map((reporte) => (
        <Marker
          key={reporte._id}
          position={[reporte.ubicacion.lat, reporte.ubicacion.lng]}
          icon={iconos[reporte.categoria] || iconos["todos"]}
        >
          <Popup minWidth={220}>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base">{reporte.titulo}</h3>
              <p className="text-sm text-gray-600">{reporte.descripcion}</p>
              <span className="text-xs text-gray-400">
                {new Date(reporte.createdAt).toLocaleDateString("es-AR")}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
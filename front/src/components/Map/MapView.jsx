import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";

import axios from "axios";

import { icons } from "../../assets/icons/icons.js";

const iconos = {
  baches: new L.Icon({
    iconUrl: icons.baches,
    iconSize: [35, 35],
  }),

  residuos: new L.Icon({
    iconUrl: icons.residuos,
    iconSize: [35, 35],
  }),

  alumbrado: new L.Icon({
    iconUrl: icons.alumbrado,
    iconSize: [35, 35],
  }),

  semaforo: new L.Icon({
    iconUrl: icons.semaforo,
    iconSize: [35, 35],
  }),

  inundacion: new L.Icon({
    iconUrl: icons.inundacion,
    iconSize: [35, 35],
  }),

  todos: new L.Icon({
    iconUrl: icons.todos,
    iconSize: [35, 35],
  }),
};

const VILLA_MARIA = [-32.4149, -63.2386];

export default function MapView({ filtro = "todos" }) {
  const [reportes, setReportes] = useState([]);

  const [loading, setLoading] = useState(true);

  /*
  |-------------------------------------------------------------
  | Obtener reportes
  |-------------------------------------------------------------
  */

  useEffect(() => {
    const obtenerReportes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/reportes/publicos",
        );

        console.log("REPORTES:", response.data);

        setReportes(response.data.reportes || []);
      } catch (error) {
        console.log("ERROR REPORTES:");

        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    obtenerReportes();
  }, []);

  /*
  |-------------------------------------------------------------
  | Filtro
  |-------------------------------------------------------------
  */

  const reportesFiltrados =
    filtro === "todos"
      ? reportes
      : reportes.filter((r) => r.categoria === filtro);

  /*
  |-------------------------------------------------------------
  | Loading
  |-------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <MapContainer center={VILLA_MARIA} zoom={14} className="w-full h-full">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {reportesFiltrados
        .filter(
          (reporte) =>
            typeof reporte.ubicacion?.lat === "number" &&
            typeof reporte.ubicacion?.lng === "number",
        )
        .map((reporte) => (
          <Marker
            key={reporte._id}
            position={[reporte.ubicacion?.lat, reporte.ubicacion?.lng]}
            icon={iconos[reporte.categoria] || iconos["todos"]}
          >
            <Popup minWidth={220}>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base">{reporte.titulo}</h3>

                <p className="text-sm text-gray-600">{reporte.descripcion}</p>

                <span className="text-xs text-gray-400">
                  {new Date(reporte.createdAt).toLocaleDateString("es-AR")}
                </span>

                <span className="text-xs font-semibold">
                  Estado: {reporte.estado}
                </span>

                <span className="text-xs">Prioridad: {reporte.prioridad}</span>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

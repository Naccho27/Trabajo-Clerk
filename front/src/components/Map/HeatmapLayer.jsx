import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

<<<<<<< HEAD
=======
const PESO_PRIORIDAD = {
  low:      0.25,
  medium:   0.5,
  high:     0.75,
  critical: 1.0,
};

>>>>>>> origin/CasauxTobias
export default function HeatmapLayer({ reportes }) {
  const map = useMap();

  useEffect(() => {
    if (!reportes || reportes.length === 0) return;

    const puntos = reportes
<<<<<<< HEAD
      .filter(r => typeof r.ubicacion?.lat === "number" && typeof r.ubicacion?.lng === "number")
      .map(r => [r.ubicacion.lat, r.ubicacion.lng, 1]);
=======
      .filter(r =>
        typeof r.ubicacion?.lat === "number" &&
        typeof r.ubicacion?.lng === "number" &&
        r.estado === "in_progress" &&
        r.esDuplicado === false
      )
      .map(r => [
        r.ubicacion.lat,
        r.ubicacion.lng,
        Math.min((PESO_PRIORIDAD[r.prioridad] ?? 0.5) * (r.cantidadConfirmaciones ?? 1), 1.0)
      ]);
>>>>>>> origin/CasauxTobias

    const heatLayer = L.heatLayer(puntos, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: "blue", 0.6: "cyan", 0.7: "lime", 0.8: "yellow", 1.0: "red" },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [reportes, map]);

  return null;
}
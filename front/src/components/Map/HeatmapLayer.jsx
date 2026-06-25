import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const PESO_PRIORIDAD = {
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  critical: 1.0,
};

export default function HeatmapLayer({ reportes }) {
  const map = useMap();

  useEffect(() => {
    if (!reportes || reportes.length === 0) return;

    const puntos = reportes
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

    const heatLayer = L.heatLayer(puntos, {
      radius: 60,
      blur: 40,
      maxZoom: 17,
      minOpacity: 0.5,
      gradient: {
        0.0: "transparent",
        0.3: "#3b3bff",
        0.5: "#a855f7",
        0.7: "#f97316",
        0.9: "#ef4444",
        1.0: "#7f1d1d",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [reportes, map]);

  return null;
}
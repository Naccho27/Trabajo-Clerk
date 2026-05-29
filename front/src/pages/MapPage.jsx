import { useState } from "react";
import { SignedIn } from "@clerk/clerk-react";
import MapView from "../components/Map/MapView";
import Header from "../components/Navbar/Header";
import FilterBar from "../components/Filters/FilterBar";
import Navbar from "../components/Navbar/Navbar";

export default function MapPage() {
  const [filtro, setFiltro] = useState("todos");
  const [modoCrear, setModoCrear] = useState(false);

  return (
    <SignedIn>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <Header />
        <MapView
          filtro={filtro}
          modoCrear={modoCrear}
          onCancelarCrear={() => setModoCrear(false)}
        />
        <FilterBar filtroActivo={filtro} onFiltroChange={setFiltro} />
        <Navbar onCrearReporte={() => setModoCrear(true)} />
      </div>
    </SignedIn>
  );
}
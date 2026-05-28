import { useState } from "react";
import { SignedIn } from "@clerk/clerk-react";
import MapView from "../components/Map/MapView";
import Header from "../components/Navbar/Header";
import BottomBar from "../components/Navbar/BottomBar";

export default function MapPage() {
  const [filtro, setFiltro] = useState("todos");

  return (
    <SignedIn>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <Header />
        <MapView filtro={filtro} />
        <BottomBar filtroActivo={filtro} onFiltroChange={setFiltro} />
      </div>
    </SignedIn>
  );
}
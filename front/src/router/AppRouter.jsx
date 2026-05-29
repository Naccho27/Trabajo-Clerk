import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState } from "react";
import MapView from "../components/Map/MapView";
import LoginPage from "../pages/LoginPage";
import Header from "../components/Navbar/Header";
import FilterBar from "../components/Filters/FilterBar";
import Navbar from "../components/Navbar/Navbar";

function MapPage() {
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

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <SignedOut>
              <Navigate to="/login" />
            </SignedOut>
            <SignedIn>
              <Navigate to="/mapa" />
            </SignedIn>
          </>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mapa" element={<MapPage />} />
    </Routes>
  );
}
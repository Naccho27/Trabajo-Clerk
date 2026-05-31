import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState } from "react";
import MapView from "../components/Map/MapView";
import LoginPage from "../pages/LoginPage";
import Header from "../components/Navbar/Header";
import FilterBar from "../components/Filters/FilterBar";
import Navbar from "../components/Navbar/Navbar";
import NavbarPublic from "../components/Navbar/NavbarPublic";

// 👇 mapa para usuarios logueados — igual que antes
function MapPage() {
  const [filtro, setFiltro] = useState("todos");
  const [modoCrear, setModoCrear] = useState(false);

  return (
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
  );
}

// 👇 mapa público — sin auth, navbar con restricciones
function MapPagePublic() {
  const [filtro, setFiltro] = useState("todos");

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Header />
      <MapView
        filtro={filtro}
        modoCrear={false}
        onCancelarCrear={() => { }}
      />
      <FilterBar filtroActivo={filtro} onFiltroChange={setFiltro} />
      <NavbarPublic />
    </div>
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
              <Navigate to="/mapa" />
            </SignedOut>
            <SignedIn>
              <Navigate to="/mapa" />
            </SignedIn>
          </>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/mapa"
        element={
          <>
            <SignedIn><MapPage /></SignedIn>
            <SignedOut><Navigate to="/login" /></SignedOut>
          </>
        }
      />
      <Route path="/mapa-publico" element={<MapPagePublic />} />
    </Routes>
  );
}
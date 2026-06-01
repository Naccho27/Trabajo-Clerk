import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState } from "react";
import { useUsuarioBD } from "../context/UserContext";
import MapView from "../components/Map/MapView";
import LoginPage from "../pages/LoginPage";
import Header from "../components/Navbar/Header";
import FilterBar from "../components/Filters/FilterBar";
import Navbar from "../components/Navbar/Navbar";
import NavbarPublic from "../components/Navbar/NavbarPublic";
import OperadorPage from "../pages/OperadorPage.jsx";

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

function MapPagePublic() {
  const [filtro, setFiltro] = useState("todos");

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Header />
      <MapView filtro={filtro} modoCrear={false} onCancelarCrear={() => {}} />
      <FilterBar filtroActivo={filtro} onFiltroChange={setFiltro} />
      <NavbarPublic />
    </div>
  );
}

function RoleRedirect() {
  const { usuarioBD } = useUsuarioBD();

  if (!usuarioBD) return (
    <div className="w-screen h-screen flex items-center justify-center">
      Cargando...
    </div>
  );

  const rol = usuarioBD.rol;
  if (rol === "operador")   return <Navigate to="/operador" />;
  if (rol === "supervisor") return <Navigate to="/supervisor" />;
  if (rol === "admin")      return <Navigate to="/admin" />;
  return <Navigate to="/mapa" />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <SignedOut><Navigate to="/login" /></SignedOut>
            <SignedIn><RoleRedirect /></SignedIn>
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
      <Route path="/operador" element={<SignedIn><OperadorPage /></SignedIn>} />
      <Route path="/supervisor" element={<SignedIn><div>Supervisor</div></SignedIn>} />
      <Route path="/admin"      element={<SignedIn><div>Admin</div></SignedIn>} />
    </Routes>
  );
}
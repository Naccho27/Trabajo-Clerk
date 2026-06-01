import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";
import MapView from "../components/Map/MapView";
import LoginPage from "../pages/LoginPage";
import Header from "../components/Navbar/Header";
import FilterBar from "../components/Filters/FilterBar";
import Navbar from "../components/Navbar/Navbar";
import NavbarPublic from "../components/Navbar/NavbarPublic";
import SupervisorPage from "../pages/SupervisorPage";

function MapPage() {
  const [filtro, setFiltro] = useState("todos");
  const [modoCrear, setModoCrear] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Header />
      <MapView filtro={filtro} modoCrear={modoCrear} onCancelarCrear={() => setModoCrear(false)} />
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

function RedirigirSegunRol() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const obtenerRol = async () => {
      if (!isLoaded || !user) return;
      try {
        const token = await getToken({ template: "backend" });
        const response = await axios.post(
          "http://localhost:3000/api/auth/sync",
          {
            clerkId: user.id,
            nombreUsuario: user.username || user.firstName || "Usuario",
            email:
              user.primaryEmailAddress?.emailAddress ||
              user.emailAddresses?.[0]?.emailAddress ||
              "sin-email@example.com",
            imagenPerfil: user.imageUrl,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("ROL EN ROUTER:", response.data.usuario.rol);
        setRol(response.data.usuario.rol);
      } catch (error) {
        console.log("Error obteniendo rol:", error);
        setRol("ciudadano");
      }
    };
    obtenerRol();
  }, [isLoaded, user]);

  if (!rol) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (rol === "supervisor" || rol === "admin") return <Navigate to="/supervisor" />;
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
            <SignedIn><RedirigirSegunRol /></SignedIn>
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
      <Route
        path="/supervisor"
        element={
          <>
            <SignedIn><SupervisorPage /></SignedIn>
            <SignedOut><Navigate to="/login" /></SignedOut>
          </>
        }
      />
    </Routes>
  );
}
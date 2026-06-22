import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import SignOutButton from "../Buttons/SignOutButton";
import { useUsuarioBD } from "../../context/UserContext";

const LABEL_POR_ROL = {
  ciudadano: { label: "Ciudadano", path: "/mapa" },
  operador: { label: "Operador", path: "/operador" },
  supervisor: { label: "Supervisor", path: "/supervisor" },
  admin: { label: "Admin", path: "/admin" },
};

// Orden fijo en el que se muestran los botones, sin importar el orden del array roles
const ORDEN_ROLES = ["admin", "supervisor", "operador", "ciudadano"];

export default function Header() {
  const { isSignedIn } = useUser();
  const { usuarioBD } = useUsuarioBD();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const rolesUsuario = usuarioBD?.roles ?? [];

  // Solo se muestran los roles que el usuario REALMENTE tiene
  const navItems = ORDEN_ROLES
    .filter((rol) => rolesUsuario.includes(rol))
    .map((rol) => LABEL_POR_ROL[rol]);

  const multipleItems = isSignedIn && navItems.length > 1;

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-bold">
          Urban<span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Log</span>
        </h1>

        <div className="flex items-center gap-2">
          {multipleItems && (
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    location.pathname === item.path
                      ? "border-transparent text-white"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  style={location.pathname === item.path
                    ? { background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }
                    : {}}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {multipleItems && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1 p-2"
            >
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          )}

          {isSignedIn ? (
            <SignOutButton className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 hover:bg-gray-100" />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="border border-blue-500 rounded-full px-4 py-1 text-sm text-blue-500 hover:bg-blue-50"
            >
              Registrarse
            </button>
          )}
        </div>
      </div>

      {menuOpen && multipleItems && (
        <div className="absolute top-[56px] right-2 z-[1002] md:hidden bg-white shadow-xl rounded-2xl w-44 py-3 px-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
              className={`text-left w-full text-sm px-3 py-2 rounded-xl transition-all ${
                location.pathname === item.path
                  ? "text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              style={location.pathname === item.path
                ? { background: "linear-gradient(135deg, #ff3b3b, #3b3bff)" }
                : {}}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
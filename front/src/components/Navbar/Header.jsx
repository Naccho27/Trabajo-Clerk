import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import SignOutButton from "../Buttons/SignOutButton";
import { useUsuarioBD } from "../../context/UserContext";

const NAV_POR_ROL = {
  ciudadano:  [{ label: "Ciudadano", path: "/mapa" }],
  operador:   [{ label: "Operador", path: "/operador" }, { label: "Ciudadano", path: "/mapa" }],
  supervisor: [{ label: "Supervisor", path: "/supervisor" }, { label: "Ciudadano", path: "/mapa" }],
  admin:      [{ label: "Admin", path: "/admin" }, { label: "Supervisor", path: "/supervisor" }, { label: "Operador", path: "/operador" }, { label: "Ciudadano", path: "/mapa" }],
};

export default function Header() {
  const { isSignedIn } = useUser();
  const { usuarioBD } = useUsuarioBD();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = NAV_POR_ROL[usuarioBD?.rol] ?? [];

  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold">
        Urban<span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Log</span>
      </h1>

      <div className="flex items-center gap-3">
        {isSignedIn && navItems.length > 1 && navItems.map((item) => (
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
              : {}
            }
          >
            {item.label}
          </button>
        ))}

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
  );
}
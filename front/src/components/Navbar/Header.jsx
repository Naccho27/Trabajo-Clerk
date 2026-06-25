import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import SignOutButton from "../Buttons/SignOutButton";
import { useUsuarioBD } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";

const LABEL_POR_ROL = {
  ciudadano: { label: "Ciudadano", path: "/mapa" },
  operador: { label: "Operador", path: "/operador" },
  supervisor: { label: "Supervisor", path: "/supervisor" },
  admin: { label: "Admin", path: "/admin" },
};

const ROL_COLORES = {
  ciudadano:  "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200",
  supervisor: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200",
  operador:   "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200",
  admin:      "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200",
};

const ORDEN_ROLES = ["admin", "supervisor", "operador", "ciudadano"];

export default function Header() {
  const { isSignedIn, user } = useUser();
  const { usuarioBD } = useUsuarioBD();
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const rolesUsuario = usuarioBD?.roles ?? [];

  const navItems = ORDEN_ROLES
    .filter((rol) => rolesUsuario.includes(rol))
    .map((rol) => LABEL_POR_ROL[rol]);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold">
        <span className="text-gray-900 dark:text-white">Urban</span>
        <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Log</span>
      </h1>

      {isSignedIn ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full pl-1.5 pr-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <img
              src={usuarioBD?.imagenPerfil || user?.imageUrl || "https://via.placeholder.com/32"}
              alt="perfil"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {usuarioBD?.nombreUsuario || "Usuario"}
            </span>
          </button>

          {menuOpen && (
            <div
              className="absolute top-12 right-0 z-[1002] bg-white dark:bg-gray-800 shadow-xl rounded-2xl w-64 py-4 px-4 flex flex-col gap-3"
              style={{ animation: "fadeInUp 0.2s ease-out" }}
            >
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <img
                  src={usuarioBD?.imagenPerfil || user?.imageUrl || "https://via.placeholder.com/48"}
                  alt="perfil"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {usuarioBD?.nombreUsuario || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {usuarioBD?.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {rolesUsuario.map((r) => (
                  <span
                    key={r}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROL_COLORES[r] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200"}`}
                  >
                    {r}
                  </span>
                ))}
              </div>

              {navItems.length > 1 && (
                <div className="flex flex-col gap-1 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium px-1 mb-1">Cambiar de panel</p>
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setMenuOpen(false); }}
                      className={`text-left w-full text-sm px-3 py-2 rounded-xl transition-all ${
                        location.pathname === item.path
                          ? "text-white font-semibold"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 px-1">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  {modoOscuro ? "" : ""} Modo oscuro
                </span>
                <button
                  onClick={toggleModoOscuro}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    modoOscuro ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      modoOscuro ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <SignOutButton className="w-full border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-center" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="border border-blue-500 rounded-full px-4 py-1 text-sm text-blue-500 hover:bg-blue-50"
        >
          Registrarse
        </button>
      )}
    </div>
  );
}
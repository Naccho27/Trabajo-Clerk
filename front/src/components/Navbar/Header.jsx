import { useUser, useAuth } from "@clerk/clerk-react";
import SignOutButton from "../Buttons/SignOutButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const verificarRol = async () => {
      if (!isSignedIn || !user) return;
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
        setRol(response.data.usuario.rol);
      } catch (error) {
        console.log("Error verificando rol:", error);
      }
    };
    verificarRol();
  }, [isSignedIn, user]);

  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold">
        Urban<span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Log</span>
      </h1>
      <div className="flex items-center gap-3">
        {/* Solo supervisor ve "Panel supervisor" */}
        {rol === "supervisor" && (
          <button
            onClick={() => navigate("/supervisor")}
            className="border border-purple-500 rounded-full px-4 py-1 text-sm text-purple-500 hover:bg-purple-50 transition-colors">
            Panel supervisor
          </button>
        )}
        {/* Solo admin ve ambos botones */}
        {rol === "admin" && (
          <>
            <button
              onClick={() => navigate("/supervisor")}
              className="border border-purple-500 rounded-full px-4 py-1 text-sm text-purple-500 hover:bg-purple-50 transition-colors">
              Panel supervisor
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="border border-red-500 rounded-full px-4 py-1 text-sm text-red-500 hover:bg-red-50 transition-colors">
              Panel admin
            </button>
          </>
        )}
        {isSignedIn ? (
          <SignOutButton className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 hover:bg-gray-100" />
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="border border-blue-500 rounded-full px-4 py-1 text-sm text-blue-500 hover:bg-blue-50">
            Registrarse
          </button>
        )}
      </div>
    </div>
  );
}
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import AppRouter from "./router/AppRouter";
import { useUsuarioBD } from "./context/UserContext";

function App() {
  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const { setUsuarioBD } = useUsuarioBD();
  const { signOut } = useClerk();
  const [syncListo, setSyncListo] = useState(false);

  useEffect(() => {
    const sincronizarUsuario = async () => {
      try {
        if (!isLoaded) return;

        if (!isSignedIn || !user) {
          setSyncListo(true);
          return;
        }

        const token = await getToken({ template: "backend" });

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/sync`,
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

        setUsuarioBD(data.usuario);
        console.log("USUARIO SINCRONIZADO", data.usuario.roles); // 👈

        if (data.usuario.activo === false) {
          await signOut();
          window.location.href = "/login?bloqueado=true";
          return;
        }

        setSyncListo(true);

      } catch (error) {
        console.log("ERROR SYNC:", error);
        console.log(error.response?.data);
        setSyncListo(true);
      }
    };

    sincronizarUsuario();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !syncListo) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
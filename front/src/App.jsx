import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";
import AppRouter from "./router/AppRouter";

function App() {
  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const sincronizarUsuario = async () => {
      try {
        console.log("USE EFFECT");

        if (!isLoaded) {
          console.log("CLERK NO CARGADO");
          return;
        }

        if (!isSignedIn || !user) {
          console.log("NO HAY USER");
          return;
        }

        console.log("USER:", user);

        const token = await getToken({ template: "backend" });

        console.log("TOKEN:", token);

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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("RESPUESTA BACK:", response.data);
        console.log("ROL OBTENIDO:", response.data.usuario.rol);

      } catch (error) {
        console.log("ERROR SYNC:");
        console.log(error);
        console.log(error.response?.data);
      }
    };

    sincronizarUsuario();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
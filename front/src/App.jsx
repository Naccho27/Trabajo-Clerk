import {
  useAuth,
  useUser,
} from "@clerk/clerk-react";

import { useEffect } from "react";

import axios from "axios";

import AppRouter from "./router/AppRouter";

function App() {

  const { getToken } = useAuth();

  const {
    user,
    isLoaded,
    isSignedIn
  } = useUser();

  /*
  |-------------------------------------------------------------
  | Sync usuario
  |-------------------------------------------------------------
  */

  useEffect(() => {

    const sincronizarUsuario = async () => {

      try {

        /*
        |---------------------------------------------------------
        | Esperar Clerk
        |---------------------------------------------------------
        */

        if (!isLoaded) {
          console.log("CLERK NO CARGADO");
          return;
        }

        /*
        |---------------------------------------------------------
        | No logueado
        |---------------------------------------------------------
        */

        if (!isSignedIn || !user) {
          console.log("NO HAY USER");
          return;
        }

        /*
        |---------------------------------------------------------
        | Token Clerk
        |---------------------------------------------------------
        */

        const token = await getToken({
          template: "backend"
        });

        /*
        |---------------------------------------------------------
        | Sync backend
        |---------------------------------------------------------
        */

        await axios.post(
          "http://localhost:3000/api/auth/sync",

          {
            clerkId: user.id,

            nombreUsuario:
              user.username ||
              user.firstName ||
              "Usuario",

            email:
              user.primaryEmailAddress?.emailAddress ||
              user.emailAddresses?.[0]?.emailAddress ||
              "sin-email@example.com",

            imagenPerfil:
              user.imageUrl
          },

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("USUARIO SINCRONIZADO");

      } catch (error) {

        console.log("ERROR SYNC:");

        console.log(error);

        console.log(error.response?.data);
      }
    };

    sincronizarUsuario();

  }, [
    isLoaded,
    isSignedIn,
    user
  ]);

  /*
  |-------------------------------------------------------------
  | Esperar Clerk antes de renderizar
  |-------------------------------------------------------------
  */

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
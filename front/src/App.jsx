import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useAuth,
  useUser
} from "@clerk/clerk-react";

import { useEffect } from "react";

import axios from "axios";

function App() {

  const { getToken } =
    useAuth();

  const {
    user,
    isLoaded
  } = useUser();

  useEffect(() => {

    const sincronizarUsuario =
      async () => {

        try {

          console.log(
            "USE EFFECT"
          );

          // Espera a que Clerk cargue
          if (!isLoaded) {

            console.log(
              "CLERK NO CARGADO"
            );

            return;
          }

          // Si no hay usuario logueado
          if (!user) {

            console.log(
              "NO HAY USER"
            );

            return;
          }

          console.log(
            "USER:",
            user
          );

          // Obtiene JWT template backend
          const token =
            await getToken({
              template: "backend"
            });

          console.log(
            "TOKEN:",
            token
          );

          // Request al backend
          const response =
            await axios.post(

              "http://localhost:3000/api/auth/sync",

              {

                clerkId:
                  user.id,

                nombreUsuario:

                  user.username ||

                  user.firstName ||

                  "Usuario",

                email:

                  user.primaryEmailAddress?.emailAddress ||

                  `${user.id}@no-email.com`,

                imagenPerfil:
                  user.imageUrl
              },

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          console.log(
            "RESPUESTA BACK:",
            response.data
          );

        } catch (error) {

          console.log(
            "ERROR AXIOS:"
          );

          console.log(error);

          console.log(
            error.response?.data
          );
        }
      };

    sincronizarUsuario();

  }, [isLoaded, user]);

  return (

    <div>

      <SignedOut>

        <SignIn />

      </SignedOut>

      <SignedIn>

        <div
          style={{
            padding: "20px"
          }}
        >

          <UserButton />

          <h1>
            UrbanLog 🚀
          </h1>

          <p>
            Usuario autenticado correctamente
          </p>

        </div>

      </SignedIn>

    </div>
  );
}

export default App;
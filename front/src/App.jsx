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
import MapView from "./components/Map/MapView";
import AppRouter from "./router/AppRouter";

function App() {

  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  useEffect(() => {

    const sincronizarUsuario = async () => {

      try {

        console.log("USE EFFECT");

        if (!isLoaded) {
          console.log("CLERK NO CARGADO");
          return;
        }

        if (!user) {
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
            imagenPerfil: user.imageUrl
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("RESPUESTA BACK:", response.data);

      } catch (error) {
        console.log("ERROR AXIOS:");
        console.log(error);
        console.log(error.response?.data);
      }
    };

    sincronizarUsuario();

  }, [isLoaded, user]);

  return <AppRouter />;
}

export default App;
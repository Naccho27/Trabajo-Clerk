import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { CategoriasProvider } from "./context/CategoriasContext.jsx";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={
        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
      }
    >
      <BrowserRouter>
        <UserProvider>
          <CategoriasProvider>
            <App />
          </CategoriasProvider>
        </UserProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";

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
          <App />
        </UserProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
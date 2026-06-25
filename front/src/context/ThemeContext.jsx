import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [modoOscuro, setModoOscuro] = useState(() => {
    const guardado = localStorage.getItem("modoOscuro");
    return guardado === "true";
  });

  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("modoOscuro", modoOscuro);
  }, [modoOscuro]);

  const toggleModoOscuro = () => setModoOscuro((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ modoOscuro, toggleModoOscuro }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
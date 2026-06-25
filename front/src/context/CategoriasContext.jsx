import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CategoriasContext = createContext(null);

export function CategoriasProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarCategorias = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/categories/active`);
      setCategorias(data.categorias || []);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  return (
    <CategoriasContext.Provider value={{ categorias, loading, refrescarCategorias: cargarCategorias }}>
      {children}
    </CategoriasContext.Provider>
  );
}

export function useCategorias() {
  return useContext(CategoriasContext);
}
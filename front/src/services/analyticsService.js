import axios from "axios";

const API_URL = "http://localhost:3000/api/analytics";

export const obtenerReportesPorEstado = async () => {
  const response = await axios.get(`${API_URL}/estados`);
  return response.data;
};

export const obtenerReportesPorCategoria = async () => {
  const response = await axios.get(`${API_URL}/categorias`);
  return response.data;
};

export const obtenerReportesPorPrioridad = async () => {
  const response = await axios.get(`${API_URL}/prioridades`);
  return response.data;
};

export const obtenerPorcentajeResueltos = async () => {
  const response = await axios.get(`${API_URL}/resueltos`);
  return response.data;
};

export const obtenerTiempoPromedio = async () => {
  const response = await axios.get(`${API_URL}/tiempo-promedio`);
  return response.data;
};
import axios from "axios";

const API_URL = "http://localhost:3000/api/supervisor";

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const obtenerReportesPendientes = async (token) => {
  const response = await axios.get(`${API_URL}/reportes?estado=open`, { headers: headers(token) });
  return response.data;
};

export const obtenerDetalleReporte = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, { headers: headers(token) });
  return response.data;
};

export const aprobarReporte = async (id, token) => {
  const response = await axios.patch(`${API_URL}/${id}/aprobar`, {}, { headers: headers(token) });
  return response.data;
};

export const rechazarReporte = async (id, motivo, token) => {
  const response = await axios.patch(`${API_URL}/${id}/rechazar`, { motivo }, { headers: headers(token) });
  return response.data;
};

export const cambiarCategoria = async (id, categoria, token) => {
  const response = await axios.patch(`${API_URL}/${id}/categoria`, { categoria }, { headers: headers(token) });
  return response.data;
};

export const cambiarPrioridad = async (id, prioridad, token) => {
  const response = await axios.patch(`${API_URL}/${id}/prioridad`, { prioridad }, { headers: headers(token) });
  return response.data;
};
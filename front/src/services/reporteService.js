import axios from "axios";

const API_URL = "http://localhost:3000/api/reportes";

// Pública - no necesita token
export const obtenerReportesPublicos = async () => {
  const response = await axios.get(`${API_URL}/publicos`);
  return response.data;
};

// Privada - necesita token de Clerk
export const obtenerMisReportes = async (token) => {
  const response = await axios.get(`${API_URL}/mis-reportes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const crearReporte = async (formData, token) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const eliminarReporte = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
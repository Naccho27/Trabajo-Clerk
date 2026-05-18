import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const sincronizarUsuario = async (
  datosUsuario,
  token
) => {
  const response = await axios.post(
    `${API_URL}/sync`,
    datosUsuario,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};
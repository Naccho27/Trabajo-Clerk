import axios from "axios";

const API_URL = "http://localhost:3000/api/admin";

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const obtenerUsuarios = async (token) => {
  const response = await axios.get(
    `${API_URL}/users`,
    {
      headers: headers(token),
    }
  );

  return response.data;
};

export const bloquearUsuario = async (id, token) => {
  const response = await axios.patch(
    `${API_URL}/users/${id}/block`,
    {},
    {
      headers: headers(token),
    }
  );

  return response.data;
};

export const desbloquearUsuario = async (id, token) => {
  const response = await axios.patch(
    `${API_URL}/users/${id}/unblock`,
    {},
    {
      headers: headers(token),
    }
  );

  return response.data;
};

export const agregarRol = async (
  id,
  rol,
  token
) => {
  const response = await axios.patch(
    `${API_URL}/users/${id}/add-role`,
    { rol },
    {
      headers: headers(token),
    }
  );

  return response.data;
};

export const quitarRol = async (
  id,
  rol,
  token
) => {
  const response = await axios.patch(
    `${API_URL}/users/${id}/remove-role`,
    { rol },
    {
      headers: headers(token),
    }
  );

  return response.data;
};
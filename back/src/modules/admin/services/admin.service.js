import Usuario from "../../ciudadano/models/Usuario.js";
import Categoria from "../models/admin.categories.js";

import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
/*
|--------------------------------------------------------------
| Obtener usuarios
|--------------------------------------------------------------
*/

export const getUsersService = async () => {
  return await Usuario.find().sort({ createdAt: -1 });
};

/*
|--------------------------------------------------------------
| Agregar rol
|--------------------------------------------------------------
*/

export const addRoleService = async (userId, rol) => {
  const usuario = await Usuario.findById(userId);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  if (!usuario.roles.includes(rol)) {
    usuario.roles.push(rol);

    await usuario.save();
  }

  return usuario;
};

/*
|--------------------------------------------------------------
| Quitar rol
|--------------------------------------------------------------
*/

export const removeRoleService = async (userId, rol) => {
  const usuario = await Usuario.findById(userId);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  usuario.roles = usuario.roles.filter((r) => r !== rol);

  if (usuario.roles.length === 0) {
    usuario.roles = ["ciudadano"];
  }

  await usuario.save();

  return usuario;
};

/*
|--------------------------------------------------------------
| Cambiar rol
|--------------------------------------------------------------
*/

/*
|--------------------------------------------------------------
| Bloquear usuario
|--------------------------------------------------------------
*/

export const blockUserService = async (userId) => {
  const usuario = await Usuario.findById(userId);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  usuario.activo = false;

  await usuario.save();

  return usuario;
};

/*
|--------------------------------------------------------------
| Desbloquear usuario
|--------------------------------------------------------------
*/

export const unblockUserService = async (userId) => {
  const usuario = await Usuario.findById(userId);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  usuario.activo = true;

  await usuario.save();

  return usuario;
};

/*
|--------------------------------------------------------------
| Crear usuario
|--------------------------------------------------------------
*/

export const createUserService = async ({
  nombreUsuario,
  email,
  password,
  roles,
}) => {
  const usernameLimpio = nombreUsuario.trim().replace(/\s+/g, "_");

  const emailLimpio = email.trim().toLowerCase();

  const existe = await Usuario.findOne({
    email: emailLimpio,
  });

  if (existe) {
    throw new Error("Ya existe un usuario con ese email");
  }

  const clerkUser = await clerkClient.users.createUser({
    username: usernameLimpio,

    emailAddress: [emailLimpio],

    password,
  });

  const usuario = await Usuario.create({
    clerkId: clerkUser.id,

    nombreUsuario,

    email: emailLimpio,

    roles,

    activo: true,
  });

  return usuario;
};

export const getCategoriesService = async () => {
  return await Categoria.find().sort({ nombre: 1 });
};

export const createCategoryService = async (nombre) => {
  const nombreLimpio = nombre.trim().toLowerCase();

  const existe = await Categoria.findOne({
    nombre: nombreLimpio,
  });

  if (existe) {
    throw new Error("La categoría ya existe");
  }

  return await Categoria.create({
    nombre: nombreLimpio,
  });
};
/*
|--------------------------------------------------------------
| Editar categoría
|--------------------------------------------------------------
*/

export const updateCategoryService = async (categoryId, nombre) => {
  const categoria = await Categoria.findById(categoryId);

  if (!categoria) {
    throw new Error("Categoría no encontrada");
  }

  const nombreLimpio = nombre.trim().toLowerCase();

  const existe = await Categoria.findOne({
    nombre: nombreLimpio,

    _id: {
      $ne: categoryId,
    },
  });

  if (existe) {
    throw new Error("Ya existe una categoría con ese nombre");
  }

  categoria.nombre = nombreLimpio;

  await categoria.save();

  return categoria;
};

/*
|--------------------------------------------------------------
| Desactivar categoría
|--------------------------------------------------------------
*/

export const disableCategoryService = async (categoryId) => {
  const categoria = await Categoria.findById(categoryId);

  if (!categoria) {
    throw new Error("Categoría no encontrada");
  }

  categoria.activa = false;

  await categoria.save();

  return categoria;
};

/*
|--------------------------------------------------------------
| Activar categoría
|--------------------------------------------------------------
*/

export const enableCategoryService = async (categoryId) => {
  const categoria = await Categoria.findById(categoryId);

  if (!categoria) {
    throw new Error("Categoría no encontrada");
  }

  categoria.activa = true;

  await categoria.save();

  return categoria;
};

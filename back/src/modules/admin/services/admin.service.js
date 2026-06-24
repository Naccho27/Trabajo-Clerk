import Usuario from "../../ciudadano/models/Usuario.js";
import Categoria from "../models/admin.categories.js";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
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
| Crear usuario (Admin)
|--------------------------------------------------------------
*/

export const createUserService = async ({ nombreUsuario, email, password, roles }) => {
  const clerkUser = await clerkClient.users.createUser({
    emailAddress: [email],
    password,
    username: nombreUsuario,
    skipPasswordChecks: false,
    skipLegalChecks: true,
  });

  const usuario = await Usuario.create({
    clerkId: clerkUser.id,
    nombreUsuario,
    email,
    roles: roles?.length ? roles : ["ciudadano"],
    imagenPerfil: clerkUser.imageUrl || "",
  });

  return usuario;
};

/*
|--------------------------------------------------------------
| Agregar rol
|--------------------------------------------------------------
*/

export const addUserRoleService = async (userId, nuevoRol) => {
  const usuario = await Usuario.findById(userId);
  if (!usuario) throw new Error("Usuario no encontrado");

  if (!usuario.roles.includes(nuevoRol)) {
    usuario.roles.push(nuevoRol);
    await usuario.save();
  }

  return usuario;
};

/*
|--------------------------------------------------------------
| Quitar rol
|--------------------------------------------------------------
*/

export const removeUserRoleService = async (userId, rolAQuitar) => {
  const usuario = await Usuario.findById(userId);
  if (!usuario) throw new Error("Usuario no encontrado");

  if (usuario.roles.length <= 1) {
    throw new Error("El usuario debe tener al menos un rol");
  }

  usuario.roles = usuario.roles.filter((r) => r !== rolAQuitar);
  await usuario.save();
  return usuario;
};

/*
|--------------------------------------------------------------
| Bloquear usuario
|--------------------------------------------------------------
*/

export const blockUserService = async (userId) => {
  const usuario = await Usuario.findById(userId);
  if (!usuario) throw new Error("Usuario no encontrado");
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
  if (!usuario) throw new Error("Usuario no encontrado");
  usuario.activo = true;
  await usuario.save();
  return usuario;
};

/*
|--------------------------------------------------------------
| Obtener TODAS las categorías (admin)
|--------------------------------------------------------------
*/

export const getCategoriesService = async () => {
  return await Categoria.find().sort({ nombre: 1 });
};

/*
|--------------------------------------------------------------
| Obtener solo categorías ACTIVAS (pública)
|--------------------------------------------------------------
*/

export const getActiveCategoriesService = async () => {
  return await Categoria.find({ activa: true }).sort({ nombre: 1 });
};

export const createCategoryService = async (nombre, imagenUrl) => {
  const nombreLimpio = nombre.trim().toLowerCase();
  const existe = await Categoria.findOne({ nombre: nombreLimpio });
  if (existe) throw new Error("La categoría ya existe");
  return await Categoria.create({
    nombre: nombreLimpio,
    ...(imagenUrl && { imagen: imagenUrl }),
  });
};

export const updateCategoryService = async (categoryId, nombre, imagenUrl) => {
  const categoria = await Categoria.findById(categoryId);
  if (!categoria) throw new Error("Categoría no encontrada");
  const nombreLimpio = nombre.trim().toLowerCase();
  const existe = await Categoria.findOne({ nombre: nombreLimpio, _id: { $ne: categoryId } });
  if (existe) throw new Error("Ya existe una categoría con ese nombre");
  categoria.nombre = nombreLimpio;
  if (imagenUrl) categoria.imagen = imagenUrl;
  await categoria.save();
  return categoria;
};

export const disableCategoryService = async (categoryId) => {
  const categoria = await Categoria.findById(categoryId);
  if (!categoria) throw new Error("Categoría no encontrada");
  categoria.activa = false;
  await categoria.save();
  return categoria;
};

export const enableCategoryService = async (categoryId) => {
  const categoria = await Categoria.findById(categoryId);
  if (!categoria) throw new Error("Categoría no encontrada");
  categoria.activa = true;
  await categoria.save();
  return categoria;
};
import Usuario
from "../../ciudadano/models/Usuario.js";

import { clerkClient } from "@clerk/express";

/*
|--------------------------------------------------------------
| Obtener usuarios
|--------------------------------------------------------------
*/

export const getUsersService =
  async () => {

    return await Usuario.find()
      .sort({ createdAt: -1 });

  };

/*
|--------------------------------------------------------------
| Crear usuario (Admin)
|--------------------------------------------------------------
*/

export const createUserService =
  async ({
    nombreUsuario,
    email,
    password,
    roles
  }) => {

    const clerkUser =
      await clerkClient.users.createUser({

        emailAddress: [email],

        password,

        username: nombreUsuario,

        skipPasswordChecks: false,

        skipLegalChecks: true,

      });

    const usuario =
      await Usuario.create({

        clerkId: clerkUser.id,

        nombreUsuario,

        email,

        roles: roles?.length
          ? roles
          : ["ciudadano"],

        imagenPerfil:
          clerkUser.imageUrl || "",

      });

    return usuario;

  };

/*
|--------------------------------------------------------------
| Agregar rol
|--------------------------------------------------------------
*/

export const addUserRoleService =
  async (
    userId,
    nuevoRol
  ) => {

    const usuario =
      await Usuario.findById(userId);

    if (!usuario) {

      throw new Error(
        "Usuario no encontrado"
      );

    }

    if (
      !usuario.roles.includes(nuevoRol)
    ) {

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

export const removeUserRoleService =
  async (
    userId,
    rolAQuitar
  ) => {

    const usuario =
      await Usuario.findById(userId);

    if (!usuario) {

      throw new Error(
        "Usuario no encontrado"
      );

    }

    if (
      usuario.roles.length <= 1
    ) {

      throw new Error(
        "El usuario debe tener al menos un rol"
      );

    }

    usuario.roles =
      usuario.roles.filter(
        (r) => r !== rolAQuitar
      );

    await usuario.save();

    return usuario;

  };

/*
|--------------------------------------------------------------
| Bloquear usuario
|--------------------------------------------------------------
*/

export const blockUserService =
  async (userId) => {

    const usuario =
      await Usuario.findById(userId);

    if (!usuario) {

      throw new Error(
        "Usuario no encontrado"
      );

    }

    usuario.activo =
      false;

    await usuario.save();

    return usuario;

  };

/*
|--------------------------------------------------------------
| Desbloquear usuario
|--------------------------------------------------------------
*/

export const unblockUserService =
  async (userId) => {

    const usuario =
      await Usuario.findById(userId);

    if (!usuario) {

      throw new Error(
        "Usuario no encontrado"
      );

    }

    usuario.activo =
      true;

    await usuario.save();

    return usuario;

  };
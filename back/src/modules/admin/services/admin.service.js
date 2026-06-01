import Usuario
from "../../ciudadano/models/Usuario.js";

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
| Agregar rol
|--------------------------------------------------------------
*/

export const addRoleService =
  async (
    userId,
    rol
  ) => {

    const usuario =
      await Usuario.findById(userId);

    if (!usuario) {

      throw new Error(
        "Usuario no encontrado"
      );

    }

    if (
      !usuario.roles.includes(rol)
    ) {

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

export const removeRoleService =
  async (
    userId,
    rol
  ) => {

    const usuario =
      await Usuario.findById(userId);

    if (!usuario) {

      throw new Error(
        "Usuario no encontrado"
      );

    }

    usuario.roles =
      usuario.roles.filter(
        r => r !== rol
      );

    if (
      usuario.roles.length === 0
    ) {

      usuario.roles =
        ["ciudadano"];

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
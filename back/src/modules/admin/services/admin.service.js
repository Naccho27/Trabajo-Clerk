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
| Cambiar rol
|--------------------------------------------------------------
*/

export const changeUserRoleService =
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

    usuario.rol =
      nuevoRol;

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
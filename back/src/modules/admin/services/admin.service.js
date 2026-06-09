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



  import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const createUserService = async ({ nombreUsuario, email, password, rol }) => {
  const clerkUser = await clerkClient.users.createUser({
    username: nombreUsuario,
    emailAddress: [email],
    password,
  });

  const usuario = await Usuario.create({
    clerkId: clerkUser.id,
    nombreUsuario,
    email,
    imagenPerfil: clerkUser.imageUrl || "",
    rol,
    activo: true,
  });

  return usuario;
};  


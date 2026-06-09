import {

  getUsersService,

  changeUserRoleService,

  blockUserService,

  unblockUserService

} from "../services/admin.service.js";

/*
|--------------------------------------------------------------
| Obtener usuarios
|--------------------------------------------------------------
*/

export const getUsers =
  async (
    req,
    res,
    next
  ) => {

    try {

      const usuarios =
        await getUsersService();

      res.status(200).json({

        ok: true,

        usuarios

      });

    } catch (error) {

      next(error);

    }

  };

/*
|--------------------------------------------------------------
| Cambiar rol
|--------------------------------------------------------------
*/

export const changeUserRole =
  async (
    req,
    res,
    next
  ) => {

    try {

      const usuario =
        await changeUserRoleService(

          req.params.id,

          req.body.rol

        );

      res.status(200).json({

        ok: true,

        usuario

      });

    } catch (error) {

      next(error);

    }

  };

/*
|--------------------------------------------------------------
| Bloquear usuario
|--------------------------------------------------------------
*/

export const blockUser =
  async (
    req,
    res,
    next
  ) => {

    try {

      const usuario =
        await blockUserService(
          req.params.id
        );

      res.status(200).json({

        ok: true,

        usuario

      });

    } catch (error) {

      next(error);

    }

  };

/*
|--------------------------------------------------------------
| Desbloquear usuario
|--------------------------------------------------------------
*/

export const unblockUser =
  async (
    req,
    res,
    next
  ) => {

    try {

      const usuario =
        await unblockUserService(
          req.params.id
        );

      res.status(200).json({

        ok: true,

        usuario

      });

    } catch (error) {

      next(error);

    }

  };


import { createUserService } from "../services/admin.service.js";

export const createUser = async (req, res, next) => {
  try {
    const { nombreUsuario, email, password, rol } = req.body;
    if (!nombreUsuario || !email || !password || !rol) {
      return res.status(400).json({ ok: false, mensaje: "Todos los campos son obligatorios" });
    }
    const usuario = await createUserService({ nombreUsuario, email, password, rol });
    res.status(201).json({ ok: true, usuario });
  } catch (error) {
    next(error);
  }
};  
import {
  getUsersService,
  blockUserService,
  unblockUserService,
  addRoleService,
  removeRoleService,
} from "../services/admin.service.js";

/*
|--------------------------------------------------------------
| Obtener usuarios
|--------------------------------------------------------------
*/

export const getUsers = async (req, res, next) => {
  try {
    const usuarios = await getUsersService();

    res.status(200).json({
      ok: true,

      usuarios,
    });
  } catch (error) {
    next(error);
  }
};
/*
|--------------------------------------------------------------
| Añadir roles
|--------------------------------------------------------------
*/
export const addRole =
  async (req, res, next) => {

    try {

      const usuario =
        await addRoleService(

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

export const removeRole =
  async (req, res, next) => {

    try {

      const usuario =
        await removeRoleService(

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
| Cambiar rol
|--------------------------------------------------------------
*/

export const changeUserRole = async (req, res, next) => {
  try {
    const usuario = await changeUserRoleService(
      req.params.id,

      req.body.roles,
    );

    res.status(200).json({
      ok: true,

      usuario,
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

export const blockUser = async (req, res, next) => {
  try {
    const usuario = await blockUserService(req.params.id);

    res.status(200).json({
      ok: true,

      usuario,
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

export const unblockUser = async (req, res, next) => {
  try {
    const usuario = await unblockUserService(req.params.id);

    res.status(200).json({
      ok: true,

      usuario,
    });
  } catch (error) {
    next(error);
  }
};

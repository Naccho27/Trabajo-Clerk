import {

  getUsersService,

  createUserService,

  addUserRoleService,

  removeUserRoleService,

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
| Crear usuario
|--------------------------------------------------------------
*/

export const createUser =
  async (
    req,
    res,
    next
  ) => {

    try {

      const usuario =
        await createUserService(
          req.body
        );

      res.status(201).json({

        ok: true,

        usuario

      });

    } catch (error) {

      next(error);

    }

  };

/*
|--------------------------------------------------------------
| Agregar rol
|--------------------------------------------------------------
*/

export const addUserRole =
  async (
    req,
    res,
    next
  ) => {

    try {

      const usuario =
        await addUserRoleService(

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
| Quitar rol
|--------------------------------------------------------------
*/

export const removeUserRole =
  async (
    req,
    res,
    next
  ) => {

    try {

      const usuario =
        await removeUserRoleService(

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
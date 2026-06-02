import { Router }
from "express";

import authMiddleware
from "../../auth/middlewares/auth.middleware.js";

import { requireRole }
from "../../../shared/middlewares/requireRole.js";

import { validate }
from "../../../shared/middlewares/validate.middleware.js";

import {

  getUsers,

  changeUserRole,

  blockUser,

  unblockUser

} from "../controllers/admin.controller.js";

import {
  roleSchema
} from "../validators/admin.validator.js";

const router = Router();

/*
|--------------------------------------------------------------
| Obtener usuarios
|--------------------------------------------------------------
*/

router.get(
  "/users",

  getUsers
);

/*
|--------------------------------------------------------------
| Cambiar rol
|--------------------------------------------------------------
*/

router.patch(
  "/users/:id/role",

  validate(roleSchema),

  changeUserRole
);

/*
|--------------------------------------------------------------
| Bloquear usuario
|--------------------------------------------------------------
*/

router.patch(
  "/users/:id/block",

  blockUser
);

/*
|--------------------------------------------------------------
| Desbloquear usuario
|--------------------------------------------------------------
*/

router.patch(
  "/users/:id/unblock",

  unblockUser
);

export default router;
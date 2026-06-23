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

  unblockUser,

  createUser,

  getCategories,
  
  createCategory,
  
  updateCategory,

  disableCategory,

  enableCategory

} from "../controllers/admin.controller.js";

import {
  roleSchema
} from "../validators/admin.validator.js";

const router = Router();

/*
|--------------------------------------------------------------
| Crear usuario
|--------------------------------------------------------------
*/

router.post(
  "/users",

  createUser
);

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


router.get(
  "/categories",
  getCategories
);

router.post(
  "/categories",
  createCategory
);

/*
|--------------------------------------------------------------
| Editar categoría
|--------------------------------------------------------------
*/

router.patch(
  "/categories/:id",
  updateCategory
);

/*
|--------------------------------------------------------------
| Desactivar categoría
|--------------------------------------------------------------
*/

router.patch(
  "/categories/:id/disable",
  disableCategory
);

/*
|--------------------------------------------------------------
| Activar categoría
|--------------------------------------------------------------
*/

router.patch(
  "/categories/:id/enable",
  enableCategory
);

export default router;
import { Router }
  from "express";

import authMiddleware
  from "../../auth/middlewares/auth.middleware.js";

import { requireRole }
  from "../../../shared/middlewares/requireRole.js";

import { validate }
  from "../../../shared/middlewares/validate.middleware.js";

import { upload }
  from "../../../shared/middlewares/upload.middleware.js";

import {

  getUsers,

  createUser,

  addUserRole,

  removeUserRole,

  blockUser,

  unblockUser,

  createUser,

  getCategories,

  getActiveCategories,

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
| Pública - listar categorías activas
|--------------------------------------------------------------
*/

router.get(
  "/categories/active",
  getActiveCategories
);

/*
|--------------------------------------------------------------
| A partir de aquí, todo requiere admin
|--------------------------------------------------------------
*/

router.use(authMiddleware);
router.use(requireRole("admin"));

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
| Crear usuario
|--------------------------------------------------------------
*/

router.post(
  "/users",

  createUser
);

/*
|--------------------------------------------------------------
| Agregar rol
|--------------------------------------------------------------
*/

router.patch(
  "/users/:id/add-role",

  validate(roleSchema),

  addUserRole
);

/*
|--------------------------------------------------------------
| Quitar rol
|--------------------------------------------------------------
*/

router.patch(
  "/users/:id/remove-role",

  validate(roleSchema),

  removeUserRole
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
  upload.single("imagen"),
  createCategory
);

/*
|--------------------------------------------------------------
| Editar categoría
|--------------------------------------------------------------
*/

router.patch(
  "/categories/:id",
  upload.single("imagen"),
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
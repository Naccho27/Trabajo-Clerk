import { Router } from "express";

import authMiddleware from "../../auth/middlewares/auth.middleware.js";

import { requireRole } from "../../../shared/middlewares/requireRole.js";

import { validate } from "../../../shared/middlewares/validate.middleware.js";


console.log("IMPORT REQUIRE ROLE:", requireRole);

import {
  getUsers,
  changeUserRole,
  blockUser,
  unblockUser,
  addRole,
  removeRole,
} from "../controllers/admin.controller.js";

import {
  addRoleSchema,
  removeRoleSchema,
} from "../validators/admin.validator.js";

const router = Router();

/*
|--------------------------------------------------------------
| Obtener usuarios
|--------------------------------------------------------------
*/

router.get(
  "/users",

  authMiddleware,

  requireRole("admin"),

  getUsers,
);

/*
|--------------------------------------------------------------
| Cambiar rol
|--------------------------------------------------------------
*/

router.patch(
  "/users/:id/add-role",
  authMiddleware,
  ///requireRole("admin"),
  validate(addRoleSchema),
  addRole
);

router.patch(
  "/users/:id/remove-role",
  authMiddleware,
  requireRole("admin"),
  validate(removeRoleSchema),
  removeRole
);

/*
|--------------------------------------------------------------
| Bloquear usuario
|--------------------------------------------------------------
*/

router.patch(
  "/users/:id/block",

  authMiddleware,

  requireRole("admin"),

  blockUser,
);

/*
|--------------------------------------------------------------
| Desbloquear usuario
|--------------------------------------------------------------
*/

router.patch(
  "/users/:id/unblock",

  authMiddleware,

  requireRole("admin"),

  unblockUser,
);

export default router;

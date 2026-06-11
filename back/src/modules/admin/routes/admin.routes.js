import { Router } from "express";

import authMiddleware from "../../auth/middlewares/auth.middleware.js";

import { requireRole } from "../../../shared/middlewares/requireRole.js";

import { validate } from "../../../shared/middlewares/validate.middleware.js";

import {
  getUsers,
  blockUser,
  unblockUser,
  addRole,
  removeRole,
  createUser,
  getCategories,
  createCategory,
  updateCategory,
  disableCategory,
  enableCategory,
} from "../controllers/admin.controller.js";

import {
  addRoleSchema,
  removeRoleSchema,
} from "../validators/admin.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Usuarios
|--------------------------------------------------------------------------
*/

router.post(
  "/users",
  authMiddleware,
  requireRole("admin"),
  createUser
);

router.get(
  "/users",
  authMiddleware,
  requireRole("admin"),
  getUsers
);

router.patch(
  "/users/:id/add-role",
  authMiddleware,
  requireRole("admin"),
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

router.patch(
  "/users/:id/block",
  authMiddleware,
  requireRole("admin"),
  blockUser
);

router.patch(
  "/users/:id/unblock",
  authMiddleware,
  requireRole("admin"),
  unblockUser
);

/*
|--------------------------------------------------------------------------
| Categorías
|--------------------------------------------------------------------------
*/

router.get(
  "/categories",
  authMiddleware,
  requireRole("admin"),
  getCategories
);

router.post(
  "/categories",
  authMiddleware,
  requireRole("admin"),
  createCategory
);

router.patch(
  "/categories/:id",
  authMiddleware,
  requireRole("admin"),
  updateCategory
);

router.patch(
  "/categories/:id/disable",
  authMiddleware,
  requireRole("admin"),
  disableCategory
);

router.patch(
  "/categories/:id/enable",
  authMiddleware,
  requireRole("admin"),
  enableCategory
);

export default router;
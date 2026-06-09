import { Router } from "express";

import authMiddleware from "../../auth/middlewares/auth.middleware.js";

import { requireRole } from "../../../shared/middlewares/requireRole.js";

import { validate } from "../../../shared/middlewares/validate.middleware.js";

import {
  getUsers,
  changeUserRole,
  blockUser,
  unblockUser,
  createUser
} from "../controllers/admin.controller.js";

import { roleSchema } from "../validators/admin.validator.js";

const router = Router();

router.get("/users", getUsers);

router.patch("/users/:id/role", validate(roleSchema), changeUserRole);

router.patch("/users/:id/block", blockUser);

router.patch("/users/:id/unblock", unblockUser);

router.post("/users", createUser);

export default router;
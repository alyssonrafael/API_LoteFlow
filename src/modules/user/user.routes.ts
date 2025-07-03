import { Router } from "express";
import { checkRole, validateToken } from "../../middlewares/authMiddleware";
import {
  getAllUsers,
  getUserById,
  updateLoggedUser,
  updatePassword,
  updateUserRole,
  updateUserStatus,
} from "./user.controller";
import {
  getAllUsersSchema,
  getUserByIdSchema,
  updatePasswordBodySchema,
  updateUserBodySchema,
  updateUserRoleBodySchema,
  updateUserStatusSchema,
} from "../../validations";
import { validate } from "../../middlewares/validate";

const router = Router();

router.use(validateToken);

router.get(
  "/users",
  validate(getAllUsersSchema, "query"),
  checkRole.adminOrMaster(),
  getAllUsers
);

router.get(
  "/user/:id",
  validate(getUserByIdSchema, "params"),
  checkRole.adminOrMaster(),
  getUserById
);

router.patch(
  "/user/me",
  validate(updateUserBodySchema),
  checkRole.all(),
  updateLoggedUser
);

router.patch(
  "/user/me/password",
  validate(updatePasswordBodySchema),
  checkRole.all(),
  updatePassword
);

router.patch(
  "/user/:id/role",
  checkRole.adminOrMaster(),
  validate(getUserByIdSchema, "params"),
  validate(updateUserRoleBodySchema),
  updateUserRole
);

router.patch(
  "/user/:id/status",
  checkRole.adminOrMaster(),
  validate(getUserByIdSchema, "params"),
  validate(updateUserStatusSchema),
  updateUserStatus
);
export default router;

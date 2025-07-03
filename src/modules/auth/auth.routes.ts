import { Router } from "express";
import {
  accessCompany,
  createCompany,
  createUser,
  login,
  requestPasswordReset,
  resertPassword,
} from "./auth.controller";
import { validate } from "../../middlewares/validate";
import {
  createCompanySchema,
  createUserSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  verifyAccessCodeSchema,
} from "../../validations";

const router = Router();

router.post("/register/company", validate(createCompanySchema), createCompany);

router.post("/access/company", validate(verifyAccessCodeSchema), accessCompany);

router.post("/register/user", validate(createUserSchema), createUser);

router.post("/login", validate(loginSchema), login);

router.post(
  "/request/password-reset",
  validate(requestPasswordResetSchema),
  requestPasswordReset
);

router.post("/password-reset", validate(resetPasswordSchema), resertPassword);

export default router;

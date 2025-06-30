import { Router } from "express";
import { accessCompany, createCompany, createUser } from "./auth.controller";
import { validate } from "../middlewares/validate";
import { createCompanySchema, createUserSchema, verifyAccessCodeSchema } from "../validations";

const router = Router();

router.post("/register/company", validate(createCompanySchema), createCompany);
router.post("/access/company", validate(verifyAccessCodeSchema), accessCompany);

router.post("/register/user/:accessCode", validate(createUserSchema), createUser)


export default router;

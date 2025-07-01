import { z } from "zod";
import {
  cnpjField,
  companyCodeField,
  companyNameField,
  emailField,
  fullNameField,
  passwordField,
  userNameField,
} from "./shared.schema";

export const createCompanySchema = z.object({
  accessCode: companyCodeField,
  name: companyNameField,
  cnpj: cnpjField,
});
export type CreateCompanySchema = z.infer<typeof createCompanySchema>;

export const verifyAccessCodeSchema = z.object({
  accessCode: companyCodeField,
});
export type VerifyAccessCodeSchema = z.infer<typeof verifyAccessCodeSchema>;

export const createUserSchema = z.object({
  accessCode: companyCodeField,
  email: emailField,
  userName: userNameField,
  fullName: fullNameField,
  password: passwordField,
});
export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const loginSchema = z
  .object({
    accessCode: companyCodeField,
    email: emailField.optional(),
    userName: userNameField.optional(),
    password: passwordField,
  })
  .refine((data) => data.email || data.userName, {
    message: "É necessário informar email ou username",
  });
export type LoginSchema = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
  accessCode: companyCodeField,
  email: emailField,
});
export type RequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;

export const resetPasswordSchema = z.object({
  newPassword: passwordField,
  tokenOrCode: z.string(),
});
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

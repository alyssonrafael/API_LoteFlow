import { z } from "zod";
import { fullNameField, passwordField, userNameField } from "./shared.schema";
import { UserRole } from "../../types/types";

// Aceita "active", "inactive" ou nada (undefined = todos)
export const getAllUsersSchema = z.object({
  status: z.enum(["active", "inactive"]).optional(),
});
export type GetAllUsersSchema = z.infer<typeof getAllUsersSchema>;

export const getUserByIdSchema = z.object({
  id: z.string().uuid("ID do usuário inválido"),
});
export type GetUserByIdSchema = z.infer<typeof getUserByIdSchema>;

export const updateUserBodySchema = z
  .object({
    fullName: fullNameField.optional(),
    username: userNameField.optional(),
  })
  .refine((data) => data.fullName || data.username, {
    path: ["Refine"],
    message: "É necessário informar ao menos um campo para atualizar.",
  });
export type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;

export const updatePasswordBodySchema = z.object({
  currentPassword: passwordField,
  newPassword: passwordField,
});
export type UpdatePasswordBodySchema = z.infer<typeof updatePasswordBodySchema>;

export const updateUserRoleBodySchema = z.object({
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Função inválida" }),
  }),
});
export type UpdateUserRoleBodySchema = z.infer<typeof updateUserRoleBodySchema>;

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
export type UpdateUserStatusSchema = z.infer<typeof updateUserStatusSchema>;

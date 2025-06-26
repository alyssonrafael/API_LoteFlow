import { z } from "zod";
import { empresaCodigoField, emailField, passwordField } from "./shared.schema";

export const loginSchema = z.object({
  empresaCodigo: empresaCodigoField,
  email: emailField,
  senha: passwordField,
});

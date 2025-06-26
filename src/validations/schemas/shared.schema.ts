// src/validations/schemas/shared.schema.ts
import { z } from "zod";

// E-mail
export const emailField = z.string().email("E-mail inválido");

// Senha
export const passwordField = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres");

export const empresaCodigoField = z
  .string()
  .regex(
    /^[a-zA-Z0-9]{6}$/,
    "Código da empresa deve conter 6 caracteres alfanuméricos"
  );

// CPF (somente números)
export const cpfField = z
  .string()
  .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos");

// CNPJ (somente números)
export const cnpjField = z
  .string()
  .regex(/^\d{14}$/, "CNPJ deve conter 14 dígitos numéricos");

// Telefone (formato brasileiro com DDD)
export const telefoneField = z
  .string()
  .regex(/^\d{10,11}$/, "Telefone deve conter 10 ou 11 dígitos numéricos");

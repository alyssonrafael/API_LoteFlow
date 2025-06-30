import { z } from "zod";

// E-mail
export const emailField = z.string().email("E-mail inválido");

// Senha
export const passwordField = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres");

// Código da empresa (alfanumérico com 6 caracteres)
export const companyCodeField = z
  .string()
  .regex(
    /^[A-Za-z]{3}[0-9]{3}$/,
    "Código da empresa deve conter 3 letras maiúsculas seguidas de 3 números"
  )
  .transform((val) => val.toUpperCase());

// Nome da empresa
export const companyNameField = z
  .string()
  .min(6, "O nome da empresa deve ter pelo menos 6 caracteres");

// CPF (somente números)
export const cpfField = z
  .string()
  .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos");

// CNPJ (somente números)
export const cnpjField = z
  .string()
  .regex(/^\d{14}$/, "CNPJ deve conter 14 dígitos numéricos");

// Telefone (somente números, 10 ou 11 dígitos com DDD)
export const phoneField = z
  .string()
  .regex(/^\d{10,11}$/, "Telefone deve conter 10 ou 11 dígitos numéricos");

//nome do usuario
export const fullNameField = z
  .string()
  .min(4, "O nome deve conter pelo menos 4 caracteres.")
  .max(60, "O nome deve conter no máximo 60 caracteres");

//user name
export const userNameField = z
  .string()
  .min(6, "O nome deve conter pelo menos 6 caracteres.")
  .max(10, "O nome deve conter no máximo 10 caracteres");

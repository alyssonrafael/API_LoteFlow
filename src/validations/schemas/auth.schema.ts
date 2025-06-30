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

export const verifyAccessCodeSchema = z.object({
  accessCode: companyCodeField,
});

export const createUserSchema = z.object({
  email: emailField,
  userName: userNameField,
  fullName: fullNameField,
  password: passwordField,
});

export const LoginSchema = z.object({
  email:emailField.optional(),
  userName:userNameField.optional(),
  password:passwordField
}).refine((data)=>data.email||data.userName,{
  message: "É necessário informar email ou username"
})
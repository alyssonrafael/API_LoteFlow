import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";

export async function createCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const company = await authService.registerCompany(req.validatedBody);

    res.status(201).json({
      message: "Empresa criada com sucesso!",
      company,
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function accessCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await authService.accessCompany(req.validatedBody);
    res.status(200).json({
      message: "Entrou na empresa",
      accessCode: response,
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authService.registerUser(req.validatedBody);
    res.status(201).json({
      message:
        "Usuario criado com sucesso! Aguarde a altorização do Administrador ",
      user,
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const token = await authService.login(req.validatedBody);

    res.status(200).json({
      message: "Autenticado com sucesso",
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function requestPasswordReset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await authService.requestPasswordReset(req.validatedBody);
    res.status(200).json({
      message: "E-mail de recuperção enviado!",
    });
  } catch (error) {
    next(error);
  }
}

export async function resertPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await authService.resetPassword(req.validatedBody);
    res.status(200).json({
      message: "Senha redefinida com sucesso!",
    });
  } catch (error) {
    next(error);
  }
}

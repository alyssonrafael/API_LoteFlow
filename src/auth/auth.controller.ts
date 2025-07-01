import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";

export async function createCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessCode, name, cnpj } = req.body;

  try {
    const company = await authService.registerCompany({
      accessCode,
      name,
      cnpj,
    });

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
  const { accessCode } = req.body;
  try {
    await authService.accessCompany(accessCode);
    res.status(200).json({
      message: "Entrou na empresa",
      accessCode: accessCode,
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
  const { accessCode } = req.params;
  const { email, userName, fullName, password } = req.body;

  try {
    const user = await authService.registerUser({
      accessCode,
      email,
      userName,
      fullName,
      password,
    });

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
  const { accessCode } = req.params;
  const { email, userName, password } = req.body;

  try {
    const data = { accessCode, email, userName, password };

    const token = await authService.login(data);

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
  const { accessCode } = req.params;
  const { email } = req.body;

  try {
    const data = { accessCode, email };

    await authService.requestPasswordReset(data);
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
  const { newPassword, tokenOrCode } = req.body;

  try {
    const data = { newPassword, tokenOrCode };

    await authService.resetPassword(data);
    res.status(200).json({
      message: "Senha redefinida com sucesso!",
    });
  } catch (error) {
    next(error);
  }
}

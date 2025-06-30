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
      message: "Usuario criado com sucesso!",
      user,
    });
    return;
  } catch (error) {
    next(error);
  }
}

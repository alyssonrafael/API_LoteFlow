import { NextFunction, Request, Response } from "express";
import * as userService from "../user/user.service";
import {
  GetAllUsersSchema,
  GetUserByIdSchema,
  UpdatePasswordBodySchema,
  UpdateUserBodySchema,
  UpdateUserRoleBodySchema,
  UpdateUserStatusSchema,
} from "../../validations";

export async function getUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const companyId = req.user.companyId
    const userId = req.user.sub

    const response = await userService.getUserData(companyId, userId)
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const companyId = req.user.companyId;
    const filters: GetAllUsersSchema = req.validatedQuery;

    const response = await userService.findAllByAccessCode(companyId, filters);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const companyId = req.user.companyId;
    const { id }: GetUserByIdSchema = req.validatedParams;

    const user = await userService.findUserById(companyId, id);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function updateLoggedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.sub;
    const companyId = req.user.companyId;
    const data: UpdateUserBodySchema = req.validatedBody;

    const user = await userService.updateUserProfile(userId, companyId, data);

    res.status(200).json({ message: "Perfil atualizado com sucesso", user });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.sub;
    const companyId = req.user.companyId;
    const data: UpdatePasswordBodySchema = req.validatedBody;

    await userService.updatePassword(userId, companyId, data);

    res.status(200).json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const companyId = req.user.companyId;
    const requesterRole = req.user.role;
    const { id }: GetUserByIdSchema = req.validatedParams;
    const { role }: UpdateUserRoleBodySchema = req.validatedBody;

    const user = await userService.updateUserRole(
      id,
      role,
      companyId,
      requesterRole
    );

    res.status(200).json({ message: "Função atualizada com sucesso", user });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatus(req: Request, res: Response) {
  const companyId = req.user.companyId;
  const userRole = req.user.role;
  const { id }: GetUserByIdSchema = req.validatedParams;
  const { isActive }: UpdateUserStatusSchema = req.validatedBody;

  const updatedUser = await userService.updateUserStatus(
    id,
    isActive,
    companyId,
    userRole
  );

  res.status(200).json({
    message: "Status atualizado com sucesso",
    user: updatedUser,
  });
  return;
}

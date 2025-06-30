import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UserRole } from "../types/types";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { ForbiddenError } from "../errors/ForbiddenError";

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Forneça um token!");
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    throw new UnauthorizedError("Formato de Token invalido");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Adiciona o payload decodificado à requisição
    next();
  } catch {
    throw new UnauthorizedError("Token invalido ou expirado");
  }
}

function baseRoleChecker(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Token inválido ou expirado");
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenError("Acesso proibido: permissões insuficientes");
    }

    next();
  };
}

export const checkRole = {
  master: () => baseRoleChecker([UserRole.MASTER]),
  admin: () => baseRoleChecker([UserRole.ADMIN]),
  seller: () => baseRoleChecker([UserRole.SELLER]),
  adminOrMaster: () => baseRoleChecker([UserRole.ADMIN, UserRole.MASTER]),
  all: () => baseRoleChecker([UserRole.ADMIN, UserRole.MASTER, UserRole.SELLER]),
  custom: (roles: UserRole[]) => baseRoleChecker(roles), // se quiser continuar usando de forma dinâmica
};

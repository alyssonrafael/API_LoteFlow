import { NotFoundError } from "../../errors";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import prisma from "../../prisma";
import { UserRole } from "../../types/types";
import { comparePasswords, hashPassword } from "../../utils/hash";
import {
  GetAllUsersSchema,
  UpdatePasswordBodySchema,
  UpdateUserBodySchema,
  UserValidator,
} from "../../validations";

export async function getUserData(companyId: string, userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
    },
    select: {
      fullName: true,
      email: true,
      createdAt: true,
      company:{
        select:{
          name:true, 
        }
      }
    },
  });
  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }
  return user;
}

export async function findAllByAccessCode(
  companyId: string,
  filters: GetAllUsersSchema
) {
  const statusFilter =
    filters.status === "active"
      ? true
      : filters.status === "inactive"
      ? false
      : undefined;

  const where = {
    companyId,
    ...(statusFilter !== undefined && { isActive: statusFilter }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        email: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

export async function findUserById(companyId: string, userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
    },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }

  return user;
}

export async function updateUserProfile(
  userId: string,
  companyId: string,
  data: UpdateUserBodySchema
) {
  if (data.username) {
    const validator = new UserValidator(prisma);
    await validator.validateUniqueUserName(companyId, data.username, userId);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      isActive: true,
      role: true,
      createdAt: true,
    },
  });

  return updated;
}

export async function updatePassword(
  userId: string,
  companyId: string,
  data: UpdatePasswordBodySchema
) {
  const validator = new UserValidator(prisma);
  const user = await validator.validateUserBelongsToCompanyOrFail(
    userId,
    companyId
  );

  const isPasswordCorrect = await comparePasswords(
    data.currentPassword,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Senha atual incorreta");
  }

  if (data.currentPassword === data.newPassword) {
    throw new UnauthorizedError("A nova senha deve ser diferente da atual");
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
}

export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  companyId: string,
  requesterRole: UserRole
) {
  const validator = new UserValidator(prisma);
  const user = await validator.validateUserBelongsToCompanyOrFail(
    userId,
    companyId
  );

  if (requesterRole === "ADMIN" && user.role === "MASTER") {
    throw new ForbiddenError("Admins não podem alterar usuários MASTER");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      fullName: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return updated;
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean,
  companyId: string,
  requesterRole: UserRole
) {
  const validator = new UserValidator(prisma);
  const user = await validator.validateUserBelongsToCompanyOrFail(
    userId,
    companyId
  );

  if (requesterRole === "ADMIN" && user.role === "MASTER") {
    throw new ForbiddenError("Admins não podem alterar usuários MASTER");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

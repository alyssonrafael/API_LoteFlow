import { NotFoundError } from "../errors";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import prisma from "../prisma";
import { generateShortToken } from "../utils/code";
import { comparePasswords, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { sendResetEmail } from "../utils/mailer";
import {
  CompanyValidator,
  UserValidator,
  CreateCompanySchema,
  CreateUserSchema,
  LoginSchema,
  RequestPasswordResetSchema,
  ResetPasswordSchema,
  VerifyAccessCodeSchema,
} from "../validations";

export async function registerCompany(data: CreateCompanySchema) {
  //valida a uniquidade
  const validator = new CompanyValidator(prisma);
  await validator.validateUniqueCnpj(data.cnpj);
  await validator.validateUniqueAccessCode(data.accessCode);
  // Cria a empresa
  return prisma.company.create({ data });
}

export async function accessCompany(data: VerifyAccessCodeSchema) {
  const validator = new CompanyValidator(prisma);
  await validator.validateExistingAccessCode(data.accessCode);

  return data.accessCode;
}

export async function registerUser(data: CreateUserSchema) {
  const company = await prisma.company.findUnique({
    where: { accessCode: data.accessCode },
  });

  if (!company) {
    throw new NotFoundError("Empresa não encontrada");
  }

  const validator = new UserValidator(prisma);
  await validator.validateUniqueEmail(company.id, data.email);
  await validator.validateUniqueUserName(company.id, data.userName);

  const hashedPassword = await hashPassword(data.password);

  const existingUsersCount = await prisma.user.count({
    where: {
      companyId: company.id,
    },
  });

  const role = existingUsersCount === 0 ? "ADMIN" : "SELLER";
  const isActive = existingUsersCount === 0 ? true : false;

  const user = await prisma.user.create({
    data: {
      companyId: company.id,
      email: data.email,
      username: data.userName,
      fullName: data.fullName,
      password: hashedPassword,
      role: role,
      isActive: isActive,
    },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      role: true,
      companyId: true,
      isActive: true,
      createdAt: true,
    },
  });

  return user;
}

export async function login(data: LoginSchema) {
  const company = await prisma.company.findUnique({
    where: { accessCode: data.accessCode },
  });

  if (!company) {
    throw new NotFoundError("Empresa não encontrada");
  }

  const user = await prisma.user.findFirst({
    where: {
      companyId: company.id,
      OR: [{ email: data.email }, { username: data.userName }],
    },
  });

  if (!user) {
    throw new UnauthorizedError("Credenciais inválidas");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("Aguardando autorização do administrador");
  }

  const passwordMatch = await comparePasswords(data.password, user.password);

  if (!passwordMatch) {
    throw new UnauthorizedError("Credenciais inválidas");
  }

  const token = generateToken({
    sub: user.id,
    role: user.role,
    accessCode: company.accessCode,
    companyId: company.id,
  });

  return token;
}

export async function requestPasswordReset(data: RequestPasswordResetSchema) {
  const company = await prisma.company.findUnique({
    where: { accessCode: data.accessCode },
    include: { users: true },
  });

  if (!company) {
    throw new NotFoundError("Empresa não encontrada");
  }

  const user = company.users.find((u) => u.email === data.email);

  if (!user) {
    throw new NotFoundError("Usuário não encontrado.");
  }

  const resetToken = generateShortToken(32);
  const code = generateShortToken(6);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: resetToken,
      code,
      expiresAt,
    },
  });

  // Envia o e-mail
  await sendResetEmail({
    to: user.email,
    name: user.fullName,
    code,
    token: resetToken,
  });

  return;
}

export async function resetPassword(data: ResetPasswordSchema) {
  const resetRecord = await prisma.passwordResetToken.findFirst({
    where: {
      OR: [{ token: data.tokenOrCode }, { code: data.tokenOrCode }],
      expiresAt: {
        gte: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!resetRecord) {
    throw new NotFoundError("Token ou código inválido ou expirado.");
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: { password: hashedPassword },
  });

  // Remove o token após uso
  await prisma.passwordResetToken.delete({
    where: { id: resetRecord.id },
  });

  return;
}

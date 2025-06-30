import { NotFoundError } from "../errors";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import prisma from "../prisma";
import { comparePasswords, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { CompanyValidator, UserValidator } from "../validations";

export async function registerCompany(data: {
  accessCode: string;
  name: string;
  cnpj: string;
}) {
  //valida a uniquidade
  const validator = new CompanyValidator(prisma);
  await validator.validateUniqueCnpj(data.cnpj);
  await validator.validateUniqueAccessCode(data.accessCode);
  // Cria a empresa
  return prisma.company.create({ data });
}

export async function accessCompany(accessCode: string) {
  const validator = new CompanyValidator(prisma);
  await validator.validateExistingAccessCode(accessCode);

  return accessCode;
}

export async function registerUser(data: {
  accessCode: string;
  email: string;
  userName: string;
  fullName: string;
  password: string;
}) {
  const formattedAccessCode = data.accessCode.toUpperCase();

  const company = await prisma.company.findUnique({
    where: { accessCode: formattedAccessCode },
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

export async function login(data: {
  accessCode: string;
  email?: string;
  userName?: string;
  password: string;
}) {
  const formattedAccessCode = data.accessCode.toUpperCase();

  const company = await prisma.company.findUnique({
    where: { accessCode: formattedAccessCode },
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

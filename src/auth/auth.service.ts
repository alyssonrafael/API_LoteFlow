import { NotFoundError } from "../errors";
import prisma from "../prisma";
import { hashPassword } from "../utils/hash";
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

  const user = await prisma.user.create({
    data: {
      companyId: company.id,
      email: data.email,
      username: data.userName,
      fullName: data.fullName,
      password: hashedPassword,
      role: role,
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

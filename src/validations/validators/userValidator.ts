import prisma from "../../prisma";
import { ConflictError } from "../../errors";

export class UserValidator {
  constructor(private readonly prismaClient = prisma) {}

  async validateUniqueUserName(companyId: string, username: string) {
    const existing = await this.prismaClient.user.findFirst({
      where: {
        companyId,
        username,
      },
    });

    if (existing) {
      throw new ConflictError("Nome de usuário já em uso nesta empresa");
    }
  }

  async validateUniqueEmail(companyId: string, email: string) {
    const existing = await this.prismaClient.user.findFirst({
      where: {
        companyId,
        email,
      },
    });

    if (existing) {
      throw new ConflictError("E-mail já cadastrado nesta empresa");
    }
  }
}

import prisma from "../../prisma";
import { ConflictError, NotFoundError } from "../../errors";

export class UserValidator {
  constructor(private readonly prismaClient = prisma) {}

  async validateUniqueUserName(
    companyId: string,
    username: string,
    ignoreUserId?: string
  ) {
    const existing = await this.prismaClient.user.findFirst({
      where: {
        companyId,
        username,
        ...(ignoreUserId && {
          NOT: { id: ignoreUserId },
        }),
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

  async validateUserBelongsToCompanyOrFail(userId: string, companyId: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: userId,
        companyId,
      },
    });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    return user;
  }
}

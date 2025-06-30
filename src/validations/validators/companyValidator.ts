import prisma from "../../prisma";
import { ConflictError, NotFoundError } from "../../errors";

export class CompanyValidator {
  constructor(private readonly prismaClient = prisma) {}

  async validateUniqueAccessCode(accessCode: string) {
    const existing = await this.prismaClient.company.findUnique({
      where: { accessCode },
    });

    if (existing) {
      throw new ConflictError("Código de acesso já em uso");
    }
  }

  async validateUniqueCnpj(cnpj: string) {
    const existing = await this.prismaClient.company.findUnique({
      where: { cnpj },
    });

    if (existing) {
      throw new ConflictError("CNPJ já cadastrado");
    }
  }

  async validateExistingAccessCode(accessCode: string) {
    const existing = await this.prismaClient.company.findUnique({
      where: { accessCode },
    });

    if (!existing) {
      throw new NotFoundError(
        "Não foi possivel encontrar a empresa com esse código!"
      );
    }
  }
}
